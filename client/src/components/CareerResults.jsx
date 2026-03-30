import { motion } from 'framer-motion';

function CareerResults({ name, personality, careers, percentages, onSendEmail, loading, onRestart }) {
  // Hiển thị các trait chi tiết
  const traitPairs = [
    { 
      left: percentages?.EI?.E || 0, 
      right: percentages?.EI?.I || 0, 
      leftName: 'Hướng ngoại (E)', 
      rightName: 'Hướng nội (I)', 
      dominant: percentages?.EI?.dominant || 'E' 
    },
    { 
      left: percentages?.SN?.S || 0, 
      right: percentages?.SN?.N || 0, 
      leftName: 'Giác quan (S)', 
      rightName: 'Trực giác (N)', 
      dominant: percentages?.SN?.dominant || 'S' 
    },
    { 
      left: percentages?.TF?.T || 0, 
      right: percentages?.TF?.F || 0, 
      leftName: 'Lý trí (T)', 
      rightName: 'Cảm xúc (F)', 
      dominant: percentages?.TF?.dominant || 'T' 
    },
    { 
      left: percentages?.JP?.J || 0, 
      right: percentages?.JP?.P || 0, 
      leftName: 'Nguyên tắc (J)', 
      rightName: 'Linh hoạt (P)', 
      dominant: percentages?.JP?.dominant || 'J' 
    }
  ];
  
  // Lấy danh sách careers (có thể là array hoặc object)
  const careerList = careers?.careers || (Array.isArray(careers) ? careers : []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container"
    >
      <div className="card">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          🎉 Kết Quả Của Bạn, {name}!
        </h1>
        
        {/* Personality Type */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            {personality}
          </div>
          <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>
            {careers?.description || 'Tính cách độc đáo của bạn'}
          </p>
        </div>
        
        {/* Detailed Traits */}
        <h3>📊 Phân Tích Chi Tiết</h3>
        <div className="traits-grid">
          {traitPairs.map((pair, idx) => (
            <div key={idx} className="trait-card">
              <div className="trait-letter">{pair.dominant}</div>
              <div className="trait-name">
                {pair.dominant === 'E' ? pair.leftName : pair.rightName}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {pair.dominant === 'E' ? pair.left : pair.right}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Career Suggestions */}
        <h3>💼 Gợi Ý Nghề Nghiệp Phù Hợp</h3>
        <ul className="career-list">
          {careerList.length > 0 ? (
            careerList.map((career, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="career-item"
              >
                <span className="career-icon">{career.icon || '💼'}</span>
                <div>
                  <strong>{career.title || career}</strong>
                  {career.reason && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                      {career.reason}
                    </div>
                  )}
                </div>
              </motion.li>
            ))
          ) : (
            <p>Đang cập nhật dữ liệu nghề nghiệp...</p>
          )}
        </ul>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            onClick={onSendEmail} 
            className="btn btn-primary" 
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Đang gửi...' : '📧 Gửi Kết Quả Qua Email'}
          </button>
          <button 
            onClick={onRestart} 
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            🔄 Làm Lại Bài Test
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default CareerResults;