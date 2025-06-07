import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>우리끼리 키즈카페 대전문화점 마케팅 대시보드</h1>
      <section style={{ margin: '32px 0' }}>
        <h2>리뷰 요약</h2>
        <p>최근 리뷰 증감률, 긍/부정 비율, 주요 키워드 등 요약 정보가 표시됩니다.</p>
        {/* 실제 데이터는 API 연동 필요 */}
      </section>
      <section style={{ margin: '32px 0' }}>
        <h2>마케팅 전략</h2>
        <p>자동 분석된 최신 마케팅 전략을 확인하세요.</p>
        <Link href="/strategy">자세히 보기 &rarr;</Link>
      </section>
      <footer style={{ marginTop: 48, color: '#888' }}>
        <p>매주 자동 갱신 · 모바일에서도 사용 가능</p>
      </footer>
    </main>
  );
}
