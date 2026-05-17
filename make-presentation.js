import puppeteer from 'puppeteer'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/* ─────────────────── design tokens ─────────────────── */
const G = '#00c853', BG = '#030f05', GLASS = 'rgba(0,18,6,0.85)'
const BORDER = 'rgba(0,200,83,0.2)', MUTED = 'rgba(255,255,255,0.45)'
const SUBTLE = 'rgba(255,255,255,0.22)', GGLOW = 'rgba(0,200,83,0.12)'

/* ─────────────────── helpers ─────────────────── */
const tag  = t => `<span style="display:inline-block;padding:5px 13px;border-radius:100px;border:1px solid ${G};color:${G};font-size:11.5px;font-family:Inter,sans-serif;font-weight:500;letter-spacing:.02em;">${t}</span>`
const field = (ph, type='text', val='') => `<div style="background:rgba(0,30,10,0.6);border:1px solid ${BORDER};border-radius:8px;padding:8px 12px;font-size:11px;color:${val?'rgba(255,255,255,0.8)':SUBTLE};font-family:Inter,sans-serif;">${val||ph}</div>`
const btn   = (txt,small=false) => `<div style="background:${G};border-radius:${small?'6px':'8px'};padding:${small?'5px 12px':'9px 16px'};text-align:center;color:white;font-weight:600;font-size:${small?'10px':'12px'};font-family:Inter,sans-serif;cursor:pointer;">${txt}</div>`
const btnOutline = txt => `<div style="border:1px solid ${BORDER};border-radius:6px;padding:5px 12px;text-align:center;color:${MUTED};font-size:10px;font-family:Inter,sans-serif;">${txt}</div>`
const label = (txt,sub) => `<div style="font-family:Inter,sans-serif;"><div style="color:white;font-size:10px;font-weight:600;">${txt}</div>${sub?`<div style="color:${SUBTLE};font-size:9px;margin-top:1px;">${sub}</div>`:''}</div>`
const pill  = (txt,color=G) => `<span style="display:inline-block;padding:2px 8px;border-radius:100px;background:${color}22;color:${color};font-size:9px;font-family:Inter,sans-serif;font-weight:600;">${txt}</span>`
const divider = txt => `<div style="display:flex;align-items:center;gap:8px;margin:6px 0;"><div style="flex:1;height:1px;background:${BORDER}"></div><span style="font-size:9px;color:${SUBTLE};font-family:Inter,sans-serif;">${txt}</span><div style="flex:1;height:1px;background:${BORDER}"></div></div>`

/* ─────────────────── sidebar ─────────────────── */
const NAV = ['Home','Dashboard','Announcements','Suggestions','Knowledge Base','AI Assistant','Settings']
function sidebar(active=-1, admin=false) {
  const items = admin
    ? [['Announcements','#e3f2fd'],['Spotlight','#fff9c4'],['Users','#fce4ec'],['Media','#e8f5e9']]
    : NAV.map(n=>[n,''])
  return `<div style="width:155px;flex-shrink:0;background:rgba(0,8,2,0.97);border-right:1px solid ${BORDER};display:flex;flex-direction:column;height:100%;box-sizing:border-box;">
    <div style="padding:10px 12px;border-bottom:1px solid ${BORDER};display:flex;align-items:center;gap:8px;">
      <div style="width:26px;height:26px;background:${G};border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:11px;font-family:Inter,sans-serif;flex-shrink:0;">A</div>
      <div><div style="color:white;font-size:9px;font-weight:600;font-family:Inter,sans-serif;">ALGO Group</div><div style="color:${SUBTLE};font-size:7.5px;font-family:Inter,sans-serif;">${admin?'Admin Panel':'Internal Portal'}</div></div>
    </div>
    <div style="padding:6px;flex:1;overflow:hidden;">
      ${items.map(([name],i)=>`<div style="padding:6px 8px;border-radius:6px;font-size:9.5px;font-family:Inter,sans-serif;font-weight:${i===active?600:400};color:${i===active?G:MUTED};background:${i===active?GGLOW:'transparent'};border-left:${i===active?`2px solid ${G}`:'2px solid transparent'};margin-bottom:1px;">${name}</div>`).join('')}
    </div>
    <div style="padding:8px;border-top:1px solid ${BORDER};">
      <div style="display:flex;align-items:center;gap:6px;padding:5px;border-radius:6px;">
        <div style="width:20px;height:20px;border-radius:50%;background:rgba(0,200,83,0.2);border:1px solid rgba(0,200,83,0.3);display:flex;align-items:center;justify-content:center;font-size:9px;color:${G};font-weight:700;font-family:Inter,sans-serif;flex-shrink:0;">J</div>
        <div><div style="color:white;font-size:9px;font-family:Inter,sans-serif;font-weight:500;">Jasur K.</div><div style="color:${SUBTLE};font-size:7.5px;font-family:Inter,sans-serif;">ELD · Member</div></div>
      </div>
    </div>
  </div>`
}

/* ─────────────────── app wrapper (frame) ─────────────────── */
const appFrame = (content, nav=-1, admin=false, noSidebar=false) => `
  <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:14px;overflow:hidden;width:100%;height:380px;display:flex;box-shadow:0 0 60px rgba(0,200,83,0.08);">
    ${noSidebar?'':sidebar(nav,admin)}
    <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;background:#040d06;">
      ${content}
    </div>
  </div>`

const topbar = (title, icon='') => `<div style="padding:10px 16px;border-bottom:1px solid ${BORDER};display:flex;align-items:center;justify-content:between;flex-shrink:0;">
  <div style="display:flex;align-items:center;gap:8px;">
    ${icon?`<div style="width:28px;height:28px;background:${GGLOW};border:1px solid ${BORDER};border-radius:8px;display:flex;align-items:center;justify-content:center;"><span style="color:${G};font-size:13px;">${icon}</span></div>`:''}
    <div>
      <div style="color:white;font-size:12px;font-weight:600;font-family:Inter,sans-serif;">${title}</div>
    </div>
  </div>
</div>`

/* ─────────────────── slide layout ─────────────────── */
function slide({num, total=15, section, title, desc, tags=[], mockup, cover=false, techStack=false, closing=false}) {
  if(cover) return coverSlide({desc, tags})
  if(techStack) return techStackSlide()
  if(closing) return closingSlide()

  return `<div class="slide" style="display:flex;width:1280px;height:720px;background:${BG};box-sizing:border-box;overflow:hidden;position:relative;">
    <!-- ambient glow -->
    <div style="position:absolute;top:-100px;left:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(0,200,83,0.06),transparent 70%);pointer-events:none;"></div>
    <div style="position:absolute;bottom:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(0,200,83,0.04),transparent 70%);pointer-events:none;"></div>

    <!-- left panel -->
    <div style="width:440px;flex-shrink:0;padding:60px 50px 50px 60px;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;position:relative;">
      <div style="color:${G};font-size:10px;font-family:Inter,sans-serif;font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin-bottom:18px;opacity:.8;">
        ${String(num).padStart(2,'0')} — ${section}
      </div>
      <h1 style="color:white;font-size:38px;font-weight:800;font-family:Inter,sans-serif;line-height:1.1;margin:0 0 20px;letter-spacing:-.02em;">${title}</h1>
      <p style="color:${MUTED};font-size:13.5px;font-family:Inter,sans-serif;line-height:1.7;margin:0 0 32px;">${desc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">${tags.map(tag).join('')}</div>
      <!-- slide counter -->
      <div style="position:absolute;top:28px;right:32px;color:${SUBTLE};font-size:10px;font-family:Inter,sans-serif;letter-spacing:.08em;">${String(num).padStart(2,'0')} / ${total}</div>
    </div>

    <!-- right panel -->
    <div style="flex:1;padding:40px 50px 40px 20px;display:flex;align-items:center;box-sizing:border-box;">
      ${mockup}
    </div>
  </div>`
}

/* ─────────────────── cover ─────────────────── */
function coverSlide({desc, tags}) {
  return `<div class="slide" style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:1280px;height:720px;background:${BG};box-sizing:border-box;overflow:hidden;position:relative;text-align:center;">
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(0,200,83,0.07),transparent 65%);pointer-events:none;"></div>
    <div style="color:${G};font-size:11px;font-family:Inter,sans-serif;font-weight:600;letter-spacing:.18em;text-transform:uppercase;margin-bottom:32px;opacity:.7;">ALGO GROUP · INTERNAL PORTAL · 2026</div>
    <h1 style="color:${G};font-size:80px;font-weight:900;font-family:Inter,sans-serif;line-height:.95;margin:0 0 24px;letter-spacing:-.03em;">ALGO<br>GROUP<br><span style="font-size:60px;">PORTAL</span></h1>
    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,${G},transparent);margin:0 auto 24px;"></div>
    <p style="color:${MUTED};font-size:14px;font-family:Inter,sans-serif;line-height:1.6;max-width:520px;margin:0 auto 36px;">${desc}</p>
    <div style="display:flex;gap:48px;justify-content:center;">
      ${tags.map(([num,label])=>`<div style="text-align:center;"><div style="color:${G};font-size:36px;font-weight:900;font-family:Inter,sans-serif;line-height:1;">${num}</div><div style="color:${SUBTLE};font-size:10px;font-family:Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase;margin-top:4px;">${label}</div></div>`).join('')}
    </div>
  </div>`
}

/* ─────────────────── tech stack ─────────────────── */
function techStackSlide() {
  const techs = [
    ['⚛️','React 18 + Vite','Tez, zamonaviy frontend framework'],
    ['🟢','Node.js + Express','REST API server, middleware'],
    ['🗄️','Prisma + PostgreSQL','ORM va ma\'lumotlar bazasi'],
    ['⚡','Socket.io v4','Real-time WebSocket aloqa'],
    ['🎨','Tailwind CSS','Glass morfizm dizayn tizimi'],
    ['🤖','OpenAI GPT-4o-mini','AI yordamchi engine'],
    ['🔐','JWT Auth','Xavfsiz token autentifikatsiya'],
    ['🚀','Railway','GitHub CI/CD + avtomatik deploy'],
  ]
  return `<div class="slide" style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:1280px;height:720px;background:${BG};box-sizing:border-box;overflow:hidden;position:relative;">
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(0,200,83,0.05),transparent 65%);pointer-events:none;"></div>
    <div style="color:${G};font-size:11px;font-family:Inter,sans-serif;font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px;opacity:.7;">TEXNOLOGIYALAR</div>
    <h2 style="color:${G};font-size:42px;font-weight:800;font-family:Inter,sans-serif;margin:0 0 40px;letter-spacing:-.02em;">Tech Stack</h2>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;width:900px;">
      ${techs.map(([icon,name,desc])=>`
        <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:14px;padding:20px;text-align:center;">
          <div style="font-size:28px;margin-bottom:10px;">${icon}</div>
          <div style="color:${G};font-size:12px;font-weight:700;font-family:Inter,sans-serif;margin-bottom:6px;">${name}</div>
          <div style="color:${SUBTLE};font-size:10px;font-family:Inter,sans-serif;line-height:1.4;">${desc}</div>
        </div>`).join('')}
    </div>
  </div>`
}

/* ─────────────────── closing ─────────────────── */
function closingSlide() {
  return `<div class="slide" style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:1280px;height:720px;background:${BG};box-sizing:border-box;overflow:hidden;position:relative;text-align:center;">
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;background:radial-gradient(circle,rgba(0,200,83,0.06),transparent 65%);pointer-events:none;"></div>
    <div style="font-size:60px;margin-bottom:24px;">🎯</div>
    <h1 style="color:white;font-size:52px;font-weight:800;font-family:Inter,sans-serif;margin:0 0 16px;">Rahmat!</h1>
    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,${G},transparent);margin:0 auto 24px;"></div>
    <p style="color:${MUTED};font-size:15px;font-family:Inter,sans-serif;line-height:1.7;max-width:480px;margin:0 auto 36px;">ALGO Group Internal Portal — xodimlar uchun, xodimlar bilan yaratilgan korporativ platforma.</p>
    <div style="color:${G};font-size:13px;font-family:Inter,sans-serif;font-weight:600;letter-spacing:.08em;">algogroup.railway.app</div>
  </div>`
}

/* ─────────────────── MOCKUPS ─────────────────── */

const loginMockup = () => `
  <div style="display:flex;align-items:center;justify-content:center;width:100%;height:380px;background:rgba(0,10,3,0.8);border:1px solid ${BORDER};border-radius:14px;box-shadow:0 0 60px rgba(0,200,83,0.06);">
    <div style="width:320px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="color:${G};font-size:18px;font-weight:900;font-family:Inter,sans-serif;letter-spacing:-.02em;line-height:1.1;">ALGO<br>PORTAL</div>
        <div style="color:${SUBTLE};font-size:9px;font-family:Inter,sans-serif;letter-spacing:.1em;margin-top:4px;">ALGO GROUP · INTERNAL</div>
      </div>
      <div style="display:flex;gap:0;border:1px solid ${BORDER};border-radius:8px;overflow:hidden;margin-bottom:16px;">
        <div style="flex:1;padding:7px;text-align:center;background:${G};color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">👤 Xodim</div>
        <div style="flex:1;padding:7px;text-align:center;background:transparent;color:${MUTED};font-size:10px;font-family:Inter,sans-serif;">🛡️ Admin</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div><div style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;margin-bottom:4px;">EMAIL</div>${field('email@algogroup.us')}</div>
        <div><div style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;margin-bottom:4px;">PAROL</div>${field('••••••••','password')}</div>
        ${btn('Kirish →')}
      </div>
      <div style="text-align:center;margin-top:12px;color:${SUBTLE};font-size:9px;font-family:Inter,sans-serif;">Accountingiz yo'qmi? <span style="color:${G};">Account yaratish</span></div>
    </div>
  </div>`

const registerMockup = () => `
  <div style="display:flex;align-items:center;justify-content:center;width:100%;height:380px;background:rgba(0,10,3,0.8);border:1px solid ${BORDER};border-radius:14px;">
    <div style="width:340px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="color:${G};font-size:16px;font-weight:900;font-family:Inter,sans-serif;">ALGO PORTAL</div>
        <div style="color:${SUBTLE};font-size:9px;font-family:Inter,sans-serif;margin-top:2px;">YANGI ACCOUNT YARATISH</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        ${field('Jasur','text','')}${field('Karimov','text','')}
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${field('email@algogroup.us')}
        <div style="background:rgba(0,30,10,0.6);border:1px solid ${BORDER};border-radius:8px;padding:8px 12px;font-size:11px;color:${SUBTLE};font-family:Inter,sans-serif;display:flex;justify-content:space-between;align-items:center;">— Departament tanlang — <span>▾</span></div>
        ${field('Kamida 6 belgi')}
        ${btn('Yuborish →')}
      </div>
      <div style="text-align:center;margin-top:10px;color:${SUBTLE};font-size:9px;font-family:Inter,sans-serif;">Accountingiz bormi? <span style="color:${G};">Kirish</span></div>
    </div>
  </div>`

const homeMockup = () => appFrame(`
  ${topbar('Hot News','📰')}
  <div style="flex:1;overflow:hidden;padding:12px;display:flex;flex-direction:column;gap:8px;">
    <!-- pinned post -->
    <div style="background:rgba(0,200,83,0.06);border:1px solid rgba(0,200,83,0.35);border-radius:10px;padding:10px;position:relative;">
      <span style="position:absolute;top:8px;right:8px;background:${GGLOW};color:${G};font-size:8px;font-weight:600;font-family:Inter,sans-serif;padding:2px 7px;border-radius:100px;border:1px solid rgba(0,200,83,0.3);">📌 Pinned</span>
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:6px;">
        <div style="width:20px;height:20px;border-radius:50%;background:rgba(0,200,83,0.25);display:flex;align-items:center;justify-content:center;font-size:9px;color:${G};font-weight:700;font-family:Inter,sans-serif;">A</div>
        <div><div style="color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">Q1 moliyaviy natijalar e'lon qilindi</div><div style="color:${SUBTLE};font-size:8px;font-family:Inter,sans-serif;">Admin · 2s oldin</div></div>
      </div>
      <div style="color:${MUTED};font-size:10px;font-family:Inter,sans-serif;line-height:1.5;margin-left:27px;">Bu chorakda kompaniya rekord ko'rsatkichga erishdi. Batafsil ma'lumot uchun…</div>
    </div>
    <!-- post 2 -->
    <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:10px;">
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
        <div style="width:20px;height:20px;border-radius:50%;background:rgba(0,200,83,0.2);display:flex;align-items:center;justify-content:center;font-size:9px;color:${G};font-weight:700;font-family:Inter,sans-serif;">A</div>
        <div><div style="color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">Yangi xodimlar onboarding — 14-may</div><div style="color:${SUBTLE};font-size:8px;font-family:Inter,sans-serif;">Admin · 1s oldin</div></div>
      </div>
      <div style="color:${MUTED};font-size:10px;font-family:Inter,sans-serif;margin-left:27px;">Yangi xodimlar guruhimizga qo'shilmoqda. Ularni qutlang!</div>
    </div>
  </div>`, 0)

const chatMockup = () => appFrame(`
  ${topbar('Jamoa Guruhi Chati','💬')}
  <div style="flex:1;overflow:hidden;padding:10px 12px;display:flex;flex-direction:column;gap:6px;">
    ${divider('Bugun')}
    <!-- others -->
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
      <div style="display:flex;align-items:center;gap:5px;"><div style="width:16px;height:16px;border-radius:50%;background:rgba(0,200,83,0.2);display:flex;align-items:center;justify-content:center;font-size:7px;color:${G};font-weight:700;font-family:Inter,sans-serif;">S</div><span style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;">Sardor M.</span><span style="color:${SUBTLE};font-size:8px;font-family:Inter,sans-serif;">09:15</span></div>
      <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;border-top-left-radius:3px;padding:7px 11px;font-size:10.5px;color:rgba(255,255,255,0.8);font-family:Inter,sans-serif;max-width:75%;">Hammaga xayrli tong! 👋</div>
    </div>
    <!-- own -->
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
      <div style="background:${G};border-radius:10px;border-top-right-radius:3px;padding:7px 11px;font-size:10.5px;color:white;font-family:Inter,sans-serif;max-width:75%;">Xayrli tong! Bugun yig'ilish bormi?</div>
    </div>
    <!-- others 2 -->
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
      <div style="display:flex;align-items:center;gap:5px;"><div style="width:16px;height:16px;border-radius:50%;background:rgba(100,180,100,0.2);display:flex;align-items:center;justify-content:center;font-size:7px;color:#80cfa0;font-weight:700;font-family:Inter,sans-serif;">B</div><span style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;">Bobur R.</span></div>
      <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;border-top-left-radius:3px;padding:7px 11px;font-size:10.5px;color:rgba(255,255,255,0.8);font-family:Inter,sans-serif;max-width:75%;">Ha, soat 14:00 da Teams orqali 📅</div>
    </div>
  </div>
  <div style="padding:8px 12px;border-top:1px solid ${BORDER};display:flex;gap:8px;align-items:center;flex-shrink:0;">
    <div style="flex:1;background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:7px 12px;font-size:10px;color:${SUBTLE};font-family:Inter,sans-serif;">Xabar yozing… (Enter — yuborish)</div>
    <div style="width:30px;height:30px;background:${G};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;">➤</div>
  </div>`, 0)

const dashboardMockup = () => appFrame(`
  <div style="padding:12px 16px;border-bottom:1px solid ${BORDER};flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
    <div><div style="color:white;font-size:12px;font-weight:700;font-family:Inter,sans-serif;">Salom, Jasur! 👋</div><div style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;">Bugun qaysi moduldansiz?</div></div>
    <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:20px;padding:4px 10px;display:flex;align-items:center;gap:5px;">
      <span style="color:${G};font-size:10px;">📶</span><span style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;">4 online</span>
    </div>
  </div>
  <!-- stats -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px 14px;flex-shrink:0;">
    ${[['📢','12','E\'lonlar'],['💡','8','Takliflar'],['📚','6','Maqolalar'],['🤖','AI','Yordamchi']].map(([ico,n,lbl])=>
    `<div style="background:${GLASS};border:1px solid ${BORDER};border-radius:8px;padding:10px;text-align:center;">
      <div style="font-size:16px;margin-bottom:3px;">${ico}</div>
      <div style="color:${G};font-size:15px;font-weight:700;font-family:Inter,sans-serif;">${n}</div>
      <div style="color:${SUBTLE};font-size:8px;font-family:Inter,sans-serif;">${lbl}</div>
    </div>`).join('')}
  </div>
  <!-- announcements preview -->
  <div style="flex:1;overflow:hidden;padding:0 14px 10px;display:flex;flex-direction:column;gap:6px;">
    <div style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">So'nggi E'lonlar</div>
    ${[['Oy xodimi — Sardor Mirzayev','2s oldin'],['Yangi modul: Safety 2026','5s oldin'],['Korporativ bayram — 15-may','1k oldin']].map(([t,time])=>
    `<div style="background:${GLASS};border:1px solid ${BORDER};border-radius:8px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;">
      <div style="color:rgba(255,255,255,0.8);font-size:10px;font-family:Inter,sans-serif;">${t}</div>
      <div style="color:${SUBTLE};font-size:8px;font-family:Inter,sans-serif;">${time}</div>
    </div>`).join('')}
  </div>`, 1)

const announcementsMockup = () => appFrame(`
  ${topbar('E\'lonlar','📢')}
  <div style="flex:1;overflow:hidden;padding:12px;display:flex;flex-direction:column;gap:8px;">
    ${[
      ['Korporativ bayram — 15-may 2026','Barcha xodimlar uchun majburiy tadbirga taklif…','2s oldin','Muhim'],
      ['Yangi Safety moduli qo\'shildi','2026-yil Safety protokollari bo\'yicha yangi modul…','1k oldin','Yangi'],
      ['Oy xodimi — Sardor Mirzayev','May oyining eng faol xodimi tanlab olindi…','3k oldin',''],
    ].map(([title,desc,time,badge])=>`
      <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:10px 12px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:5px;">
          <div style="color:white;font-size:11px;font-weight:600;font-family:Inter,sans-serif;flex:1;">${title}</div>
          ${badge?`<span style="background:${GGLOW};color:${G};font-size:8px;font-family:Inter,sans-serif;padding:2px 7px;border-radius:100px;border:1px solid rgba(0,200,83,0.3);flex-shrink:0;margin-left:8px;">${badge}</span>`:''}
        </div>
        <div style="color:${MUTED};font-size:10px;font-family:Inter,sans-serif;margin-bottom:5px;">${desc}</div>
        <div style="color:${SUBTLE};font-size:8.5px;font-family:Inter,sans-serif;">Admin · ${time}</div>
      </div>`).join('')}
  </div>`, 2)

const suggestionsMockup = () => appFrame(`
  ${topbar('Takliflar','💡')}
  <div style="flex:1;overflow:hidden;padding:12px;display:flex;flex-direction:column;gap:8px;">
    <!-- compose -->
    <div style="background:rgba(0,200,83,0.05);border:1px solid rgba(0,200,83,0.25);border-radius:10px;padding:10px;">
      <div style="color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;margin-bottom:8px;">Yangi taklif yuborish</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${field('Taklifingiz sarlavhasi…')}
        <div style="background:rgba(0,30,10,0.6);border:1px solid ${BORDER};border-radius:8px;padding:8px 12px;font-size:10px;color:${SUBTLE};font-family:Inter,sans-serif;height:40px;">Batafsil tushuntirish…</div>
        ${btn('Yuborish')}
      </div>
    </div>
    <!-- existing -->
    ${[['Kantina menyusini onlayn ko\'rish','Jasur K. · 2s oldin','6 ovoz'],['Chorshanba sport kuni bo\'lsin','Sardor M. · 1k oldin','14 ovoz']].map(([t,auth,votes])=>
    `<div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:10px;display:flex;justify-content:space-between;align-items:center;">
      <div><div style="color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">${t}</div><div style="color:${SUBTLE};font-size:8.5px;font-family:Inter,sans-serif;margin-top:2px;">${auth}</div></div>
      <div style="color:${G};font-size:10px;font-weight:600;font-family:Inter,sans-serif;">👍 ${votes}</div>
    </div>`).join('')}
  </div>`, 3)

const knowledgeMockup = () => appFrame(`
  ${topbar('Bilim Bazasi','📚')}
  <div style="flex:1;overflow:hidden;padding:12px;display:flex;flex-direction:column;gap:8px;">
    <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:8px;padding:7px 12px;display:flex;align-items:center;gap:8px;flex-shrink:0;">
      <span style="color:${SUBTLE};font-size:12px;">🔍</span>
      <span style="color:${SUBTLE};font-size:10px;font-family:Inter,sans-serif;">Maqola qidirish…</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;flex-shrink:0;">
      ${[['📋','ELD Qoidalari','12 maqola'],['🚗','Haydovchilik','8 maqola'],['⚠️','Safety','15 maqola'],['📊','Hisobotlar','6 maqola']].map(([ico,name,count])=>
      `<div style="background:${GLASS};border:1px solid ${BORDER};border-radius:8px;padding:10px;display:flex;align-items:center;gap:8px;">
        <div style="font-size:18px;">${ico}</div>
        <div><div style="color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">${name}</div><div style="color:${SUBTLE};font-size:8.5px;font-family:Inter,sans-serif;">${count}</div></div>
      </div>`).join('')}
    </div>
    ${[['ELD Log kiritish qoidalari','ELD · 3 daqiqa o\'qish'],['HOS (Hours of Service) hisoblash','Safety · 5 daqiqa o\'qish']].map(([t,sub])=>
    `<div style="background:${GLASS};border:1px solid ${BORDER};border-radius:8px;padding:9px 12px;display:flex;justify-content:space-between;align-items:center;">
      <div><div style="color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">${t}</div><div style="color:${SUBTLE};font-size:8.5px;font-family:Inter,sans-serif;">${sub}</div></div>
      <span style="color:${G};font-size:12px;">›</span>
    </div>`).join('')}
  </div>`, 4)

const aiMockup = () => appFrame(`
  <div style="padding:10px 14px;border-bottom:1px solid ${BORDER};flex-shrink:0;display:flex;align-items:center;gap:8px;">
    <div style="width:28px;height:28px;background:${G};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;">🤖</div>
    <div><div style="color:white;font-size:11px;font-weight:600;font-family:Inter,sans-serif;">AI Yordamchi</div><div style="display:flex;align-items:center;gap:4px;"><div style="width:6px;height:6px;border-radius:50%;background:${G};"></div><div style="color:${G};font-size:8.5px;font-family:Inter,sans-serif;">Online · AI Assistant</div></div></div>
  </div>
  <div style="flex:1;overflow:hidden;padding:12px;display:flex;flex-direction:column;gap:8px;">
    <!-- bot message -->
    <div style="display:flex;gap:7px;align-items:flex-start;">
      <div style="width:22px;height:22px;background:${G};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:1px;">🤖</div>
      <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:8px 11px;font-size:10px;color:rgba(255,255,255,0.8);font-family:Inter,sans-serif;line-height:1.5;max-width:80%;">Salom! Men ALGO Group AI Yordamchisiman. ELD, HOS, yuk tashish va boshqa savollarga javob beraman.</div>
    </div>
    <!-- user message -->
    <div style="display:flex;justify-content:flex-end;">
      <div style="background:${G};border-radius:10px;padding:8px 11px;font-size:10px;color:white;font-family:Inter,sans-serif;max-width:70%;">HOS qoidalari nima?</div>
    </div>
    <!-- bot response -->
    <div style="display:flex;gap:7px;align-items:flex-start;">
      <div style="width:22px;height:22px;background:${G};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;">🤖</div>
      <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:8px 11px;font-size:10px;color:rgba(255,255,255,0.8);font-family:Inter,sans-serif;line-height:1.5;max-width:80%;">HOS (Hours of Service) — 11 soat haydash, 14 soatlik ish oynasi, 30 daqiqa tanaffus va 10 soat majburiy dam olish qoidalari.</div>
    </div>
  </div>
  <div style="padding:8px 12px;border-top:1px solid ${BORDER};display:flex;gap:8px;flex-shrink:0;">
    <div style="flex:1;background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:7px 12px;font-size:10px;color:${SUBTLE};font-family:Inter,sans-serif;">Savol bering…</div>
    <div style="width:30px;height:30px;background:${G};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;">➤</div>
  </div>`, 5)

const settingsMockup = () => appFrame(`
  ${topbar('Sozlamalar','⚙️')}
  <div style="flex:1;overflow:hidden;padding:14px;display:flex;flex-direction:column;gap:10px;">
    <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:12px;">
      <div style="color:${G};font-size:9px;font-weight:600;font-family:Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;">👤 Profil Ma'lumotlari</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <div><div style="color:${MUTED};font-size:8.5px;font-family:Inter,sans-serif;margin-bottom:3px;">ISM</div>${field('','text','Jasur')}</div>
        <div><div style="color:${MUTED};font-size:8.5px;font-family:Inter,sans-serif;margin-bottom:3px;">FAMILIYA</div>${field('','text','Karimov')}</div>
      </div>
      <div style="margin-bottom:8px;"><div style="color:${MUTED};font-size:8.5px;font-family:Inter,sans-serif;margin-bottom:3px;">EMAIL</div>${field('','text','jasur@algogroup.us')}</div>
      <div style="color:${MUTED};font-size:8.5px;font-family:Inter,sans-serif;margin-bottom:3px;">DEPARTAMENT</div>
      <div style="background:rgba(0,30,10,0.6);border:1px solid ${BORDER};border-radius:8px;padding:8px 12px;font-size:11px;color:rgba(255,255,255,0.7);font-family:Inter,sans-serif;">ELD Division</div>
    </div>
    <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;padding:12px;">
      <div style="color:${G};font-size:9px;font-weight:600;font-family:Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;">🔐 Parolni O'zgartirish</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${field('Joriy parol')}
        ${field('Yangi parol')}
        <div style="width:120px;">${btn('Saqlash',true)}</div>
      </div>
    </div>
  </div>`, 6)

const adminAnnMockup = () => appFrame(`
  <div style="padding:10px 14px;border-bottom:1px solid ${BORDER};flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
    <div style="color:white;font-size:12px;font-weight:700;font-family:Inter,sans-serif;">Admin · E'lonlar Boshqaruvi</div>
    <div style="background:${G};border-radius:6px;padding:5px 12px;color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">+ Yangi E'lon</div>
  </div>
  <div style="flex:1;overflow:hidden;padding:12px;">
    <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;overflow:hidden;">
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 80px;padding:7px 12px;border-bottom:1px solid ${BORDER};background:rgba(0,200,83,0.05);">
        ${['SARLAVHA','MU\'ALLIF','SANA','AMALLAR'].map(h=>`<div style="color:${SUBTLE};font-size:8px;font-weight:600;font-family:Inter,sans-serif;letter-spacing:.1em;">${h}</div>`).join('')}
      </div>
      ${[['Korporativ bayram — 15-may','Admin','14.05.2026'],['Yangi modul qo\'shildi','Admin','13.05.2026'],['Oy xodimi tanlandi','Admin','12.05.2026'],['Safety o\'qitish — 20-may','Admin','11.05.2026']].map(([title,auth,date])=>
      `<div style="display:grid;grid-template-columns:2fr 1fr 1fr 80px;padding:8px 12px;border-bottom:1px solid rgba(0,200,83,0.07);align-items:center;">
        <div style="color:rgba(255,255,255,0.85);font-size:10px;font-family:Inter,sans-serif;font-weight:500;">${title}</div>
        <div style="color:${MUTED};font-size:9.5px;font-family:Inter,sans-serif;">${auth}</div>
        <div style="color:${SUBTLE};font-size:9px;font-family:Inter,sans-serif;">${date}</div>
        <div style="display:flex;gap:5px;">${btnOutline('✏️')}${btnOutline('🗑️')}</div>
      </div>`).join('')}
    </div>
  </div>`, 0, true)

const spotlightMockup = () => appFrame(`
  <div style="padding:10px 14px;border-bottom:1px solid ${BORDER};flex-shrink:0;">
    <div style="color:white;font-size:12px;font-weight:700;font-family:Inter,sans-serif;">Admin · Oy Xodimi (Spotlight)</div>
  </div>
  <div style="flex:1;overflow:hidden;padding:14px;display:flex;gap:14px;">
    <!-- current -->
    <div style="flex:1;background:rgba(0,200,83,0.06);border:1px solid rgba(0,200,83,0.3);border-radius:10px;padding:14px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="font-size:11px;color:${G};font-weight:600;font-family:Inter,sans-serif;margin-bottom:10px;">⭐ Joriy Oy Xodimi</div>
      <div style="width:52px;height:52px;border-radius:50%;background:rgba(0,200,83,0.2);border:2px solid ${G};display:flex;align-items:center;justify-content:center;font-size:22px;color:${G};font-weight:700;font-family:Inter,sans-serif;margin-bottom:8px;">S</div>
      <div style="color:white;font-size:13px;font-weight:700;font-family:Inter,sans-serif;">Sardor Mirzayev</div>
      <div style="color:${MUTED};font-size:9.5px;font-family:Inter,sans-serif;margin-top:2px;">ELD Division · May 2026</div>
      <div style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;margin-top:8px;line-height:1.5;">Eng yuqori natija va jamoa ruhi uchun tanlandi</div>
    </div>
    <!-- form -->
    <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
      <div style="color:${G};font-size:9px;font-weight:600;font-family:Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;">Yangi Spotlight Belgilash</div>
      ${field('Xodim tanlang...')}
      <div style="background:rgba(0,30,10,0.6);border:1px solid ${BORDER};border-radius:8px;padding:8px 12px;font-size:10px;color:${SUBTLE};font-family:Inter,sans-serif;height:50px;">Sabab va tavsif…</div>
      ${field('Oy tanlang...')}
      ${btn('Spotlightni saqlash')}
    </div>
  </div>`, 1, true)

const usersMockup = () => appFrame(`
  <div style="padding:10px 14px;border-bottom:1px solid ${BORDER};flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
    <div style="color:white;font-size:12px;font-weight:700;font-family:Inter,sans-serif;">Admin · Foydalanuvchilar</div>
    <div style="background:${G};border-radius:6px;padding:5px 12px;color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">+ Xodim qo'shish</div>
  </div>
  <div style="flex:1;overflow:hidden;padding:10px;">
    <div style="background:${GLASS};border:1px solid ${BORDER};border-radius:10px;overflow:hidden;">
      <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr 70px 90px;padding:7px 12px;border-bottom:1px solid ${BORDER};background:rgba(0,200,83,0.05);">
        ${['ISM','EMAIL','BOʻLIM','ROL','AMALLAR'].map(h=>`<div style="color:${SUBTLE};font-size:8px;font-weight:600;font-family:Inter,sans-serif;letter-spacing:.1em;">${h}</div>`).join('')}
      </div>
      ${[
        ['Jasur Karimov','jasur@algo…','ELD','member'],
        ['Sardor Mirzayev','sardor@algo…','ELD','member'],
        ['Gulnora Saidova','gulnora@algo…','Safety','member'],
        ['Bobur Rahimov','bobur@algo…','Sales','member'],
      ].map(([name,email,dept,role])=>`
        <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr 70px 90px;padding:7px 12px;border-bottom:1px solid rgba(0,200,83,0.07);align-items:center;">
          <div style="color:rgba(255,255,255,0.85);font-size:10px;font-family:Inter,sans-serif;font-weight:500;">${name}</div>
          <div style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;">${email}</div>
          <div style="color:${MUTED};font-size:9px;font-family:Inter,sans-serif;">${dept}</div>
          <div>${pill(role)}</div>
          <div style="display:flex;gap:4px;">${btnOutline('✏️')}${btnOutline('🗑️')}</div>
        </div>`).join('')}
    </div>
    <!-- pending -->
    <div style="margin-top:8px;background:rgba(255,200,0,0.05);border:1px solid rgba(255,200,0,0.2);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">
      <div><div style="color:rgba(255,220,0,0.9);font-size:10px;font-weight:600;font-family:Inter,sans-serif;">⏳ Pending: Akbar Nazarov</div><div style="color:${SUBTLE};font-size:8.5px;font-family:Inter,sans-serif;">Safety · 14.05.2026</div></div>
      <div style="display:flex;gap:6px;"><div style="background:rgba(0,200,83,0.2);border:1px solid ${G};border-radius:6px;padding:4px 10px;color:${G};font-size:9px;font-family:Inter,sans-serif;">✓ Tasdiqlash</div><div style="background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.4);border-radius:6px;padding:4px 10px;color:#ff6b6b;font-size:9px;font-family:Inter,sans-serif;">✗ Rad</div></div>
    </div>
  </div>`, 2, true)

const mediaMockup = () => appFrame(`
  <div style="padding:10px 14px;border-bottom:1px solid ${BORDER};flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
    <div style="color:white;font-size:12px;font-weight:700;font-family:Inter,sans-serif;">Admin · Media Boshqaruvi</div>
    <div style="background:${G};border-radius:6px;padding:5px 12px;color:white;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">+ Fayl Yuklash</div>
  </div>
  <div style="flex:1;overflow:hidden;padding:12px;">
    <div style="background:rgba(0,200,83,0.03);border:2px dashed rgba(0,200,83,0.25);border-radius:10px;padding:16px;text-align:center;margin-bottom:10px;">
      <div style="font-size:22px;margin-bottom:5px;">📁</div>
      <div style="color:${MUTED};font-size:10px;font-family:Inter,sans-serif;">Fayl tashlab qo'ying yoki <span style="color:${G};">tanlang</span></div>
      <div style="color:${SUBTLE};font-size:8.5px;font-family:Inter,sans-serif;margin-top:3px;">PNG, JPG, PDF, MP4 — max 50MB</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
      ${[['🖼️','banner-may.png','2.1 MB'],['📄','onboarding.pdf','0.8 MB'],['🖼️','team-photo.jpg','3.4 MB'],['📄','eld-guide.pdf','1.2 MB'],['🎬','welcome.mp4','12 MB'],['🖼️','logo-hd.png','0.3 MB'],['📄','safety-rules.pdf','0.6 MB'],['🖼️','office.jpg','1.9 MB']].map(([ico,name,size])=>
      `<div style="background:${GLASS};border:1px solid ${BORDER};border-radius:8px;padding:8px;text-align:center;">
        <div style="font-size:22px;margin-bottom:4px;">${ico}</div>
        <div style="color:rgba(255,255,255,0.8);font-size:8.5px;font-family:Inter,sans-serif;font-weight:500;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</div>
        <div style="color:${SUBTLE};font-size:8px;font-family:Inter,sans-serif;">${size}</div>
      </div>`).join('')}
    </div>
  </div>`, 3, true)

/* ─────────────────── build HTML ─────────────────── */
const TOTAL = 15

const SLIDES = [
  coverSlide({
    desc:'Xodimlar uchun yagona korporativ platforma — real-time yangiliklar, jamoa chat, AI yordamchi va to\'liq admin boshqaruv paneli.',
    tags:[['7','Sahifalar'],['AI','Assistant'],['⚡','Real-time'],['🛡️','Admin Panel']],
  }),
  slide({num:1, total:TOTAL, section:'KIRISH', title:'Login Sahifasi',
    desc:'Admin va xodim uchun alohida kirish. JWT token asosida haqiqiy autentifikatsiya — localStorage + REST API. Glass morfizm dizayn.',
    tags:['Xodim kirish','Admin kirish','JWT Auth','Glass UI'], mockup:loginMockup()}),
  slide({num:2, total:TOTAL, section:'RO\'YXATDAN O\'TISH', title:'Account Yaratish',
    desc:'Yangi xodim ism, familiya, email, departament va parol kiritadi. So\'rov admin tasdiqlaguncha tizimga kirish imkoni yo\'q.',
    tags:['4 departament','Pending queue','Email validatsiya','Xavfsiz oqim'], mockup:registerMockup()}),
  slide({num:3, total:TOTAL, section:'BOSH SAHIFA · YANGILIKLAR', title:'Hot News Panel',
    desc:'Admin muhim yangiliklar va xabarlarni chiqaradi. Barcha xodimlar Socket.io orqali real-vaqtda ko\'radi. Pin qilish va kengaytirish imkoni.',
    tags:['Admin post','Real-time','Pin/Unpin','Expand toggle'], mockup:homeMockup()}),
  slide({num:4, total:TOTAL, section:'BOSH SAHIFA · CHAT', title:'Jamoa Guruhi Chati',
    desc:'Barcha onlayn xodimlar o\'rtasida real-time chat. To\'liq tarix saqlanadi, hech qachon o\'chirilmaydi. Sana ajratuvchilari va guruh ko\'rinishi bilan.',
    tags:['WebSocket','Persistent history','Date dividers','Online count'], mockup:chatMockup()}),
  slide({num:5, total:TOTAL, section:'DASHBOARD', title:'Bosh Boshqaruv Paneli',
    desc:'Umumiy statistika kartochkalar: e\'lonlar, takliflar, bilim bazasi. So\'nggi faollik va onlayn xodimlar soni real-vaqtda yangilanadi.',
    tags:['Stats cards','Live feed','Online count','Quick access'], mockup:dashboardMockup()}),
  slide({num:6, total:TOTAL, section:'E\'LONLAR', title:'E\'lonlar Tasmasi',
    desc:'Kompaniya ichki e\'lonlarini ko\'rish. Admin tomonidan yaratilgan e\'lonlar barcha xodimlarga darhol yetkaziladi. Vaqt bo\'yicha tartiblangan.',
    tags:['Feed view','Admin created','Timestamp','Real-time'], mockup:announcementsMockup()}),
  slide({num:7, total:TOTAL, section:'TAKLIFLAR', title:'Xodim Takliflari',
    desc:'Xodimlar o\'z fikr va takliflarini yuborishlari mumkin. Ovoz berish imkoni mavjud. Admin barcha takliflarni ko\'rib chiqadi.',
    tags:['Taklif yuborish','Ovoz berish','Admin review','Feedback loop'], mockup:suggestionsMockup()}),
  slide({num:8, total:TOTAL, section:'BILIM BAZASI', title:'Knowledge Base',
    desc:'Kompaniya ichki hujjatlari, qo\'llanmalar va resurslar markazlashgan ko\'rinishda. Kategoriyalar bo\'yicha qidirish imkoni mavjud.',
    tags:['Internal docs','Search','Categories','Always available'], mockup:knowledgeMockup()}),
  slide({num:9, total:TOTAL, section:'AI YORDAMCHI', title:'AI Assistant',
    desc:'OpenAI GPT-4o-mini asosida ishlaydi. Xodim ELD, HOS, yuk tashish va boshqa savollarga javob olishi mumkin. Typing animatsiya bilan.',
    tags:['GPT-4o-mini','Real responses','Typing dots','Suggestion chips'], mockup:aiMockup()}),
  slide({num:10, total:TOTAL, section:'SOZLAMALAR', title:'Shaxsiy Sozlamalar',
    desc:'Xodim o\'z profil ma\'lumotlarini tahrirlaydi: ism, email, parol. Departament ma\'lumotlari va interfeys afzalliklari.',
    tags:['Profile edit','Password change','Department','Preferences'], mockup:settingsMockup()}),
  slide({num:11, total:TOTAL, section:'ADMIN · E\'LONLAR', title:'Admin E\'lonlar Boshqaruvi',
    desc:'Admin yangi e\'lon yaratadi, tahrirlaydi va o\'chiradi. Barcha xodimlarga Socket.io orqali darhol yetkaziladi. To\'liq CRUD operatsiyalar.',
    tags:['Create','Edit','Delete','Real-time broadcast'], mockup:adminAnnMockup()}),
  slide({num:12, total:TOTAL, section:'ADMIN · SPOTLIGHT', title:'Oy Xodimi — Spotlight',
    desc:'Admin har oyda eng yaxshi xodimni tanlaydi va e\'lon qiladi. Dashboard\'da ko\'rsatiladi. Jamoa motivatsiyasi uchun muhim vosita.',
    tags:['Employee of month','Description','Monthly reset','Dashboard'], mockup:spotlightMockup()}),
  slide({num:13, total:TOTAL, section:'ADMIN · FOYDALANUVCHILAR', title:'Foydalanuvchilar Boshqaruvi',
    desc:'Barcha xodimlar ro\'yxati: ism, email, departament, rol. Pending accountlarni tasdiqlash yoki rad etish. To\'liq CRUD operatsiyalar.',
    tags:['Approve/Reject','Role mgmt','Department filter','CRUD'], mockup:usersMockup()}),
  slide({num:14, total:TOTAL, section:'ADMIN · MEDIA', title:'Media Boshqaruvi',
    desc:'Platforma uchun rasm, hujjat va video fayllarni yuklash va boshqarish. Drag-and-drop yuklash. Barcha media markazlashgan bir joyda.',
    tags:['File upload','Drag & drop','Image/PDF/Video','Centralized'], mockup:mediaMockup()}),
  techStackSlide(),
  closingSlide(),
]

const html = `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  body { margin:0; padding:0; background:#030f05; }
  .slide { page-break-after: always; page-break-inside: avoid; }
  .slide:last-child { page-break-after: auto; }
</style>
</head>
<body>
${SLIDES.join('\n')}
</body>
</html>`

/* ─────────────────── generate PDF ─────────────────── */
const htmlPath = resolve(__dirname, 'temp-presentation.html')
const pdfPath  = resolve(__dirname, 'ALGO-Portal-Presentation.pdf')

writeFileSync(htmlPath, html, 'utf8')
console.log('HTML written, launching browser…')

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-web-security','--font-render-hinting=none'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 720 })
await page.goto(`file:///${htmlPath.replace(/\\/g,'/')}`, { waitUntil: 'networkidle0', timeout: 30000 })

// wait for fonts
await new Promise(r => setTimeout(r, 2000))

await page.pdf({
  path: pdfPath,
  width: '1280px',
  height: '720px',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
})

await browser.close()

if (existsSync(htmlPath)) unlinkSync(htmlPath)
console.log(`\n✅  PDF ready: ${pdfPath}`)
