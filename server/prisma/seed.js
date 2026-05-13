import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  await prisma.announcement.deleteMany()
  await prisma.knowledgeCategory.deleteMany()
  await prisma.spotlight.deleteMany()
  await prisma.siteMedia.deleteMany()
  await prisma.suggestion.deleteMany()
  await prisma.user.deleteMany()

  // Admin user — change password before going to production
  const hashedPw = await bcrypt.hash('Admin@1234', 10)
  await prisma.user.create({
    data: {
      email: 'admin@algogroup.com',
      password: hashedPw,
      name: 'ALGO Admin',
      role: 'admin',
      department: 'Management',
    },
  })

  await prisma.announcement.createMany({
    data: [
      {
        title: 'Company Football Tournament',
        description: 'Annual 5-a-side tournament between departments. Sign up your team before the deadline!',
        date: new Date('2025-06-14'),
        type: 'event',
      },
      {
        title: 'Friday Pizza Night',
        description: 'End the week right — free pizza for the whole team in the main break room.',
        date: new Date('2025-06-20'),
        type: 'event',
      },
      {
        title: 'Office Closed Monday',
        description: 'The office will be closed on Monday 16 June for a public holiday.',
        date: new Date('2025-06-16'),
        type: 'notice',
      },
      {
        title: 'Submit Timesheets by Friday',
        description: 'Please ensure all timesheets for this pay period are submitted by 5pm Friday.',
        date: new Date('2025-06-13'),
        type: 'notice',
      },
    ],
  })

  await prisma.knowledgeCategory.createMany({
    data: [
      { title: 'Company Policies',    icon: 'ShieldCheck',   articleCount: 12 },
      { title: 'HR Guidelines',       icon: 'Users',         articleCount: 8  },
      { title: 'Work Procedures',     icon: 'ClipboardList', articleCount: 15 },
      { title: 'Internal Rules',      icon: 'ScrollText',    articleCount: 6  },
      { title: 'Employee Guides',     icon: 'BookMarked',    articleCount: 10 },
      { title: 'Training Materials',  icon: 'GraduationCap', articleCount: 9  },
      { title: 'Event Guidelines',    icon: 'CalendarDays',  articleCount: 4  },
      { title: 'Workplace Standards', icon: 'Building2',     articleCount: 7  },
    ],
  })

  const now = new Date()
  await prisma.spotlight.createMany({
    data: [
      {
        type: 'employee',
        name: 'Alex Johnson',
        role: 'Senior Operations Manager',
        quote: 'Always going above and beyond to support the team and deliver results.',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
      {
        type: 'queen',
        name: 'Sofia Martinez',
        role: 'Head of People & Culture',
        quote: 'Bringing warmth, creativity, and energy to everything she touches.',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    ],
  })

  await prisma.siteMedia.create({
    data: { key: 'management_photo', imageUrl: '/Onboarding-bro.svg' },
  })

  console.log('Database seeded successfully.')
  console.log('Admin credentials: admin@algogroup.com / Admin@1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
