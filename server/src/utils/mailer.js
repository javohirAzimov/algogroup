// Nodemailer transporter — used by the suggestions controller to email management
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export async function sendSuggestionEmail({ subject, message, isAnonymous }) {
  const from = isAnonymous ? 'Anonymous Employee' : 'An ALGO Group Employee'

  await transporter.sendMail({
    from: `"ALGO Portal" <${process.env.MAIL_USER}>`,
    to:   process.env.MAIL_TO,
    subject: `[Portal Suggestion] ${subject}`,
    text: `From: ${from}\n\n${message}`,
    html: `
      <p><strong>From:</strong> ${from}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  })
}
