export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 마케팅 전략 데이터
    const strategy = {
      id: "1",
      title: "고객 만족도 극대화 전략",
      description: "최근 리뷰 분석 결과를 바탕으로 한 우리끼리 키즈카페 대전문화점 마케팅 전략입니다. 고객들의 긍정적인 피드백을 활용하여 브랜드 이미지를 강화하고, 개선점을 파악하여 서비스 품질을 향상시키는 것이 목표입니다.",
      priority: "high",
      category: "고객 서비스",
      insights: [
        "고객들이 시설의 청결함과 안전성을 높이 평가하고 있습니다",
        "직원들의 친절한 서비스에 대한 긍정적 피드백이 지속적으로 나오고 있습니다",
        "놀이기구의 다양성과 품질에 대한 만족도가 높습니다",
        "주말 이용객 집중으로 인한 혼잡도가 일부 고객들에게 아쉬움으로 작용합니다"
      ],
      actions: [
        "청결 관리 시스템을 더욱 체계화하고 이를 적극적으로 홍보하기",
        "직원 서비스 교육 프로그램을 지속 운영하고 우수 직원 인센티브 제도 도입",
        "신규 놀이기구 도입 계획을 SNS를 통해 미리 공지하여 기대감 조성",
        "주말 예약 시스템 도입으로 대기시간 최소화 및 고객 편의성 증대",
        "고객 리뷰 적극 활용한 마케팅 콘텐츠 제작 (인스타그램, 네이버 블로그 등)"
      ],
      createdAt: new Date().toISOString()
    };

    res.status(200).json(strategy);

  } catch (error) {
    console.error('Strategy API error:', error);
    res.status(500).json({ 
      error: 'Failed to load strategy',
      message: error.message 
    });
  }
}
