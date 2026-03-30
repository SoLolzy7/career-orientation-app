import { useState, useEffect } from 'react';
import PersonalInfoForm from './components/PersonalInfoForm';
import QuestionCard from './components/QuestionCard';
import CareerResults from './components/CareerResults';
import LoadingSpinner from './components/LoadingSpinner';
import { calculatePersonality } from './services/scoring';
import { sendResultEmail } from './services/api';

function App() {
  const [step, setStep] = useState('personal');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const [careersData, setCareersData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Đang tải dữ liệu...');
        const questionsRes = await fetch('/questions.json');
        const careersRes = await fetch('/careers.json');
        
        if (!questionsRes.ok) {
          throw new Error(`Không thể tải questions.json: ${questionsRes.status}`);
        }
        if (!careersRes.ok) {
          throw new Error(`Không thể tải careers.json: ${careersRes.status}`);
        }
        
        const questions = await questionsRes.json();
        const careers = await careersRes.json();
        
        console.log('Đã tải xong:', questions.length, 'câu hỏi');
        setQuestionsData(questions);
        setCareersData(careers);
        setDataLoaded(true);
      } catch (error) {
        console.error('Lỗi chi tiết:', error);
        alert('Không thể tải dữ liệu: ' + error.message);
      }
    };
    
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Tính toán kết quả khi hoàn thành câu hỏi
  useEffect(() => {
    if (step === 'questions' && answers.length === questionsData.length && questionsData.length > 0) {
      setLoading(true);
      setTimeout(() => {
        const personalityResult = calculatePersonality(answers, questionsData);
        const careerData = careersData[personalityResult.type];
        setResult({
          ...personalityResult,
          careers: careerData || { description: 'Chưa có dữ liệu', careers: [] }
        });
        setStep('results');
        setLoading(false);
      }, 500);
    }
  }, [answers, step, questionsData, careersData]);

  const handlePersonalInfoSubmit = (info) => {
    setUserInfo(info);
    setStep('questions');
  };

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

  const handleSendEmail = async () => {
    if (!result) return;
    
    setLoading(true);
    try {
      // Lấy danh sách careers
      let careerTitles = [];
      if (result.careers.careers) {
        careerTitles = result.careers.careers.map(c => c.title || c);
      } else if (Array.isArray(result.careers)) {
        careerTitles = result.careers;
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

  const handleRestart = () => {
    setStep('personal');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
  };

  // Hiển thị loading khi chưa có dữ liệu
  if (!dataLoaded) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (step === 'personal') {
    return <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />;
  }

  if (step === 'questions') {
    const currentQuestion = questionsData[currentQuestionIndex];
    return (
      <QuestionCard
        question={currentQuestion.text}
        options={currentQuestion.options}
        onAnswer={handleAnswer}
        currentIndex={currentQuestionIndex}
        total={questionsData.length}
      />
    );
  }

  if (step === 'results') {
    if (loading || !result) return <LoadingSpinner />;
    
    return (
      <>
        <CareerResults
          name={userInfo.name}
          personality={result.type}
          careers={result.careers}
          percentages={result.percentages}
          onSendEmail={handleSendEmail}
          onRestart={handleRestart}
          loading={loading}
        />
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </>
    );
  }

  return <LoadingSpinner />;
}

export default App;