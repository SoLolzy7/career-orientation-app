import LoadingSpinner from './LoadingSpinner'

// Displays the personality type and suggested careers
function CareerResults({ name, personality, careers, onSendEmail, loading }) {
  return (
    <div className="card">
      <h2>Hi {name}!</h2>
      <p>Your personality type is: <strong>{personality}</strong></p>
      <h3>Suggested careers:</h3>
      <ul>
        {careers.map((career, i) => (
          <li key={i}>{career}</li>
        ))}
      </ul>
      <button onClick={onSendEmail} disabled={loading}>
        {loading ? <LoadingSpinner /> : 'Send Results to My Email'}
      </button>
    </div>
  )
}

export default CareerResults