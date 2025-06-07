import React from 'react';
import Link from 'next/link';

export default function Strategy() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>마케팅 전략 상세</h1>
      <section style={{ margin: '32px 0' }}>
        <h2>최신 전략</h2>
        <p>6월은 평일 방문 고객 할인, 인스타그램 후기 이벤트 진행 등 자동 분석된 전략이 표시됩니다.</p>
        {/* 실제 데이터는 API 연동 필요 */}
      </section>
      <section style={{ margin: '32px 0' }}>
        <h2>대응책</h2>
        <ul>
          <li>주차 안내문 추가</li>
          <li>주차 공간 확보 검토</li>
          <li>SNS 후기 이벤트</li>
        </ul>
      </section>
      <Link href="/">← 홈으로 돌아가기</Link>
    </main>
  );
}
