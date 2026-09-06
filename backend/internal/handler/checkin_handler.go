package handler

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type CheckinHandler struct{}

func NewCheckinHandler() *CheckinHandler {
	return &CheckinHandler{}
}

// Get serves the contents of ~/checkin.log as plain text.
func (h *CheckinHandler) Get(c *gin.Context) {
	logDir := os.Getenv("CHECKIN_LOG_DIR")
	if logDir == "" {
		logDir = "/data" // fallback default
	}

	path := filepath.Join(logDir, "checkin.log")
	data, err := os.ReadFile(path)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to read checkin.log"})
		return
	}

	c.Data(http.StatusOK, "text/plain; charset=utf-8", data)
}
