import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAll(_req, res, next) {
  try {
    const items = await prisma.startup.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(items)
  } catch (err) { next(err) }
}

export async function create(req, res, next) {
  try {
    const { name, tagline, description, logoUrl, stage, teamLead, department, website } = req.body
    if (!name?.trim() || !description?.trim() || !teamLead?.trim()) {
      return res.status(400).json({ error: 'name, description and teamLead are required' })
    }
    const item = await prisma.startup.create({
      data: { name: name.trim(), tagline: tagline?.trim() || null, description: description.trim(),
              logoUrl: logoUrl || null, stage: stage || 'Idea', teamLead: teamLead.trim(),
              department: department?.trim() || null, website: website?.trim() || null },
    })
    res.status(201).json(item)
  } catch (err) { next(err) }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    const { name, tagline, description, logoUrl, stage, teamLead, department, website } = req.body
    const item = await prisma.startup.update({
      where: { id },
      data: {
        ...(name        && { name: name.trim() }),
        ...(tagline     !== undefined && { tagline: tagline?.trim() || null }),
        ...(description && { description: description.trim() }),
        ...(logoUrl     !== undefined && { logoUrl: logoUrl || null }),
        ...(stage       && { stage }),
        ...(teamLead    && { teamLead: teamLead.trim() }),
        ...(department  !== undefined && { department: department?.trim() || null }),
        ...(website     !== undefined && { website: website?.trim() || null }),
      },
    })
    res.json(item)
  } catch (err) { next(err) }
}

export async function remove(req, res, next) {
  try {
    await prisma.startup.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  } catch (err) { next(err) }
}
