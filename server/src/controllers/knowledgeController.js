// Returns all knowledge categories from the DB
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAll(req, res, next) {
  try {
    const categories = await prisma.knowledgeCategory.findMany({
      orderBy: { title: 'asc' },
    })
    res.json(categories)
  } catch (err) {
    next(err)
  }
}
