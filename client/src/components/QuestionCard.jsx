// Shows one question at a time with options as buttons
function QuestionCard({ question, options, onAnswer, progress }) {
  return (
    <div className="card">
      <h2>Question {progress}</h2>
      <p>{question}</p>
      <div>
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(opt.value)}
            style={{ marginRight: '1rem', marginTop: '1rem' }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuestionCard