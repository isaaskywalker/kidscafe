import React from 'react';

const StrategyCard = ({ strategy, compact = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '미정';
    }
  };

  if (!strategy) {
    return (
      <div className="strategy-card empty">
        <p>마케팅 전략을 생성 중입니다...</p>
        <div className="loading-spinner"></div>

        <style jsx>{`
          .strategy-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 24px;
            color: white;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          }

          .strategy-card.empty {
            text-align: center;
            padding: 40px 24px;
          }

          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
            margin: 16px auto 0;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="strategy-card">
      <div className="strategy-header">
        <h3 className="strategy-title">{strategy.title}</h3>
        <div className="strategy-badges">
          <span className="category-badge">{strategy.category}</span>
          <span 
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(strategy.priority) }}
          >
            {getPriorityLabel(strategy.priority)}
          </span>
        </div>
      </div>

      <div className="strategy-content">
        <p className="strategy-description">{strategy.description}</p>

        {strategy.insights && strategy.insights.length > 0 && (
          <div className="strategy-section">
            <h4>📊 주요 인사이트</h4>
            <ul className="insights-list">
              {strategy.insights.slice(0, compact ? 2 : strategy.insights.length).map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {strategy.actions && strategy.actions.length > 0 && (
          <div className="strategy-section">
            <h4>🎯 실행 방안</h4>
            <ul className="actions-list">
              {strategy.actions.slice(0, compact ? 3 : strategy.actions.length).map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {strategy.createdAt && (
        <div className="strategy-footer">
          <span className="created-date">
            생성일: {new Date(strategy.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      )}

      <style jsx>{`
        .strategy-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 24px;
          color: white;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .strategy-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 16px;
        }

        .strategy-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1.3;
        }

        .strategy-badges {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .category-badge, .priority-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .category-badge {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .priority-badge {
          color: white;
        }

        .strategy-content {
          line-height: 1.6;
        }

        .strategy-description {
          font-size: 1.1rem;
          margin-bottom: 24px;
          opacity: 0.95;
        }

        .strategy-section {
          margin-bottom: 20px;
        }

        .strategy-section h4 {
          margin: 0 0 12px 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .insights-list, .actions-list {
          margin: 0;
          padding-left: 20px;
        }

        .insights-list li, .actions-list li {
          margin-bottom: 8px;
          opacity: 0.9;
        }

        .strategy-footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .created-date {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .strategy-header {
            flex-direction: column;
            gap: 12px;
          }

          .strategy-badges {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default StrategyCard;
