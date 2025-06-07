import type { NextApiRequest, NextApiResponse } from 'next';

// 임시 더미 전략 데이터
const strategy = {
  date: '2024-06-08',
  review_count: 120,
  review_trend: '+12%',
  positive_ratio: 0.82,
  negative_ratio: 0.10,
  neutral_ratio: 0.08,
  main_positive_keywords: ['깨끗함', '친절', '시설좋음'],
  main_negative_keywords: ['주차불편', '가격', '혼잡'],
  response_plan: '주차 안내문 추가, 평일 할인 이벤트',
  final_strategy: '6월은 평일 방문 고객 대상 할인, 주차장 안내 강화, 인스타그램 후기 이벤트 진행'
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(strategy);
}
