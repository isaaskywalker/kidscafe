import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/kakao.css';
import ReviewList from '../components/ReviewList';
import StrategyCard from '../components/StrategyCard';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [strategy, setStrategy] = useState(null);

  useEffect(() => {
    fetch('/api/reviews').then(res => res.json()).then(setReviews);
    fetch('/api/strategy').then(res => res.json()).then(setStrategy);
  }, []);

  return (
    <div className="main-container">
      <h1 style={{ color: '#3d1e1e', textAlign: 'center', marginBottom: 24 }}>우리끼리 키즈카페 대전문화점<br/>마케팅 대시보드</h1>
      <section>
        <h2>리뷰 요약</h2>
        <ReviewList reviews={reviews} />
      </section>
      <section>
        <h2>마케팅 전략</h2>
        {strategy && <StrategyCard strategy={strategy} />}
        <Link href="/strategy"><button className="kakao-btn" style={{ marginTop: 12 }}>자세히 보기 &rarr;</button></Link>
      </section>
      <footer style={{ marginTop: 48, color: '#888', textAlign: 'center' }}>
        <p>매주 자동 갱신 · 모바일에서도 사용 가능</p>
      </footer>
    </div>
  );
}
