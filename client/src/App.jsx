import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendResultEmail } from './services/api';
import { calculatePersonality } from './scoring';
import './index.css';

function App() {
  // ==================== ALL HOOKS AT TOP ====================
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
  
  // State for current question
  const [selectedScore, setSelectedScore] = useState(null);

  // Score options for 1-5 scale
  const scores = [
    { value: 1, label: '1', text: 'Not at all', textEn: 'Does not describe me' },
    { value: 2, label: '2', text: 'Slightly', textEn: 'Describes me a little' },
    { value: 3, label: '3', text: 'Moderately', textEn: 'Describes me moderately' },
    { value: 4, label: '4', text: 'Very much', textEn: 'Describes me well' },
    { value: 5, label: '5', text: 'Extremely', textEn: 'Describes me very well' }
  ];

  // Complete careers data for all 16 MBTI types
  const fallbackCareers = {
    'INTJ': {
      description: 'The Strategist - Strategic thinking, independent, problem solver',
      careers: [
        { title: 'Data Scientist', icon: '📊', reason: 'Strategic thinking and analytical skills' },
        { title: 'Architect', icon: '🏛️', reason: 'Vision and systematic planning' },
        { title: 'Strategy Consultant', icon: '🎯', reason: 'Long-term vision and strategic mindset' }
      ]
    },
    'INTP': {
      description: 'The Thinker - Logical analysis, curious, enjoys exploration',
      careers: [
        { title: 'Software Developer', icon: '💻', reason: 'Logical thinking and problem-solving' },
        { title: 'Research Scientist', icon: '🔬', reason: 'Curiosity and analytical mindset' },
        { title: 'Philosopher', icon: '📚', reason: 'Deep thinking and abstract reasoning' }
      ]
    },
    'ENTJ': {
      description: 'The Commander - Bold, imaginative, strong-willed leader',
      careers: [
        { title: 'Executive Director', icon: '👔', reason: 'Natural leadership and strategic vision' },
        { title: 'Management Consultant', icon: '📊', reason: 'Problem-solving and organizational skills' },
        { title: 'Entrepreneur', icon: '🚀', reason: 'Visionary thinking and determination' }
      ]
    },
    'ENTP': {
      description: 'The Debater - Creative, quick-witted, enjoys intellectual challenges',
      careers: [
        { title: 'Entrepreneur', icon: '🚀', reason: 'Innovation and risk-taking' },
        { title: 'Lawyer', icon: '⚖️', reason: 'Debate skills and logical reasoning' },
        { title: 'Advertising Executive', icon: '📢', reason: 'Creativity and persuasion' }
      ]
    },
    'INFJ': {
      description: 'The Advocate - Insightful, humanistic, visionary',
      careers: [
        { title: 'Writer', icon: '✍️', reason: 'Deep insight and creativity' },
        { title: 'Counselor', icon: '🤝', reason: 'Empathy and understanding' },
        { title: 'Nonprofit Director', icon: '💝', reason: 'Vision and humanitarian values' }
      ]
    },
    'INFP': {
      description: 'The Mediator - Idealistic, creative, driven by strong values',
      careers: [
        { title: 'Psychologist', icon: '🧠', reason: 'Understanding human behavior' },
        { title: 'Graphic Designer', icon: '🎨', reason: 'Creativity and self-expression' },
        { title: 'Social Worker', icon: '🤝', reason: 'Helping others and making a difference' }
      ]
    },
    'ENFJ': {
      description: 'The Protagonist - Charismatic, inspiring, natural leader',
      careers: [
        { title: 'Teacher', icon: '📚', reason: 'Inspiring and guiding others' },
        { title: 'HR Manager', icon: '👥', reason: 'Understanding and developing people' },
        { title: 'Public Relations Specialist', icon: '📢', reason: 'Communication and relationship building' }
      ]
    },
    'ENFP': {
      description: 'The Campaigner - Enthusiastic, creative, people-oriented',
      careers: [
        { title: 'Marketing Specialist', icon: '📱', reason: 'Creativity and communication' },
        { title: 'Event Planner', icon: '🎉', reason: 'Energy and organization' },
        { title: 'Journalist', icon: '📰', reason: 'Curiosity and storytelling' }
      ]
    },
    'ISTJ': {
      description: 'The Logistician - Practical, fact-minded, dependable',
      careers: [
        { title: 'Accountant', icon: '💰', reason: 'Attention to detail and accuracy' },
        { title: 'Project Manager', icon: '📋', reason: 'Organization and responsibility' },
        { title: 'Librarian', icon: '📖', reason: 'Systematic and detail-oriented' }
      ]
    },
    'ISFJ': {
      description: 'The Defender - Dedicated, warm-hearted, protective',
      careers: [
        { title: 'Pharmacist', icon: '💊', reason: 'Attention to detail and care' },
        { title: 'Social Worker', icon: '🤝', reason: 'Empathy and dedication' },
        { title: 'Administrative Assistant', icon: '📁', reason: 'Organization and reliability' }
      ]
    },
    'ESTJ': {
      description: 'The Executive - Efficient, organized, practical leader',
      careers: [
        { title: 'Police Officer', icon: '👮', reason: 'Decisiveness and structure' },
        { title: 'Operations Manager', icon: '🏭', reason: 'Efficiency and organization' },
        { title: 'Judge', icon: '⚖️', reason: 'Decisiveness and fairness' }
      ]
    },
    'ESFJ': {
      description: 'The Consul - Caring, social, community-oriented',
      careers: [
        { title: 'Teacher', icon: '📚', reason: 'Nurturing and communication' },
        { title: 'Nurse', icon: '🏥', reason: 'Caring and dedication' },
        { title: 'Sales Representative', icon: '💼', reason: 'Social skills and helpfulness' }
      ]
    },
    'ISTP': {
      description: 'The Virtuoso - Bold, practical, hands-on problem solver',
      careers: [
        { title: 'Mechanical Engineer', icon: '🔧', reason: 'Practical skills and problem-solving' },
        { title: 'Pilot', icon: '✈️', reason: 'Quick reflexes and technical skills' },
        { title: 'Forensic Analyst', icon: '🔍', reason: 'Attention to detail and analysis' }
      ]
    },
    'ISFP': {
      description: 'The Adventurer - Flexible, charming, artistic',
      careers: [
        { title: 'Artist', icon: '🎨', reason: 'Creative expression and aesthetics' },
        { title: 'Musician', icon: '🎵', reason: 'Emotional expression through art' },
        { title: 'Chef', icon: '🍳', reason: 'Hands-on creativity and sensory experience' }
      ]
    },
    'ESTP': {
      description: 'The Entrepreneur - Energetic, perceptive, risk-taker',
      careers: [
        { title: 'Real Estate Agent', icon: '🏠', reason: 'Energy and negotiation skills' },
        { title: 'Athlete', icon: '⚽', reason: 'Physical energy and competition' },
        { title: 'EMT', icon: '🚑', reason: 'Quick decision-making under pressure' }
      ]
    },
    'ESFP': {
      description: 'The Entertainer - Spontaneous, energetic, enthusiastic',
      careers: [
        { title: 'Actor', icon: '🎬', reason: 'Expression and charisma' },
        { title: 'Tour Guide', icon: '🗺️', reason: 'Energy and communication' },
        { title: 'Event Coordinator', icon: '🎪', reason: 'Creativity and people skills' }
      ]
    }
  };

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data...');
        
        let questions = [];
        let careers = fallbackCareers;
        
        try {
          const questionsRes = await fetch('/questions.json');
          if (questionsRes.ok) {
            questions = await questionsRes.json();
            console.log('Successfully loaded questions.json');
          } else {
            console.warn('questions.json not found, using fallback');
          }
        } catch (e) {
          console.warn('Error loading questions.json:', e);
        }
        
        try {
          const careersRes = await fetch('/careers.json');
          if (careersRes.ok) {
            careers = await careersRes.json();
            console.log('Successfully loaded careers.json');
          } else {
            console.warn('careers.json not found, using fallback');
          }
        } catch (e) {
          console.warn('Error loading careers.json:', e);
        }
        
        setQuestionsData(questions);
        setCareersData(careers);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setQuestionsData([]);
        setCareersData(fallbackCareers);
        setDataLoaded(true);
      }
    };
    
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate results when questions are completed
  useEffect(() => {
    console.log('Checking completion:', { 
      step, 
      answersLength: answers.length, 
      totalQuestions: questionsData.length 
    });
    
    if (step === 'questions' && answers.length === questionsData.length && questionsData.length > 0) {
      console.log('All questions answered! Calculating results...');
      setLoading(true);
      setTimeout(() => {
        const personalityResult = calculatePersonality(answers, questionsData);
        console.log('Personality result:', personalityResult);
        
        const careerData = careersData[personalityResult.type] || {
          description: `${personalityResult.type} - Your unique personality type`,
          careers: [
            { title: 'Career Counselor', icon: '🎯', reason: 'Understanding of people' },
            { title: 'Research Specialist', icon: '🔬', reason: 'Analytical thinking' },
            { title: 'Content Creator', icon: '✍️', reason: 'Creative ideas' }
          ]
        };
        setResult({
          type: personalityResult.type,
          percentages: personalityResult.percentages,
          careers: careerData
        });
        setStep('results');
        setLoading(false);
      }, 500);
    }
  }, [answers, step, questionsData, careersData]);

  // Handle answer selection - AUTO GO TO NEXT QUESTION
  const handleAnswer = (value) => {
    const newAnswer = {
      questionId: questionsData[currentQuestionIndex].id,
      value: value,
    };
    
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    
    // Auto move to next question after answering
    if (currentQuestionIndex + 1 < questionsData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedScore(null);
    }
  };
  
  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Remove the last answer when going back
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedScore(null);
    }
  };
  
  // Handle score selection for current question
  const handleScoreSelect = (score) => {
    setSelectedScore(score);
  };
  
  // Handle submit for current question - AUTO GOES TO NEXT
  const handleSubmit = () => {
    if (selectedScore === null) {
      alert('Please select a rating (1-5)');
      return;
    }
    handleAnswer(selectedScore);
  };

  const handlePersonalInfoSubmit = (info) => {
    setUserInfo(info);
    setStep('questions');
  };

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
        careerTitles = ['Career Counselor', 'Research Specialist', 'Content Creator'];
      }
      
      await sendResultEmail(
        userInfo.email,
        userInfo.name,
        result.type,
        careerTitles
      );
      showToast('Email sent successfully! 📧', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to send email. Please try again! ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep('personal');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setUserInfo({ name: '', email: '' });
    setSelectedScore(null);
  };

  if (!dataLoaded) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  // ==================== PERSONAL INFO FORM ====================
  if (step === 'personal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container"
      >
        <div className="card">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🌟 Discover Your Career Path
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            MBTI personality assessment to help you understand yourself and find suitable careers
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (userInfo.name.trim() && userInfo.email.trim()) {
              handlePersonalInfoSubmit(userInfo);
            } else {
              alert('Please fill in all fields');
            }
          }}>
            <div className="form-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                placeholder="Enter your full name"
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
                Results will be sent to your email
              </small>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Start Assessment 🚀
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // ==================== QUESTIONS (1-5 SCALE) ====================
  if (step === 'questions') {
    const currentQuestion = questionsData[currentQuestionIndex];
    const percentage = ((currentQuestionIndex + 1) / questionsData.length) * 100;
    
    if (!currentQuestion || questionsData.length === 0) {
      return (
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Loading questions...</p>
          </div>
        </div>
      );
    }
    
    // Check if current question already has an answer
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
    const hasAnswer = !!currentAnswer;
    
    // If we're revisiting a question, show the selected score
    const displayScore = hasAnswer ? currentAnswer.value : selectedScore;
    
    return (
      <div className="container">
        <div className="card">
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="progress-text">
              Question {currentQuestionIndex + 1} / {questionsData.length}
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {currentQuestion.text}
          </h2>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Rate how well this describes you (1 = Not at all, 5 = Describes me very well)
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
              Rate how well this describes you:
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              {scores.map((score) => (
                <button
                  key={score.value}
                  onClick={() => handleScoreSelect(score.value)}
                  disabled={hasAnswer}
                  style={{
                    flex: 1,
                    minWidth: '70px',
                    padding: '12px',
                    background: displayScore === score.value ? '#667eea' : '#f9fafb',
                    border: displayScore === score.value ? '2px solid #667eea' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: hasAnswer ? 'not-allowed' : 'pointer',
                    color: displayScore === score.value ? 'white' : '#333',
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: '12px 30px',
                background: currentQuestionIndex === 0 ? '#ccc' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ← Previous
            </button>
            
            {!hasAnswer ? (
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
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Confirm Answer ✓
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (currentQuestionIndex + 1 < questionsData.length) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setSelectedScore(null);
                  }
                }}
                disabled={currentQuestionIndex + 1 >= questionsData.length}
                style={{
                  padding: '12px 30px',
                  background: currentQuestionIndex + 1 >= questionsData.length ? '#ccc' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: currentQuestionIndex + 1 >= questionsData.length ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                {currentQuestionIndex + 1 === questionsData.length ? 'Last Question' : 'Next →'}
              </button>
            )}
          </div>
          
          {/* Show completion status */}
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray)' }}>
            Completed: {answers.length} / {questionsData.length} questions
          </div>
        </div>
      </div>
    );
  }

  // ==================== RESULTS ====================
  if (step === 'results') {
    if (loading || !result) {
      return (
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Processing results...</p>
          </div>
        </div>
      );
    }
    
    const careerList = result.careers?.careers || [];
    const pct = result.percentages;
    
    // Debug log to see what we have
    console.log('Result percentages:', pct);
    
    const traitPairs = [
      { 
        left: pct?.EI?.E || 0, 
        right: pct?.EI?.I || 0, 
        leftName: 'Extroversion (E)', 
        rightName: 'Introversion (I)', 
        dominant: pct?.EI?.dominant || 'E'
      },
      { 
        left: pct?.SN?.S || 0, 
        right: pct?.SN?.N || 0, 
        leftName: 'Sensing (S)', 
        rightName: 'Intuition (N)', 
        dominant: pct?.SN?.dominant || 'S'
      },
      { 
        left: pct?.TF?.T || 0, 
        right: pct?.TF?.F || 0, 
        leftName: 'Thinking (T)', 
        rightName: 'Feeling (F)', 
        dominant: pct?.TF?.dominant || 'T'
      },
      { 
        left: pct?.JP?.J || 0, 
        right: pct?.JP?.P || 0, 
        leftName: 'Judging (J)', 
        rightName: 'Perceiving (P)', 
        dominant: pct?.JP?.dominant || 'J'
      }
    ];
    
    const getTraitName = (dominant, leftName, rightName) => {
      if (dominant === 'E') return leftName.split('(')[0];
      if (dominant === 'I') return rightName.split('(')[0];
      if (dominant === 'S') return leftName.split('(')[0];
      if (dominant === 'N') return rightName.split('(')[0];
      if (dominant === 'T') return leftName.split('(')[0];
      if (dominant === 'F') return rightName.split('(')[0];
      if (dominant === 'J') return leftName.split('(')[0];
      if (dominant === 'P') return rightName.split('(')[0];
      return '';
    };
    
    const getDisplayValue = (pair) => {
      if (pair.dominant === 'E') return pair.left;
      if (pair.dominant === 'I') return pair.right;
      if (pair.dominant === 'S') return pair.left;
      if (pair.dominant === 'N') return pair.right;
      if (pair.dominant === 'T') return pair.left;
      if (pair.dominant === 'F') return pair.right;
      if (pair.dominant === 'J') return pair.left;
      if (pair.dominant === 'P') return pair.right;
      return 0;
    };
    
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <div className="card">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
              🎉 Your Results, {userInfo.name}!
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
                {result.careers.description || 'Your unique personality type'}
              </p>
            </div>
            
            <h3>📊 Detailed Analysis</h3>
            <div className="traits-grid">
              {traitPairs.map((pair, idx) => (
                <div key={idx} className="trait-card">
                  <div className="trait-letter">{pair.dominant}</div>
                  <div className="trait-name">
                    {getTraitName(pair.dominant, pair.leftName, pair.rightName)}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#667eea' }}>
                    {getDisplayValue(pair)}%
                  </div>
                </div>
              ))}
            </div>
            
            <h3>💼 Recommended Careers</h3>
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
                  Updating career data...
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
                {loading ? 'Sending...' : '📧 Send Results via Email'}
              </button>
              <button 
                onClick={handleRestart} 
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '180px' }}
              >
                🔄 Take Test Again
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
