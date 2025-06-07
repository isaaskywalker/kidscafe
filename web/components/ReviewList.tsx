import React from 'react';
import '../styles/kakao.css';

type Review = {
  date: string;
  sentiment: string;
  content: string;
};

type Props = {
  reviews: Review[];
};

export default function ReviewList({ reviews }: Props) {
  if (!reviews || reviews.length === 0) {
    return <div className="kakao-card">아직 리뷰가 없습니다.</div>;
  }
  return (
    <div>
      {reviews.map((r, i) => (
        <div className="kakao-card" key={i}>
          <div style={{ fontSize: '0.95rem', color: '#888' }}>{r.date}</div>
          <div style={{ margin: '8px 0', fontWeight: 'bold' }}>{r.content}</div>
          <div style={{ color: r.sentiment === 'positive' ? '#2d8c00' : r.sentiment === 'negative' ? '#e84118' : '#888', fontWeight: 'bold' }}>
            {r.sentiment === 'positive' ? '😊 긍정' : r.sentiment === 'negative' ? '😢 부정' : '😐 중립'}
          </div>
        </div>
      ))}
    </div>
  );
} 
