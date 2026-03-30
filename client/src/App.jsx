import { useState, useEffect } from 'react'
import PersonalInfoForm from './components/PersonalInfoForm'
import QuestionCard from './components/QuestionCard'
import CareerResults from './components/CareerResults'
import LoadingSpinner from './components/LoadingSpinner'
import { calculatePersonality } from './services/scoring'
import { sendResultEmail } from './services/api'

// Import questions and careers directly from the data folder
import questions from "./questions.json"; 
import careersData from './careers.json'

function App() {
  // State for the whole app
  const [step, setStep] = useState('personal') // 'personal', 'questions', 'results'
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([]) // store answers as { questionId, value }
  const [personality, setPersonality] = useState('')
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(false)

  // When all questions are answered, calculate results
  useEffect(() => {
    if (step === 'questions' && answers.length === questionsData.length) {
      const result = calculatePersonality(answers, questionsData)
      setPersonality(result.type)
      setCareers(careersData[result.type] || ['No specific careers found'])
      setStep('results')
    }
  }, [answers, step])

  // Save user info and start questions
  const handlePersonalInfoSubmit = (info) => {
    setUserInfo(info)
    setStep('questions')
  }

  // Save answer and move to next question
  const handleAnswer = (answerValue) => {
    const newAnswer = {
      questionId: questionsData[currentQuestionIndex].id,
      value: answerValue
    }
    setAnswers([...answers, newAnswer])

    // Move to next question
    if (currentQuestionIndex + 1 < questionsData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // All questions answered – the useEffect will handle calculation
    }
  }

  // Send email after results are shown
  const handleSendEmail = async () => {
    setLoading(true)
    try {
      await sendResultEmail(userInfo.email, userInfo.name, personality, careers)
      alert('Email sent successfully!')
    } catch (error) {
      console.error(error)
      alert('Failed to send email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Render different screens
  if (step === 'personal') {
    return <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
  }

  if (step === 'questions') {
    const currentQuestion = questionsData[currentQuestionIndex]
    return (
      <QuestionCard
        question={currentQuestion.text}
        options={currentQuestion.options}
        onAnswer={handleAnswer}
        progress={`${currentQuestionIndex + 1} / ${questionsData.length}`}
      />
    )
  }

  if (step === 'results') {
    return (
      <CareerResults
        name={userInfo.name}
        personality={personality}
        careers={careers}
        onSendEmail={handleSendEmail}
        loading={loading}
      />
    )
  }

  return <LoadingSpinner />
}

export default App