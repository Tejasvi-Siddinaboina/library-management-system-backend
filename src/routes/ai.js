import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/summary', async (req, res) => {
  try {
    const { title, author } = req.body
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Write a short 3-sentence summary for the book "${title}" by ${author}. Keep it simple and informative.`
    const result = await model.generateContent(prompt)
    const summary = result.response.text()
    res.json({ summary })
  } catch (error) {
    res.status(500).json({ error: 'AI summary failed' })
  }
})

export default router