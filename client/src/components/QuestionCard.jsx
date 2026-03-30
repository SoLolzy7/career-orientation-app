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
      alert('Vui lòng chọn mức độ phù hợp (1-5)');
      return;
    }
    onAnswer(selectedScore);
    setIsAnswered(true);
  };
  
  const handleNext = () => {
    // Không gọi onAnswer ở đây vì đã gọi ở handleSubmit
    setIsAnswered(false);
    setSelectedScore(null);
  };
  
  const scores = [
    { value: 1, label: '1', text: 'Không đúng', textEn: 'Not at all' },
    { value: 2, label: '2', text: 'Hơi đúng', textEn: 'Slightly' },
    { value: 3, label: '3', text: 'Trung bình', textEn: 'Moderately' },
    { value: 4, label: '4', text: 'Khá đúng', textEn: 'Very much' },
    { value: 5, label: '5', text: 'Rất đúng', textEn: 'Extremely' }
  ];
  
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
            Mức độ phù hợp với bản thân (1 = Không đúng, 5 = Rất đúng):
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            {scores.map((score) => (
              <button
                key={score.value}
                onClick={() => handleScoreSelect(score.value)}
                disabled={isAnswered}
                style={{
                  flex: 1,
                  minWidth: '70px',
                  padding: '12px',
                  background: selectedScore === score.value ? '#667eea' : '#f9fafb',
                  border: selectedScore === score.value ? '2px solid #667eea' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: isAnswered ? 'not-allowed' : 'pointer',
                  color: selectedScore === score.value ? 'white' : '#333',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{score.label}</div>
                <div style={{ fontSize: '0.7rem' }}>{score.text}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>{score.textEn}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          {!isAnswered ? (
            <button 
              onClick={handleSubmit}
              disabled={selectedScore === null}
              style={{
                padding: '12px 30px',
                background: selectedScore === null ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: selectedScore === null ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Xác nhận câu trả lời ✓
            </button>
          ) : (
            <button 
              onClick={handleNext}
              style={{
                padding: '12px 30px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {currentIndex + 1 === total ? 'Xem kết quả 🎉' : 'Câu hỏi tiếp theo →'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default QuestionCard;