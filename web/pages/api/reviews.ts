import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
  } catch (e) {
    // 폴더/파일이 없으면 빈 배열
  }
  res.status(200).json(reviews);
}
