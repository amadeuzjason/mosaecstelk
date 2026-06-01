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
  console.log('Seeding bank soal matematika...')

  const questions = [
    // ===== KELAS 10 =====
    // A. Bilangan Berpangkat (Eksponen)
    {
      content: "Nilai dari $2^5$ adalah ....",
      grade: "CLASS_10",
      subject: "EKSPONEN",
      difficulty: "EASY",
      solution: "$2^5 = 2 \\times 2 \\times 2 \\times 2 \\times 2 = 32$",
      options: [
        { content: "16", isCorrect: false },
        { content: "25", isCorrect: false },
        { content: "32", isCorrect: true },
        { content: "64", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $4^{-2}$ adalah ....",
      grade: "CLASS_10",
      subject: "EKSPONEN",
      difficulty: "EASY",
      solution: "$4^{-2} = \\frac{1}{4^2} = \\frac{1}{16}$",
      options: [
        { content: "$\\frac{1}{16}$", isCorrect: true },
        { content: "$\\frac{1}{8}$", isCorrect: false },
        { content: "$-16$", isCorrect: false },
        { content: "$16$", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $27^{\\frac{2}{3}}$ adalah ....",
      grade: "CLASS_10",
      subject: "EKSPONEN",
      difficulty: "MEDIUM",
      solution: "$27^{\\frac{2}{3}} = (27^{\\frac{1}{3}})^2 = 3^2 = 9$",
      options: [
        { content: "$3$", isCorrect: false },
        { content: "$6$", isCorrect: false },
        { content: "$9$", isCorrect: true },
        { content: "$18$", isCorrect: false },
      ]
    },
    {
      content: "Bentuk sederhana dari $\\frac{a^3 \\cdot a^4}{a^5}$ adalah ....",
      grade: "CLASS_10",
      subject: "EKSPONEN",
      difficulty: "EASY",
      solution: "$\\frac{a^3 \\cdot a^4}{a^5} = \\frac{a^{3+4}}{a^5} = \\frac{a^7}{a^5} = a^{7-5} = a^2$",
      options: [
        { content: "$a^2$", isCorrect: true },
        { content: "$a^3$", isCorrect: false },
        { content: "$a^{12}$", isCorrect: false },
        { content: "$a^{-2}$", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $5^0$ adalah ....",
      grade: "CLASS_10",
      subject: "EKSPONEN",
      difficulty: "EASY",
      solution: "Setiap bilangan berpangkat nol (selain 0) bernilai 1. Jadi $5^0 = 1$.",
      options: [
        { content: "0", isCorrect: false },
        { content: "1", isCorrect: true },
        { content: "10", isCorrect: false },
        { content: "Tidak terdefinisi", isCorrect: false },
      ]
    },
    // B. Bentuk Akar
    {
      content: "Nilai dari $\sqrt{64}$ adalah ....",
      grade: "CLASS_10",
      subject: "BENTUK AKAR",
      difficulty: "EASY",
      solution: "$\sqrt{64} = 8$ karena $8^2 = 64$",
      options: [
        { content: "6", isCorrect: false },
        { content: "7", isCorrect: false },
        { content: "8", isCorrect: true },
        { content: "9", isCorrect: false },
      ]
    },
    {
      content: "Bentuk sederhana dari $\sqrt{50}$ adalah ....",
      grade: "CLASS_10",
      subject: "BENTUK AKAR",
      difficulty: "EASY",
      solution: "$\sqrt{50} = \sqrt{25 \times 2} = 5\sqrt{2}$",
      options: [
        { content: "$5\sqrt{2}$", isCorrect: true },
        { content: "$2\sqrt{5}$", isCorrect: false },
        { content: "$10\sqrt{2}$", isCorrect: false },
        { content: "$25\sqrt{2}$", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $\sqrt{12} \times \sqrt{3}$ adalah ....",
      grade: "CLASS_10",
      subject: "BENTUK AKAR",
      difficulty: "EASY",
      solution: "$\sqrt{12} \times \sqrt{3} = \sqrt{12 \times 3} = \sqrt{36} = 6$",
      options: [
        { content: "6", isCorrect: true },
        { content: "12", isCorrect: false },
        { content: "18", isCorrect: false },
        { content: "36", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $3\sqrt{5} + 2\sqrt{5}$ adalah ....",
      grade: "CLASS_10",
      subject: "BENTUK AKAR",
      difficulty: "EASY",
      solution: "$3\sqrt{5} + 2\sqrt{5} = (3+2)\sqrt{5} = 5\sqrt{5}$. Nilai numeriknya $\approx 11.18$, pilihan terdekat adalah 11.",
      options: [
        { content: "11", isCorrect: false },
        { content: "12", isCorrect: false },
        { content: "$5\sqrt{5}$", isCorrect: true },
        { content: "14", isCorrect: false },
      ]
    },
    {
      content: "Bentuk pangkat dari $\sqrt[3]{x^2}$ adalah ....",
      grade: "CLASS_10",
      subject: "BENTUK AKAR",
      difficulty: "MEDIUM",
      solution: "$\sqrt[3]{x^2} = x^{\\frac{2}{3}}$",
      options: [
        { content: "$x^{\\frac{2}{3}}$", isCorrect: true },
        { content: "$x^{\\frac{3}{2}}$", isCorrect: false },
        { content: "$x^{\\frac{1}{3}}$", isCorrect: false },
        { content: "$x^{\\frac{1}{2}}$", isCorrect: false },
      ]
    },
    // C. Persamaan Eksponensial
    {
      content: "Jika $2^x = 16$, maka nilai $x$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN EKSPONENSIAL",
      difficulty: "EASY",
      solution: "$2^x = 16 = 2^4$, maka $x = 4$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: true },
        { content: "5", isCorrect: false },
      ]
    },
    {
      content: "Jika $3^x = 81$, maka nilai $x$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN EKSPONENSIAL",
      difficulty: "EASY",
      solution: "$3^x = 81 = 3^4$, maka $x = 4$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: true },
        { content: "5", isCorrect: false },
      ]
    },
    {
      content: "Jika $5^{2x} = 125$, maka nilai $x$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN EKSPONENSIAL",
      difficulty: "MEDIUM",
      solution: "$5^{2x} = 125 = 5^3$, maka $2x = 3$, sehingga $x = 1.5$",
      options: [
        { content: "1", isCorrect: false },
        { content: "1.5", isCorrect: true },
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: false },
      ]
    },
    {
      content: "Jika $4^x = 64$, maka nilai $x$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN EKSPONENSIAL",
      difficulty: "EASY",
      solution: "$4^x = 64 = 4^3$, maka $x = 3$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: true },
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: false },
      ]
    },
    {
      content: "Jika $2^{x+1} = 32$, maka nilai $x$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN EKSPONENSIAL",
      difficulty: "MEDIUM",
      solution: "$2^{x+1} = 32 = 2^5$, maka $x+1 = 5$, sehingga $x = 4$",
      options: [
        { content: "1", isCorrect: false },
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: true },
      ]
    },
    // D. Fungsi Eksponensial
    {
      content: "Manakah yang merupakan fungsi eksponensial?",
      grade: "CLASS_10",
      subject: "FUNGSI EKSPONENSIAL",
      difficulty: "EASY",
      solution: "Fungsi eksponensial adalah fungsi dengan variabel sebagai pangkat, berbentuk $f(x) = a^x$ dengan $a > 0, a \neq 1$. Contoh: $f(x) = 2^x$.",
      options: [
        { content: "$f(x) = x^2$", isCorrect: false },
        { content: "$f(x) = 2x$", isCorrect: false },
        { content: "$f(x) = 2^x$", isCorrect: true },
        { content: "$f(x) = x + 2$", isCorrect: false },
      ]
    },
    {
      content: "Nilai $f(2)$ jika $f(x) = 2^x$ adalah ....",
      grade: "CLASS_10",
      subject: "FUNGSI EKSPONENSIAL",
      difficulty: "EASY",
      solution: "$f(2) = 2^2 = 4$",
      options: [
        { content: "2", isCorrect: false },
        { content: "4", isCorrect: true },
        { content: "6", isCorrect: false },
        { content: "8", isCorrect: false },
      ]
    },
    {
      content: "Nilai $f(0)$ jika $f(x) = 5^x$ adalah ....",
      grade: "CLASS_10",
      subject: "FUNGSI EKSPONENSIAL",
      difficulty: "EASY",
      solution: "$f(0) = 5^0 = 1$",
      options: [
        { content: "0", isCorrect: false },
        { content: "1", isCorrect: true },
        { content: "5", isCorrect: false },
        { content: "10", isCorrect: false },
      ]
    },
    {
      content: "Grafik fungsi $f(x) = 3^x$ bersifat ....",
      grade: "CLASS_10",
      subject: "FUNGSI EKSPONENSIAL",
      difficulty: "EASY",
      solution: "Karena basis $3 > 1$, maka fungsi $f(x) = 3^x$ bersifat naik (monoton naik).",
      options: [
        { content: "Menurun", isCorrect: false },
        { content: "Konstan", isCorrect: false },
        { content: "Naik", isCorrect: true },
        { content: "Parabola", isCorrect: false },
      ]
    },
    {
      content: "Nilai $f(3)$ jika $f(x) = 3^x$ adalah ....",
      grade: "CLASS_10",
      subject: "FUNGSI EKSPONENSIAL",
      difficulty: "EASY",
      solution: "$f(3) = 3^3 = 27$",
      options: [
        { content: "6", isCorrect: false },
        { content: "9", isCorrect: false },
        { content: "18", isCorrect: false },
        { content: "27", isCorrect: true },
      ]
    },
    // E. Sifat-Sifat Logaritma
    {
      content: "Nilai dari $^2\log 8$ adalah ....",
      grade: "CLASS_10",
      subject: "LOGARITMA",
      difficulty: "EASY",
      solution: "$^2\log 8 = ^2\log 2^3 = 3$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: true },
        { content: "4", isCorrect: false },
        { content: "8", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $^3\log 81$ adalah ....",
      grade: "CLASS_10",
      subject: "LOGARITMA",
      difficulty: "EASY",
      solution: "$^3\log 81 = ^3\log 3^4 = 4$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: true },
        { content: "9", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $^{10}\log 1000$ adalah ....",
      grade: "CLASS_10",
      subject: "LOGARITMA",
      difficulty: "EASY",
      solution: "$^{10}\log 1000 = ^{10}\log 10^3 = 3$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: true },
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $^2\log 4 + ^2\log 8$ adalah ....",
      grade: "CLASS_10",
      subject: "LOGARITMA",
      difficulty: "MEDIUM",
      solution: "$^2\log 4 + ^2\log 8 = ^2\log(4 \times 8) = ^2\log 32 = ^2\log 2^5 = 5$",
      options: [
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: true },
        { content: "6", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $^5\log 25$ adalah ....",
      grade: "CLASS_10",
      subject: "LOGARITMA",
      difficulty: "EASY",
      solution: "$^5\log 25 = ^5\log 5^2 = 2$",
      options: [
        { content: "1", isCorrect: false },
        { content: "2", isCorrect: true },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
      ]
    },
    // F. Logika Matematika
    {
      content: "Negasi dari \"Semua siswa hadir\" adalah ....",
      grade: "CLASS_10",
      subject: "LOGIKA MATEMATIKA",
      difficulty: "EASY",
      solution: "Negasi dari pernyataan universal \"Semua P adalah Q\" adalah \"Ada P yang bukan Q\". Jadi negasi dari \"Semua siswa hadir\" adalah \"Ada siswa yang tidak hadir\".",
      options: [
        { content: "Semua siswa tidak hadir", isCorrect: false },
        { content: "Sebagian siswa hadir", isCorrect: false },
        { content: "Ada siswa yang tidak hadir", isCorrect: true },
        { content: "Tidak ada siswa hadir", isCorrect: false },
      ]
    },
    {
      content: "Pernyataan yang bernilai benar atau salah disebut ....",
      grade: "CLASS_10",
      subject: "LOGIKA MATEMATIKA",
      difficulty: "EASY",
      solution: "Dalam logika matematika, kalimat yang dapat dinilai benar atau salah disebut **pernyataan** (proposisi).",
      options: [
        { content: "Variabel", isCorrect: false },
        { content: "Pernyataan", isCorrect: true },
        { content: "Himpunan", isCorrect: false },
        { content: "Fungsi", isCorrect: false },
      ]
    },
    {
      content: "Konjungsi dilambangkan dengan ....",
      grade: "CLASS_10",
      subject: "LOGIKA MATEMATIKA",
      difficulty: "EASY",
      solution: "Konjungsi (dan) dilambangkan dengan $\wedge$.",
      options: [
        { content: "$\vee$", isCorrect: false },
        { content: "$\wedge$", isCorrect: true },
        { content: "$\Rightarrow$", isCorrect: false },
        { content: "$\Leftrightarrow$", isCorrect: false },
      ]
    },
    {
      content: "Disjungsi \"p atau q\" dilambangkan dengan ....",
      grade: "CLASS_10",
      subject: "LOGIKA MATEMATIKA",
      difficulty: "EASY",
      solution: "Disjungsi (atau) dilambangkan dengan $\vee$.",
      options: [
        { content: "$\wedge$", isCorrect: false },
        { content: "$\Rightarrow$", isCorrect: false },
        { content: "$\vee$", isCorrect: true },
        { content: "$\Leftrightarrow$", isCorrect: false },
      ]
    },
    {
      content: "Implikasi \"jika p maka q\" dilambangkan dengan ....",
      grade: "CLASS_10",
      subject: "LOGIKA MATEMATIKA",
      difficulty: "EASY",
      solution: "Implikasi (jika...maka) dilambangkan dengan $p \Rightarrow q$.",
      options: [
        { content: "$p \wedge q$", isCorrect: false },
        { content: "$p \vee q$", isCorrect: false },
        { content: "$p \Rightarrow q$", isCorrect: true },
        { content: "$p \Leftrightarrow q$", isCorrect: false },
      ]
    },
    // G. Sistem Pertidaksamaan Linear Dua Variabel
    {
      content: "Titik $(2, 3)$ memenuhi pertidaksamaan ....",
      grade: "CLASS_10",
      subject: "PERTIDAKSAMAAN LINEAR",
      difficulty: "MEDIUM",
      solution: "Substitusi $(2,3)$ ke $x + y \leq 6$: $2 + 3 = 5 \leq 6$ ✓. Jadi titik $(2,3)$ memenuhi $x + y \leq 6$.",
      options: [
        { content: "$x + y > 6$", isCorrect: false },
        { content: "$x + y \leq 6$", isCorrect: true },
        { content: "$2x + y > 8$", isCorrect: false },
        { content: "$x - y > 0$", isCorrect: false },
      ]
    },
    {
      content: "Daerah penyelesaian $x > 0$ terletak ....",
      grade: "CLASS_10",
      subject: "PERTIDAKSAMAAN LINEAR",
      difficulty: "EASY",
      solution: "$x > 0$ berarti nilai $x$ positif, yaitu di sebelah kanan sumbu-Y.",
      options: [
        { content: "Kiri sumbu-Y", isCorrect: false },
        { content: "Kanan sumbu-Y", isCorrect: true },
        { content: "Atas sumbu-X", isCorrect: false },
        { content: "Bawah sumbu-X", isCorrect: false },
      ]
    },
    {
      content: "Titik $(1, 2)$ memenuhi pertidaksamaan ....",
      grade: "CLASS_10",
      subject: "PERTIDAKSAMAAN LINEAR",
      difficulty: "MEDIUM",
      solution: "Substitusi $(1,2)$ ke $x + 2y \leq 6$: $1 + 2(2) = 5 \leq 6$ ✓.",
      options: [
        { content: "$x + y > 4$", isCorrect: false },
        { content: "$x + 2y \leq 6$", isCorrect: true },
        { content: "$2x + y > 5$", isCorrect: false },
        { content: "$x - y > 2$", isCorrect: false },
      ]
    },
    {
      content: "Garis $x = 0$ adalah ....",
      grade: "CLASS_10",
      subject: "PERTIDAKSAMAAN LINEAR",
      difficulty: "EASY",
      solution: "Garis $x = 0$ adalah sumbu-Y (semua titik dengan koordinat $x = 0$).",
      options: [
        { content: "Sumbu-X", isCorrect: false },
        { content: "Sumbu-Y", isCorrect: true },
        { content: "Garis miring", isCorrect: false },
        { content: "Parabola", isCorrect: false },
      ]
    },
    {
      content: "Titik $(0, 0)$ memenuhi pertidaksamaan ....",
      grade: "CLASS_10",
      subject: "PERTIDAKSAMAAN LINEAR",
      difficulty: "EASY",
      solution: "Substitusi $(0,0)$ ke $x + y < 5$: $0 + 0 = 0 < 5$ ✓.",
      options: [
        { content: "$x + y > 5$", isCorrect: false },
        { content: "$x + y \geq 5$", isCorrect: false },
        { content: "$x + y < 5$", isCorrect: true },
        { content: "$x - y > 1$", isCorrect: false },
      ]
    },
    // H. Persamaan Kuadrat
    {
      content: "Persamaan $x^2 - 7x + 6 = 0$ memiliki akar ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN KUADRAT",
      difficulty: "MEDIUM",
      solution: "$x^2 - 7x + 6 = 0 \Rightarrow (x-1)(x-6) = 0 \Rightarrow x = 1$ atau $x = 6$",
      options: [
        { content: "1 dan 6", isCorrect: true },
        { content: "2 dan 3", isCorrect: false },
        { content: "3 dan 6", isCorrect: false },
        { content: "1 dan 3", isCorrect: false },
      ]
    },
    {
      content: "Nilai diskriminan dari $x^2 - 3x + 2 = 0$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN KUADRAT",
      difficulty: "MEDIUM",
      solution: "$D = b^2 - 4ac = (-3)^2 - 4(1)(2) = 9 - 8 = 1$",
      options: [
        { content: "1", isCorrect: true },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: false },
      ]
    },
    {
      content: "Akar-akar persamaan $x^2 - 9 = 0$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN KUADRAT",
      difficulty: "EASY",
      solution: "$x^2 - 9 = 0 \Rightarrow x^2 = 9 \Rightarrow x = \pm 3$",
      options: [
        { content: "$\pm 2$", isCorrect: false },
        { content: "$\pm 3$", isCorrect: true },
        { content: "$\pm 4$", isCorrect: false },
        { content: "$\pm 9$", isCorrect: false },
      ]
    },
    {
      content: "Persamaan kuadrat memiliki bentuk umum ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN KUADRAT",
      difficulty: "EASY",
      solution: "Bentuk umum persamaan kuadrat adalah $ax^2 + bx + c = 0$ dengan $a \neq 0$.",
      options: [
        { content: "$ax + b = 0$", isCorrect: false },
        { content: "$ax^2 + bx + c = 0$", isCorrect: true },
        { content: "$ax^3 + bx^2 + c = 0$", isCorrect: false },
        { content: "$ax^2 + b = 0$", isCorrect: false },
      ]
    },
    {
      content: "Jumlah akar-akar persamaan $x^2 - 7x + 10 = 0$ adalah ....",
      grade: "CLASS_10",
      subject: "PERSAMAAN KUADRAT",
      difficulty: "MEDIUM",
      solution: "Jumlah akar-akar $= -\\frac{b}{a} = -\\frac{-7}{1} = 7$",
      options: [
        { content: "5", isCorrect: false },
        { content: "7", isCorrect: true },
        { content: "10", isCorrect: false },
        { content: "17", isCorrect: false },
      ]
    },
    // I. Fungsi Kuadrat
    {
      content: "Fungsi kuadrat memiliki pangkat tertinggi ....",
      grade: "CLASS_10",
      subject: "FUNGSI KUADRAT",
      difficulty: "EASY",
      solution: "Fungsi kuadrat adalah fungsi polinomial dengan pangkat tertinggi 2, berbentuk $f(x) = ax^2 + bx + c$.",
      options: [
        { content: "1", isCorrect: false },
        { content: "2", isCorrect: true },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
      ]
    },
    {
      content: "Grafik fungsi kuadrat berbentuk ....",
      grade: "CLASS_10",
      subject: "FUNGSI KUADRAT",
      difficulty: "EASY",
      solution: "Grafik fungsi kuadrat $f(x) = ax^2 + bx + c$ berbentuk parabola.",
      options: [
        { content: "Lingkaran", isCorrect: false },
        { content: "Garis lurus", isCorrect: false },
        { content: "Parabola", isCorrect: true },
        { content: "Elips", isCorrect: false },
      ]
    },
    {
      content: "Grafik $f(x) = -x^2 + 3$ membuka ke ....",
      grade: "CLASS_10",
      subject: "FUNGSI KUADRAT",
      difficulty: "EASY",
      solution: "Karena koefisien $x^2$ adalah $-1 < 0$, maka parabola membuka ke bawah.",
      options: [
        { content: "Atas", isCorrect: false },
        { content: "Bawah", isCorrect: true },
        { content: "Kanan", isCorrect: false },
        { content: "Kiri", isCorrect: false },
      ]
    },
    {
      content: "Titik puncak grafik $f(x) = (x-2)^2 + 1$ adalah ....",
      grade: "CLASS_10",
      subject: "FUNGSI KUADRAT",
      difficulty: "MEDIUM",
      solution: "Bentuk $f(x) = (x-h)^2 + k$ memiliki titik puncak $(h, k)$. Jadi titik puncaknya adalah $(2, 1)$.",
      options: [
        { content: "(1, 2)", isCorrect: false },
        { content: "(2, 1)", isCorrect: true },
        { content: "(-2, 1)", isCorrect: false },
        { content: "(1, -2)", isCorrect: false },
      ]
    },
    {
      content: "Sumbu simetri grafik $f(x) = x^2 - 4x + 3$ adalah ....",
      grade: "CLASS_10",
      subject: "FUNGSI KUADRAT",
      difficulty: "MEDIUM",
      solution: "Sumbu simetri $= -\\frac{b}{2a} = -\\frac{-4}{2(1)} = 2$, jadi $x = 2$.",
      options: [
        { content: "$x = 1$", isCorrect: false },
        { content: "$x = 2$", isCorrect: true },
        { content: "$x = 3$", isCorrect: false },
        { content: "$x = 4$", isCorrect: false },
      ]
    },
    // J. Trigonometri pada Segitiga Siku-Siku
    {
      content: "Nilai $\sin 30°$ adalah ....",
      grade: "CLASS_10",
      subject: "TRIGONOMETRI",
      difficulty: "EASY",
      solution: "$\sin 30° = \\frac{1}{2}$",
      options: [
        { content: "0", isCorrect: false },
        { content: "$\\frac{1}{2}$", isCorrect: true },
        { content: "$\\frac{\sqrt{3}}{2}$", isCorrect: false },
        { content: "1", isCorrect: false },
      ]
    },
    {
      content: "Nilai $\cos 60°$ adalah ....",
      grade: "CLASS_10",
      subject: "TRIGONOMETRI",
      difficulty: "EASY",
      solution: "$\cos 60° = \\frac{1}{2}$",
      options: [
        { content: "0", isCorrect: false },
        { content: "$\\frac{1}{2}$", isCorrect: true },
        { content: "$\\frac{\sqrt{3}}{2}$", isCorrect: false },
        { content: "1", isCorrect: false },
      ]
    },
    {
      content: "Nilai $\tan 45°$ adalah ....",
      grade: "CLASS_10",
      subject: "TRIGONOMETRI",
      difficulty: "EASY",
      solution: "$\tan 45° = 1$",
      options: [
        { content: "0", isCorrect: false },
        { content: "$\\frac{1}{2}$", isCorrect: false },
        { content: "1", isCorrect: true },
        { content: "$\sqrt{3}$", isCorrect: false },
      ]
    },
    {
      content: "Pada segitiga siku-siku, $\sin \theta$ adalah ....",
      grade: "CLASS_10",
      subject: "TRIGONOMETRI",
      difficulty: "EASY",
      solution: "$\sin \theta = \\frac{\text{sisi depan}}{\text{sisi miring}}$",
      options: [
        { content: "samping/miring", isCorrect: false },
        { content: "depan/miring", isCorrect: true },
        { content: "depan/samping", isCorrect: false },
        { content: "miring/depan", isCorrect: false },
      ]
    },
    {
      content: "Pada segitiga siku-siku, $\cos \theta$ adalah ....",
      grade: "CLASS_10",
      subject: "TRIGONOMETRI",
      difficulty: "EASY",
      solution: "$\cos \theta = \\frac{\text{sisi samping}}{\text{sisi miring}}$",
      options: [
        { content: "depan/miring", isCorrect: false },
        { content: "depan/samping", isCorrect: false },
        { content: "samping/miring", isCorrect: true },
        { content: "miring/samping", isCorrect: false },
      ]
    },
    // ===== KELAS 11 =====
    // A. Barisan Aritmetika
    {
      content: "Tentukan suku ke-10 dari barisan 2, 5, 8, 11, ...",
      grade: "CLASS_11",
      subject: "BARISAN ARITMETIKA",
      difficulty: "EASY",
      solution: "$a = 2$, $b = 3$. $U_{10} = a + (n-1)b = 2 + (10-1) \times 3 = 2 + 27 = 29$",
      options: [
        { content: "26", isCorrect: false },
        { content: "27", isCorrect: false },
        { content: "28", isCorrect: false },
        { content: "29", isCorrect: true },
      ]
    },
    {
      content: "Beda dari barisan 7, 12, 17, 22, ... adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN ARITMETIKA",
      difficulty: "EASY",
      solution: "Beda $b = U_2 - U_1 = 12 - 7 = 5$",
      options: [
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: true },
        { content: "6", isCorrect: false },
      ]
    },
    {
      content: "Suku ke-15 dari barisan 4, 7, 10, 13, ... adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN ARITMETIKA",
      difficulty: "MEDIUM",
      solution: "$a = 4$, $b = 3$. $U_{15} = 4 + (15-1) \times 3 = 4 + 42 = 46$",
      options: [
        { content: "43", isCorrect: false },
        { content: "44", isCorrect: false },
        { content: "45", isCorrect: false },
        { content: "46", isCorrect: true },
      ]
    },
    {
      content: "Rumus suku ke-n barisan aritmetika adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN ARITMETIKA",
      difficulty: "EASY",
      solution: "Rumus suku ke-n barisan aritmetika: $U_n = a + (n-1)b$, dengan $a$ = suku pertama dan $b$ = beda.",
      options: [
        { content: "$U_n = a \cdot r^{n-1}$", isCorrect: false },
        { content: "$U_n = a + (n-1)b$", isCorrect: true },
        { content: "$U_n = a + nb$", isCorrect: false },
        { content: "$U_n = n \cdot b$", isCorrect: false },
      ]
    },
    {
      content: "Suku ke-8 dari barisan 10, 15, 20, 25, ... adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN ARITMETIKA",
      difficulty: "EASY",
      solution: "$a = 10$, $b = 5$. $U_8 = 10 + (8-1) \times 5 = 10 + 35 = 45$",
      options: [
        { content: "40", isCorrect: false },
        { content: "45", isCorrect: true },
        { content: "50", isCorrect: false },
        { content: "55", isCorrect: false },
      ]
    },
    // B. Deret Aritmetika
    {
      content: "Jumlah 10 suku pertama dari deret $2 + 5 + 8 + ...$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET ARITMETIKA",
      difficulty: "MEDIUM",
      solution: "$a = 2$, $b = 3$, $n = 10$. $S_{10} = \\frac{10}{2}(2 \times 2 + (10-1) \times 3) = 5(4 + 27) = 5 \times 31 = 155$",
      options: [
        { content: "145", isCorrect: false },
        { content: "155", isCorrect: true },
        { content: "165", isCorrect: false },
        { content: "175", isCorrect: false },
      ]
    },
    {
      content: "Rumus jumlah n suku pertama deret aritmetika adalah ....",
      grade: "CLASS_11",
      subject: "DERET ARITMETIKA",
      difficulty: "EASY",
      solution: "Rumus jumlah n suku pertama deret aritmetika: $S_n = \\frac{n}{2}(2a + (n-1)b)$",
      options: [
        { content: "$S_n = \\frac{n}{2}(a + U_n)$", isCorrect: false },
        { content: "$S_n = \\frac{n}{2}(2a + (n-1)b)$", isCorrect: true },
        { content: "$S_n = n \cdot a$", isCorrect: false },
        { content: "$S_n = a + (n-1)b$", isCorrect: false },
      ]
    },
    {
      content: "Jumlah 5 suku pertama deret $4 + 7 + 10 + ...$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET ARITMETIKA",
      difficulty: "MEDIUM",
      solution: "$a = 4$, $b = 3$, $n = 5$. $S_5 = \\frac{5}{2}(2 \times 4 + (5-1) \times 3) = \\frac{5}{2}(8 + 12) = \\frac{5}{2} \times 20 = 50$",
      options: [
        { content: "45", isCorrect: false },
        { content: "50", isCorrect: true },
        { content: "55", isCorrect: false },
        { content: "60", isCorrect: false },
      ]
    },
    {
      content: "Jumlah 20 suku pertama deret $1 + 3 + 5 + ...$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET ARITMETIKA",
      difficulty: "MEDIUM",
      solution: "$a = 1$, $b = 2$, $n = 20$. $S_{20} = \\frac{20}{2}(2 \times 1 + (20-1) \times 2) = 10(2 + 38) = 10 \times 40 = 400$",
      options: [
        { content: "200", isCorrect: false },
        { content: "300", isCorrect: false },
        { content: "400", isCorrect: true },
        { content: "500", isCorrect: false },
      ]
    },
    {
      content: "Jumlah 8 suku pertama deret $3 + 6 + 9 + ...$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET ARITMETIKA",
      difficulty: "MEDIUM",
      solution: "$a = 3$, $b = 3$, $n = 8$. $S_8 = \\frac{8}{2}(2 \times 3 + (8-1) \times 3) = 4(6 + 21) = 4 \times 27 = 108$",
      options: [
        { content: "96", isCorrect: false },
        { content: "108", isCorrect: true },
        { content: "120", isCorrect: false },
        { content: "132", isCorrect: false },
      ]
    },
    // C. Barisan Geometri
    {
      content: "Rasio dari barisan 2, 6, 18, 54, ... adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN GEOMETRI",
      difficulty: "EASY",
      solution: "Rasio $r = \\frac{U_2}{U_1} = \\frac{6}{2} = 3$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: true },
        { content: "4", isCorrect: false },
        { content: "6", isCorrect: false },
      ]
    },
    {
      content: "Suku ke-5 dari barisan 3, 6, 12, 24, ... adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN GEOMETRI",
      difficulty: "EASY",
      solution: "$a = 3$, $r = 2$. $U_5 = 3 \times 2^{5-1} = 3 \times 16 = 48$",
      options: [
        { content: "36", isCorrect: false },
        { content: "42", isCorrect: false },
        { content: "48", isCorrect: true },
        { content: "96", isCorrect: false },
      ]
    },
    {
      content: "Rumus suku ke-n barisan geometri adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN GEOMETRI",
      difficulty: "EASY",
      solution: "Rumus suku ke-n barisan geometri: $U_n = a \cdot r^{n-1}$",
      options: [
        { content: "$U_n = a + (n-1)r$", isCorrect: false },
        { content: "$U_n = a \cdot r^{n-1}$", isCorrect: true },
        { content: "$U_n = a \cdot r^n$", isCorrect: false },
        { content: "$U_n = n \cdot r$", isCorrect: false },
      ]
    },
    {
      content: "Suku ke-6 dari barisan 2, 4, 8, 16, ... adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN GEOMETRI",
      difficulty: "EASY",
      solution: "$a = 2$, $r = 2$. $U_6 = 2 \times 2^{6-1} = 2 \times 32 = 64$",
      options: [
        { content: "32", isCorrect: false },
        { content: "64", isCorrect: true },
        { content: "128", isCorrect: false },
        { content: "256", isCorrect: false },
      ]
    },
    {
      content: "Rasio dari barisan 81, 27, 9, 3, ... adalah ....",
      grade: "CLASS_11",
      subject: "BARISAN GEOMETRI",
      difficulty: "EASY",
      solution: "Rasio $r = \\frac{27}{81} = \\frac{1}{3}$",
      options: [
        { content: "$\\frac{1}{2}$", isCorrect: false },
        { content: "$\\frac{1}{3}$", isCorrect: true },
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: false },
      ]
    },
    // D. Deret Geometri
    {
      content: "Jumlah 4 suku pertama deret $2 + 4 + 8 + 16$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET GEOMETRI",
      difficulty: "EASY",
      solution: "$S_4 = 2 + 4 + 8 + 16 = 30$",
      options: [
        { content: "28", isCorrect: false },
        { content: "30", isCorrect: true },
        { content: "32", isCorrect: false },
        { content: "34", isCorrect: false },
      ]
    },
    {
      content: "Jumlah 5 suku pertama deret geometri $1 + 2 + 4 + ...$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET GEOMETRI",
      difficulty: "MEDIUM",
      solution: "$a = 1$, $r = 2$, $n = 5$. $S_5 = \\frac{1(2^5 - 1)}{2 - 1} = \\frac{32 - 1}{1} = 31$",
      options: [
        { content: "31", isCorrect: true },
        { content: "32", isCorrect: false },
        { content: "33", isCorrect: false },
        { content: "34", isCorrect: false },
      ]
    },
    {
      content: "Rumus jumlah n suku pertama deret geometri adalah ....",
      grade: "CLASS_11",
      subject: "DERET GEOMETRI",
      difficulty: "EASY",
      solution: "Rumus jumlah n suku pertama deret geometri: $S_n = \\frac{a(r^n - 1)}{r - 1}$ untuk $r \neq 1$",
      options: [
        { content: "$S_n = \\frac{n}{2}(2a + (n-1)b)$", isCorrect: false },
        { content: "$S_n = \\frac{a(r^n - 1)}{r - 1}$", isCorrect: true },
        { content: "$S_n = a \cdot r^n$", isCorrect: false },
        { content: "$S_n = n \cdot a \cdot r$", isCorrect: false },
      ]
    },
    {
      content: "Jumlah deret $3 + 6 + 12 + 24$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET GEOMETRI",
      difficulty: "EASY",
      solution: "$S = 3 + 6 + 12 + 24 = 45$",
      options: [
        { content: "42", isCorrect: false },
        { content: "45", isCorrect: true },
        { content: "48", isCorrect: false },
        { content: "51", isCorrect: false },
      ]
    },
    {
      content: "Jumlah deret geometri $5 + 10 + 20$ adalah ....",
      grade: "CLASS_11",
      subject: "DERET GEOMETRI",
      difficulty: "EASY",
      solution: "$S = 5 + 10 + 20 = 35$",
      options: [
        { content: "30", isCorrect: false },
        { content: "35", isCorrect: true },
        { content: "40", isCorrect: false },
        { content: "45", isCorrect: false },
      ]
    },
    // E. Bunga Tunggal
    {
      content: "Modal Rp1.000.000 dibungakan 10% per tahun selama 2 tahun. Besar bunganya adalah ....",
      grade: "CLASS_11",
      subject: "BUNGA TUNGGAL",
      difficulty: "EASY",
      solution: "Bunga = Modal x suku bunga x waktu = 1.000.000 x 10% x 2 = Rp200.000",
      options: [
        { content: "Rp100.000", isCorrect: false },
        { content: "Rp150.000", isCorrect: false },
        { content: "Rp200.000", isCorrect: true },
        { content: "Rp250.000", isCorrect: false },
      ]
    },
    {
      content: "Rumus bunga tunggal adalah ....",
      grade: "CLASS_11",
      subject: "BUNGA TUNGGAL",
      difficulty: "EASY",
      solution: "Rumus bunga tunggal: $B = M \times i \times t$, di mana $M$ = modal, $i$ = suku bunga, $t$ = waktu.",
      options: [
        { content: "$B = M + i + t$", isCorrect: false },
        { content: "$B = M \times i \times t$", isCorrect: true },
        { content: "$B = M \times (1+i)^t$", isCorrect: false },
        { content: "$B = M / (i \times t)$", isCorrect: false },
      ]
    },
    {
      content: "Modal Rp2.000.000 dengan bunga 5% selama 1 tahun menghasilkan bunga ....",
      grade: "CLASS_11",
      subject: "BUNGA TUNGGAL",
      difficulty: "EASY",
      solution: "Bunga = 2.000.000 x 5% x 1 = Rp100.000",
      options: [
        { content: "Rp50.000", isCorrect: false },
        { content: "Rp100.000", isCorrect: true },
        { content: "Rp150.000", isCorrect: false },
        { content: "Rp200.000", isCorrect: false },
      ]
    },
    {
      content: "Nilai akhir Rp500.000 dengan bunga 10% selama 1 tahun adalah ....",
      grade: "CLASS_11",
      subject: "BUNGA TUNGGAL",
      difficulty: "EASY",
      solution: "Nilai akhir = Modal + Bunga = 500.000 + (500.000 x 10% x 1) = 500.000 + 50.000 = Rp550.000",
      options: [
        { content: "Rp525.000", isCorrect: false },
        { content: "Rp550.000", isCorrect: true },
        { content: "Rp575.000", isCorrect: false },
        { content: "Rp600.000", isCorrect: false },
      ]
    },
    {
      content: "Modal Rp4.000.000 dengan bunga 8% selama 2 tahun menghasilkan bunga ....",
      grade: "CLASS_11",
      subject: "BUNGA TUNGGAL",
      difficulty: "MEDIUM",
      solution: "Bunga = 4.000.000 x 8% x 2 = Rp640.000",
      options: [
        { content: "Rp480.000", isCorrect: false },
        { content: "Rp560.000", isCorrect: false },
        { content: "Rp640.000", isCorrect: true },
        { content: "Rp720.000", isCorrect: false },
      ]
    },
    // F. Bunga Majemuk
    {
      content: "Nilai akhir investasi Rp1.000.000 dengan bunga majemuk 10% selama 1 tahun adalah ....",
      grade: "CLASS_11",
      subject: "BUNGA MAJEMUK",
      difficulty: "EASY",
      solution: "Nilai akhir = $M(1+i)^t = 1.000.000 \times (1+0.1)^1 = 1.000.000 \times 1.1 = $ Rp1.100.000",
      options: [
        { content: "Rp1.000.000", isCorrect: false },
        { content: "Rp1.050.000", isCorrect: false },
        { content: "Rp1.100.000", isCorrect: true },
        { content: "Rp1.200.000", isCorrect: false },
      ]
    },
    {
      content: "Rumus nilai akhir bunga majemuk adalah ....",
      grade: "CLASS_11",
      subject: "BUNGA MAJEMUK",
      difficulty: "EASY",
      solution: "Rumus nilai akhir bunga majemuk: $M_t = M_0(1+i)^t$",
      options: [
        { content: "$M_t = M_0 + i \times t$", isCorrect: false },
        { content: "$M_t = M_0 \times i \times t$", isCorrect: false },
        { content: "$M_t = M_0(1+i)^t$", isCorrect: true },
        { content: "$M_t = M_0 / (1+i)^t$", isCorrect: false },
      ]
    },
    {
      content: "Investasi Rp2.000.000 dengan bunga majemuk 10% selama 2 tahun menghasilkan nilai akhir ....",
      grade: "CLASS_11",
      subject: "BUNGA MAJEMUK",
      difficulty: "MEDIUM",
      solution: "Nilai akhir = $2.000.000 \times (1.1)^2 = 2.000.000 \times 1.21 = $ Rp2.420.000",
      options: [
        { content: "Rp2.200.000", isCorrect: false },
        { content: "Rp2.420.000", isCorrect: true },
        { content: "Rp2.500.000", isCorrect: false },
        { content: "Rp2.600.000", isCorrect: false },
      ]
    },
    {
      content: "Jika bunga majemuk 20%, maka faktor pengalinya adalah ....",
      grade: "CLASS_11",
      subject: "BUNGA MAJEMUK",
      difficulty: "EASY",
      solution: "Faktor pengali = $(1 + i) = 1 + 0.2 = 1.2$",
      options: [
        { content: "0.2", isCorrect: false },
        { content: "1.02", isCorrect: false },
        { content: "1.2", isCorrect: true },
        { content: "2", isCorrect: false },
      ]
    },
    {
      content: "Modal Rp5.000.000 dengan bunga majemuk 10% selama 1 tahun menjadi ....",
      grade: "CLASS_11",
      subject: "BUNGA MAJEMUK",
      difficulty: "EASY",
      solution: "Nilai akhir = $5.000.000 \times (1.1)^1 = $ Rp5.500.000",
      options: [
        { content: "Rp5.100.000", isCorrect: false },
        { content: "Rp5.250.000", isCorrect: false },
        { content: "Rp5.500.000", isCorrect: true },
        { content: "Rp6.000.000", isCorrect: false },
      ]
    },
    // G. Komposisi Fungsi
    {
      content: "Jika $f(x) = 2x + 1$ dan $g(x) = x^2$, maka $(f \circ g)(x)$ adalah ....",
      grade: "CLASS_11",
      subject: "KOMPOSISI FUNGSI",
      difficulty: "MEDIUM",
      solution: "$(f \circ g)(x) = f(g(x)) = f(x^2) = 2x^2 + 1$",
      options: [
        { content: "$2x^2 + 1$", isCorrect: true },
        { content: "$(2x+1)^2$", isCorrect: false },
        { content: "$2x + x^2$", isCorrect: false },
        { content: "$4x^2 + 1$", isCorrect: false },
      ]
    },
    {
      content: "Jika $f(x) = x + 3$ dan $g(x) = 2x$, maka $(g \circ f)(x)$ adalah ....",
      grade: "CLASS_11",
      subject: "KOMPOSISI FUNGSI",
      difficulty: "MEDIUM",
      solution: "$(g \circ f)(x) = g(f(x)) = g(x+3) = 2(x+3) = 2x + 6$",
      options: [
        { content: "$2x + 3$", isCorrect: false },
        { content: "$2x + 6$", isCorrect: true },
        { content: "$x + 6$", isCorrect: false },
        { content: "$2x^2 + 6$", isCorrect: false },
      ]
    },
    {
      content: "Hasil $(f \circ g)(2)$ untuk $f(x) = x + 1$, $g(x) = x^2$ adalah ....",
      grade: "CLASS_11",
      subject: "KOMPOSISI FUNGSI",
      difficulty: "MEDIUM",
      solution: "$(f \circ g)(2) = f(g(2)) = f(4) = 4 + 1 = 5$",
      options: [
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: true },
        { content: "6", isCorrect: false },
      ]
    },
    {
      content: "Nilai $(f \circ g)(1)$ jika $f(x) = 3x$ dan $g(x) = x + 2$ adalah ....",
      grade: "CLASS_11",
      subject: "KOMPOSISI FUNGSI",
      difficulty: "MEDIUM",
      solution: "$(f \circ g)(1) = f(g(1)) = f(1+2) = f(3) = 3 \times 3 = 9$",
      options: [
        { content: "3", isCorrect: false },
        { content: "6", isCorrect: false },
        { content: "9", isCorrect: true },
        { content: "12", isCorrect: false },
      ]
    },
    {
      content: "Operasi komposisi fungsi dilambangkan dengan ....",
      grade: "CLASS_11",
      subject: "KOMPOSISI FUNGSI",
      difficulty: "EASY",
      solution: "Operasi komposisi fungsi dilambangkan dengan $\circ$ (lingkaran kecil).",
      options: [
        { content: "+", isCorrect: false },
        { content: "x", isCorrect: false },
        { content: "$\circ$", isCorrect: true },
        { content: "/", isCorrect: false },
      ]
    },
    // H. Invers Fungsi
    {
      content: "Invers dari $f(x) = 2x + 4$ adalah ....",
      grade: "CLASS_11",
      subject: "INVERS FUNGSI",
      difficulty: "MEDIUM",
      solution: "Misalkan $y = 2x + 4$, maka $x = \\frac{y-4}{2}$. Jadi $f^{-1}(x) = \\frac{x-4}{2}$",
      options: [
        { content: "$f^{-1}(x) = \\frac{x-4}{2}$", isCorrect: true },
        { content: "$f^{-1}(x) = \\frac{x+4}{2}$", isCorrect: false },
        { content: "$f^{-1}(x) = 2x - 4$", isCorrect: false },
        { content: "$f^{-1}(x) = \\frac{x}{2} + 4$", isCorrect: false },
      ]
    },
    {
      content: "Invers dari $f(x) = 3x - 6$ adalah ....",
      grade: "CLASS_11",
      subject: "INVERS FUNGSI",
      difficulty: "MEDIUM",
      solution: "Misalkan $y = 3x - 6$, maka $3x = y + 6$, sehingga $x = \\frac{y+6}{3}$. Jadi $f^{-1}(x) = \\frac{x+6}{3}$",
      options: [
        { content: "$f^{-1}(x) = \\frac{x-6}{3}$", isCorrect: false },
        { content: "$f^{-1}(x) = \\frac{x+6}{3}$", isCorrect: true },
        { content: "$f^{-1}(x) = 3x + 6$", isCorrect: false },
        { content: "$f^{-1}(x) = \\frac{x}{3} - 6$", isCorrect: false },
      ]
    },
    {
      content: "Jika $f(x) = x + 5$, maka inversnya adalah ....",
      grade: "CLASS_11",
      subject: "INVERS FUNGSI",
      difficulty: "EASY",
      solution: "Misalkan $y = x + 5$, maka $x = y - 5$. Jadi $f^{-1}(x) = x - 5$",
      options: [
        { content: "$f^{-1}(x) = x + 5$", isCorrect: false },
        { content: "$f^{-1}(x) = x - 5$", isCorrect: true },
        { content: "$f^{-1}(x) = 5 - x$", isCorrect: false },
        { content: "$f^{-1}(x) = -x - 5$", isCorrect: false },
      ]
    },
    {
      content: "Nilai $f^{-1}(8)$ jika $f(x) = x - 3$ adalah ....",
      grade: "CLASS_11",
      subject: "INVERS FUNGSI",
      difficulty: "MEDIUM",
      solution: "$f^{-1}(x) = x + 3$. Maka $f^{-1}(8) = 8 + 3 = 11$",
      options: [
        { content: "3", isCorrect: false },
        { content: "5", isCorrect: false },
        { content: "8", isCorrect: false },
        { content: "11", isCorrect: true },
      ]
    },
    {
      content: "Fungsi $f$ dan inversnya $f^{-1}$ memenuhi ....",
      grade: "CLASS_11",
      subject: "INVERS FUNGSI",
      difficulty: "EASY",
      solution: "Fungsi dan inversnya memenuhi $(f \circ f^{-1})(x) = x$ (fungsi identitas).",
      options: [
        { content: "$(f \circ f^{-1})(x) = 0$", isCorrect: false },
        { content: "$(f \circ f^{-1})(x) = x$", isCorrect: true },
        { content: "$(f \circ f^{-1})(x) = 1$", isCorrect: false },
        { content: "$(f \circ f^{-1})(x) = f(x)$", isCorrect: false },
      ]
    },
    // I. Matriks
    {
      content: "Banyak baris dan kolom matriks $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\\\ 5 & 6 \\end{pmatrix}$ adalah ....",
      grade: "CLASS_11",
      subject: "MATRIKS",
      difficulty: "EASY",
      solution: "Matriks tersebut memiliki 3 baris dan 2 kolom, sehingga ordonya adalah $3 \times 2$.",
      options: [
        { content: "$2 \times 2$", isCorrect: false },
        { content: "$2 \times 3$", isCorrect: false },
        { content: "$3 \times 2$", isCorrect: true },
        { content: "$3 \times 3$", isCorrect: false },
      ]
    },
    {
      content: "Ordo matriks $\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}$ adalah ....",
      grade: "CLASS_11",
      subject: "MATRIKS",
      difficulty: "EASY",
      solution: "Matriks tersebut memiliki 2 baris dan 3 kolom, sehingga ordonya adalah $2 \times 3$.",
      options: [
        { content: "$2 \times 2$", isCorrect: false },
        { content: "$2 \times 3$", isCorrect: true },
        { content: "$3 \times 2$", isCorrect: false },
        { content: "$3 \times 3$", isCorrect: false },
      ]
    },
    {
      content: "Jika $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, maka elemen $a_{12}$ adalah ....",
      grade: "CLASS_11",
      subject: "MATRIKS",
      difficulty: "EASY",
      solution: "Elemen $a_{12}$ adalah elemen pada baris ke-1 dan kolom ke-2, yaitu 2.",
      options: [
        { content: "1", isCorrect: false },
        { content: "2", isCorrect: true },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: false },
      ]
    },
    {
      content: "Hasil penjumlahan $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} + \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$ adalah ....",
      grade: "CLASS_11",
      subject: "MATRIKS",
      difficulty: "EASY",
      solution: "Penjumlahan matriks dilakukan elemen per elemen: $\\begin{pmatrix} 1+5 & 2+6 \\\\ 3+7 & 4+8 \\end{pmatrix} = \\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}$",
      options: [
        { content: "$\\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}$", isCorrect: true },
        { content: "$\\begin{pmatrix} 5 & 12 \\\\ 21 & 32 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} 6 & 8 \\\\ 10 & 11 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} 7 & 8 \\\\ 10 & 12 \\end{pmatrix}$", isCorrect: false },
      ]
    },
    {
      content: "Determinan matriks $\\begin{pmatrix} 3 & 2 \\\\ 1 & 3 \\end{pmatrix}$ adalah ....",
      grade: "CLASS_11",
      subject: "MATRIKS",
      difficulty: "MEDIUM",
      solution: "$\\det(A) = (3)(3) - (2)(1) = 9 - 2 = 7$",
      options: [
        { content: "5", isCorrect: false },
        { content: "7", isCorrect: true },
        { content: "11", isCorrect: false },
        { content: "9", isCorrect: false },
      ]
    },
    // J. Lingkaran dan Statistika Bivariat
    {
      content: "Diameter lingkaran dengan jari-jari 7 cm adalah ....",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "EASY",
      solution: "Diameter = 2 x jari-jari = 2 x 7 = 14 cm",
      options: [
        { content: "7 cm", isCorrect: false },
        { content: "14 cm", isCorrect: true },
        { content: "21 cm", isCorrect: false },
        { content: "28 cm", isCorrect: false },
      ]
    },
    {
      content: "Panjang busur dengan sudut pusat 90° pada lingkaran berjari-jari 14 cm adalah ....",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Panjang busur = $\\frac{90}{360} \times 2\pi r = \\frac{1}{4} \times 2\pi \times 14 = 7\pi$ cm",
      options: [
        { content: "$7\pi$ cm", isCorrect: true },
        { content: "$14\pi$ cm", isCorrect: false },
        { content: "$21\pi$ cm", isCorrect: false },
        { content: "$28\pi$ cm", isCorrect: false },
      ]
    },
    {
      content: "Luas juring 90° pada lingkaran berjari-jari 14 cm adalah ....",
      grade: "CLASS_11",
      subject: "LINGKARAN",
      difficulty: "MEDIUM",
      solution: "Luas juring = $\\frac{90}{360} \times \pi r^2 = \\frac{1}{4} \times \pi \times 196 = 49\pi$ cm²",
      options: [
        { content: "$49\pi$ cm²", isCorrect: true },
        { content: "$98\pi$ cm²", isCorrect: false },
        { content: "$147\pi$ cm²", isCorrect: false },
        { content: "$196\pi$ cm²", isCorrect: false },
      ]
    },
    {
      content: "Diagram yang digunakan untuk melihat hubungan dua variabel adalah ....",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "EASY",
      solution: "Diagram pencar (scatter plot) digunakan untuk melihat hubungan atau korelasi antara dua variabel.",
      options: [
        { content: "Histogram", isCorrect: false },
        { content: "Diagram batang", isCorrect: false },
        { content: "Diagram pencar", isCorrect: true },
        { content: "Diagram lingkaran", isCorrect: false },
      ]
    },
    {
      content: "Jika semakin besar nilai X diikuti semakin besar nilai Y, maka korelasinya ....",
      grade: "CLASS_11",
      subject: "STATISTIKA BIVARIAT",
      difficulty: "EASY",
      solution: "Jika X naik dan Y juga naik, maka hubungannya adalah korelasi positif.",
      options: [
        { content: "Negatif", isCorrect: false },
        { content: "Positif", isCorrect: true },
        { content: "Nol", isCorrect: false },
        { content: "Tidak tentu", isCorrect: false },
      ]
    },
    // ===== KELAS 12 =====
    // A. Transformasi Fungsi
    {
      content: "Grafik fungsi $y = f(x) + 4$ merupakan hasil transformasi berupa ....",
      grade: "CLASS_12",
      subject: "TRANSFORMASI FUNGSI",
      difficulty: "EASY",
      solution: "$y = f(x) + 4$ berarti setiap nilai $y$ ditambah 4, sehingga grafik bergeser 4 satuan ke atas.",
      options: [
        { content: "Translasi 4 satuan ke kiri", isCorrect: false },
        { content: "Translasi 4 satuan ke kanan", isCorrect: false },
        { content: "Translasi 4 satuan ke atas", isCorrect: true },
        { content: "Refleksi terhadap sumbu-X", isCorrect: false },
      ]
    },
    {
      content: "Grafik fungsi $y = f(x - 3)$ merupakan hasil translasi ....",
      grade: "CLASS_12",
      subject: "TRANSFORMASI FUNGSI",
      difficulty: "EASY",
      solution: "$y = f(x - 3)$ berarti grafik bergeser 3 satuan ke kanan.",
      options: [
        { content: "3 satuan ke kiri", isCorrect: false },
        { content: "3 satuan ke kanan", isCorrect: true },
        { content: "3 satuan ke atas", isCorrect: false },
        { content: "3 satuan ke bawah", isCorrect: false },
      ]
    },
    {
      content: "Fungsi $y = -f(x)$ merupakan hasil ....",
      grade: "CLASS_12",
      subject: "TRANSFORMASI FUNGSI",
      difficulty: "EASY",
      solution: "$y = -f(x)$ berarti setiap nilai $y$ dinegasikan, sehingga grafik dicerminkan terhadap sumbu-X.",
      options: [
        { content: "Refleksi terhadap sumbu-X", isCorrect: true },
        { content: "Refleksi terhadap sumbu-Y", isCorrect: false },
        { content: "Translasi horizontal", isCorrect: false },
        { content: "Dilatasi", isCorrect: false },
      ]
    },
    {
      content: "Grafik $y = f(-x)$ merupakan hasil ....",
      grade: "CLASS_12",
      subject: "TRANSFORMASI FUNGSI",
      difficulty: "EASY",
      solution: "$y = f(-x)$ berarti setiap nilai $x$ dinegasikan, sehingga grafik dicerminkan terhadap sumbu-Y.",
      options: [
        { content: "Refleksi terhadap sumbu-X", isCorrect: false },
        { content: "Refleksi terhadap sumbu-Y", isCorrect: true },
        { content: "Dilatasi", isCorrect: false },
        { content: "Translasi", isCorrect: false },
      ]
    },
    {
      content: "Fungsi $y = 3f(x)$ menunjukkan ....",
      grade: "CLASS_12",
      subject: "TRANSFORMASI FUNGSI",
      difficulty: "MEDIUM",
      solution: "$y = 3f(x)$ berarti setiap nilai $y$ dikalikan 3, sehingga terjadi dilatasi vertikal dengan faktor 3.",
      options: [
        { content: "Translasi vertikal", isCorrect: false },
        { content: "Refleksi", isCorrect: false },
        { content: "Dilatasi vertikal faktor 3", isCorrect: true },
        { content: "Rotasi", isCorrect: false },
      ]
    },
    // B. Limit Fungsi
    {
      content: "Nilai dari $\\lim_{x \\to 2} (x^2 + x + 1)$ adalah ....",
      grade: "CLASS_12",
      subject: "LIMIT FUNGSI",
      difficulty: "EASY",
      solution: "Substitusi langsung: $\\lim_{x \\to 2} (x^2 + x + 1) = 4 + 2 + 1 = 7$",
      options: [
        { content: "5", isCorrect: false },
        { content: "6", isCorrect: false },
        { content: "7", isCorrect: true },
        { content: "8", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $\\lim_{x \\to 1} (x^2 + 2x + 2)$ adalah ....",
      grade: "CLASS_12",
      subject: "LIMIT FUNGSI",
      difficulty: "EASY",
      solution: "Substitusi langsung: $\\lim_{x \\to 1} (x^2 + 2x + 2) = 1 + 2 + 2 = 5$",
      options: [
        { content: "4", isCorrect: false },
        { content: "5", isCorrect: true },
        { content: "6", isCorrect: false },
        { content: "7", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $\\lim_{x \\to 3} (x + 1)$ adalah ....",
      grade: "CLASS_12",
      subject: "LIMIT FUNGSI",
      difficulty: "EASY",
      solution: "Substitusi langsung: $\\lim_{x \\to 3} (x + 1) = 3 + 1 = 4$",
      options: [
        { content: "2", isCorrect: false },
        { content: "3", isCorrect: false },
        { content: "4", isCorrect: true },
        { content: "5", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $\\lim_{x \\to 2} (3x^2 - x)$ adalah ....",
      grade: "CLASS_12",
      subject: "LIMIT FUNGSI",
      difficulty: "MEDIUM",
      solution: "Substitusi langsung: $\\lim_{x \\to 2} (3x^2 - x) = 3(4) - 2 = 12 - 2 = 10$. Pilihan terdekat adalah 11.",
      options: [
        { content: "11", isCorrect: false },
        { content: "10", isCorrect: true },
        { content: "13", isCorrect: false },
        { content: "14", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $\\lim_{x \\to 3} (x^2 + 2)$ adalah ....",
      grade: "CLASS_12",
      subject: "LIMIT FUNGSI",
      difficulty: "EASY",
      solution: "Substitusi langsung: $\\lim_{x \\to 3} (x^2 + 2) = 9 + 2 = 11$",
      options: [
        { content: "11", isCorrect: true },
        { content: "12", isCorrect: false },
        { content: "13", isCorrect: false },
        { content: "14", isCorrect: false },
      ]
    },
    // C. Turunan
    {
      content: "Jika $f(x) = x^3 + 2x^2 - 5x + 1$, maka turunan pertama fungsi tersebut adalah ....",
      grade: "CLASS_12",
      subject: "TURUNAN",
      difficulty: "MEDIUM",
      solution: "$f'(x) = 3x^2 + 4x - 5$",
      options: [
        { content: "$3x^2 + 4x - 5$", isCorrect: true },
        { content: "$3x^2 + 2x - 5$", isCorrect: false },
        { content: "$x^2 + 4x - 5$", isCorrect: false },
        { content: "$3x^2 - 4x + 5$", isCorrect: false },
      ]
    },
    {
      content: "Jika $f(x) = 4x^2 - 3x + 7$, maka turunan pertamanya adalah ....",
      grade: "CLASS_12",
      subject: "TURUNAN",
      difficulty: "MEDIUM",
      solution: "$f'(x) = 8x - 3$",
      options: [
        { content: "$8x + 3$", isCorrect: false },
        { content: "$8x - 3$", isCorrect: true },
        { content: "$4x - 3$", isCorrect: false },
        { content: "$8x - 7$", isCorrect: false },
      ]
    },
    {
      content: "Jika $f(x) = 5x^3$, maka turunan pertamanya adalah ....",
      grade: "CLASS_12",
      subject: "TURUNAN",
      difficulty: "EASY",
      solution: "$f'(x) = 15x^2$",
      options: [
        { content: "$5x^2$", isCorrect: false },
        { content: "$10x^2$", isCorrect: false },
        { content: "$15x^2$", isCorrect: true },
        { content: "$15x^3$", isCorrect: false },
      ]
    },
    {
      content: "Jika $f(x) = 5x + 3$, maka $f'(x)$ adalah ....",
      grade: "CLASS_12",
      subject: "TURUNAN",
      difficulty: "EASY",
      solution: "$f'(x) = 5$ (turunan dari fungsi linear $ax + b$ adalah $a$)",
      options: [
        { content: "0", isCorrect: false },
        { content: "1", isCorrect: false },
        { content: "5", isCorrect: true },
        { content: "8", isCorrect: false },
      ]
    },
    {
      content: "Jika $f(x) = 10$ (konstanta), maka turunannya adalah ....",
      grade: "CLASS_12",
      subject: "TURUNAN",
      difficulty: "EASY",
      solution: "Turunan dari konstanta adalah 0. Jadi $f'(x) = 0$.",
      options: [
        { content: "0", isCorrect: true },
        { content: "1", isCorrect: false },
        { content: "10", isCorrect: false },
        { content: "Tidak terdefinisi", isCorrect: false },
      ]
    },
    // D. Integral
    {
      content: "Hasil dari $\\int 3x^2 \\, dx$ adalah ....",
      grade: "CLASS_12",
      subject: "INTEGRAL",
      difficulty: "MEDIUM",
      solution: "$\\int 3x^2 \\, dx = \\frac{3x^3}{3} + C = x^3 + C$",
      options: [
        { content: "$x^3 + C$", isCorrect: true },
        { content: "$6x + C$", isCorrect: false },
        { content: "$3x^3 + C$", isCorrect: false },
        { content: "$x^2 + C$", isCorrect: false },
      ]
    },
    {
      content: "Hasil dari $\\int (2x + 3) \\, dx$ adalah ....",
      grade: "CLASS_12",
      subject: "INTEGRAL",
      difficulty: "MEDIUM",
      solution: "$\\int (2x + 3) \\, dx = x^2 + 3x + C$",
      options: [
        { content: "$x^2 + 3x + C$", isCorrect: true },
        { content: "$2x^2 + 3x + C$", isCorrect: false },
        { content: "$x^2 + 3 + C$", isCorrect: false },
        { content: "$2x + C$", isCorrect: false },
      ]
    },
    {
      content: "Hasil dari $\\int 4x^3 \\, dx$ adalah ....",
      grade: "CLASS_12",
      subject: "INTEGRAL",
      difficulty: "MEDIUM",
      solution: "$\\int 4x^3 \\, dx = \\frac{4x^4}{4} + C = x^4 + C$",
      options: [
        { content: "$x^4 + C$", isCorrect: true },
        { content: "$4x^4 + C$", isCorrect: false },
        { content: "$12x^2 + C$", isCorrect: false },
        { content: "$x^3 + C$", isCorrect: false },
      ]
    },
    {
      content: "Hasil dari $\\int 5 \\, dx$ adalah ....",
      grade: "CLASS_12",
      subject: "INTEGRAL",
      difficulty: "EASY",
      solution: "$\\int 5 \\, dx = 5x + C$",
      options: [
        { content: "$5 + C$", isCorrect: false },
        { content: "$5x + C$", isCorrect: true },
        { content: "$5x^2 + C$", isCorrect: false },
        { content: "$x + C$", isCorrect: false },
      ]
    },
    {
      content: "Integral merupakan operasi kebalikan dari ....",
      grade: "CLASS_12",
      subject: "INTEGRAL",
      difficulty: "EASY",
      solution: "Integral (anti-turunan) merupakan operasi kebalikan dari turunan (diferensiasi).",
      options: [
        { content: "Limit", isCorrect: false },
        { content: "Matriks", isCorrect: false },
        { content: "Turunan", isCorrect: true },
        { content: "Peluang", isCorrect: false },
      ]
    },
    // E. Peluang
    {
      content: "Banyak cara menyusun 3 huruf berbeda dari huruf A, B, C adalah ....",
      grade: "CLASS_12",
      subject: "PELUANG",
      difficulty: "MEDIUM",
      solution: "Permutasi 3 dari 3: $P(3,3) = 3! = 3 \times 2 \times 1 = 6$",
      options: [
        { content: "3", isCorrect: false },
        { content: "6", isCorrect: true },
        { content: "9", isCorrect: false },
        { content: "12", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $C(6, 2)$ adalah ....",
      grade: "CLASS_12",
      subject: "PELUANG",
      difficulty: "MEDIUM",
      solution: "$C(6,2) = \\frac{6!}{2! \times 4!} = \\frac{6 \times 5}{2 \times 1} = 15$",
      options: [
        { content: "10", isCorrect: false },
        { content: "15", isCorrect: true },
        { content: "20", isCorrect: false },
        { content: "25", isCorrect: false },
      ]
    },
    {
      content: "Nilai dari $P(5, 2)$ adalah ....",
      grade: "CLASS_12",
      subject: "PELUANG",
      difficulty: "MEDIUM",
      solution: "$P(5,2) = \\frac{5!}{(5-2)!} = \\frac{5!}{3!} = 5 \times 4 = 20$",
      options: [
        { content: "10", isCorrect: false },
        { content: "12", isCorrect: false },
        { content: "15", isCorrect: false },
        { content: "20", isCorrect: true },
      ]
    },
    {
      content: "Sebuah dadu dilempar satu kali. Peluang muncul mata dadu genap adalah ....",
      grade: "CLASS_12",
      subject: "PELUANG",
      difficulty: "EASY",
      solution: "Mata dadu genap: {2, 4, 6} = 3 kejadian. Total = 6. Peluang = $\\frac{3}{6} = \\frac{1}{2}$",
      options: [
        { content: "$\\frac{1}{6}$", isCorrect: false },
        { content: "$\\frac{1}{3}$", isCorrect: false },
        { content: "$\\frac{1}{2}$", isCorrect: true },
        { content: "$\\frac{2}{3}$", isCorrect: false },
      ]
    },
    {
      content: "Sebuah koin dilempar dua kali. Peluang muncul dua gambar adalah ....",
      grade: "CLASS_12",
      subject: "PELUANG",
      difficulty: "MEDIUM",
      solution: "Ruang sampel: {AA, AG, GA, GG} = 4. Kejadian dua gambar: {GG} = 1. Peluang = $\\frac{1}{4}$",
      options: [
        { content: "$\\frac{1}{4}$", isCorrect: true },
        { content: "$\\frac{1}{2}$", isCorrect: false },
        { content: "$\\frac{3}{4}$", isCorrect: false },
        { content: "1", isCorrect: false },
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
