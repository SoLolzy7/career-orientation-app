import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [careerResult, setCareerResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Dữ liệu câu hỏi mẫu (bạn có thể thay thế bằng import từ file JSON sau)
  const sampleQuestions = [
    {
      id: 1,
      text: "Bạn thích làm việc trong môi trường như thế nào?",
      options: [
        "Làm việc độc lập, tự do sáng tạo",
        "Làm việc nhóm, hợp tác với nhiều người",
        "Làm việc có cấu trúc, quy trình rõ ràng",
        "Làm việc linh hoạt, thay đổi thường xuyên"
      ],
      careerType: "creative",
      points: [3, 1, 2, 2]
    },
    {
      id: 2,
      text: "Điều gì quan trọng nhất với bạn trong công việc?",
      options: [
        "Thu nhập cao",
        "Cân bằng công việc - cuộc sống",
        "Cơ hội phát triển và thăng tiến",
        "Môi trường làm việc thân thiện"
      ],
      careerType: "business",
      points: [2, 3, 2, 1]
    },
    {
      id: 3,
      text: "Bạn có kỹ năng nổi bật nào?",
      options: [
        "Phân tích và giải quyết vấn đề",
        "Giao tiếp và thuyết phục",
        "Sáng tạo và nghệ thuật",
        "Tổ chức và quản lý"
      ],
      careerType: "analytical",
      points: [3, 2, 1, 2]
    },
    {
      id: 4,
      text: "Bạn thích làm việc với?",
      options: [
        "Con số và dữ liệu",
        "Con người và các mối quan hệ",
        "Máy móc và công nghệ",
        "Ý tưởng và dự án sáng tạo"
      ],
      careerType: "technical",
      points: [2, 3, 3, 1]
    },
    {
      id: 5,
      text: "Bạn muốn đóng góp điều gì cho xã hội?",
      options: [
        "Đổi mới và sáng tạo công nghệ",
        "Giáo dục và phát triển con người",
        "Kinh doanh và tạo việc làm",
        "Nghệ thuật và văn hóa"
      ],
      careerType: "social",
      points: [2, 3, 2, 1]
    }
  ];

  // Dữ liệu nghề nghiệp mẫu
  const careersData = [
    {
      type: "creative",
      title: "Nhà sáng tạo & Nghệ sĩ",
      description: "Bạn phù hợp với các công việc đòi hỏi sự sáng tạo như: Designer, Họa sĩ, Nhà văn, Đạo diễn, Kiến trúc sư, Nhà thiết kế thời trang, Nhiếp ảnh gia, hoặc chuyên gia sáng tạo nội dung.",
      skills: "Sáng tạo, tư duy nghệ thuật, khả năng biểu đạt, óc thẩm mỹ",
      environment: "Môi trường tự do, linh hoạt, khuyến khích đổi mới"
    },
    {
      type: "business",
      title: "Chuyên gia Kinh doanh & Quản lý",
      description: "Bạn phù hợp với các công việc như: Quản trị kinh doanh, Marketing, Nhân sự, Tài chính, Kế toán, hoặc khởi nghiệp kinh doanh.",
      skills: "Lãnh đạo, quản lý, đàm phán, tư duy chiến lược",
      environment: "Môi trường năng động, cạnh tranh, nhiều thách thức"
    },
    {
      type: "analytical",
      title: "Nhà phân tích & Nghiên cứu",
      description: "Bạn phù hợp với các công việc như: Chuyên viên phân tích dữ liệu, Nhà nghiên cứu, Kỹ sư, Lập trình viên, Chuyên gia tư vấn chiến lược.",
      skills: "Logic, phân tích, giải quyết vấn đề, tư duy hệ thống",
      environment: "Môi trường chuyên sâu, đòi hỏi chính xác và tỉ mỉ"
    },
    {
      type: "technical",
      title: "Chuyên gia Công nghệ & Kỹ thuật",
      description: "Bạn phù hợp với các công việc như: Lập trình viên, Kỹ sư phần mềm, Chuyên gia AI/ML, Kỹ thuật viên, Quản trị mạng, hoặc chuyên gia bảo mật.",
      skills: "Tư duy logic, kỹ thuật, công nghệ, giải quyết vấn đề",
      environment: "Môi trường công nghệ cao, không ngừng học hỏi và cập nhật"
    },
    {
      type: "social",
      title: "Chuyên gia Xã hội & Dịch vụ",
      description: "Bạn phù hợp với các công việc như: Giáo viên, Bác sĩ, Chuyên viên tư vấn tâm lý, Công tác xã hội, Nhân viên y tế, hoặc các ngành dịch vụ cộng đồng.",
      skills: "Giao tiếp, đồng cảm, kiên nhẫn, chăm sóc và hỗ trợ người khác",
      environment: "Môi trường nhân văn, tập trung vào con người và cộng đồng"
    }
  ];

  useEffect(() => {
    // Khởi tạo câu hỏi
    setQuestions(sampleQuestions);
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    // Tính điểm cho từng nhóm nghề nghiệp
    const scores = {
      creative: 0,
      business: 0,
      analytical: 0,
      technical: 0,
      social: 0
    };
    
    answers.forEach((answer, index) => {
      const question = questions[index];
      const careerType = question.careerType;
      const points = question.points[answer];
      
      if (scores[careerType] !== undefined) {
        scores[careerType] += points;
      }
    });
    
    // Tìm nhóm nghề có điểm cao nhất
    let maxScore = 0;
    let topCareerType = 'creative';
    
    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        topCareerType = type;
      }
    }
    
    // Tìm thông tin nghề nghiệp phù hợp
    const result = careersData.find(career => career.type === topCareerType);
    setCareerResult(result);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
    setCareerResult(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (questions.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="app">
      {!showResult ? (
        <div className="question-card">
          <div className="progress-section">
            <div className="question-counter">
              Câu hỏi {currentIndex + 1}/{totalQuestions}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="question-content">
            <h2 className="question-text">{currentQuestion.text}</h2>
            
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
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
      ) : (
        <div className="result-container">
          <div className="result-header">
            <h1>🎯 Kết quả định hướng nghề nghiệp</h1>
            <p>Dựa trên những lựa chọn của bạn</p>
          </div>
          
          <div className="career-result">
            <div className="career-icon">
              {careerResult?.type === 'creative' && '🎨'}
              {careerResult?.type === 'business' && '💼'}
              {careerResult?.type === 'analytical' && '📊'}
              {careerResult?.type === 'technical' && '💻'}
              {careerResult?.type === 'social' && '🤝'}
            </div>
            
            <h2>Nghề nghiệp phù hợp với bạn:</h2>
            <div className="career-title">{careerResult?.title}</div>
            
            <div className="career-description">
              <p>{careerResult?.description}</p>
            </div>
            
            <div className="career-details">
              <div className="detail-section">
                <h3>🌟 Kỹ năng nổi bật:</h3>
                <p>{careerResult?.skills}</p>
              </div>
              
              <div className="detail-section">
                <h3>🏢 Môi trường làm việc phù hợp:</h3>
                <p>{careerResult?.environment}</p>
              </div>
            </div>
            
            <button onClick={resetQuiz} className="btn-restart">
              Làm lại bài test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;