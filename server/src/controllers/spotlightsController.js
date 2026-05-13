import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getCurrent(req, res, next) {
  try {
    const now = new Date()
    const month = now.getMonth() + 1
    const year  = now.getFullYear()

    const [employee, queen] = await Promise.all([
      prisma.spotlight.findFirst({ where: { type: 'employee', month, year }, orderBy: { createdAt: 'desc' } }),
      prisma.spotlight.findFirst({ where: { type: 'queen',    month, year }, orderBy: { createdAt: 'desc' } }),
    ])
    res.json({ employee, queen })
  } catch (err) {
    next(err)
  }
}

export async function upsert(req, res, next) {
  try {
    const { type, name, role, quote, imageUrl, month, year } = req.body
    if (!type || !name || !role || !quote || !month || !year) {
      return res.status(400).json({ error: 'type, name, role, quote, month, year are required' })
    }
    const existing = await prisma.spotlight.findFirst({ where: { type, month: Number(month), year: Number(year) } })
    let result
    if (existing) {
      result = await prisma.spotlight.update({ where: { id: existing.id }, data: { name, role, quote, imageUrl } })
    } else {
      result = await prisma.spotlight.create({ data: { type, name, role, quote, imageUrl, month: Number(month), year: Number(year) } })
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getSiteMedia(req, res, next) {
  try {
    const items = await prisma.siteMedia.findMany()
    const map = {}
    items.forEach(i => { map[i.key] = i.imageUrl })
    res.json(map)
  } catch (err) {
    next(err)
  }
}

export async function updateSiteMedia(req, res, next) {
  try {
    const { key, imageUrl } = req.body
    if (!key || !imageUrl) return res.status(400).json({ error: 'key and imageUrl are required' })
    const result = await prisma.siteMedia.upsert({
      where: { key },
      update: { imageUrl },
      create: { key, imageUrl },
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
}
