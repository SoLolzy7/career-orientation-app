import { motion } from 'framer-motion';

function QuestionCard({ question, options, onAnswer, currentIndex, total }) {
  const percentage = ((currentIndex + 1) / total) * 100;
  
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
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', minHeight: '100px' }}>
          {question}
        </h2>
        
        <div className="options-grid">
          {options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="option-btn"
              onClick={() => onAnswer(opt.value)}
            >
              {opt.text}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default QuestionCard;