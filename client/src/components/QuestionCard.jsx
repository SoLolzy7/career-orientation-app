import React, { useState } from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, currentIndex, totalQuestions, onAnswer, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
    onAnswer(selectedAnswer);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    onNext();
  };

  return (
    <div className="question-card">
      <div className="progress-section">
        <div className="question-counter">
          Câu hỏi {currentIndex + 1}/{totalQuestions}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="question-content">
        <h2 className="question-text">{question.text}</h2>
        
        <div className="options-container">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`option-card ${selectedAnswer === index ? 'selected' : ''} ${isAnswered ? 'disabled' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="option-letter">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="option-text">
                {option}
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          {!isAnswered ? (
            <button 
              className="btn-submit" 
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Xác nhận câu trả lời
            </button>
          ) : (
            <button className="btn-next" onClick={handleNext}>
              {currentIndex + 1 === totalQuestions ? 'Xem kết quả' : 'Câu hỏi tiếp theo'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;