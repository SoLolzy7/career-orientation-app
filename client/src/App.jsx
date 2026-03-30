import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendResultEmail } from './services/api';
import './index.css';

function App() {
  const [step, setStep] = useState('personal'); // personal, questions, results
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const [careersData, setCareersData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load dữ liệu từ file JSON
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Đang tải dữ liệu...');
        const questionsRes = await fetch('/questions.json');
        const careersRes = await fetch('/careers.json');
        
        if (!questionsRes.ok || !careersRes.ok) {
          throw new Error('Không thể tải file JSON');
        }
        
        const questions = await questionsRes.json();
        const careers = await careersRes.json();
        
        console.log('Đã tải xong:', questions.length, 'câu hỏi');
        setQuestionsData(questions);
        setCareersData(careers);
        setDataLoaded(true);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        alert('Không thể tải dữ liệu. Vui lòng refresh lại trang!');
      }
    };
    
    loadData();
  }, []);

  // Hiển thị thông báo
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Tính điểm MBTI
  const calculatePersonality = (answers, questions) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    answers.forEach(answer => {
      scores[answer.value] = (scores[answer.value] || 0) + 1;
    });
    
    const energy = scores.E > scores.I ? 'E' : 'I';
    const perception = scores.S > scores.N ? 'S' : 'N';
    const decision = scores.T > scores.F ? 'T' : 'F';
    const lifestyle = scores.J > scores.P ? 'J' : 'P';
    const type = energy + perception + decision + lifestyle;
    
    const totalEI = scores.E + scores.I;
    const totalSN = scores.S + scores.N;
    const totalTF = scores.T + scores.F;
    const totalJP = scores.J + scores.P;
    
    const percentages = {
      EI: { E: scores.E, I: scores.I, dominant: energy, percentage: totalEI > 0 ? Math.round((Math.max(scores.E, scores.I) / totalEI) * 100) : 50 },
      SN: { S: scores.S, N: scores.N, dominant: perception, percentage: totalSN > 0 ? Math.round((Math.max(scores.S, scores.N) / totalSN) * 100) : 50 },
      TF: { T: scores.T, F: scores.F, dominant: decision, percentage: totalTF > 0 ? Math.round((Math.max(scores.T, scores.F) / totalTF) * 100) : 50 },
      JP: { J: scores.J, P: scores.P, dominant: lifestyle, percentage: totalJP > 0 ? Math.round((Math.max(scores.J, scores.P) / totalJP) * 100) : 50 }
    };
    
    return { type, scores, percentages };
  };

  // Tính kết quả khi hoàn thành câu hỏi
  useEffect(() => {
    if (step === 'questions' && answers.length === questionsData.length && questionsData.length > 0) {
      setLoading(true);
      setTimeout(() => {
        const personalityResult = calculatePersonality(answers, questionsData);
        const careerData = careersData[personalityResult.type] || {
          description: 'Tính cách độc đáo của bạn',
          careers: ['Chuyên viên tư vấn', 'Nhà nghiên cứu', 'Nhà sáng tạo']
        };
        setResult({
          ...personalityResult,
          careers: careerData
        });
        setStep('results');
        setLoading(false);
      }, 500);
    }
  }, [answers, step, questionsData, careersData]);

  // Xử lý form thông tin cá nhân
  const handlePersonalInfoSubmit = (info) => {
    setUserInfo(info);
    setStep('questions');
  };

  // Xử lý chọn đáp án
  const handleAnswer = (answerValue) => {
    const newAnswer = {
      questionId: questionsData[currentQuestionIndex].id,
      value: answerValue
    };
    setAnswers([...answers, newAnswer]);

    if (currentQuestionIndex + 1 < questionsData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Gửi email qua EmailJS
  const handleSendEmail = async () => {
    if (!result) return;
    
    setLoading(true);
    try {
      // Lấy danh sách nghề nghiệp
      let careerTitles = [];
      if (result.careers.careers) {
        careerTitles = result.careers.careers.map(c => c.title || c);
      } else if (Array.isArray(result.careers)) {
        careerTitles = result.careers;
      } else {
        careerTitles = ['Chuyên gia tư vấn', 'Nhà nghiên cứu', 'Nhà sáng tạo'];
      }
      
      await sendResultEmail(
        userInfo.email,
        userInfo.name,
        result.type,
        careerTitles
      );
      showToast('Email đã được gửi thành công! 📧', 'success');
    } catch (error) {
      console.error(error);
      showToast('Gửi email thất bại. Vui lòng thử lại! ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Làm lại bài test
  const handleRestart = () => {
    setStep('personal');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setUserInfo({ name: '', email: '' });
  };

  // Hiển thị loading khi chưa có dữ liệu
  if (!dataLoaded) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Form nhập thông tin cá nhân
  if (step === 'personal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container"
      >
        <div className="card">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🌟 Khám Phá Định Hướng Nghề Nghiệp
          </h1>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
            Bài test MBTI giúp bạn hiểu rõ tính cách và tìm ra nghề nghiệp phù hợp
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (userInfo.name.trim() && userInfo.email.trim()) {
              handlePersonalInfoSubmit(userInfo);
            } else {
              alert('Vui lòng điền đầy đủ thông tin');
            }
          }}>
            <div className="form-group">
              <label>👤 Họ và tên</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                placeholder="Nhập họ tên của bạn"
                required
              />
            </div>
            
            <div className="form-group">
              <label>📧 Email</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                placeholder="example@email.com"
                required
              />
              <small style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>
                Kết quả sẽ được gửi đến email của bạn
              </small>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Bắt đầu làm bài test 🚀
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Hiển thị câu hỏi
  if (step === 'questions') {
    const currentQuestion = questionsData[currentQuestionIndex];
    const percentage = ((currentQuestionIndex + 1) / questionsData.length) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="container"
      >
        <div className="card">
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="progress-text">
              Câu {currentQuestionIndex + 1} / {questionsData.length}
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', minHeight: '100px' }}>
            {currentQuestion.text}
          </h2>
          
          <div className="options-grid">
            {currentQuestion.options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="option-btn"
                onClick={() => handleAnswer(opt.value)}
              >
                {opt.text}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Hiển thị kết quả
  if (step === 'results') {
    if (loading || !result) {
      return (
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Đang xử lý kết quả...</p>
          </div>
        </div>
      );
    }
    
    const careerList = result.careers.careers || [];
    const traitPairs = [
      { left: result.percentages.EI.E, right: result.percentages.EI.I, leftName: 'Hướng ngoại (E)', rightName: 'Hướng nội (I)', dominant: result.percentages.EI.dominant },
      { left: result.percentages.SN.S, right: result.percentages.SN.N, leftName: 'Giác quan (S)', rightName: 'Trực giác (N)', dominant: result.percentages.SN.dominant },
      { left: result.percentages.TF.T, right: result.percentages.TF.F, leftName: 'Lý trí (T)', rightName: 'Cảm xúc (F)', dominant: result.percentages.TF.dominant },
      { left: result.percentages.JP.J, right: result.percentages.JP.P, leftName: 'Nguyên tắc (J)', rightName: 'Linh hoạt (P)', dominant: result.percentages.JP.dominant }
    ];
    
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <div className="card">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              🎉 Kết Quả Của Bạn, {userInfo.name}!
            </h1>
            
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                {result.type}
              </div>
              <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>
                {result.careers.description || 'Tính cách độc đáo của bạn'}
              </p>
            </div>
            
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
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={handleSendEmail} 
                className="btn btn-primary" 
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Đang gửi...' : '📧 Gửi Kết Quả Qua Email'}
              </button>
              <button 
                onClick={handleRestart} 
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                🔄 Làm Lại Bài Test
              </button>
            </div>
          </div>
        </motion.div>
        
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </>
    );
  }
  
  return null;
}

export default App;