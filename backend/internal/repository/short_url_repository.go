package repository

import (
	"errors"
	"pendekin_go/internal/domain"

	"gorm.io/gorm"
)

type ShortUrlRepository struct {
	db *gorm.DB
}

func NewShortUrlRepository(db *gorm.DB) *ShortUrlRepository {
	return &ShortUrlRepository{
		db: db,
	}
}

func (s *ShortUrlRepository) FindByAlias(alias *string) (*domain.ShortUrl, error) {
	var shortLink domain.ShortUrl
	err := s.db.Where("alias = ?", alias).First(&shortLink).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrAliasNotFound
	}
	if err != nil {
		return nil, err
	}

	return &shortLink, nil
}

func (s *ShortUrlRepository) FindById(id int) (*domain.ShortUrl, error) {
	var shortUrl domain.ShortUrl
	err := s.db.Where("id = ?", id).First(&shortUrl).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrAliasNotFound
	}
	if err != nil {
		return nil, err
	}

	return &shortUrl, nil
}

func (s *ShortUrlRepository) FindByUserId(userID int, limit int, offset int) (shortUrls []domain.ShortUrl, err error) {
	query := s.db.Where("user_id = ?", userID).Order("created_at DESC")

	if limit > 0 {
		query = query.Limit(limit)
	}
	if offset > 0 {
		query = query.Offset(offset)
	}

	err = query.Find(&shortUrls).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return shortUrls, domain.ErrAliasNotFound
	}
	if err != nil {
		return nil, err
	}

	return shortUrls, nil
}

func (r *ShortUrlRepository) CountByUserID(userID int) (int64, int, error) {
	var totalUrl int64
	var clickCount int
	err := r.db.Model(&domain.ShortUrl{}).Where("user_id = ?", userID).Count(&totalUrl).Error
	if err != nil {
		return 0, 0, err
	}
	err = r.db.Model(&domain.ShortUrl{}).Select("SUM(click_count)").Where("user_id = ?", userID).Scan(&clickCount).Error
	if err != nil {
		return 0, 0, err
	}
	return totalUrl, clickCount, nil
}

func (s *ShortUrlRepository) GetTotalUrlStats(userID int) (*domain.TotalUrlStats, error) {
	var totalUrlStats domain.TotalUrlStats
	err := s.db.Model(domain.ShortUrl{}).Select(`
		COUNT(alias) AS total_url,
		COUNT(
			CASE WHEN EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
			AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
			then 1 end
		) AS url_this_month,
		COUNT(
		CASE WHEN EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
			AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
			then 1 end
		) AS url_last_month
		`).Where("user_id = ?", userID).Scan(&totalUrlStats).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrAliasNotFound
	}
	if err != nil {
		return nil, err
	}
	return &totalUrlStats, nil
}

func (s *ShortUrlRepository) GetTotalClickStats(userID int) (*domain.TotalClickStats, error) {
	var totalClickStats domain.TotalClickStats
	err := s.db.Model(domain.ShortUrl{}).Select(`
		COUNT(*) as total_click,
		COUNT(
			case when EXTRACT(year from clicked_at) = extract(year from current_date)
			and extract(month from clicked_at) = extract(month from current_date)
			and extract(day from clicked_at) = extract(day from current_date)
			then 1 end
		) as click_today,
		COUNT(
			case when EXTRACT(year from clicked_at) = extract(year from current_date - interval '1 day')
			and extract(month from clicked_at) = extract(month from current_date - interval '1 day')
			and extract(day from clicked_at) = extract(day from current_date - interval '1 day')
			then 1 end
		) as click_yesterday,
		COUNT(
			case when EXTRACT(year from clicked_at) = extract(year from current_date)
			and extract(month from clicked_at) = extract(month from current_date)
			then 1 end
		) as click_this_month,
		COUNT(
			case when EXTRACT(year from clicked_at) = extract(year from current_date - interval '1 month')
			and extract(month from clicked_at) = extract(month from current_date - interval '1 month')
			then 1 end
		) as click_last_month
		`).Joins("join click_logs on click_logs.short_url_id = short_urls.id").Where("user_id = ?", userID).Scan(&totalClickStats).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrAliasNotFound
	}
	if err != nil {
		return nil, err
	}
	return &totalClickStats, nil
}

func (s *ShortUrlRepository) Create(shortLink *domain.ShortUrl) error {
	if err := s.db.Create(shortLink).Error; err != nil {
		return err
	}
	return nil
}

func (s *ShortUrlRepository) Delete(shortLink *domain.ShortUrl) error {
	if err := s.db.Delete(shortLink).Error; err != nil {
		return err
	}
	return nil
}

func (s *ShortUrlRepository) UpdateClickCount(shortLink *domain.ShortUrl) error {
	if err := s.db.Model(shortLink).Update("click_count", shortLink.ClickCount+1).Error; err != nil {
		return err
	}
	return nil
}
