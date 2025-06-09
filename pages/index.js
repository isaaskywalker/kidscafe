import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard({ reviews, strategy }) {
  const [activeTab, setActiveTab] = useState('overview');

  // 감정 분석 통계 계산
  const getSentimentStats = () => {
    if (!reviews || reviews.length === 0) return null;
    
    const positive = reviews.filter(r => r.sentiment === 'positive').length;
    const negative = reviews.filter(r => r.sentiment === 'negative').length;
    const neutral = reviews.filter(r => r.sentiment === 'neutral').length;
    const total = reviews.length;
    
    return {
      positive: { count: positive, percentage: ((positive / total) * 100).toFixed(1) },
      negative: { count: negative, percentage: ((negative / total) * 100).toFixed(1) },
      neutral: { count: neutral, percentage: ((neutral / total) * 100).toFixed(1) },
      total
    };
  };

  const stats = getSentimentStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>우리끼리 키즈카페 마케팅 대시보드</title>
        <meta name="description" content="실시간 리뷰 분석 및 마케팅 전략" />
      </Head>

      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🎯 우리끼리 키즈카페 대전문화점
          </h1>
          <p className="text-gray-600 mt-2">실시간 리뷰 분석 및 마케팅 전략 대시보드</p>
        </div>
      </header>

      {/* 네비게이션 */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: '📊 개요', },
              { id: 'reviews', name: '📝 리뷰 분석' },
              { id: 'strategy', name: '🚀 마케팅 전략' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 통계 카드 */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">총 리뷰</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="text-2xl">😊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">긍정적</p>
                      <p className="text-2xl font-semibold text-green-600">
                        {stats.positive.count} ({stats.positive.percentage}%)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <span className="text-2xl">😞</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">부정적</p>
                      <p className="text-2xl font-semibold text-red-600">
                        {stats.negative.count} ({stats.negative.percentage}%)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <span className="text-2xl">😐</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">중립적</p>
                      <p className="text-2xl font-semibold text-gray-600">
                        {stats.neutral.count} ({stats.neutral.percentage}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 만족도 그래프 */}
            {stats && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">고객 만족도 분포</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>긍정적 ({stats.positive.percentage}%)</span>
                      <span>{stats.positive.count}개</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${stats.positive.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>부정적 ({stats.negative.percentage}%)</span>
                      <span>{stats.negative.count}개</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${stats.negative.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>중립적 ({stats.neutral.percentage}%)</span>
                      <span>{stats.neutral.count}개</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-500 h-2 rounded-full" 
                        style={{ width: `${stats.neutral.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">📝 최신 리뷰 분석</h2>
            
            {reviews && reviews.length > 0 ? (
              <div className="grid gap-6">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {review.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {review.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {review.date}</span>
                          <a 
                            href={review.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            원문 보기 →
                          </a>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          review.sentiment === 'positive' 
                            ? 'bg-green-100 text-green-800'
                            : review.sentiment === 'negative'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {review.sentiment === 'positive' ? '😊 긍정적' :
                           review.sentiment === 'negative' ? '😞 부정적' : '😐 중립적'}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          신뢰도: {(review.sentiment_confidence * 100).toFixed(0)}%
                        </span>
                        {review.sentiment_reasoning && (
                          <p className="text-xs text-gray-400 mt-2 text-right max-w-xs">
                            {review.sentiment_reasoning}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl">📭</span>
                <p className="text-gray-500 mt-4">분석할 리뷰가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">🚀 마케팅 전략</h2>
            
            {strategy ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {strategy}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl">🤖</span>
                <p className="text-gray-500 mt-4">마케팅 전략을 생성 중입니다...</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            🎯 우리끼리 키즈카페 대전문화점 마케팅 대시보드 - 
            마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}
          </p>
        </div>
      </footer>
    </div>
  );
}

// 정적 데이터 로딩
export async function getStaticProps() {
  let reviews = [];
  let strategy = '';

  try {
    // 리뷰 데이터 로딩
    const fs = require('fs');
    const path = require('path');
    
    const today = new Date().toISOString().split('T')[0];
    const reviewsPath = path.join(process.cwd(), 'data', 'reviews', `${today}_iframe.json`);
    
    if (fs.existsSync(reviewsPath)) {
      const reviewsData = fs.readFileSync(reviewsPath, 'utf8');
      reviews = JSON.parse(reviewsData);
    }

    // 전략 데이터 로딩
    const strategyPath = path.join(process.cwd(), 'data', 'strategies', `${today}_marketing_strategy.md`);
    
    if (fs.existsSync(strategyPath)) {
      strategy = fs.readFileSync(strategyPath, 'utf8');
    }

  } catch (error) {
    console.error('데이터 로딩 에러:', error);
  }

  return {
    props: {
      reviews,
      strategy
    },
    // 10분마다 재생성
    revalidate: 600
  };
}
