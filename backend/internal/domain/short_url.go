package domain

import (
	"errors"
	"pendekin_go/pkg/errs"
	"time"
)

var (
	ErrAliasNotFound = errors.New("alias not found")
)

type ShortUrl struct {
	ID          int       `json:"id"`
	OriginalURL string    `json:"original_url"`
	ClickCount  int       `json:"click_count"`
	CreatedAt   time.Time `json:"created_at"`
	UserID      *int      `json:"user_id"`
	ExpiresAt   time.Time `json:"expires_at"`
	Alias       *string   `json:"alias"`
}

type ShortUrlStats struct {
	TotalUrlStats   TotalUrlStats   `json:"url_stats"`
	TotalClickStats TotalClickStats `json:"click_stats"`
}

type TotalUrlStats struct {
	TotalUrl     int `json:"total_url" gorm:"column:total_url"`
	UrlLastMonth int `json:"url_last_month" gorm:"column:url_last_month"`
	UrlThisMonth int `json:"url_this_month" gorm:"column:url_this_month"`
}

type TotalClickStats struct {
	TotalClick     int `json:"total_click" gorm:"column:total_click"`
	ClickToday     int `json:"click_today" gorm:"column:click_today"`
	ClickYesterday int `json:"click_yesterday" gorm:"column:click_yesterday"`
	ClickThisMonth int `json:"click_this_month" gorm:"column:click_this_month"`
	ClickLastMonth int `json:"click_last_month" gorm:"column:click_last_month"`
}

type CreateShortUrlRequest struct {
	OriginalURL string  `json:"original_url" binding:"required,url"`
	UserID      *int    `json:"user_id"`
	ExpiresIn   *int    `json:"expires_in" binding:"omitempty,min=1"`
	Alias       *string `json:"alias" binding:"omitempty,min=4,max=20,alphanum"`
}

type CreateShortUrlResponse struct {
	ID          int       `json:"id"`
	OriginalURL string    `json:"original_url"`
	Alias       *string   `json:"alias"`
	ShortUrl    string    `json:"short_url"`
	ExpiresAt   time.Time `json:"expires_at"`
	CreatedAt   time.Time `json:"created_at"`
}

type RedirectShortUrlRequest struct {
	Alias     *string `json:"alias" binding:"required"`
	IPAddress string  `json:"ip_address"`
	Referer   string  `json:"referer"`
	UserAgent string  `json:"user_agent"`
}

type RedirectShortUrlResponse struct {
	OriginalURL string `json:"original_url"`
}

type DeleteShortUrlRequest struct {
	ID     int  `json:"id"`
	UserID *int `json:"user_id"`
}

type DeleteShortUrlResponse struct {
	ShortUrlID int     `json:"short_url_id"`
	Alias      *string `json:"alias"`
}

type GetUrlByUserIdResponse struct {
	ShortUrls   []ShortUrl `json:"short_urls"`
	TotalUrls   int        `json:"total_urls"`
	TotalClicks int        `json:"total_clicks"`
}

type ShortUrlRepository interface {
	FindByAlias(alias *string) (*ShortUrl, error)
	FindById(id int) (*ShortUrl, error)
	Create(shortUrl *ShortUrl) error
	Delete(shortUrl *ShortUrl) error
	UpdateClickCount(shortUrl *ShortUrl) error
	FindByUserId(userID int) ([]ShortUrl, int, int, error)
	GetTotalUrlStats(userID int) (*TotalUrlStats, error)
	GetTotalClickStats(userID int) (*TotalClickStats, error)
}

type ShortUrlUsecase interface {
	CreateShortUrl(req *CreateShortUrlRequest) (*CreateShortUrlResponse, *errs.Error)
	RedirectShortUrl(req *RedirectShortUrlRequest) (*RedirectShortUrlResponse, *errs.Error)
	DeleteShortUrl(req *DeleteShortUrlRequest) (*DeleteShortUrlResponse, *errs.Error)
	GetUserShortUrl(userID int) (*GetUrlByUserIdResponse, *errs.Error)
	GetUrlStats(userID int) (*ShortUrlStats, *errs.Error)
	// GetShortUrlStats(shortUrlID int) (*ShortUrl, *errors.Error)
}
