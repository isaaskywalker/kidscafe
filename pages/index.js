import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ReviewList from '../components/ReviewList';
import StrategyCard from '../components/StrategyCard';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 리뷰 데이터 로드
      const reviewsResponse = await fetch('/api/reviews');
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || reviewsData);
      } else {
        console.error('리뷰 로드 실패:', reviewsResponse.status);
      }

      // 전략 데이터 로드
      const strategyResponse = await fetch('/api/strategy');
      if (strategyResponse.ok) {
        const strategyData = await strategyResponse.json();
        setStrategy(strategyData);
      } else {
        console.error('전략 로드 실패:', strategyResponse.status);
      }

    } catch (error) {
      console.error('데이터 로드 중 오류:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>데이터를 불러오는 중입니다...</p>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>❌ 오류 발생</h2>
        <p>{error}</p>
        <button onClick={loadData}>다시 시도</button>
        
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 20px;
          }
          button {
            margin-top: 16px;
            padding: 12px 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
          button:hover {
            background: #0056b3;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="main-container">
      <header className="dashboard-header">
        <h1 style={{ color: '#3d1e1e', textAlign: 'center', marginBottom: 24 }}>
          우리끼리 키즈카페 대전문화점<br/>마케팅 대시보드
        </h1>
        
        <div className="status-info">
          <div className="status-card">
            <div className="status-number">{reviews.length}</div>
            <div className="status-label">총 리뷰 수</div>
          </div>
          <div className="status-card">
            <div className="status-number">
              {reviews.filter(r => r.sentiment === 'positive').length}
            </div>
            <div className="status-label">긍정적 리뷰</div>
          </div>
          <div className="status-card">
            <div className="status-number">
              {Math.round(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length) || 0}
            </div>
            <div className="status-label">평균 점수</div>
          </div>
        </div>
      </header>

      <section className="reviews-section">
        <div className="section-header">
          <h2>리뷰 요약</h2>
          <Link href="/reviews">
            <button className="view-all-btn">전체 보기</button>
          </Link>
        </div>
        <ReviewList reviews={reviews} />
      </section>

      <section className="strategy-section">
        <div className="section-header">
          <h2>마케팅 전략</h2>
          <Link href="/strategy">
            <button className="kakao-btn">
              자세히 보기 &rarr;
            </button>
          </Link>
        </div>
        {strategy && <StrategyCard strategy={strategy} />}
      </section>

      <footer className="footer">
        <p>매주 월요일 오전 9시 자동 갱신 · 모바일에서도 사용 가능</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          네이버 블로그에서 실시간으로 리뷰를 수집하여 분석합니다
        </p>
      </footer>

      <style jsx>{`
        .main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .dashboard-header {
          margin-bottom: 40px;
        }

        .status-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .status-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .status-number {
          font-size: 2rem;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 8px;
        }

        .status-label {
          font-size: 0.9rem;
          color: #666;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          margin: 0;
          color: #3d1e1e;
        }

        .view-all-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 20px;
          padding: 8px 16px;
          color: #495057;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-all-btn:hover {
          background: #e9ecef;
          transform: translateY(-1px);
        }

        .kakao-btn {
          background: #fee500;
          border: none;
          border-radius: 20px;
          padding: 10px 20px;
          color: #3c1e1e;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .kakao-btn:hover {
          background: #fdd835;
          transform: translateY(-1px);
        }

        .reviews-section, .strategy-section {
          margin-bottom: 40px;
        }

        .footer {
          margin-top: 48px;
          color: #888;
          text-align: center;
          padding: 20px;
          border-top: 1px solid #eee;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          
          .status-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
