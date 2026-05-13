import { Router } from 'express'
import OpenAI from 'openai'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

const SYSTEM_PROMPT = `You are the internal AI assistant for ALGO Group, a professional company.
Your role is to help employees with questions about company policies, HR guidelines, work procedures,
announcements, events, and general workplace topics.

Be concise, professional, and helpful. If asked about something outside company topics,
you can still help as a general assistant. Keep responses clear and to the point.
Do not make up specific policy details you are not sure about — advise the employee to
check with HR or the Knowledge Base instead.`

router.post('/chat', verifyToken, async (req, res) => {
  const { messages } = req.body

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'AI service is not configured. Please contact your administrator.' })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'I could not generate a response. Please try again.'
    res.json({ reply })
  } catch (err) {
    if (err.status === 401) {
      return res.status(503).json({ error: 'Invalid AI API key. Please contact your administrator.' })
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'AI rate limit reached. Please wait a moment and try again.' })
    }
    console.error('OpenAI error:', err.message)
    res.status(500).json({ error: 'AI service error. Please try again.' })
  }
})

export default router
