import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StrategyCard from '../components/StrategyCard';

export default function Strategy() {
  const [strategy, setStrategy] = useState(null);

  useEffect(() => {
    fetch('/api/strategy').then(res => res.json()).then(setStrategy);
  }, []);

  return (
    <div className="main-container">
      <h1 style={{ color: '#3d1e1e', textAlign: 'center', marginBottom: 24 }}>마케팅 전략 상세</h1>
      <section>
        {strategy && <StrategyCard strategy={strategy} />}
      </section>
      <Link href="/"><button className="kakao-btn" style={{ marginTop: 24 }}>← 홈으로 돌아가기</button></Link>
    </div>
  );
}
