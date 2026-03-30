// Serverless function to send email using Resend
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, name, personality, careers } = req.body

  if (!to || !name || !personality || !careers) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Simple email content
  const subject = 'Your Career Orientation Results'
  const text = `
Hello ${name},

Thank you for completing the career orientation assessment.

Your personality type is: ${personality}

Based on your answers, here are some career suggestions:
${careers.map((career, i) => `${i + 1}. ${career}`).join('\n')}

We hope this helps you on your journey!

Best regards,
Career Orientation Team
  `

  try {
    const { data, error } = await resend.emails.send({
      from: 'Career Orientation <onboarding@resend.dev>', // Use your verified domain later
      to: [to],
      subject: subject,
      text: text,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }

    return res.status(200).json({ message: 'Email sent', id: data.id })
  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}