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
  console.log('Seeding kisi-kisi SAS Genap Kelas XI...')

  const questions = [
    // ===== LINGKARAN - TEMBERENG =====
    {
      content: "Sebuah lingkaran memiliki jari-jari 7 cm. Jika sudut pusat sebuah juring adalah $90°$, maka luas tembereng yang dibatasi oleh busur dan tali busur tersebut adalah...\n\n(Gunakan $\pi = \\frac{22}{7}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{90}{360} \times \pi r^2 = \\frac{1}{4} \times \\frac{22}{7} \times 49 = \\frac{1}{4} \times 154 = 38{,}5$ cm²\n\nLuas segitiga $= \\frac{1}{2} \times r \times r \times \sin 90° = \\frac{1}{2} \times 7 \times 7 \times 1 = 24{,}5$ cm²\n\nLuas tembereng $= 38{,}5 - 24{,}5 = 14$ cm²",
      options: [
        { content: "$14$ cm²", isCorrect: true },
        { content: "$24{,}5$ cm²", isCorrect: false },
        { content: "$38{,}5$ cm²", isCorrect: false },
        { content: "$10{,}5$ cm²", isCorrect: false },
        { content: "$28$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Seorang murid memotong selembar kertas berbentuk lingkaran dengan jari-jari 10 cm. Ia mengambil sebagian kertas tersebut dengan sudut pusat $60°$. Luas tembereng dari potongan tersebut adalah...\n\n(Gunakan $\pi = 3{,}14$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{60}{360} \times \pi r^2 = \\frac{1}{6} \times 3{,}14 \times 100 = 52{,}33$ cm²\n\nLuas segitiga $= \\frac{1}{2} r^2 \sin 60° = \\frac{1}{2} \times 100 \times \\frac{\sqrt{3}}{2} = 25\sqrt{3} \approx 43{,}3$ cm²\n\nLuas tembereng $\approx 52{,}33 - 43{,}3 = 9{,}03$ cm²",
      options: [
        { content: "$9{,}03$ cm²", isCorrect: true },
        { content: "$52{,}33$ cm²", isCorrect: false },
        { content: "$43{,}3$ cm²", isCorrect: false },
        { content: "$18{,}06$ cm²", isCorrect: false },
        { content: "$25$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Sebuah lingkaran memiliki jari-jari 21 cm. Jika sudut pusat sebuah juring $60°$, maka luas tembereng yang dibatasi oleh busur dan tali busur tersebut adalah...\n\n(Gunakan $\pi = \\frac{22}{7}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{60}{360} \times \\frac{22}{7} \times 441 = \\frac{1}{6} \times 1386 = 231$ cm²\n\nLuas segitiga $= \\frac{1}{2} r^2 \sin 60° = \\frac{1}{2} \times 441 \times \\frac{\sqrt{3}}{2} = \\frac{441\sqrt{3}}{4} \approx 190{,}96$ cm²\n\nLuas tembereng $\approx 231 - 190{,}96 = 40{,}04$ cm²",
      options: [
        { content: "$40{,}04$ cm²", isCorrect: true },
        { content: "$231$ cm²", isCorrect: false },
        { content: "$190{,}96$ cm²", isCorrect: false },
        { content: "$80{,}08$ cm²", isCorrect: false },
        { content: "$115{,}5$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Ibu membuat kue bolu berbentuk lingkaran berdiameter 28 cm. Ibu memotong bagian pinggir kue (tembereng) dengan sudut pusat $90°$. Luas potongan pinggir kue tersebut adalah...\n\n(Gunakan $\pi = \\frac{22}{7}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Jari-jari $r = 14$ cm\n\nLuas juring $= \\frac{90}{360} \times \\frac{22}{7} \times 196 = \\frac{1}{4} \times 616 = 154$ cm²\n\nLuas segitiga $= \\frac{1}{2} \times 14 \times 14 = 98$ cm²\n\nLuas tembereng $= 154 - 98 = 56$ cm²",
      options: [
        { content: "$56$ cm²", isCorrect: true },
        { content: "$154$ cm²", isCorrect: false },
        { content: "$98$ cm²", isCorrect: false },
        { content: "$112$ cm²", isCorrect: false },
        { content: "$28$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Pada lingkaran dengan pusat O dan jari-jari $r$, luas juring $AOB$ adalah 157 cm². Luas temberengnya adalah...\n\n(Sudut pusat $= 90°$, $\pi = 3{,}14$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "HARD",
      solution: "Luas juring $= 157$ cm², sudut $= 90°$\n\n$157 = \\frac{90}{360} \times 3{,}14 \times r^2 \Rightarrow r^2 = \\frac{157 \times 4}{3{,}14} = 200 \Rightarrow r = 10\sqrt{2}$\n\nLuas segitiga $= \\frac{1}{2} r^2 \sin 90° = \\frac{1}{2} \times 200 = 100$ cm²\n\nLuas tembereng $= 157 - 100 = 57$ cm²",
      options: [
        { content: "$57$ cm²", isCorrect: true },
        { content: "$100$ cm²", isCorrect: false },
        { content: "$157$ cm²", isCorrect: false },
        { content: "$50$ cm²", isCorrect: false },
        { content: "$207$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Sebuah lingkaran memiliki jari-jari 10 cm. Jika sudut pusatnya $90°$, maka luas temberengnya adalah...\n\n(Gunakan $\pi = 3{,}14$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{90}{360} \times 3{,}14 \times 100 = 78{,}5$ cm²\n\nLuas segitiga $= \\frac{1}{2} \times 10 \times 10 = 50$ cm²\n\nLuas tembereng $= 78{,}5 - 50 = 28{,}5$ cm²",
      options: [
        { content: "$28{,}5$ cm²", isCorrect: true },
        { content: "$78{,}5$ cm²", isCorrect: false },
        { content: "$50$ cm²", isCorrect: false },
        { content: "$57$ cm²", isCorrect: false },
        { content: "$14{,}25$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Di sebuah taman berbentuk lingkaran dengan jari-jari 14 m, terdapat area rumput yang dibatasi oleh tali busur dengan sudut pusat $90°$. Luas area rumput (tembereng) tersebut adalah...\n\n(Gunakan $\pi = \\frac{22}{7}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{90}{360} \times \\frac{22}{7} \times 196 = \\frac{1}{4} \times 616 = 154$ m²\n\nLuas segitiga $= \\frac{1}{2} \times 14 \times 14 = 98$ m²\n\nLuas tembereng $= 154 - 98 = 56$ m²",
      options: [
        { content: "$56$ m²", isCorrect: true },
        { content: "$154$ m²", isCorrect: false },
        { content: "$98$ m²", isCorrect: false },
        { content: "$44$ m²", isCorrect: false },
        { content: "$112$ m²", isCorrect: false },
      ]
    },
    {
      content: "Diketahui luas juring sebuah lingkaran adalah 44 cm² dengan sudut pusat $60°$. Luas tembereng pada juring tersebut adalah...\n\n(Gunakan $\pi = \\frac{22}{7}$, $\sin 60° = \\frac{\sqrt{3}}{2}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "HARD",
      solution: "Luas juring $= 44$ cm², sudut $= 60°$\n\n$44 = \\frac{60}{360} \times \\frac{22}{7} \times r^2 \Rightarrow r^2 = \\frac{44 \times 6 \times 7}{22} = 84$\n\nLuas segitiga $= \\frac{1}{2} r^2 \sin 60° = \\frac{1}{2} \times 84 \times \\frac{\sqrt{3}}{2} = 21\sqrt{3} \approx 36{,}37$ cm²\n\nLuas tembereng $= 44 - 36{,}37 \approx 7{,}63$ cm²",
      options: [
        { content: "$44 - 21\sqrt{3}$ cm²", isCorrect: true },
        { content: "$44$ cm²", isCorrect: false },
        { content: "$21\sqrt{3}$ cm²", isCorrect: false },
        { content: "$22$ cm²", isCorrect: false },
        { content: "$7$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Seorang arsitek merancang jendela berbentuk setengah lingkaran. Di dalamnya terdapat ornamen kaca berbentuk tembereng dengan sudut pusat $90°$ dan jari-jari 6 cm. Luas kaca tembereng tersebut adalah...\n\n(Gunakan $\pi = 3{,}14$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{90}{360} \times 3{,}14 \times 36 = \\frac{1}{4} \times 113{,}04 = 28{,}26$ cm²\n\nLuas segitiga $= \\frac{1}{2} \times 6 \times 6 = 18$ cm²\n\nLuas tembereng $= 28{,}26 - 18 = 10{,}26$ cm²",
      options: [
        { content: "$10{,}26$ cm²", isCorrect: true },
        { content: "$28{,}26$ cm²", isCorrect: false },
        { content: "$18$ cm²", isCorrect: false },
        { content: "$20{,}52$ cm²", isCorrect: false },
        { content: "$9$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Diketahui lingkaran dengan jari-jari 12 cm, maka luas tembereng yang terbentuk jika sudut pusatnya $90°$ adalah...\n\n(Gunakan $\pi = 3{,}14$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{90}{360} \times 3{,}14 \times 144 = \\frac{1}{4} \times 452{,}16 = 113{,}04$ cm²\n\nLuas segitiga $= \\frac{1}{2} \times 12 \times 12 = 72$ cm²\n\nLuas tembereng $= 113{,}04 - 72 = 41{,}04$ cm²",
      options: [
        { content: "$41{,}04$ cm²", isCorrect: true },
        { content: "$113{,}04$ cm²", isCorrect: false },
        { content: "$72$ cm²", isCorrect: false },
        { content: "$82{,}08$ cm²", isCorrect: false },
        { content: "$36$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Sebuah tembereng lingkaran dibentuk dari juring dengan sudut pusat $90°$ dan jari-jari 28 cm. Jika luas juring adalah 616 cm², maka luas temberengnya adalah...\n\n(Gunakan $\pi = \\frac{22}{7}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas segitiga $= \\frac{1}{2} \times 28 \times 28 = 392$ cm²\n\nLuas tembereng $= $ Luas juring $-$ Luas segitiga $= 616 - 392 = 224$ cm²",
      options: [
        { content: "$224$ cm²", isCorrect: true },
        { content: "$616$ cm²", isCorrect: false },
        { content: "$392$ cm²", isCorrect: false },
        { content: "$308$ cm²", isCorrect: false },
        { content: "$196$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Sebuah lingkaran memiliki diameter 42 cm. Sudut pusat $90°$ membentuk juring dan segitiga siku-siku. Hitung luas temberengnya!\n\n(Gunakan $\pi = \\frac{22}{7}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Jari-jari $r = 21$ cm\n\nLuas juring $= \\frac{90}{360} \times \\frac{22}{7} \times 441 = \\frac{1}{4} \times 1386 = 346{,}5$ cm²\n\nLuas segitiga $= \\frac{1}{2} \times 21 \times 21 = 220{,}5$ cm²\n\nLuas tembereng $= 346{,}5 - 220{,}5 = 126$ cm²",
      options: [
        { content: "$126$ cm²", isCorrect: true },
        { content: "$346{,}5$ cm²", isCorrect: false },
        { content: "$220{,}5$ cm²", isCorrect: false },
        { content: "$252$ cm²", isCorrect: false },
        { content: "$63$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Sebuah tembereng lingkaran dibentuk dari juring dengan sudut pusat $90°$ dan jari-jari 12 cm. Jika luas juring adalah 120 cm², maka luas temberengnya adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas segitiga $= \\frac{1}{2} \times 12 \times 12 \times \sin 90° = \\frac{1}{2} \times 144 = 72$ cm²\n\nLuas tembereng $= 120 - 72 = 48$ cm²",
      options: [
        { content: "$48$ cm²", isCorrect: true },
        { content: "$120$ cm²", isCorrect: false },
        { content: "$72$ cm²", isCorrect: false },
        { content: "$96$ cm²", isCorrect: false },
        { content: "$24$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Sebuah lingkaran memiliki jari-jari 35 cm. Sudut pusat $90°$ membentuk juring dan segitiga siku-siku. Hitung luas temberengnya!\n\n(Gunakan $\pi = \\frac{22}{7}$)",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring $= \\frac{90}{360} \times \\frac{22}{7} \times 1225 = \\frac{1}{4} \times 3850 = 962{,}5$ cm²\n\nLuas segitiga $= \\frac{1}{2} \times 35 \times 35 = 612{,}5$ cm²\n\nLuas tembereng $= 962{,}5 - 612{,}5 = 350$ cm²",
      options: [
        { content: "$350$ cm²", isCorrect: true },
        { content: "$962{,}5$ cm²", isCorrect: false },
        { content: "$612{,}5$ cm²", isCorrect: false },
        { content: "$700$ cm²", isCorrect: false },
        { content: "$175$ cm²", isCorrect: false },
      ]
    },
    // ===== LINGKARAN - PERSAMAAN LINGKARAN =====
    {
      content: "Persamaan lingkaran yang berpusat di titik $O(0,0)$ dan memiliki jari-jari $r = 11$ adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "Persamaan lingkaran berpusat di $O(0,0)$: $x^2 + y^2 = r^2$\n\n$x^2 + y^2 = 11^2 = 121$",
      options: [
        { content: "$x^2 + y^2 = 121$", isCorrect: true },
        { content: "$x^2 + y^2 = 11$", isCorrect: false },
        { content: "$x^2 + y^2 = 22$", isCorrect: false },
        { content: "$(x-11)^2 + (y-11)^2 = 0$", isCorrect: false },
        { content: "$x^2 + y^2 = 1331$", isCorrect: false },
      ]
    },
    {
      content: "Sebuah radar pemantau cuaca diletakkan pada titik pusat $(0,0)$. Radar tersebut mampu mendeteksi awan mendung dalam radius 25 km. Persamaan jangkauan radar tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "Persamaan lingkaran berpusat di $O(0,0)$ dengan $r = 25$:\n\n$x^2 + y^2 = 625$",
      options: [
        { content: "$x^2 + y^2 = 625$", isCorrect: true },
        { content: "$x^2 + y^2 = 25$", isCorrect: false },
        { content: "$x^2 + y^2 = 50$", isCorrect: false },
        { content: "$x^2 + y^2 = 125$", isCorrect: false },
        { content: "$x^2 + y^2 = 5$", isCorrect: false },
      ]
    },
    {
      content: "Lingkaran yang berpusat di titik $(0,0)$ dan melalui titik $(6, -8)$ memiliki persamaan...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "$r = \sqrt{6^2 + (-8)^2} = \sqrt{36 + 64} = \sqrt{100} = 10$\n\nPersamaan: $x^2 + y^2 = 100$",
      options: [
        { content: "$x^2 + y^2 = 100$", isCorrect: true },
        { content: "$x^2 + y^2 = 10$", isCorrect: false },
        { content: "$x^2 + y^2 = 28$", isCorrect: false },
        { content: "$x^2 + y^2 = 14$", isCorrect: false },
        { content: "$x^2 + y^2 = 200$", isCorrect: false },
      ]
    },
    {
      content: "Seorang murid menggambar sebuah lingkaran pada koordinat kartesius dengan pusat di asal. Jika lingkaran tersebut menyinggung garis $y = -7$, maka persamaannya adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Jika lingkaran berpusat di $(0,0)$ menyinggung garis $y = -7$, maka jari-jari $= |{-7}| = 7$\n\nPersamaan: $x^2 + y^2 = 49$",
      options: [
        { content: "$x^2 + y^2 = 49$", isCorrect: true },
        { content: "$x^2 + y^2 = 7$", isCorrect: false },
        { content: "$x^2 + y^2 = 14$", isCorrect: false },
        { content: "$x^2 + (y+7)^2 = 0$", isCorrect: false },
        { content: "$x^2 + y^2 = 98$", isCorrect: false },
      ]
    },
    {
      content: "Sebuah lingkaran yang berpusat di $(0,0)$, dengan jari-jari 21 cm. Persamaan lingkaran tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "$x^2 + y^2 = r^2 = 21^2 = 441$",
      options: [
        { content: "$x^2 + y^2 = 441$", isCorrect: true },
        { content: "$x^2 + y^2 = 21$", isCorrect: false },
        { content: "$x^2 + y^2 = 42$", isCorrect: false },
        { content: "$x^2 + y^2 = 882$", isCorrect: false },
        { content: "$x^2 + y^2 = 9261$", isCorrect: false },
      ]
    },
    {
      content: "Diketahui sebuah lingkaran berpusat di titik $(0,0)$ dengan jari-jari 7 cm. Persamaan lingkaran tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "$x^2 + y^2 = r^2 = 7^2 = 49$",
      options: [
        { content: "$x^2 + y^2 = 49$", isCorrect: true },
        { content: "$x^2 + y^2 = 7$", isCorrect: false },
        { content: "$x^2 + y^2 = 14$", isCorrect: false },
        { content: "$x^2 + y^2 = 98$", isCorrect: false },
        { content: "$x^2 + y^2 = 343$", isCorrect: false },
      ]
    },
    {
      content: "Sebuah lingkaran berpusat di titik $(0,0)$ melalui titik $(8, 9)$. Persamaan lingkaran tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "$r^2 = 8^2 + 9^2 = 64 + 81 = 145$\n\nPersamaan: $x^2 + y^2 = 145$",
      options: [
        { content: "$x^2 + y^2 = 145$", isCorrect: true },
        { content: "$x^2 + y^2 = 17$", isCorrect: false },
        { content: "$x^2 + y^2 = 289$", isCorrect: false },
        { content: "$x^2 + y^2 = 72$", isCorrect: false },
        { content: "$x^2 + y^2 = 145^2$", isCorrect: false },
      ]
    },
    {
      content: "Persamaan lingkaran yang berpusat di titik $(3, -5)$ dengan jari-jari 4 cm adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "Persamaan lingkaran berpusat di $(a, b)$: $(x-a)^2 + (y-b)^2 = r^2$\n\n$(x-3)^2 + (y+5)^2 = 16$",
      options: [
        { content: "$(x-3)^2 + (y+5)^2 = 16$", isCorrect: true },
        { content: "$(x+3)^2 + (y-5)^2 = 16$", isCorrect: false },
        { content: "$(x-3)^2 + (y-5)^2 = 16$", isCorrect: false },
        { content: "$(x-3)^2 + (y+5)^2 = 4$", isCorrect: false },
        { content: "$(x+3)^2 + (y+5)^2 = 16$", isCorrect: false },
      ]
    },
    {
      content: "Di sebuah taman, terdapat kolam ikan berbentuk lingkaran yang pusatnya berada pada koordinat $(2, 4)$. Jika tepi kolam tersebut melalui titik $(5, 8)$, maka persamaan lingkaran kolam tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "$r = \sqrt{(5-2)^2 + (8-4)^2} = \sqrt{9 + 16} = \sqrt{25} = 5$\n\nPersamaan: $(x-2)^2 + (y-4)^2 = 25$",
      options: [
        { content: "$(x-2)^2 + (y-4)^2 = 25$", isCorrect: true },
        { content: "$(x-2)^2 + (y-4)^2 = 5$", isCorrect: false },
        { content: "$(x+2)^2 + (y+4)^2 = 25$", isCorrect: false },
        { content: "$(x-2)^2 + (y-4)^2 = 50$", isCorrect: false },
        { content: "$(x-5)^2 + (y-8)^2 = 25$", isCorrect: false },
      ]
    },
    {
      content: "Pusat dan jari-jari dari lingkaran dengan persamaan $(x+6)^2 + (y-1)^2 = 81$ adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "Dari bentuk $(x-a)^2 + (y-b)^2 = r^2$:\n\n$(x+6)^2 + (y-1)^2 = 81 \Rightarrow$ pusat $(-6, 1)$, jari-jari $r = \sqrt{81} = 9$",
      options: [
        { content: "Pusat $(-6, 1)$, jari-jari $9$", isCorrect: true },
        { content: "Pusat $(6, -1)$, jari-jari $9$", isCorrect: false },
        { content: "Pusat $(-6, 1)$, jari-jari $81$", isCorrect: false },
        { content: "Pusat $(6, 1)$, jari-jari $9$", isCorrect: false },
        { content: "Pusat $(-6, -1)$, jari-jari $9$", isCorrect: false },
      ]
    },
    {
      content: "Sebuah murid jurusan teknik sedang mendesain gir mesin. Pusat gir berada di $(-3, -2)$ dan gir tersebut menyinggung sumbu X. Persamaan lingkaran gir tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Jika lingkaran menyinggung sumbu X, maka jari-jari $= |y_{\text{pusat}}| = |-2| = 2$\n\nPersamaan: $(x+3)^2 + (y+2)^2 = 4$",
      options: [
        { content: "$(x+3)^2 + (y+2)^2 = 4$", isCorrect: true },
        { content: "$(x-3)^2 + (y-2)^2 = 4$", isCorrect: false },
        { content: "$(x+3)^2 + (y+2)^2 = 9$", isCorrect: false },
        { content: "$(x+3)^2 + (y+2)^2 = 2$", isCorrect: false },
        { content: "$(x+3)^2 + (y+2)^2 = 13$", isCorrect: false },
      ]
    },
    {
      content: "Persamaan lingkaran yang berpusat di $(-1, 4)$ dan menyinggung sumbu Y adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Jika lingkaran menyinggung sumbu Y, maka jari-jari $= |x_{\text{pusat}}| = |-1| = 1$\n\nPersamaan: $(x+1)^2 + (y-4)^2 = 1$",
      options: [
        { content: "$(x+1)^2 + (y-4)^2 = 1$", isCorrect: true },
        { content: "$(x-1)^2 + (y+4)^2 = 1$", isCorrect: false },
        { content: "$(x+1)^2 + (y-4)^2 = 4$", isCorrect: false },
        { content: "$(x+1)^2 + (y-4)^2 = 16$", isCorrect: false },
        { content: "$(x+1)^2 + (y-4)^2 = 17$", isCorrect: false },
      ]
    },
    {
      content: "Diketahui sebuah lingkaran berpusat di titik $(2, -3)$ dengan jari-jari 7 cm. Persamaan lingkaran tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "$(x-2)^2 + (y+3)^2 = 7^2 = 49$",
      options: [
        { content: "$(x-2)^2 + (y+3)^2 = 49$", isCorrect: true },
        { content: "$(x+2)^2 + (y-3)^2 = 49$", isCorrect: false },
        { content: "$(x-2)^2 + (y-3)^2 = 49$", isCorrect: false },
        { content: "$(x-2)^2 + (y+3)^2 = 7$", isCorrect: false },
        { content: "$(x-2)^2 + (y+3)^2 = 14$", isCorrect: false },
      ]
    },
    {
      content: "Bentuk umum dari persamaan lingkaran $(x-2)^2 + (y+4)^2 = 12$ adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "$(x-2)^2 + (y+4)^2 = 12$\n\n$x^2 - 4x + 4 + y^2 + 8y + 16 = 12$\n\n$x^2 + y^2 - 4x + 8y + 8 = 0$",
      options: [
        { content: "$x^2 + y^2 - 4x + 8y + 8 = 0$", isCorrect: true },
        { content: "$x^2 + y^2 + 4x - 8y + 8 = 0$", isCorrect: false },
        { content: "$x^2 + y^2 - 4x + 8y - 8 = 0$", isCorrect: false },
        { content: "$x^2 + y^2 - 4x + 8y + 20 = 0$", isCorrect: false },
        { content: "$x^2 + y^2 - 2x + 4y + 8 = 0$", isCorrect: false },
      ]
    },
    {
      content: "Pusat lingkaran dari persamaan $x^2 + y^2 - 10x + 6y + 18 = 0$ adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Bentuk umum: $x^2 + y^2 + Ax + By + C = 0$, pusat $= \\left(-\\frac{A}{2}, -\\frac{B}{2}\\right)$\n\n$A = -10, B = 6 \Rightarrow$ pusat $= (5, -3)$",
      options: [
        { content: "$(5, -3)$", isCorrect: true },
        { content: "$(-5, 3)$", isCorrect: false },
        { content: "$(10, -6)$", isCorrect: false },
        { content: "$(-10, 6)$", isCorrect: false },
        { content: "$(5, 3)$", isCorrect: false },
      ]
    },
    {
      content: "Dalam sebuah simulasi komputer, sebuah objek bergerak mengikuti lintasan $x^2 + y^2 + 4x - 12y - 9 = 0$. Jari-jari lintasan objek tersebut adalah...",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "HARD",
      solution: "Bentuk umum: $x^2 + y^2 + Ax + By + C = 0$\n\n$r = \sqrt{\\frac{A^2}{4} + \\frac{B^2}{4} - C} = \sqrt{\\frac{16}{4} + \\frac{144}{4} - (-9)} = \sqrt{4 + 36 + 9} = \sqrt{49} = 7$",
      options: [
        { content: "$7$", isCorrect: true },
        { content: "$49$", isCorrect: false },
        { content: "$\sqrt{31}$", isCorrect: false },
        { content: "$9$", isCorrect: false },
        { content: "$\sqrt{13}$", isCorrect: false },
      ]
    },
    // ===== STATISTIKA BIVARIAT =====
    {
      content: "Data bivariat berikut ini yang **tidak** mempunyai korelasi adalah ....",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "MEDIUM",
      solution: "Korelasi terjadi jika ada hubungan sebab-akibat atau keterkaitan logis antara dua variabel. Tingkat pendidikan dengan jumlah ponsel yang dimiliki tidak memiliki hubungan logis yang jelas, sehingga tidak berkorelasi.",
      options: [
        { content: "Suhu udara dengan banyaknya penjualan minuman dingin", isCorrect: false },
        { content: "Tingkat pendidikan dengan tingkat kemiskinan", isCorrect: false },
        { content: "Tingkat pendidikan dengan jumlah ponsel yang dimiliki", isCorrect: true },
        { content: "Banyaknya kendaraan dengan waktu tempuh", isCorrect: false },
        { content: "Tingkat kepadatan penduduk dengan tingkat kemacetan", isCorrect: false },
      ]
    },
    {
      content: "Perhatikan diagram pencar berikut.\n\nTitik-titik data tersebar dari kiri bawah ke kanan atas dengan pola yang sangat rapat dan hampir membentuk garis lurus.\n\nDiagram tersebut menunjukkan korelasi ....",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "EASY",
      solution: "Pola titik dari kiri bawah ke kanan atas menunjukkan korelasi **positif** (semakin besar X, semakin besar Y). Pola yang sangat rapat menunjukkan korelasi **kuat**.",
      options: [
        { content: "Positif kuat", isCorrect: true },
        { content: "Negatif kuat", isCorrect: false },
        { content: "Positif lemah", isCorrect: false },
        { content: "Negatif lemah", isCorrect: false },
        { content: "Tidak ada korelasi", isCorrect: false },
      ]
    },
    {
      content: "Perhatikan diagram pencar antara usia (sumbu X) dan skor tes (sumbu Y). Titik-titik data menunjukkan pola menurun dari kiri atas ke kanan bawah.\n\nBerdasarkan data pada diagram pencar tersebut, pernyataan yang paling tepat adalah ...",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "MEDIUM",
      solution: "Pola menurun dari kiri atas ke kanan bawah menunjukkan bahwa semakin bertambah usia, skor tes yang diperoleh cenderung menurun (korelasi negatif).",
      options: [
        { content: "Usia tidak berpengaruh terhadap skor tes yang diperoleh", isCorrect: false },
        { content: "Semakin bertambah usia seseorang, skor tes yang diperoleh cenderung meningkat", isCorrect: false },
        { content: "Semakin bertambah usia seseorang, skor tes yang diperoleh cenderung menurun", isCorrect: true },
        { content: "Skor tes paling tinggi terjadi pada usia 28 tahun", isCorrect: false },
        { content: "Skor tes selalu sama setiap penambahan usia satu tahun", isCorrect: false },
      ]
    },
    {
      content: "Perhatikan diagram pencar antara usia dan skor tes. Data menunjukkan korelasi negatif. Jika standar skor tes yang dianggap baik adalah minimal 250, maka kesimpulan yang paling tepat mengenai rentang usia yang memenuhi standar tersebut adalah ...",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "HARD",
      solution: "Karena korelasi negatif (usia naik, skor turun), maka untuk mencapai skor minimal 250 diperlukan usia yang lebih muda. Namun karena data bersifat statistik (bukan deterministik), hasilnya tidak pasti konsisten. Usia lebih dari 25 tahun masih memungkinkan mencapai standar karena ada variasi data.",
      options: [
        { content: "Usia 24 tahun ke atas sudah pasti mencapai standar", isCorrect: false },
        { content: "Diperlukan usia kurang dari atau sama dengan 24 tahun agar skor tes mencapai standar baik", isCorrect: false },
        { content: "Usia 24 tahun sudah cukup, namun hasilnya belum tentu konsisten", isCorrect: false },
        { content: "Usia lebih dari 25 tahun masih memungkinkan mencapai standar", isCorrect: true },
        { content: "Semakin bertambah usia, skor tes akan terus menurun tanpa batas", isCorrect: false },
      ]
    },
    {
      content: "Perhatikan diagram pencar berikut. Titik-titik data membentuk pola garis lurus dari kiri bawah ke kanan atas, namun titik-titik tersebar agak jauh dari garis.\n\nPernyataan yang paling tepat mengenai tren dan jenis korelasi dari data tersebut adalah ...",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "MEDIUM",
      solution: "Pola dari kiri bawah ke kanan atas = tren linear positif. Titik yang agak jauh dari garis = korelasi positif lemah.",
      options: [
        { content: "Tren menurun, memiliki korelasi negatif kuat", isCorrect: false },
        { content: "Tren non linear, memiliki korelasi negatif lemah", isCorrect: false },
        { content: "Tren linear, memiliki korelasi positif kuat", isCorrect: false },
        { content: "Tren linear, memiliki korelasi positif lemah", isCorrect: true },
        { content: "Tren non linear, tidak memiliki korelasi", isCorrect: false },
      ]
    },
    {
      content: "Data bivariat berikut ini yang mempunyai **korelasi positif** adalah ....",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "EASY",
      solution: "Korelasi positif berarti semakin besar X, semakin besar Y. Tingkat pendidikan yang lebih tinggi cenderung menghasilkan penghasilan yang lebih besar.",
      options: [
        { content: "Tingkat pendidikan dengan banyaknya penghasilan", isCorrect: true },
        { content: "Banyaknya penghasilan dengan berat badan", isCorrect: false },
        { content: "Frekuensi berolahraga dengan ukuran sepatu", isCorrect: false },
        { content: "Jarak rumah ke sekolah dengan nilai ujian", isCorrect: false },
        { content: "Tingkat pendidikan dengan lamanya waktu tidur", isCorrect: false },
      ]
    },
    {
      content: "Perhatikan diagram pencar berikut. Titik-titik data tersebar secara acak tanpa membentuk pola tertentu, baik naik maupun turun.\n\nDiagram tersebut menunjukkan korelasi ....",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "EASY",
      solution: "Titik-titik yang tersebar acak tanpa pola menunjukkan bahwa tidak ada hubungan antara kedua variabel, sehingga korelasinya adalah **tidak ada korelasi**.",
      options: [
        { content: "Positif kuat", isCorrect: false },
        { content: "Negatif kuat", isCorrect: false },
        { content: "Positif lemah", isCorrect: false },
        { content: "Negatif lemah", isCorrect: false },
        { content: "Tidak ada korelasi", isCorrect: true },
      ]
    },
    {
      content: "Perhatikan diagram pencar antara waktu latihan fisik (sumbu X) dan penurunan berat badan (sumbu Y). Titik-titik membentuk pola naik dari kiri ke kanan.\n\nBerdasarkan data pada diagram pencar tersebut, pernyataan yang paling tepat adalah ...",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "MEDIUM",
      solution: "Pola naik dari kiri ke kanan menunjukkan korelasi positif: semakin lama waktu latihan fisik, penurunan berat badan cenderung meningkat.",
      options: [
        { content: "Waktu latihan tidak berpengaruh terhadap penurunan berat badan", isCorrect: false },
        { content: "Semakin lama waktu latihan fisik, penurunan berat badan cenderung meningkat", isCorrect: true },
        { content: "Semakin lama waktu latihan fisik, penurunan berat badan cenderung menurun", isCorrect: false },
        { content: "Penurunan berat badan paling besar terjadi pada waktu latihan 1 jam", isCorrect: false },
        { content: "Semakin lama waktu latihan, semakin menambah berat badan", isCorrect: false },
      ]
    },
    {
      content: "Perhatikan diagram pencar antara waktu latihan dan penurunan berat badan (korelasi positif). Jika seseorang menargetkan penurunan berat badan minimal 1,5 kg, maka kesimpulan yang paling tepat mengenai waktu latihan yang diperlukan adalah ...",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "HARD",
      solution: "Karena data bersifat statistik, tidak ada jaminan pasti. Berlatih selama 2,5 jam menunjukkan kecenderungan mencapai target, namun hasilnya belum tentu konsisten karena ada variasi individual.",
      options: [
        { content: "Cukup berlatih selama 2 jam sudah pasti mencapai target", isCorrect: false },
        { content: "Diperlukan waktu latihan lebih dari atau sama dengan 2,5 jam agar target tercapai", isCorrect: false },
        { content: "Berlatih selama 2,5 jam sudah cukup, namun hasilnya belum tentu konsisten", isCorrect: true },
        { content: "Waktu latihan kurang dari 2 jam masih memungkinkan mencapai target", isCorrect: false },
        { content: "Semakin lama latihan, penurunan berat badan akan terus bertambah tanpa batas", isCorrect: false },
      ]
    },
    {
      content: "Perhatikan diagram pencar berikut. Titik-titik data membentuk pola garis lurus yang sangat rapat dari kiri bawah ke kanan atas.\n\nPernyataan yang paling tepat mengenai tren dan jenis korelasi dari data tersebut adalah ...",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "MEDIUM",
      solution: "Pola dari kiri bawah ke kanan atas = tren linear positif. Titik yang sangat rapat = korelasi positif kuat.",
      options: [
        { content: "Tren menurun, memiliki korelasi negatif kuat", isCorrect: false },
        { content: "Tren non linear, memiliki korelasi negatif lemah", isCorrect: false },
        { content: "Tren linear, memiliki korelasi positif kuat", isCorrect: true },
        { content: "Tren linear, memiliki korelasi positif lemah", isCorrect: false },
        { content: "Tren linear, tidak memiliki korelasi", isCorrect: false },
      ]
    },
  ]

  console.log(`Inserting ${questions.length} questions...`)

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

  console.log(`Successfully seeded ${questions.length} questions!`)
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
