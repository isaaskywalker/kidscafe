import pandas as pd

def analyze_trend(reviews_by_date: dict) -> dict:
    """
    날짜별 리뷰 수, 긍/부정/중립 비율, 증감률 계산
    reviews_by_date: {날짜: [리뷰 dict, ...]}
    """
    trend = {}
    prev_count = None
    for date, reviews in sorted(reviews_by_date.items()):
        count = len(reviews)
        pos = sum(1 for r in reviews if r['sentiment'] == 'positive')
        neg = sum(1 for r in reviews if r['sentiment'] == 'negative')
        neu = sum(1 for r in reviews if r['sentiment'] == 'neutral')
        if prev_count is not None:
            change = (count - prev_count) / prev_count * 100
        else:
            change = 0
        trend[date] = {
            'count': count,
            'positive_ratio': pos / count if count else 0,
            'negative_ratio': neg / count if count else 0,
            'neutral_ratio': neu / count if count else 0,
            'change_percent': change
        }
        prev_count = count
    return trend

if __name__ == "__main__":
    # 예시 데이터
    reviews_by_date = {
        '2024-06-01': [
            {'sentiment': 'positive'}, {'sentiment': 'negative'}
        ],
        '2024-06-08': [
            {'sentiment': 'positive'}, {'sentiment': 'positive'}, {'sentiment': 'neutral'}
        ]
    }
    print(analyze_trend(reviews_by_date))
