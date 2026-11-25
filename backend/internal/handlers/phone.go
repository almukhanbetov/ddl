package handlers

import (
	"crypto/rand"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

var allowedChannels = map[string]bool{"telegram": true, "whatsapp": true, "sms": true}

const codeTTL = 5 * time.Minute

const errPhoneVerificationOff = "подтверждение телефона не подключено, менеджер свяжется с вами по указанному номеру"

var (
	phoneCharsRe = regexp.MustCompile(`^\+?[0-9 ()-]+$`)
	phoneRe      = regexp.MustCompile(`^(\+?7\d{10}|8\d{10}|\+[1-689]\d{9,14})$`)
	phoneSepRe   = regexp.MustCompile(`[ ()-]`)
)

// validPhone accepts +7/7/8 and ten digits, or another country's number
// written with "+". Spaces, brackets and dashes are allowed between digits.
// The cart page applies the same rule (frontend/lib/phone.ts).
func validPhone(phone string) bool {
	phone = strings.TrimSpace(phone)
	return phoneCharsRe.MatchString(phone) && phoneRe.MatchString(phoneSepRe.ReplaceAllString(phone, ""))
}

type sendPhoneCodeRequest struct {
	Phone   string `json:"phone" binding:"required"`
	Channel string `json:"channel" binding:"required"`
}

// SendPhoneCode is a mock code dispatcher: it has no real Telegram/WhatsApp/SMS
// gateway wired up, so the generated code is returned in the response
// (debugCode) instead of actually being sent. That proves nothing about the
// phone, so in production both endpoints are off until a provider is wired up.
func (h *Handler) SendPhoneCode(c *gin.Context) {
	if h.production {
		errJSON(c, http.StatusServiceUnavailable, errPhoneVerificationOff)
		return
	}

	var req sendPhoneCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "phone and channel are required")
		return
	}
	if !allowedChannels[req.Channel] {
		errJSON(c, http.StatusBadRequest, "channel must be one of telegram, whatsapp, sms")
		return
	}

	code, err := randomDigits(4)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to generate code")
		return
	}

	if _, err := h.repo.CreatePhoneCode(c.Request.Context(), req.Phone, req.Channel, code, codeTTL); err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to store verification code")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sent":             true,
		"expiresInSeconds": int(codeTTL.Seconds()),
		"debugCode":        code,
	})
}

type verifyPhoneCodeRequest struct {
	Phone string `json:"phone" binding:"required"`
	Code  string `json:"code" binding:"required"`
}

func (h *Handler) VerifyPhoneCode(c *gin.Context) {
	if h.production {
		errJSON(c, http.StatusServiceUnavailable, errPhoneVerificationOff)
		return
	}

	var req verifyPhoneCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "phone and code are required")
		return
	}

	verification, err := h.repo.LatestActiveCode(c.Request.Context(), req.Phone)
	if err != nil {
		if err == pgx.ErrNoRows {
			errJSON(c, http.StatusBadRequest, "код не найден или истёк, запросите новый")
			return
		}
		errJSON(c, http.StatusInternalServerError, "failed to check code")
		return
	}

	if verification.Code != req.Code {
		errJSON(c, http.StatusBadRequest, "неверный код")
		return
	}

	token := uuid.NewString()
	if err := h.repo.MarkPhoneVerified(c.Request.Context(), verification.ID, token); err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to confirm code")
		return
	}

	c.JSON(http.StatusOK, gin.H{"verified": true, "token": token})
}

func randomDigits(n int) (string, error) {
	buf := make([]byte, n)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	for i, b := range buf {
		buf[i] = '0' + b%10
	}
	return string(buf), nil
}
