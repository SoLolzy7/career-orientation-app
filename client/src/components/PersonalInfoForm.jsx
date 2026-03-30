import { useState } from 'react'

// Simple form to collect name and email
function PersonalInfoForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && email.trim()) {
      onSubmit({ name, email })
    } else {
      alert('Please fill in both fields')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Welcome to Career Orientation</h2>
      <p>Please enter your details to get started.</p>

      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <button type="submit">Start Assessment</button>
    </form>
  )
}

export default PersonalInfoForm