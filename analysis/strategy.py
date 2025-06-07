def generate_strategy(trend: dict, keywords: dict) -> dict:
    """
    트렌드/키워드 분석 결과를 바탕으로 마케팅 전략을 자동 생성합니다.
    trend: 최근 주차 리뷰 증감률, 긍/부정 비율 등
    keywords: 긍정/부정 키워드
    """
    latest = list(trend.values())[-1]
    strategy = {}
    # 리뷰 증가/감소에 따른 대응
    if latest['change_percent'] > 0:
        strategy['trend_comment'] = '리뷰가 증가하고 있습니다!'
    elif latest['change_percent'] < 0:
        strategy['trend_comment'] = '리뷰가 감소하고 있습니다. 원인 분석 필요.'
    else:
        strategy['trend_comment'] = '리뷰 수에 큰 변화가 없습니다.'
    # 긍정/부정 비율에 따른 대응
    if latest['positive_ratio'] > 0.7:
        strategy['sentiment_comment'] = '긍정 리뷰가 많아 좋은 이미지를 유지 중입니다.'
    elif latest['negative_ratio'] > 0.2:
        strategy['sentiment_comment'] = '부정 리뷰가 늘고 있어 빠른 대응이 필요합니다.'
    else:
        strategy['sentiment_comment'] = '대체로 무난한 반응입니다.'
    # 키워드 기반 대응책
    if '주차' in keywords.get('negative', []):
        strategy['response_plan'] = '주차 안내문 추가, 주차 공간 확보 검토'
    else:
        strategy['response_plan'] = 'SNS 후기 이벤트, 평일 할인 등'
    # 최종 전략
    strategy['final_strategy'] = '6월은 평일 방문 고객 할인, 인스타그램 후기 이벤트 진행'
    return strategy

if __name__ == "__main__":
    trend = {
        '2024-06-08': {'change_percent': 10, 'positive_ratio': 0.8, 'negative_ratio': 0.1, 'neutral_ratio': 0.1}
    }
    keywords = {'positive': ['깨끗함', '친절'], 'negative': ['주차']}
    print(generate_strategy(trend, keywords))
