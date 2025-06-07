import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchGeminiStrategy(reviews: any[]) {
  if (!GEMINI_API_KEY) return null;
  try {
    const prompt = `아래는 우리끼리 키즈카페 대전문화점의 실제 리뷰 목록입니다.\n리뷰를 분석해 마케팅 전략을 한글로 요약해 주세요.\n리뷰 목록:\n${reviews.map(r => `- ${r.content}`).join('\n')}`;
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return text;
  } catch (e) {
    return null;
  }
}

// 임시 더미 전략 데이터
const dummy = {
  date: '2024-06-08',
  review_count: 120,
  review_trend: '+12%',
  positive_ratio: 0.82,
  negative_ratio: 0.10,
  neutral_ratio: 0.08,
  main_positive_keywords: ['깨끗함', '친절', '시설좋음'],
  main_negative_keywords: ['주차불편', '가격', '혼잡'],
  response_plan: '주차 안내문 추가, 평일 할인 이벤트',
  final_strategy: '6월은 평일 방문 고객 대상 할인, 주차장 안내 강화, 인스타그램 후기 이벤트 진행',
  ai_summary: 'AI 분석 결과: 긍정 리뷰가 많으나 주차 관련 불만이 있습니다. 평일 할인과 주차 안내 강화가 필요합니다.'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 리뷰 데이터 fetch (실제 운영 시 DB/파일에서 불러오거나, 여기서는 더미)
  const reviews = [
    { date: '2024-06-01', sentiment: 'positive', content: '시설이 깨끗하고 좋아요!' },
    { date: '2024-06-01', sentiment: 'negative', content: '주차가 불편했어요.' },
    { date: '2024-06-08', sentiment: 'positive', content: '직원분이 친절해요.' },
  ];
  let ai_summary = null;
  if (GEMINI_API_KEY) {
    ai_summary = await fetchGeminiStrategy(reviews);
  }
  res.status(200).json({ ...dummy, ai_summary });
}
