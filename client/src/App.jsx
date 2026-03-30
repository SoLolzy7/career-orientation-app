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

  // Dữ liệu mẫu dự phòng (fallback) nếu không load được file JSON
  const fallbackQuestions = [
    {
      id: 1,
      text: "Trong một bữa tiệc, bạn thường:",
      options: [
        { value: "E", text: "Hòa đồng, nói chuyện với nhiều người" },
        { value: "I", text: "Trò chuyện với một vài người quen" }
      ]
    },
    {
      id: 2,
      text: "Bạn thiên về cách làm việc nào hơn?",
      options: [
        { value: "S", text: "Thực tế, chi tiết, có kế hoạch cụ thể" },
        { value: "N", text: "Sáng tạo, nhìn tổng thể, thích khám phá" }
      ]
    },
    {
      id: 3,
      text: "Khi đưa ra quyết định, bạn dựa vào:",
      options: [
        { value: "T", text: "Logic, lý trí và phân tích" },
        { value: "F", text: "Cảm xúc và giá trị cá nhân" }
      ]
    },
    {
      id: 4,
      text: "Về phong cách sống, bạn thích:",
      options: [
        { value: "J", text: "Có kế hoạch rõ ràng, đúng giờ" },
        { value: "P", text: "Linh hoạt, tùy hứng, thích ứng nhanh" }
      ]
    },
    {
      id: 5,
      text: "Bạn thích làm việc trong môi trường nào?",
      options: [
        { value: "E", text: "Năng động, nhiều người, hoạt động nhóm" },
        { value: "I", text: "Yên tĩnh, tập trung, làm việc độc lập" }
      ]
    },
    {
      id: 6,
      text: "Bạn tiếp cận vấn đề mới như thế nào?",
      options: [
        { value: "S", text: "Dựa vào kinh nghiệm và thực tế" },
        { value: "N", text: "Tìm kiếm ý tưởng và khả năng mới" }
      ]
    },
    {
      id: 7,
      text: "Điều gì quan trọng hơn với bạn?",
      options: [
        { value: "T", text: "Sự công bằng và đúng đắn" },
        { value: "F", text: "Sự hòa hợp và thấu hiểu" }
      ]
    },
    {
      id: 8,
      text: "Bạn thường xử lý deadline như thế nào?",
      options: [
        { value: "J", text: "Lên kế hoạch từ sớm và hoàn thành trước hạn" },
        { value: "P", text: "Làm việc dồn dập gần đến hạn" }
      ]
    }
  ];

  const fallbackCareers = {
    'INTJ': {
      description: 'Nhà chiến lược - Tư duy logic, tầm nhìn xa, thích lập kế hoạch dài hạn',
      careers: [
        { title: 'Kỹ sư phần mềm', icon: '💻', reason: 'Phù hợp với tư duy logic và hệ thống' },
        { title: 'Nhà phân tích dữ liệu', icon: '📊', reason: 'Khả năng phân tích và giải quyết vấn đề' },
        { title: 'Chuyên gia chiến lược', icon: '🎯', reason: 'Tầm nhìn dài hạn và tư duy chiến lược' }
      ]
    },
    'INTP': {
      description: 'Nhà tư duy - Sáng tạo, thích khám phá lý thuyết và ý tưởng mới',
      careers: [
        { title: 'Nhà khoa học', icon: '🔬', reason: 'Đam mê khám phá và nghiên cứu' },
        { title: 'Kiến trúc sư', icon: '🏛️', reason: 'Tư duy sáng tạo và hệ thống' },
        { title: 'Nhà phát triển sản phẩm', icon: '🚀', reason: 'Thích tạo ra giải pháp mới' }
      ]
    },
    'ENTJ': {
      description: 'Nhà lãnh đạo - Quyết đoán, có tầm nhìn, khả năng tổ chức tốt',
      careers: [
        { title: 'Giám đốc điều hành', icon: '👔', reason: 'Khả năng lãnh đạo bẩm sinh' },
        { title: 'Quản lý dự án', icon: '📋', reason: 'Tổ chức và điều phối tốt' },
        { title: 'Doanh nhân', icon: '💼', reason: 'Tầm nhìn và quyết đoán' }
      ]
    },
    'ENTP': {
      description: 'Nhà đổi mới - Sáng tạo, linh hoạt, thích thử thách mới',
      careers: [
        { title: 'Chuyên gia marketing', icon: '📢', reason: 'Sáng tạo và tư duy đột phá' },
        { title: 'Nhà thiết kế', icon: '🎨', reason: 'Đam mê sáng tạo' },
        { title: 'Khởi nghiệp', icon: '🌟', reason: 'Thích thử thách và đổi mới' }
      ]
    },
    'INFJ': {
      description: 'Người cố vấn - Thấu hiểu, nhạy cảm, muốn giúp đỡ người khác',
      careers: [
        { title: 'Chuyên viên tư vấn', icon: '🤝', reason: 'Khả năng thấu hiểu và đồng cảm' },
        { title: 'Nhà tâm lý học', icon: '🧠', reason: 'Quan tâm đến con người' },
        { title: 'Giáo viên', icon: '📚', reason: 'Đam mê truyền cảm hứng' }
      ]
    },
    'INFP': {
      description: 'Người lý tưởng - Giàu cảm xúc, sống theo giá trị cá nhân',
      careers: [
        { title: 'Nhà văn', icon: '✍️', reason: 'Giàu cảm xúc và sáng tạo' },
        { title: 'Nghệ sĩ', icon: '🎭', reason: 'Biểu đạt cảm xúc qua nghệ thuật' },
        { title: 'Chuyên viên xã hội', icon: '💝', reason: 'Muốn tạo ra thay đổi tích cực' }
      ]
    },
    'ENFJ': {
      description: 'Người truyền cảm hứng - Thân thiện, nhiệt tình, lãnh đạo tự nhiên',
      careers: [
        { title: 'Nhà đào tạo', icon: '🎓', reason: 'Khả năng truyền cảm hứng' },
        { title: 'Chuyên viên nhân sự', icon: '👥', reason: 'Hiểu và kết nối con người' },
        { title: 'Nhà báo', icon: '📰', reason: 'Giao tiếp và kết nối cộng đồng' }
      ]
    },
    'ENFP': {
      description: 'Nhà truyền thông - Năng động, sáng tạo, yêu thích khám phá',
      careers: [
        { title: 'Chuyên gia truyền thông', icon: '📱', reason: 'Sáng tạo và linh hoạt' },
        { title: 'Nhà tổ chức sự kiện', icon: '🎉', reason: 'Năng động và thích giao tiếp' },
        { title: 'Hướng dẫn viên du lịch', icon: '✈️', reason: 'Yêu thích khám phá' }
      ]
    },
    'ISTJ': {
      description: 'Người thực tế - Đáng tin cậy, chi tiết, có nguyên tắc',
      careers: [
        { title: 'Kế toán', icon: '💰', reason: 'Chi tiết và chính xác' },
        { title: 'Quản trị văn phòng', icon: '📁', reason: 'Có tổ chức và nguyên tắc' },
        { title: 'Luật sư', icon: '⚖️', reason: 'Tuân thủ nguyên tắc và quy định' }
      ]
    },
    'ISFJ': {
      description: 'Người chăm sóc - Tận tụy, kiên nhẫn, quan tâm đến người khác',
      careers: [
        { title: 'Y tá', icon: '🏥', reason: 'Chăm sóc và tận tụy' },
        { title: 'Thủ thư', icon: '📖', reason: 'Kiên nhẫn và tỉ mỉ' },
        { title: 'Quản lý hành chính', icon: '📋', reason: 'Có tổ chức và trách nhiệm' }
      ]
    },
    'ESTJ': {
      description: 'Nhà quản lý - Hiệu quả, thực tế, khả năng lãnh đạo tốt',
      careers: [
        { title: 'Quản lý điều hành', icon: '📊', reason: 'Hiệu quả và quyết đoán' },
        { title: 'Chuyên viên tài chính', icon: '💹', reason: 'Thực tế và logic' },
        { title: 'Quản lý chuỗi cung ứng', icon: '🚚', reason: 'Tổ chức và điều phối tốt' }
      ]
    },
    'ESFJ': {
      description: 'Người hòa đồng - Thân thiện, chu đáo, thích giúp đỡ',
      careers: [
        { title: 'Chuyên viên chăm sóc khách hàng', icon: '💬', reason: 'Thân thiện và chu đáo' },
        { title: 'Nhân viên y tế cộng đồng', icon: '🏥', reason: 'Quan tâm đến cộng đồng' },
        { title: 'Giáo viên mầm non', icon: '👶', reason: 'Yêu trẻ và kiên nhẫn' }
      ]
    },
    'ISTP': {
      description: 'Người thực hành - Khéo léo, thực tế, thích giải quyết vấn đề',
      careers: [
        { title: 'Kỹ thuật viên', icon: '🔧', reason: 'Khéo léo và thực hành' },
        { title: 'Phi công', icon: '✈️', reason: 'Phản xạ nhanh và kỹ thuật' },
        { title: 'Kiểm sát viên', icon: '🔍', reason: 'Chi tiết và chính xác' }
      ]
    },
    'ESTP': {
      description: 'Người hành động - Năng động, thực tế, thích thử thách',
      careers: [
        { title: 'Nhân viên kinh doanh', icon: '📈', reason: 'Năng động và quyết đoán' },
        { title: 'Chuyên gia thể thao', icon: '⚽', reason: 'Thích thử thách' },
        { title: 'Đầu bếp', icon: '🍳', reason: 'Sáng tạo và hành động nhanh' }
      ]
    },
    'ESFP': {
      description: 'Người biểu diễn - Vui vẻ, hòa đồng, thích trung tâm',
      careers: [
        { title: 'Diễn viên', icon: '🎬', reason: 'Thích thể hiện bản thân' },
        { title: 'MC/ Dẫn chương trình', icon: '🎤', reason: 'Giao tiếp tự nhiên' },
        { title: 'Chuyên viên sự kiện', icon: '🎪', reason: 'Năng động và sáng tạo' }
      ]
    }
  };

  // Load dữ liệu từ file JSON
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Đang tải dữ liệu...');
        
        // Thử tải file JSON, nếu không được thì dùng fallback
        let questions = fallbackQuestions;
        let careers = fallbackCareers;
        
        try {
          const questionsRes = await fetch('/questions.json');
          if (questionsRes.ok) {
            questions = await questionsRes.json();
            console.log('Đã tải questions.json thành công');
          } else {
            console.warn('Không tìm thấy questions.json, dùng dữ liệu mẫu');
          }
        } catch (e) {
          console.warn('Lỗi tải questions.json, dùng dữ liệu mẫu:', e);
        }
        
        try {
          const careersRes = await fetch('/careers.json');
          if (careersRes.ok) {
            careers = await careersRes.json();
            console.log('Đã tải careers.json thành công');
          } else {
            console.warn('Không tìm thấy careers.json, dùng dữ liệu mẫu');
          }
        } catch (e) {
          console.warn('Lỗi tải careers.json, dùng dữ liệu mẫu:', e);
        }
        
        setQuestionsData(questions);
        setCareersData(careers);
        setDataLoaded(true);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        // Dùng fallback nếu tất cả đều lỗi
        setQuestionsData(fallbackQuestions);
        setCareersData(fallbackCareers);
        setDataLoaded(true);
        alert('Sử dụng dữ liệu mẫu. Nếu muốn dùng dữ liệu riêng, hãy thêm file questions.json và careers.json vào thư mục public!');
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
      if (scores[answer.value] !== undefined) {
        scores[answer.value] = (scores[answer.value] || 0) + 1;
      }
    });
    
    const energy = scores.E >= scores.I ? 'E' : 'I';
    const perception = scores.S >= scores.N ? 'S' : 'N';
    const decision = scores.T >= scores.F ? 'T' : 'F';
    const lifestyle = scores.J >= scores.P ? 'J' : 'P';
    const type = energy + perception + decision + lifestyle;
    
    const totalEI = scores.E + scores.I;
    const totalSN = scores.S + scores.N;
    const totalTF = scores.T + scores.F;
    const totalJP = scores.J + scores.P;
    
    const percentages = {
      EI: { 
        E: scores.E, 
        I: scores.I, 
        dominant: energy, 
        percentage: totalEI > 0 ? Math.round((Math.max(scores.E, scores.I) / totalEI) * 100) : 50 
      },
      SN: { 
        S: scores.S, 
        N: scores.N, 
        dominant: perception, 
        percentage: totalSN > 0 ? Math.round((Math.max(scores.S, scores.N) / totalSN) * 100) : 50 
      },
      TF: { 
        T: scores.T, 
        F: scores.F, 
        dominant: decision, 
        percentage: totalTF > 0 ? Math.round((Math.max(scores.T, scores.F) / totalTF) * 100) : 50 
      },
      JP: { 
        J: scores.J, 
        P: scores.P, 
        dominant: lifestyle, 
        percentage: totalJP > 0 ? Math.round((Math.max(scores.J, scores.P) / totalJP) * 100) : 50 
      }
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
          careers: [
            { title: 'Chuyên viên tư vấn hướng nghiệp', icon: '🎯', reason: 'Phù hợp với khả năng thấu hiểu' },
            { title: 'Nhà nghiên cứu phát triển', icon: '🔬', reason: 'Tư duy phân tích tốt' },
            { title: 'Chuyên gia sáng tạo nội dung', icon: '✍️', reason: 'Giàu ý tưởng mới' }
          ]
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
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < questionsData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Gửi email qua EmailJS
  const handleSendEmail = async () => {
    if (!result) return;
    
    setLoading(true);
    try {
      let careerTitles = [];
      if (result.careers.careers && Array.isArray(result.careers.careers)) {
        careerTitles = result.careers.careers.map(c => typeof c === 'object' ? c.title : c);
      } else if (Array.isArray(result.careers)) {
        careerTitles = result.careers;
      } else {
        careerTitles = ['Chuyên gia tư vấn hướng nghiệp', 'Nhà nghiên cứu', 'Nhà sáng tạo'];
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
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
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
              <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
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
        key="questions"
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
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', minHeight: '100px', lineHeight: '1.4' }}>
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
    
    const careerList = result.careers?.careers || [];
    const traitPairs = [
      { left: result.percentages.EI.E, right: result.percentages.EI.I, leftName: 'Hướng ngoại (E)', rightName: 'Hướng nội (I)', dominant: result.percentages.EI.dominant, percentage: result.percentages.EI.percentage },
      { left: result.percentages.SN.S, right: result.percentages.SN.N, leftName: 'Giác quan (S)', rightName: 'Trực giác (N)', dominant: result.percentages.SN.dominant, percentage: result.percentages.SN.percentage },
      { left: result.percentages.TF.T, right: result.percentages.TF.F, leftName: 'Lý trí (T)', rightName: 'Cảm xúc (F)', dominant: result.percentages.TF.dominant, percentage: result.percentages.TF.percentage },
      { left: result.percentages.JP.J, right: result.percentages.JP.P, leftName: 'Nguyên tắc (J)', rightName: 'Linh hoạt (P)', dominant: result.percentages.JP.dominant, percentage: result.percentages.JP.percentage }
    ];
    
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <div className="card">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
              🎉 Kết Quả Của Bạn, {userInfo.name}!
            </h1>
            
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div style={{ 
                fontSize: '4rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
                letterSpacing: '4px'
              }}>
                {result.type}
              </div>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                {result.careers.description || 'Tính cách độc đáo của bạn'}
              </p>
            </div>
            
            <h3>📊 Phân Tích Chi Tiết</h3>
            <div className="traits-grid">
              {traitPairs.map((pair, idx) => (
                <div key={idx} className="trait-card">
                  <div className="trait-letter">{pair.dominant}</div>
                  <div className="trait-name">
                    {pair.dominant === 'E' ? pair.leftName.split('(')[0] : 
                     pair.dominant === 'I' ? pair.rightName.split('(')[0] :
                     pair.dominant === 'S' ? pair.leftName.split('(')[0] :
                     pair.dominant === 'N' ? pair.rightName.split('(')[0] :
                     pair.dominant === 'T' ? pair.leftName.split('(')[0] :
                     pair.dominant === 'F' ? pair.rightName.split('(')[0] :
                     pair.dominant === 'J' ? pair.leftName.split('(')[0] :
                     pair.rightName.split('(')[0]}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#667eea' }}>
                    {pair.percentage}%
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
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                          {career.reason}
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>
                  Đang cập nhật dữ liệu nghề nghiệp...
                </p>
              )}
            </ul>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleSendEmail} 
                className="btn btn-primary" 
                disabled={loading}
                style={{ flex: 1, minWidth: '180px' }}
              >
                {loading ? 'Đang gửi...' : '📧 Gửi Kết Quả Qua Email'}
              </button>
              <button 
                onClick={handleRestart} 
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '180px' }}
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