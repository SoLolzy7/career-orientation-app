import { useState } from 'react';
import { motion } from 'framer-motion';

function QuestionCard({ question, description, onAnswer, currentIndex, total }) {
  const [selectedScore, setSelectedScore] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const percentage = ((currentIndex + 1) / total) * 100;
  
  const handleScoreSelect = (score) => {
    if (isAnswered) return;
    setSelectedScore(score);
  };
  
  const handleSubmit = () => {
    if (selectedScore === null) {
      alert('Vui lòng chọn mức độ phù hợp');
      return;
    }
    onAnswer(selectedScore);
    setIsAnswered(true);
  };
  
  const handleNext = () => {
    if (selectedScore !== null) {
      // onAnswer đã được gọi ở handleSubmit
      setIsAnswered(false);
      setSelectedScore(null);
    }
  };
  
  // Hiển thị các nút chọn điểm 1-5
  const renderScoreButtons = () => {
    const scores = [
      { value: 1, label: '1', text: 'Không đúng', textEn: 'Not at all' },
      { value: 2, label: '2', text: 'Hơi đúng', textEn: 'Slightly' },
      { value: 3, label: '3', text: 'Trung bình', textEn: 'Moderately' },
      { value: 4, label: '4', text: 'Khá đúng', textEn: 'Very much' },
      { value: 5, label: '5', text: 'Rất đúng', textEn: 'Extremely' }
    ];
    
    return (
      <div className="score-grid">
        {scores.map((score) => (
          <motion.button
            key={score.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`score-btn ${selectedScore === score.value ? 'selected' : ''}`}
            onClick={() => handleScoreSelect(score.value)}
            disabled={isAnswered}
          >
            <div className="score-number">{score.label}</div>
            <div className="score-label">{score.text}</div>
            <div className="score-label-en">{score.textEn}</div>
          </motion.button>
        ))}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="container"
    >
      <div className="card">
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="progress-text">
            Câu {currentIndex + 1} / {total}
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {question}
        </h2>
        <p style={{ color: 'var(--gray)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
          {description}
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
            Mức độ phù hợp với bản thân:
          </p>
          {renderScoreButtons()}
        </div>
        
        <div className="action-buttons" style={{ textAlign: 'center' }}>
          {!isAnswered ? (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={selectedScore === null}
              style={{ padding: '12px 30px' }}
            >
              Xác nhận câu trả lời ✓
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>
              {currentIndex + 1 === total ? 'Xem kết quả 🎉' : 'Câu hỏi tiếp theo →'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default QuestionCard;