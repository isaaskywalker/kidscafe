export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 임시 더미 데이터 (나중에 실제 크롤링 데이터로 교체)
    const dummyReviews = [
      {
        id: "1",
        title: "우리끼리 키즈카페 대전문화점 방문 후기",
        content: "아이들이 정말 좋아했어요! 시설도 깨끗하고 직원분들도 친절하셨습니다. 놀이기구도 다양하고 안전해 보였어요. 다음에 또 올 예정입니다.",
        date: "2024-06-05",
        url: "https://blog.naver.com/sample1/123456789",
        sentiment: "positive",
        score: 85
      },
      {
        id: "2", 
        title: "대전문화점 키즈카페 체험 일기",
        content: "놀이기구가 다양해서 좋았지만 주말이라 사람이 많아서 조금 시끄러웠어요. 가격은 적당한 것 같습니다.",
        date: "2024-06-03",
        url: "https://blog.naver.com/sample2/987654321",
        sentiment: "neutral",
        score: 70
      },
      {
        id: "3",
        title: "우리끼리 키즈카페 솔직 후기",
        content: "아이가 너무 좋아해서 3시간 넘게 놀았어요. 깨끗하고 안전하게 잘 관리되고 있는 것 같아요. 직원분들이 아이들을 잘 챙겨주셔서 감사했습니다.",
        date: "2024-06-01",
        url: "https://blog.naver.com/sample3/456789123",
        sentiment: "positive",
        score: 90
      }
    ];

    // 감정 분석 요약 계산
    const summary = {
      positive: dummyReviews.filter(r => r.sentiment === 'positive').length,
      negative: dummyReviews.filter(r => r.sentiment === 'negative').length,
      neutral: dummyReviews.filter(r => r.sentiment === 'neutral').length,
      total: dummyReviews.length
    };

    // 응답 데이터 구조
    const response = {
      reviews: dummyReviews,
      total: dummyReviews.length,
      hasMore: false,
      summary: summary
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Reviews API error:', error);
    res.status(500).json({ 
      error: 'Failed to load reviews',
      message: error.message 
    });
  }
}
