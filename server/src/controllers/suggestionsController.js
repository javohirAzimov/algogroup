// Saves suggestion to DB and sends email to management via Nodemailer
import { PrismaClient } from '@prisma/client'
import { sendSuggestionEmail } from '../utils/mailer.js'
const prisma = new PrismaClient()

export async function create(req, res, next) {
  try {
    const { subject, message, isAnonymous = false } = req.body

    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Subject and message are required.' })
    }

    const suggestion = await prisma.suggestion.create({
      data: { subject: subject.trim(), message: message.trim(), isAnonymous },
    })

    // Fire-and-forget email — don't fail the request if mail is down
    sendSuggestionEmail({ subject, message, isAnonymous }).catch(err =>
      console.error('Mail error:', err.message)
    )

    res.status(201).json(suggestion)
  } catch (err) {
    next(err)
  }
}
