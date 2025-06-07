import type { NextApiRequest, NextApiResponse } from 'next';

// 임시 더미 데이터
const reviews = [
  { date: '2024-06-01', sentiment: 'positive', content: '시설이 깨끗하고 좋아요!' },
  { date: '2024-06-01', sentiment: 'negative', content: '주차가 불편했어요.' },
  { date: '2024-06-08', sentiment: 'positive', content: '직원분이 친절해요.' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(reviews);
}
