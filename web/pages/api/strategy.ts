import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchGeminiStrategy(reviews: any[]) {
  if (!GEMINI_API_KEY) return null;
  try {
    const prompt = `아래는 우리끼리 키즈카페 대전문화점의 실제 리뷰 목록입니다.\n리뷰를 분석해 마케팅 전략을 한글로 요약해 주세요.\n리뷰 목록:\n${reviews.map(r => `- ${r.content || r.title || ''}`).join('\n')}`;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reviewsDir = path.join(process.cwd(), 'data', 'reviews');
  let reviews = [];
  try {
    const files = fs.readdirSync(reviewsDir)
      .filter(f => f.endsWith('.json') && !f.includes('strategy'))
      .sort()
      .reverse();
    if (files.length > 0) {
      const latestFile = path.join(reviewsDir, files[0]);
      reviews = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));
    }
  } catch (e) {}

  if (!reviews || reviews.length === 0) {
    res.status(200).json(null);
    return;
  }

  // 간단 분석 예시 (실제 분석 로직은 별도 구현 가능)
  const strategy = {
    date: (reviews[0] && (reviews[0] as any).date) || '',
    review_count: reviews.length,
    review_trend: '',
    positive_ratio: 0,
    negative_ratio: 0,
    neutral_ratio: 0,
    main_positive_keywords: [],
    main_negative_keywords: [],
    response_plan: '',
    final_strategy: '',
    ai_summary: null
  };

  // Gemini AI 요약
  if (GEMINI_API_KEY) {
    strategy.ai_summary = await fetchGeminiStrategy(reviews);
  }

  res.status(200).json(strategy);
}
