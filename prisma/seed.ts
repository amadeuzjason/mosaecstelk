
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ 
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Events
  const events = [
    {
      title: 'PRISMA`25 MATH COMPETITION',
      date: '1 Februari 2025',
      description:
        'Kompetisi Olimpiade Matematika yang diselenggarakan oleh Universitas Muhammadiyah Makassar',
      image: '/assets/events/prisma25.jpg',
      details: 'PRISMA`25 adalah kompetisi matematika tingkat nasional yang diadakan oleh Universitas Muhammadiyah Makassar. Kompetisi ini memberikan kesempatan bagi siswa untuk menguji kemampuan matematika mereka dalam berbagai kategori, termasuk aljabar, geometri, dan kalkulus. MOSAEC STELK berpartisipasi aktif dalam kompetisi ini sebagai ajang pembuktian kemampuan akademik dan sportivitas.',
      location: 'Universitas Muhammadiyah Makassar',
      participants: 'Siswa SMK Telkom Makassar - Anggota MOSAEC',
    },
    {
      title: 'MOSAEC: Calculation Project (MAC)',
      date: '1 Maret - 17 Mei 2024',
      description:
        'Projek membuat calculator, tidak hanya menambah pemahaman tentang Matematika, juga memperkenalkan mengenai pemrograman.',
      image: '/assets/events/mac.jpg',
      details: 'MOSAEC: Calculation Project adalah proyek pembelajaran yang menggabungkan konsep matematika dengan pemrograman. Peserta belajar membuat kalkulator fungsional menggunakan berbagai bahasa pemrograman, mulai dari Python hingga JavaScript. Proyek ini tidak hanya meningkatkan pemahaman logika matematika tetapi juga keterampilan coding praktis.',
      location: 'SMK Telkom Makassar',
      participants: 'Anggota MOSAEC STELK',
    },
    {
      title: 'Event 10 Februari 2023',
      date: '10 Februari 2023',
      description:
        'Kegiatan MOSAEC STELK dalam rangka pengembangan kemampuan matematika dan sains siswa.',
      image: '/assets/events/10feb23.jpg',
      details: 'Kegiatan MOSAEC STELK yang diadakan pada tanggal 10 Februari 2023 merupakan salah satu program rutin ekstrakurikuler untuk meningkatkan kemampuan siswa dalam bidang matematika dan sains. Acara ini meliputi berbagai aktivitas pembelajaran, diskusi, dan latihan soal yang dirancang untuk memperdalam pemahaman konsep-konsep dasar.',
      location: 'SMK Telkom Makassar',
      participants: 'Anggota MOSAEC STELK',
    },
    {
      title: 'Event 28 Juli 2024',
      date: '28 Juli 2024',
      description:
        'Kegiatan MOSAEC STELK dalam rangka pengembangan kemampuan matematika dan sains siswa.',
      image: '/assets/events/28juli24.jpg',
      details: 'Kegiatan MOSAEC STELK yang diadakan pada tanggal 28 Juli 2024 merupakan program pengembangan kemampuan siswa dalam bidang matematika dan sains. Acara ini mencakup berbagai aktivitas pembelajaran interaktif, workshop, dan sesi latihan yang bertujuan untuk meningkatkan pemahaman siswa terhadap materi pelajaran serta aplikasinya dalam kehidupan sehari-hari.',
      location: 'SMK Telkom Makassar',
      participants: 'Anggota MOSAEC STELK',
    },
  ]

  for (const event of events) {
    // Check if event exists to avoid duplicates (optional but good)
    const existing = await prisma.event.findFirst({ where: { title: event.title } })
    if (!existing) {
      await prisma.event.create({
        data: event,
      })
    }
  }

  // Periods
  const periodsData = [
    {
      period: 32,
      year: 2025,
      members: [
        { position: 'pembina', name: "DEWI S.PD", ig: "dewif4834", image: "DEWI" },
        { position: 'ketua', name: "JASON DARYL AMADEUS", ig: "jasondeuz", image: "JASON DARYL AMADEUS" },
        { position: 'wakil', name: "NABILAH HASRIL SALSABILAH", ig: "nbilaslsbila__" },
        { position: 'sekretaris', name: "TAQAVI DERASKYAN ALI", ig: "derakhsyan_09" },
        { position: 'wakil_sekretaris', name: "SALWA FAIQAH", ig: "slwaafaiqhh" },
        { position: 'bendahara', name: "NURUL RIFDA MUSTOFA", ig: "nurull1008_" },
      ]
    },
    {
      period: 31,
      year: 2024,
      members: [
        { position: 'pembina', name: "MUH ADE SYAM AGUNG S.PD", ig: "adesyamagung.muh", image: "MUH ADE SYAM AGUNG" },
        { position: 'ketua', name: "SASMITA PRATAMA", ig: "ssmitaa_a", image: "SASMITA PRATAMA" },
        { position: 'wakil', name: "NABILAH HASRIL SALSABILAH", ig: "nbilaslsbila__" },
        { position: 'sekretaris', name: "JASON DARYL AMADEUS", ig: "jasondeuz" },
        { position: 'bendahara', name: "NURUL RIFDA MUSTOFA", ig: "nurull1008_" },
      ]
    },
    {
      period: 30,
      year: 2023,
      members: [
        { position: 'pembina', name: "CHAERUNNISA DARWIS S.PD", ig: "nisaadarwis25", image: "Chaerunnisa Darwis"},
        { position: 'ketua', name: "SHAQUILLE RASHAUN SAHL TAMRIN", ig: "shaqy9", image: "SHAQUILLE RASHAUN SAHL TAMRIN" },
        { position: 'wakil', name: "RAHMATHIA RAMADHANI", ig: "tyiiaaa", image: "RAHMATHIA RAMADHANI" },
        { position: 'sekretaris', name: "NUR ASYSYAMDINI.S", ig: "diniysss_s", image: "NUR ASYSYAMDINI.S" },
        { position: 'bendahara', name: "NURAINI NAFISA ZAHIRA", ig: "nnafisaz", image: "NURAINI NAFISA ZAHIRA" },
      ]
    },
    {
      period: 29,
      year: 2022,
      members: [
        { position: 'pembina', name: "CHAERUNNISA DARWIS S.PD", ig: "nisaadarwis25", image: "Chaerunnisa Darwis"},
        { position: 'ketua', name: "ANDI RIZKY ALYA ANUGRAH", ig: "aandialyaa", image: "alya" },
        { position: 'wakil', name: "NURAZIZAH DWI PUTRI", ig: "nrazzh_0829", image: "chica" },
      ]
    },
    {
      period: 28,
      year: 2021,
      members: []
    },
    {
      period: 27,
      year: 2020,
      members: []
    }
  ]

  for (const periodData of periodsData) {
    const { members, ...periodInfo } = periodData
    const period = await prisma.period.upsert({
      where: { period: periodInfo.period },
      update: {},
      create: periodInfo,
    })

    // Clear existing members for this period to avoid duplicates/stale data if re-running
    await prisma.member.deleteMany({ where: { periodId: period.id } })

    for (const member of members) {
      await prisma.member.create({
        data: {
          ...member,
          periodId: period.id,
        },
      })
    }
  }

  // Questions
  // Clear existing questions to avoid duplicates during dev
  await prisma.option.deleteMany({})
  await prisma.question.deleteMany({})

  const questions = [
    {
      content: "Diketahui sistem persamaan linear dua variabel:\n2x + 3y = 12\nx - y = 1\nNilai x + y adalah...",
      grade: "CLASS_10",
      subject: "SPLDV",
      difficulty: "EASY",
      solution: "Dari x - y = 1, maka x = y + 1.\nSubstitusi ke persamaan pertama:\n2(y+1) + 3y = 12\n2y + 2 + 3y = 12\n5y = 10 -> y = 2\nx = 2 + 1 = 3\nNilai x + y = 3 + 2 = 5",
      options: [
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: true },
        { content: "6", isCorrect: false },
        { content: "7", isCorrect: false },
      ]
    },
    {
      content: "Matriks A = [[1, 2], [3, 4]]. Determinan matriks A adalah...",
      grade: "CLASS_11",
      subject: "MATRIKS",
      difficulty: "EASY",
      solution: "Det(A) = (1)(4) - (2)(3) = 4 - 6 = -2",
      options: [
        { content: "-2", isCorrect: true },
        { content: "2", isCorrect: false },
        { content: "10", isCorrect: false },
        { content: "-10", isCorrect: false },
        { content: "0", isCorrect: false },
      ]
    },
    {
      content: "Turunan pertama dari f(x) = 3x^2 + 2x - 5 adalah...",
      grade: "CLASS_11",
      subject: "KALKULUS",
      difficulty: "MEDIUM",
      solution: "f'(x) = 2(3)x^(2-1) + 1(2)x^(1-1) - 0 = 6x + 2",
      options: [
        { content: "6x - 2", isCorrect: false },
        { content: "6x + 2", isCorrect: true },
        { content: "3x + 2", isCorrect: false },
        { content: "6x", isCorrect: false },
        { content: "2x + 3", isCorrect: false },
      ]
    },
     {
      content: "Integral dari 2x dx adalah...",
      grade: "CLASS_12",
      subject: "KALKULUS",
      difficulty: "MEDIUM",
      solution: "Integral x^n dx = (1/(n+1))x^(n+1) + C. Jadi Integral 2x^1 = 2(1/2)x^2 + C = x^2 + C",
      options: [
        { content: "x^2 + C", isCorrect: true },
        { content: "2x^2 + C", isCorrect: false },
        { content: "x + C", isCorrect: false },
        { content: "x^3 + C", isCorrect: false },
        { content: "2x + C", isCorrect: false },
      ]
    },
    {
      content: "Bentuk sederhana dari (a^2 * b^3) / (a * b^2) adalah...",
      grade: "CLASS_10",
      subject: "ALJABAR",
      difficulty: "EASY",
      solution: "a^(2-1) * b^(3-2) = a^1 * b^1 = ab",
      options: [
        { content: "ab", isCorrect: true },
        { content: "a^2b", isCorrect: false },
        { content: "ab^2", isCorrect: false },
        { content: "a/b", isCorrect: false },
        { content: "1", isCorrect: false },
      ]
    },
    {
      content: "Volume kubus dengan panjang rusuk 5 cm adalah...",
      grade: "CLASS_12",
      subject: "GEOMETRI",
      difficulty: "EASY",
      solution: "V = s^3 = 5^3 = 125 cm^3",
      options: [
        { content: "25 cm^3", isCorrect: false },
        { content: "100 cm^3", isCorrect: false },
        { content: "125 cm^3", isCorrect: true },
        { content: "150 cm^3", isCorrect: false },
        { content: "625 cm^3", isCorrect: false },
      ]
    },
    {
      content: "Nilai sin 30 derajat + cos 60 derajat adalah...",
      grade: "CLASS_10",
      subject: "TRIGONOMETRI",
      difficulty: "MEDIUM",
      solution: "sin 30 = 1/2, cos 60 = 1/2. 1/2 + 1/2 = 1",
      options: [
        { content: "0", isCorrect: false },
        { content: "1/2", isCorrect: false },
        { content: "1", isCorrect: true },
        { content: "sqrt(3)", isCorrect: false },
        { content: "2", isCorrect: false },
      ]
    },
     {
      content: "Rata-rata dari data: 4, 5, 6, 7, 8 adalah...",
      grade: "CLASS_12",
      subject: "STATISTIKA",
      difficulty: "EASY",
      solution: "(4+5+6+7+8)/5 = 30/5 = 6",
      options: [
        { content: "5", isCorrect: false },
        { content: "6", isCorrect: true },
        { content: "7", isCorrect: false },
        { content: "8", isCorrect: false },
        { content: "4", isCorrect: false },
      ]
    },
    {
      content: "Peluang munculnya angka ganjil pada pelemparan sebuah dadu adalah...",
      grade: "CLASS_12",
      subject: "PELUANG",
      difficulty: "EASY",
      solution: "Angka ganjil: 1, 3, 5 (3 angka). Total sisi: 6. Peluang = 3/6 = 1/2",
      options: [
        { content: "1/6", isCorrect: false },
        { content: "1/3", isCorrect: false },
        { content: "1/2", isCorrect: true },
        { content: "2/3", isCorrect: false },
        { content: "5/6", isCorrect: false },
      ]
    }
  ]

  for (const q of questions) {
    await prisma.question.create({
      data: {
        content: q.content,
        grade: q.grade as any,
        subject: q.subject as any,
        difficulty: q.difficulty as any,
        solution: q.solution,
        options: {
          create: q.options
        }
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
