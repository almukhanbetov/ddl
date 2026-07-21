package handlers

import (
	"crypto/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

var allowedChannels = map[string]bool{"telegram": true, "whatsapp": true, "sms": true}

const codeTTL = 5 * time.Minute

type sendPhoneCodeRequest struct {
	Phone   string `json:"phone" binding:"required"`
	Channel string `json:"channel" binding:"required"`
}

// SendPhoneCode is a mock code dispatcher: it has no real Telegram/WhatsApp/SMS
// gateway wired up, so the generated code is returned in the response
// (debugCode) instead of actually being sent. Swap this out for a real
// provider integration before going to production.
func (h *Handler) SendPhoneCode(c *gin.Context) {
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
