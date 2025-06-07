import React from 'react';

type Strategy = {
  date: string;
  review_count: number;
  review_trend: string;
  positive_ratio: number;
  negative_ratio: number;
  neutral_ratio: number;
  main_positive_keywords: string[];
  main_negative_keywords: string[];
  response_plan: string;
  final_strategy: string;
  ai_summary?: string;
};

type Props = {
  strategy: Strategy;
};

export default function StrategyCard({ strategy }: Props) {
  if (!strategy) return null;
  return (
    <div className="kakao-card">
      <div style={{ fontSize: '0.95rem', color: '#888' }}>{strategy.date} 기준</div>
      <div style={{ margin: '8px 0', fontWeight: 'bold' }}>리뷰 수: {strategy.review_count} ({strategy.review_trend})</div>
      <div>긍정: {(strategy.positive_ratio * 100).toFixed(0)}% / 부정: {(strategy.negative_ratio * 100).toFixed(0)}% / 중립: {(strategy.neutral_ratio * 100).toFixed(0)}%</div>
      <div style={{ margin: '8px 0' }}>
        <b>주요 긍정 키워드:</b> {strategy.main_positive_keywords.join(', ')}<br/>
        <b>주요 부정 키워드:</b> {strategy.main_negative_keywords.join(', ')}
      </div>
      <div style={{ margin: '8px 0', color: '#2d8c00' }}><b>AI 대응책:</b> {strategy.response_plan}</div>
      <div style={{ margin: '8px 0', color: '#3d1e1e', fontWeight: 'bold' }}><b>최종 전략:</b> {strategy.final_strategy}</div>
      {strategy.ai_summary && (
        <div style={{ margin: '8px 0', color: '#0057b8', fontWeight: 'bold' }}>
          <b>Gemini AI 요약:</b> {strategy.ai_summary}
        </div>
      )}
    </div>
  );
} 
