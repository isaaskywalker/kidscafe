import React from 'react';

const ReviewList = ({ reviews = [], showSummary = true, limit = 5 }) => {
  const displayReviews = limit ? reviews.slice(0, limit) : reviews;
  
  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#28a745';
      case 'negative': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list">
        <div className="no-reviews">
          <p>📝 아직 수집된 리뷰가 없습니다.</p>
          <p className="sub-text">
            크롤링을 시작하여 최신 리뷰를 수집해보세요.
          </p>
        </div>

        <style jsx>{`
          .review-list {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .no-reviews {
            text-align: center;
            padding: 40px 20px;
            color: #666;
          }
          .sub-text {
            font-size: 0.9rem;
            color: #999;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    );
  }

  // 감정 분석 요약
  const summary = {
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
    total: reviews.length
  };

  return (
    <div className="review-list">
      {showSummary && (
        <div className="review-summary">
          <div className="summary-item positive">
            <span className="emoji">😊</span>
            <div>
              <div className="count">{summary.positive}</div>
              <div className="label">긍정적</div>
            </div>
          </div>
          <div className="summary-item neutral">
            <span className="emoji">😐</span>
            <div>
              <div className="count">{summary.neutral}</div>
              <div className="label">중립적</div>
            </div>
          </div>
          <div className="summary-item negative">
            <span className="emoji">😞</span>
            <div>
              <div className="count">{summary.negative}</div>
              <div className="label">부정적</div>
            </div>
          </div>
        </div>
      )}

      <div className="reviews-grid">
        {displayReviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="review-title">
                <a href={review.url} target="_blank" rel="noopener noreferrer">
                  {review.title}
                </a>
              </div>
              <div className="review-meta">
                <span 
                  className="sentiment-badge"
                  style={{ color: getSentimentColor(review.sentiment) }}
                >
                  {getSentimentEmoji(review.sentiment)}
                </span>
                <span className="review-date">{formatDate(review.date)}</span>
                <span className="review-score">{review.score}점</span>
              </div>
            </div>
            <div className="review-content">
              {review.content && review.content.length > 150 
                ? `${review.content.substring(0, 150)}...` 
                : review.content
              }
            </div>
          </div>
        ))}
      </div>

      {limit && reviews.length > limit && (
        <div className="view-more">
          <button className="view-more-btn">
            더 많은 리뷰 보기 ({reviews.length - limit}개 더)
          </button>
        </div>
      )}

      <style jsx>{`
        .review-list {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .review-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #eee;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .summary-item.positive {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        }

        .summary-item.negative {
          background: linear-gradient(135deg, #f8d7da 0%, #f1b0b7 100%);
        }

        .summary-item.neutral {
          background: linear-gradient(135deg, #e2e3e5 0%, #d1d3d5 100%);
        }

        .summary-item .emoji {
          font-size: 2rem;
        }

        .summary-item .count {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .summary-item .label {
          font-size: 0.9rem;
          color: #666;
        }

        .reviews-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .review-card:hover {
          border-color: #007bff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,123,255,0.15);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 16px;
        }

        .review-title a {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
          line-height: 1.4;
        }

        .review-title a:hover {
          text-decoration: underline;
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          font-size: 0.85rem;
        }

        .sentiment-badge {
          font-size: 1.1rem;
        }

        .review-date {
          color: #666;
        }

        .review-score {
          background: #007bff;
          color: white;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .review-content {
          color: #333;
          line-height: 1.5;
          font-size: 0.95rem;
        }

        .view-more {
          margin-top: 24px;
          text-align: center;
        }

        .view-more-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 20px;
          padding: 12px 24px;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-more-btn:hover {
          background: #e9ecef;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .review-summary {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .review-header {
            flex-direction: column;
            gap: 8px;
          }

          .review-meta {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewList;
