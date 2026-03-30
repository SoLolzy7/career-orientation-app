// Function to call the serverless email endpoint
export async function sendResultEmail(email, name, personality, careers) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: email,
      name: name,
      personality: personality,
      careers: careers,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send email')
  }

  return response.json()
}