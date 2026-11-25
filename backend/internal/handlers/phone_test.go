package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestValidPhone(t *testing.T) {
	for _, ok := range []string{"+7 (701) 000-00-00", "+77010000000", "87010000000", "77010000000", " +7 701 000 00 00 ", "+998901234567"} {
		if !validPhone(ok) {
			t.Errorf("%q must be accepted", ok)
		}
	}
	for _, bad := range []string{"", "   ", "123", "abc", "+7701000000", "+770100000000", "7010000000", "+7701000000a", "8701000000+0", "++77010000000", "+0123456789"} {
		if validPhone(bad) {
			t.Errorf("%q must be rejected", bad)
		}
	}
}

// The repository is nil: reaching the code storage would panic.
func TestPhoneEndpointsOffInProduction(t *testing.T) {
	gin.SetMode(gin.TestMode)
	h := &Handler{production: true}
	for name, f := range map[string]gin.HandlerFunc{"send": h.SendPhoneCode, "verify": h.VerifyPhoneCode} {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("POST", "/", strings.NewReader(`{"phone":"+77010000000","channel":"sms","code":"0000"}`))
		f(c)
		if w.Code != http.StatusServiceUnavailable || strings.Contains(w.Body.String(), "debugCode") {
			t.Errorf("%s: %d %s", name, w.Code, w.Body)
		}
	}
}
