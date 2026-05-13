import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// GET all news posts — sorted pinned first, then newest
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await prisma.newsPost.findMany({
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      include: { author: { select: { id: true, name: true, department: true } } },
    })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

// POST create news post — admin only
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  const { title, content, isPinned } = req.body
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Title and content are required' })
  }
  try {
    const post = await prisma.newsPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isPinned: Boolean(isPinned),
        authorId: req.user.id,
      },
      include: { author: { select: { id: true, name: true, department: true } } },
    })
    // Broadcast to all socket clients
    req.app.get('io')?.emit('new_news', post)
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create news post' })
  }
})

// PATCH toggle pin — admin only
router.patch('/:id/pin', verifyToken, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const existing = await prisma.newsPost.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Post not found' })
    const post = await prisma.newsPost.update({
      where: { id },
      data: { isPinned: !existing.isPinned },
      include: { author: { select: { id: true, name: true, department: true } } },
    })
    req.app.get('io')?.emit('update_news', post)
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// DELETE news post — admin only
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    await prisma.newsPost.delete({ where: { id } })
    req.app.get('io')?.emit('delete_news', id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router
