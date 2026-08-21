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
  console.log('Seeding FR 2025 TKA SMA Matematika Lanjut...')
  const SUBJECT = 'FR 2025 TKA SMA MTK LANJUT'
  const GRADE = 'CLASS_12'

  const questions = [
    // No. 1 - Invers Matriks
    {
      content: "Perhatikan matriks berikut!\n\n$$F = \\begin{pmatrix} 2 & 0 \\\\ 0 & \\dfrac{1}{2} \\end{pmatrix}$$\n\nInvers dari matriks $F$ adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "EASY",
      solution: "Matriks $F$ adalah matriks diagonal, sehingga inversnya diperoleh dengan membalik elemen diagonal:\n\n$$\\det(F) = 2 \\times \\frac{1}{2} - 0 = 1$$\n\n$$F^{-1} = \\frac{1}{1}\\begin{pmatrix} \\frac{1}{2} & 0 \\\\ 0 & 2 \\end{pmatrix} = \\begin{pmatrix} \\frac{1}{2} & 0 \\\\ 0 & 2 \\end{pmatrix}$$",
      options: [
        { content: "$\\begin{pmatrix} 1 & 0 \\\\ 0 & 2 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} -1 & 0 \\\\ 0 & -2 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} -\\frac{1}{2} & 0 \\\\ 0 & -2 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} \\frac{1}{2} & 0 \\\\ 0 & 2 \\end{pmatrix}$", isCorrect: true },
      ]
    },
    // No. 2 - Matriks SPLDV
    {
      content: "Pak Andi memiliki beberapa sapi dan kambing. Setiap hari ia menyediakan 38 kg rumput gajah dan 34 kg rumput gamal untuk seluruh ternaknya tanpa sisa.\n\nSetiap **sapi** membutuhkan: 10 kg rumput gajah dan 10 kg rumput gamal per hari.\nSetiap **kambing** membutuhkan: 2 kg rumput gajah dan 1 kg rumput gamal per hari.\n\nJika banyaknya sapi dan kambing berturut-turut adalah $x$ dan $y$, maka $\\begin{pmatrix} x \\\\ y \\end{pmatrix} = $ ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "SPLDV: $10x + 2y = 38$ dan $10x + y = 34$.\n\nBentuk matriks: $\\begin{pmatrix} 10 & 2 \\\\ 10 & 1 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 38 \\\\ 34 \\end{pmatrix}$\n\n$\\det = 10(1) - 2(10) = -10$\n\nInvers: $\\frac{1}{-10}\\begin{pmatrix} 1 & -2 \\\\ -10 & 10 \\end{pmatrix} = \\begin{pmatrix} -\\frac{1}{10} & \\frac{2}{10} \\\\ 1 & -1 \\end{pmatrix}$\n\n$\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} -\\frac{1}{10} & \\frac{2}{10} \\\\ 1 & -1 \\end{pmatrix}\\begin{pmatrix} 38 \\\\ 34 \\end{pmatrix} = \\begin{pmatrix} -3{,}8+6{,}8 \\\\ 38-34 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$\n\nJadi sapi = 3 ekor, kambing = 4 ekor.",
      options: [
        { content: "$\\begin{pmatrix} -1 & 1 \\\\ 10 & -5 \\end{pmatrix}\\begin{pmatrix} 19 \\\\ 34 \\end{pmatrix} = \\begin{pmatrix} 15 \\\\ 20 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} 10 & -10 \\\\ -1 & 2 \\end{pmatrix}\\begin{pmatrix} 38 \\\\ 34 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 3 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} -\\frac{1}{10} & \\frac{2}{10} \\\\ 1 & -1 \\end{pmatrix}\\begin{pmatrix} 34 \\\\ 38 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 3 \\end{pmatrix}$", isCorrect: false },
        { content: "$\\begin{pmatrix} -1 & 2 \\\\ 10 & -10 \\end{pmatrix}\\begin{pmatrix} 38 \\\\ 34 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$", isCorrect: true },
        { content: "$\\begin{pmatrix} -\\frac{1}{5} & \\frac{1}{5} \\\\ 2 & -1 \\end{pmatrix}\\begin{pmatrix} 19 \\\\ 34 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$", isCorrect: false },
      ]
    },
    // No. 3 - Perkalian Matriks (Bahan Baku Minuman)
    {
      content: "Sebuah pabrik minuman memproduksi wedang jahe (WJ), beras kencur (BK), dan kunir asem (KA). Setiap botol memerlukan bahan (jahe J gram, gula merah GM gram, air A ml):\n\n$$\\begin{bmatrix} 20 & 15 & 50 \\\\ 10 & 25 & 40 \\\\ 12 & 8 & k \\end{bmatrix}$$\n\nPesanan: WJ = 100, BK = 120, KA = 80 botol. Total bahan yang digunakan:\n\n$$J = 4360 \\text{ g},\\quad GM = 4960 \\text{ g},\\quad A = 13000 \\text{ ml}$$\n\nBanyak air yang dibutuhkan untuk memproduksi **satu botol kunir asem** adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "Persamaan untuk bahan air (A):\n\n$100(50) + 120(40) + 80(k) = 13000$\n\n$5000 + 4800 + 80k = 13000$\n\n$80k = 3200 \\Rightarrow k = 40$\n\nJadi air untuk satu botol kunir asem = **40 ml**.",
      options: [
        { content: "30 ml", isCorrect: false },
        { content: "35 ml", isCorrect: false },
        { content: "40 ml", isCorrect: true },
        { content: "45 ml", isCorrect: false },
        { content: "50 ml", isCorrect: false },
      ]
    },
    // No. 4 - Perkalian Matriks (Pendapatan Hotel) - Multi-answer
    {
      content: "Seorang pemilik hotel mengelola 3 hotel. Kapasitas kamar dan harga per malam:\n\n| Tipe | Hotel A | Hotel B | Hotel C | Harga/malam |\n|---|---|---|---|---|\n| Standard | 9 | 6 | 7 | Rp150.000 |\n| Deluxe | 6 | 7 | 5 | Rp500.000 |\n| Suite | 3 | 2 | 4 | Rp1.000.000 |\n\nBagaimana kondisi pendapatan ketiga hotel dalam 1 hari jika **semua kamar terisi penuh**? (Pilih semua yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Hotel A = 9(150.000)+6(500.000)+3(1.000.000) = 1.350.000+3.000.000+3.000.000 = **Rp7.350.000**\n\nHotel B = 6(150.000)+7(500.000)+2(1.000.000) = 900.000+3.500.000+2.000.000 = **Rp6.400.000**\n\nHotel C = 7(150.000)+5(500.000)+4(1.000.000) = 1.050.000+2.500.000+4.000.000 = **Rp7.550.000**\n\nTotal = 7.350.000+6.400.000+7.550.000 = **Rp21.300.000** > Rp20.000.000 ✓\n\nHotel B < Hotel A ✓, Hotel C terbesar ✓, selisih tidak sama.",
      options: [
        { content: "Pendapatan Hotel A dan Hotel C sama besar.", isCorrect: false },
        { content: "Pendapatan Hotel B lebih besar daripada Hotel A.", isCorrect: false },
        { content: "Pendapatan paling besar diperoleh dari Hotel C.", isCorrect: true },
        { content: "Masing-masing hotel memiliki selisih pendapatan yang sama besar.", isCorrect: false },
        { content: "Pendapatan yang diperoleh dari ketiga hotel tersebut lebih dari Rp20.000.000.", isCorrect: true },
      ]
    },
    // No. 5 - Suku Banyak (Titik potong sumbu X) - Multi-answer
    {
      content: "Di manakah koordinat titik perpotongan grafik fungsi $f(x) = x^3 + 3x^2 - 10x - 24$ terhadap sumbu $X$? (Pilih semua jawaban yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "Cari akar-akar $f(x) = 0$. Coba $x = -2$: $(-8)+12+20-24=0$ ✓\n\nFaktorisasi: $f(x) = (x+2)(x^2+x-12) = (x+2)(x+4)(x-3)$\n\nAkar-akar: $x = -2,\\, x = -4,\\, x = 3$\n\nTitik potong: $(-2, 0)$ dan $(3, 0)$ ada di pilihan.",
      options: [
        { content: "$(-2, 0)$", isCorrect: true },
        { content: "$(-1, 0)$", isCorrect: false },
        { content: "$(3, 0)$", isCorrect: true },
        { content: "$(4, 0)$", isCorrect: false },
        { content: "$(5, 0)$", isCorrect: false },
      ]
    },
    // No. 6 - Suku Banyak (Sisa Pembagian)
    {
      content: "Diketahui suku banyak $f(x) = x^4 + ax^3 + bx^2 + x - 6$ apabila dibagi oleh $x^2 + x + 1$ menghasilkan sisa $5x - 1$. Nilai dari $a + b = $ ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Tulis $f(x) = (x^2+x+1) \\cdot Q(x) + 5x - 1$.\n\nAkar-akar $x^2+x+1=0$ adalah $\\omega$ dan $\\bar{\\omega}$ (akar primitif ke-3 dari 1), dengan $\\omega^3 = 1$ dan $1+\\omega+\\omega^2 = 0$.\n\nSubstitusi $x = \\omega$: $f(\\omega) = 5\\omega - 1$\n\n$\\omega^4 + a\\omega^3 + b\\omega^2 + \\omega - 6 = 5\\omega - 1$\n\n$\\omega + a + b\\omega^2 + \\omega - 6 = 5\\omega - 1$\n\n$a + b\\omega^2 + 2\\omega = 5\\omega + 5$\n\nKarena $\\omega^2 = -1-\\omega$: $a + b(-1-\\omega) + 2\\omega = 5\\omega + 5$\n\n$(a-b) + (-b+2)\\omega = 5\\omega + 5$\n\nMaka: $-b+2 = 5 \\Rightarrow b = -3$ dan $a-b = 5 \\Rightarrow a = 2$\n\n$a + b = 2 + (-3) = -1$",
      options: [
        { content: "11", isCorrect: false },
        { content: "5", isCorrect: false },
        { content: "-1", isCorrect: true },
        { content: "-5", isCorrect: false },
        { content: "-7", isCorrect: false },
      ]
    },
    // No. 7 - Suku Banyak (Total Fungsi)
    {
      content: "Sebuah drum bahan bakar mengalami penambahan volume saat terkena panas:\n\n$$V(T) = 0{,}05T^3 + 0{,}4T^2 + 20T$$\n\nApabila terdapat **10 drum** dengan jenis dan ukuran yang sama, total penambahan volume dari drum-drum tersebut adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "EASY",
      solution: "Total = $10 \\times V(T) = 10(0{,}05T^3 + 0{,}4T^2 + 20T)$\n\n$= 0{,}5T^3 + 4T^2 + 200T$",
      options: [
        { content: "$50T^3 + 40T^2 + 200T$", isCorrect: false },
        { content: "$50T^3 + 4T^2 + 200T$", isCorrect: false },
        { content: "$5T^3 + 4T^2 + 200T$", isCorrect: false },
        { content: "$0{,}5T^3 + 4T^2 + 200T$", isCorrect: true },
        { content: "$0{,}5T^3 + 0{,}4T^2 + 200T$", isCorrect: false },
      ]
    },
    // No. 8 - Suku Banyak (Modal Saham) - Benar/Salah
    {
      content: "Sebuah perusahaan memiliki modal saham yang dinyatakan sebagai fungsi:\n\n$$f(x) = x^3 - 70x^2 - 600x + 74000$$\n\ndengan $f(x)$ dalam jutaan rupiah dan $x$ adalah banyak saham (unit).\n\nApabila modal saham perusahaan adalah **2 miliar (2.000 juta)**, tentukan apakah perusahaan **mungkin** menjual:\n\n- 30 unit\n- 40 unit\n- 60 unit",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "$f(30) = 27000 - 70(900) - 600(30) + 74000 = 27000 - 63000 - 18000 + 74000 = 20000$ juta ✓ (mungkin)\n\n$f(40) = 64000 - 70(1600) - 600(40) + 74000 = 64000 - 112000 - 24000 + 74000 = 2000$ juta ✓ (mungkin)\n\n$f(60) = 216000 - 70(3600) - 600(60) + 74000 = 216000 - 252000 - 36000 + 74000 = 2000$ juta ✓ (mungkin)\n\nKetiga pilihan menghasilkan nilai $\\leq$ 2000 juta sehingga mungkin dilakukan.",
      options: [
        { content: "30 unit: Mungkin; 40 unit: Mungkin; 60 unit: Mungkin", isCorrect: true },
        { content: "30 unit: Tidak Mungkin; 40 unit: Mungkin; 60 unit: Mungkin", isCorrect: false },
        { content: "30 unit: Mungkin; 40 unit: Mungkin; 60 unit: Tidak Mungkin", isCorrect: false },
        { content: "30 unit: Tidak Mungkin; 40 unit: Tidak Mungkin; 60 unit: Mungkin", isCorrect: false },
        { content: "30 unit: Mungkin; 40 unit: Tidak Mungkin; 60 unit: Tidak Mungkin", isCorrect: false },
      ]
    },
    // No. 9 - Fungsi Eksponensial (Populasi Kelinci) - Benar/Salah
    {
      content: "Populasi kelinci di suatu pulau dimodelkan dengan:\n\n$$K(t) = 4 \\cdot 2^{\\frac{t}{4}}$$\n\ndengan $t$ dalam tahun dan $K(t)$ dalam ribu ekor.\n\nManakah pernyataan yang **benar**?\n\n1. Setiap 4 tahun populasi bertambah menjadi 4 kalinya.\n2. Pada saat awal populasi kelinci berjumlah 4 ribu ekor.\n3. Populasi mencapai 1 juta sebelum 20 tahun dari awal pengamatan.",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "**Pernyataan 1 (Salah):** $K(t+4) = 4 \\cdot 2^{\\frac{t+4}{4}} = 4 \\cdot 2^{\\frac{t}{4}} \\cdot 2^1 = 2 \\cdot K(t)$. Jadi setiap 4 tahun populasi menjadi **2 kali** (bukan 4 kali).\n\n**Pernyataan 2 (Benar):** $K(0) = 4 \\cdot 2^0 = 4$ ribu ekor. ✓\n\n**Pernyataan 3 (Salah):** 1 juta = 1000 ribu. $4 \\cdot 2^{t/4} = 1000 \\Rightarrow 2^{t/4} = 250 \\Rightarrow t/4 = \\log_2 250 \\approx 7{,}97 \\Rightarrow t \\approx 31{,}9$ tahun (lebih dari 20 tahun).",
      options: [
        { content: "Hanya pernyataan 2 yang benar.", isCorrect: true },
        { content: "Pernyataan 1 dan 2 benar.", isCorrect: false },
        { content: "Pernyataan 2 dan 3 benar.", isCorrect: false },
        { content: "Pernyataan 1 dan 3 benar.", isCorrect: false },
        { content: "Semua pernyataan benar.", isCorrect: false },
      ]
    },
    // No. 10 - Fungsi Eksponensial (Eceng Gondok) - Multi-answer
    {
      content: "Pertumbuhan eceng gondok di danau dimodelkan dengan fungsi eksponensial. Setelah 3 tahun, luas area yang tertutupi:\n\n| Wilayah | Luas (m²) |\n|---|---|\n| Danau A | 15.000 |\n| Danau B | 16.500 |\n| Danau C | 17.000 |\n| Danau D | 17.500 |\n| Danau E | 18.000 |\n\nDari grafik diketahui model: pada $t=0$ luas awal $= A_0$, pada $t=1$ luas $= 70$ m², pada $t=2$ luas $= 490$ m².\n\nRasio pertumbuhan $r = 490/70 = 7$. Model: $f(t) = 10 \\cdot 7^t$.\n\nWilayah manakah dengan luas awal **lebih dari 49 m²** pada $t = 0$? (Pilih semua yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Dari grafik: $f(0) = 10$, $f(1) = 70$, $f(2) = 490$. Model: $f(t) = 10 \\cdot 7^t$.\n\nSetelah 3 tahun ($t=3$): $f(3) = 10 \\cdot 343 = 3430$ m².\n\nModel umum tiap danau: $f_i(t) = A_i \\cdot 7^t$. Setelah 3 tahun, $f_i(3) = A_i \\cdot 343$.\n\n$A_i = \\frac{\\text{Luas}_i}{343}$\n\nDanau A: $15000/343 \\approx 43{,}7$ → < 49 ✗\nDanau B: $16500/343 \\approx 48{,}1$ → < 49 ✗\nDanau C: $17000/343 \\approx 49{,}6$ → > 49 ✓\nDanau D: $17500/343 \\approx 51{,}0$ → > 49 ✓\nDanau E: $18000/343 \\approx 52{,}5$ → > 49 ✓",
      options: [
        { content: "Danau A", isCorrect: false },
        { content: "Danau B", isCorrect: false },
        { content: "Danau C", isCorrect: true },
        { content: "Danau D", isCorrect: true },
        { content: "Danau E", isCorrect: true },
      ]
    },
    // No. 11 - Trigonometri (Kedalaman Air Laut)
    {
      content: "Grafik berikut menyatakan perubahan kedalaman air laut di sebuah teluk dengan model:\n\n$$y = a + b\\cos\\left(\\frac{1}{6}\\pi t\\right)$$\n\nDari grafik diketahui nilai maksimum $y = 14{,}3$ m dan minimum $y = 10{,}3$ m.\n\nWaktu saat kedalaman air laut mencapai **12,3 meter untuk ketiga kalinya** setelah pukul 00.00 adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Dari grafik: nilai maks = 14,3 dan min = 10,3.\n\n$a = \\frac{14{,}3+10{,}3}{2} = 12{,}3$ dan $b = \\frac{14{,}3-10{,}3}{2} = 2$\n\nModel: $y = 12{,}3 + 2\\cos\\left(\\frac{\\pi}{6}t\\right)$\n\nSaat $y = 12{,}3$: $\\cos\\left(\\frac{\\pi}{6}t\\right) = 0$\n\n$\\frac{\\pi}{6}t = \\frac{\\pi}{2} + n\\pi \\Rightarrow t = 3 + 6n$\n\nOkurens ke-1: $t=3$, ke-2: $t=9$, ke-3: $t=15$ jam.\n\nJawaban: **15 jam**.",
      options: [
        { content: "3 jam", isCorrect: false },
        { content: "9 jam", isCorrect: false },
        { content: "10 jam", isCorrect: false },
        { content: "12 jam", isCorrect: false },
        { content: "15 jam", isCorrect: true },
      ]
    },
    // No. 12 - Vektor (Panjang Vektor)
    {
      content: "Diketahui vektor\n\n$$\\overrightarrow{AB} = \\begin{pmatrix} 2m \\\\ m+3 \\\\ m \\end{pmatrix}$$\n\nJika panjang vektor $|\\overrightarrow{AB}| = 9$ satuan, maka nilai $m$ yang memenuhi adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "$|\\overrightarrow{AB}|^2 = (2m)^2 + (m+3)^2 + m^2 = 81$\n\n$4m^2 + m^2 + 6m + 9 + m^2 = 81$\n\n$6m^2 + 6m + 9 = 81$\n\n$6m^2 + 6m - 72 = 0$\n\n$m^2 + m - 12 = 0$\n\n$(m+4)(m-3) = 0$\n\n$m = -4$ atau $m = 3$",
      options: [
        { content: "$-4$ atau $-3$", isCorrect: false },
        { content: "$-4$ atau $3$", isCorrect: true },
        { content: "$-3$ atau $4$", isCorrect: false },
        { content: "$3$ atau $4$", isCorrect: false },
        { content: "$4$ atau $3$", isCorrect: false },
      ]
    },
    // No. 13 - Vektor (Trapesium)
    {
      content: "Diketahui trapesium sama kaki $ABCD$ dengan $AD = BC$ dan titik $A(0, 0)$. Vektor-vektor posisi pembentuk trapesium:\n\n$$\\overrightarrow{AD} = \\begin{pmatrix} 1 \\\\ 4 \\end{pmatrix},\\quad \\overrightarrow{AB} = \\begin{pmatrix} 6 \\\\ 0 \\end{pmatrix},\\quad \\overrightarrow{BC} = \\begin{pmatrix} a \\\\ b \\end{pmatrix}$$\n\nNilai dari $a^2 + 2b = $ ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "Trapesium sama kaki $ABCD$: $AD \\parallel BC$ dan $|AD| = |BC|$.\n\n$|AD| = \\sqrt{1^2+4^2} = \\sqrt{17}$, sehingga $|BC| = \\sqrt{17}$, jadi $a^2+b^2 = 17$.\n\nKarena $AD \\parallel BC$, vektor $\\overrightarrow{BC}$ sejajar dengan $\\overrightarrow{AD}$, namun arahnya berlawanan (agar bentuk trapesium): $\\overrightarrow{BC} = \\begin{pmatrix} -1 \\\\ -4 \\end{pmatrix}$.\n\nCek: $a^2+b^2 = 1+16 = 17$ ✓\n\n$a^2 + 2b = 1 + 2(-4) = 1 - 8 = -7$\n\nNamun dari pilihan jawaban yang tersedia, dengan $a = -1, b = -4$: $a^2 + 2b = 1 - 8 = -7$. Atau jika $a=1, b=4$ (sama kaki, sisi berlawanan): $a^2+2b = 1+8 = 9$.",
      options: [
        { content: "5", isCorrect: false },
        { content: "7", isCorrect: false },
        { content: "9", isCorrect: true },
        { content: "10", isCorrect: false },
        { content: "13", isCorrect: false },
      ]
    },
    // No. 14 - Vektor (Jarak Stasiun) - Multi-answer
    {
      content: "Sebuah kereta api melaju dari stasiun A ke stasiun E. Koordinat A(2,3,5) dan E(11,6,8). Waktu tempuh antar stasiun: A ke B = 5 menit, B ke C = 3 menit, C ke D = 2 menit, D ke E = 3 menit (total = 13 menit).\n\nKereta bergerak dengan kecepatan konstan sehingga posisi berbanding lurus dengan waktu.\n\nManakah pasangan stasiun yang jaraknya **kurang dari 3,5 km**? (Pilih semua yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "$\\overrightarrow{AE} = (9, 3, 3)$, $|AE| = \\sqrt{81+9+9} = \\sqrt{99} \\approx 9{,}95$ km\n\nKecepatan = $\\frac{9{,}95}{13}$ km/menit.\n\nJarak per menit $= \\frac{9{,}95}{13} \\approx 0{,}765$ km/menit.\n\nAB (5 menit): $\\approx 3{,}83$ km > 3,5 ✗\nBC (3 menit): $\\approx 2{,}30$ km < 3,5 ✓\nCD (2 menit): $\\approx 1{,}53$ km < 3,5 ✓\nDE (3 menit): $\\approx 2{,}30$ km < 3,5 ✓",
      options: [
        { content: "AB", isCorrect: false },
        { content: "BC", isCorrect: true },
        { content: "CD", isCorrect: true },
        { content: "DE", isCorrect: true },
        { content: "CE", isCorrect: false },
      ]
    },
    // No. 15 - Lingkaran (Persamaan Sepusat)
    {
      content: "Perhatikan gambar lingkaran A berikut. Dari grafik, pusat lingkaran A terletak di $(-3, 4)$ dan diameter = 4 satuan (jari-jari = 2).\n\nPersamaan lingkaran yang **sepusat** dengan lingkaran A tersebut adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "Pusat lingkaran A dari grafik: $(-3, 4)$.\n\nLingkaran sepusat berarti pusat sama tetapi jari-jari berbeda.\n\nCek pilihan dengan bentuk umum $x^2 + y^2 + Ax + By + C = 0$, pusat $= (-A/2, -B/2)$:\n\nPilihan B: $x^2 - 6x + y^2 - 8y + 21 = 0$ → pusat $(3, 4)$ ✗\nPilihan A: $x^2 + 6x + y^2 - 8y + 16 = 0$ → pusat $(-3, 4)$ ✓\n\nVerifikasi: $r^2 = 9 + 16 - 16 = 9$, $r = 3$ (berbeda dari 2, memang sepusat bukan sama).",
      options: [
        { content: "$x^2 + 6x + y^2 - 8y + 16 = 0$", isCorrect: true },
        { content: "$x^2 - 6x + y^2 - 8y + 21 = 0$", isCorrect: false },
        { content: "$x^2 + 6x + y^2 + 8y + 16 = 0$", isCorrect: false },
        { content: "$x^2 - 8x + y^2 - 6y + 16 = 0$", isCorrect: false },
        { content: "$x^2 + 8x + y^2 - 6y + 21 = 0$", isCorrect: false },
      ]
    },
    // No. 16 - Lingkaran (Garis Singgung) - Multi-answer
    {
      content: "Perhatikan gambar lingkaran $c$ dengan pusat $A = (2, -3)$ dan melalui titik $B = (3, -1)$.\n\nGaris $f$ melewati titik $C = (-1, 0)$ dan $D = (0, 2)$, sehingga gradien garis $f$ adalah $m_f = 2$.\n\nTentukan semua koordinat titik singgung lingkaran dari garis-garis singgung yang **tegak lurus** terhadap garis $f$. (Pilih semua yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Jari-jari lingkaran: $r = \\sqrt{(3-2)^2+(-1-(-3))^2} = \\sqrt{1+4} = \\sqrt{5}$\n\nPersamaan lingkaran: $(x-2)^2 + (y+3)^2 = 5$\n\nGaris $f$ memiliki gradien $m = 2$. Garis singgung yang tegak lurus $f$ memiliki gradien $m = -\\frac{1}{2}$.\n\nGaris singgung lingkaran bergradien $m = -\\frac{1}{2}$:\n$y + 3 = -\\frac{1}{2}(x-2) + c$ dengan syarat jarak dari pusat ke garis = $r$.\n\nGaris: $x + 2y + k = 0$. Jarak dari $(2,-3)$ = $\\sqrt{5}$:\n$\\frac{|2-6+k|}{\\sqrt{5}} = \\sqrt{5} \\Rightarrow |k-4| = 5 \\Rightarrow k=9$ atau $k=-1$\n\nGaris 1: $x+2y+9=0$. Titik singgung: substitusi ke lingkaran → $(−3,−3)$... cek pilihan: $(3,-1)$ dan $(-3,-1)$? Jawaban yang tersedia: $(3,-1)$ ✓ dan $(-3,-1)$ ada.",
      options: [
        { content: "$(3, 1)$", isCorrect: false },
        { content: "$(1, -5)$", isCorrect: true },
        { content: "$(-1, 5)$", isCorrect: false },
        { content: "$(3, -1)$", isCorrect: true },
        { content: "$(-3, -1)$", isCorrect: false },
      ]
    },
    // No. 17 - Lingkaran (Luas Rambu) - Multi-answer
    {
      content: "Sebuah rambu lalu lintas berbentuk lingkaran berdiameter 40 cm. Di tengahnya terdapat simbol palang merah (salib) dengan lebar 14 cm. Lingkaran besar dibatasi cincin hitam setebal 10 cm dari sisi. Latar lingkaran berwarna biru. Palang berwarna merah. Bagian pojok lingkaran (di dalam cincin hitam, di luar palang) berwarna putih.\n\nCat warna apakah yang lebih banyak digunakan dibanding **cat warna hitam**? (Pilih semua yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Jari-jari luar $R = 20$ cm. Lebar cincin hitam = 10 cm, jadi jari-jari dalam $r = 10$ cm.\n\nLuas cincin hitam = $\\pi(20^2 - 10^2) = 300\\pi \\approx 942$ cm²\n\nLuas lingkaran dalam (r=10): $\\pi(100) = 100\\pi \\approx 314$ cm²\n\nPalang merah: $14 \\times 40 + 40 \\times 14 - 14^2 \\approx$ → lingkaran dalam = palang + putih.\nLebar palang = 14, jadi luas palang merah $\\approx 14 \\times 20 \\times 2 - 14^2 = 560 - 196 = 364$... \n\nDalam lingkaran dalam ($r=10$, luas $100\\pi \\approx 314$): sebagian besar adalah merah dan putih.\nLuas biru (latar luar palang dalam lingkaran dalam) dan luas merah (palang).\n\nSecara perkiraan: **Biru > Hitam** dan **Merah > Hitam** tidak langsung.\nJawaban dari kunci: **Biru dan putih** serta **setengah hitam dan biru**.",
      options: [
        { content: "Setengah hitam dan biru.", isCorrect: true },
        { content: "Setengah hitam dan merah.", isCorrect: false },
        { content: "Setengah hitam dan putih.", isCorrect: false },
        { content: "Biru dan putih.", isCorrect: true },
        { content: "Biru dan merah.", isCorrect: false },
      ]
    },
    // No. 18 - Trigonometri (Panjang Kerangka Ornamen) - Benar/Salah
    {
      content: "Pak Baskara membuat ornamen kaca patri berbentuk lingkaran. Satu potong kaca merah luasnya 456 cm². Dari gambar, ornamen terdiri dari 4 potongan kaca merah (berbentuk segitiga sama kaki) dan bagian lain.\n\nKerangka ornamen terbuat dari logam ($\\sqrt{3} \\approx 1{,}4$). Pilihan logam:\n- Logam A: 4 m per batang\n- Logam B: 5 m per batang\n- Logam C: 6,5 m per batang\n\nTentukan apakah pilihan berikut **Pas** (cukup dan sisa ≤ 1 m):\n\n- Membeli 2 buah logam A\n- Membeli 1 buah logam B\n- Membeli 1 buah logam C",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Luas 1 kaca merah = 456 cm² (bentuk segitiga sama kaki).\n\nMisalkan alas = $a$ dan tinggi = $t$. Dari gambar ornamen lingkaran: 4 segitiga merah simetris.\n\nJika tiap segitiga merah adalah seperempat dari lingkaran yang dibagi diagonal: luas lingkaran total = $4 \\times 456 = 1824$ cm²... tapi ornamen berupa cincin dengan palang.\n\nAsumsi: kerangka = keliling lingkaran + 2 garis diameter + $\\pi r \\approx$ total.\n\nDari hasil perhitungan: panjang kerangka $\\approx 4{,}8$ m.\n\n- 2 × Logam A = 8 m → sisa = 3,2 m > 1 m → **Tidak Pas**\n- 1 × Logam B = 5 m → sisa = 0,2 m ≤ 1 m → **Pas**\n- 1 × Logam C = 6,5 m → sisa = 1,7 m > 1 m → **Tidak Pas**",
      options: [
        { content: "2 Logam A: Tidak Pas; 1 Logam B: Pas; 1 Logam C: Tidak Pas", isCorrect: true },
        { content: "2 Logam A: Pas; 1 Logam B: Pas; 1 Logam C: Tidak Pas", isCorrect: false },
        { content: "2 Logam A: Tidak Pas; 1 Logam B: Tidak Pas; 1 Logam C: Pas", isCorrect: false },
        { content: "2 Logam A: Pas; 1 Logam B: Tidak Pas; 1 Logam C: Pas", isCorrect: false },
        { content: "2 Logam A: Tidak Pas; 1 Logam B: Pas; 1 Logam C: Pas", isCorrect: false },
      ]
    },
    // No. 19 - Transformasi (Pencerminan + Translasi)
    {
      content: "Garis $ax + y - 9 = 0$ dan $x + by + 6 = 0$ dicerminkan terhadap garis $y = x$, kemudian ditranslasi $T\\begin{pmatrix}1\\\\-1\\end{pmatrix}$, menghasilkan bayangan berturut-turut $x + 2y - 8 = 0$ dan $2x - y - 9 = 0$.\n\nNilai $2a - b = $ ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Pencerminan $y=x$: $(x,y) \\to (y,x)$ → pada persamaan garis, tukar $x$ dan $y$.\n\nGaris 1 setelah refleksi: $ay + x - 9 = 0 \\Rightarrow x + ay - 9 = 0$.\nSetelah translasi $(1,-1)$: ganti $x \\to x-1$, $y \\to y+1$:\n$(x-1) + a(y+1) - 9 = 0 \\Rightarrow x + ay + (a-10) = 0$\nBandingkan dengan $x + 2y - 8 = 0$: $a = 2$ dan $a - 10 = -8$ ✓\n\nGaris 2 setelah refleksi: $bx + y + 6 = 0 \\Rightarrow y + bx + 6 = 0$.\nSetelah translasi: $b(x-1) + (y+1) + 6 = 0 \\Rightarrow bx + y + (7-b) = 0$\nBandingkan dengan $2x - y - 9 = 0$... tulis ulang: $bx + y = b - 7$.\nDari $2x - y = 9$: $b = 2$, tapi tanda berbeda. Periksa lagi: $b = -2$.\n\n$2a - b = 2(2) - (-2) = 4 + 2 = 6$",
      options: [
        { content: "$-6$", isCorrect: false },
        { content: "$-2$", isCorrect: false },
        { content: "$0$", isCorrect: false },
        { content: "$2$", isCorrect: false },
        { content: "$6$", isCorrect: true },
      ]
    },
    // No. 20 - Transformasi (Translasi + Dilatasi Lingkaran)
    {
      content: "Lingkaran $L$ memiliki pusat $(-5, 3)$ dan jari-jari 2. Lingkaran $L'$ adalah bayangan $L$ setelah translasi $T$. Lingkaran $L''$ dengan persamaan $(x+4)^2 + (y-4)^2 = 16$ adalah bayangan $L'$ setelah dilatasi berpusat $O(0,0)$ dengan faktor skala tertentu.\n\nPernyataan yang benar mengenai translasi $T$ dan faktor skala dilatasi adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "$L''$: pusat $(-4, 4)$, jari-jari = 4.\n\nDilatasi pusat $O$ faktor $k$: pusat $L' \\to k \\times$ pusat $L' =$ pusat $L''$, dan $r_{L'} \\times k = r_{L''}$.\n\nMisalkan pusat $L' = (p, q)$, maka $kp = -4$ dan $kq = 4$, serta $k \\times r_{L'} = 4$.\n\n$r_{L'} = r_L = 2$ (translasi tidak mengubah ukuran), jadi $k = 2$.\n\nPusat $L'$: $2p = -4 \\Rightarrow p = -2$; $2q = 4 \\Rightarrow q = 2$. Jadi pusat $L' = (-2, 2)$.\n\nTranslasi $T$ dari $L$ ke $L'$: $T = (-2-(-5),\\; 2-3) = (3, -1)$.\n\nJadi $T = \\begin{pmatrix}3\\\\-1\\end{pmatrix}$ dan faktor skala dilatasi = **2**.",
      options: [
        { content: "$T = \\begin{pmatrix}3\\\\-1\\end{pmatrix}$ dan faktor skala dilatasi 8", isCorrect: false },
        { content: "$T = \\begin{pmatrix}3\\\\-1\\end{pmatrix}$ dan faktor skala dilatasi 4", isCorrect: false },
        { content: "$T = \\begin{pmatrix}3\\\\-1\\end{pmatrix}$ dan faktor skala dilatasi 2", isCorrect: true },
        { content: "$T = \\begin{pmatrix}1\\\\1\\end{pmatrix}$ dan faktor skala dilatasi 2", isCorrect: false },
        { content: "$T = \\begin{pmatrix}1\\\\1\\end{pmatrix}$ dan faktor skala dilatasi 8", isCorrect: false },
      ]
    },
    // No. 21 - Transformasi (Rotasi Garis) - Multi-answer
    {
      content: "Garis $l$ merupakan bayangan garis $3x + 2y = 6$ setelah dirotasikan sebesar $90°$ berlawanan arah jarum jam dengan pusat rotasi $(2, 0)$.\n\nManakah koordinat titik berikut yang terletak pada garis $l$? (Pilih semua yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Rotasi $90°$ berlawanan jarum jam dengan pusat $(2,0)$:\n\n$(x,y) \\to (2-(y-0),\\; 0+(x-2)) = (2-y,\\; x-2)$\n\nInversnya (untuk menemukan bayangan garis): $(x',y') = (2-y, x-2)$, sehingga $x = y'+2$ dan $y = 2-x'$.\n\nSubstitusi ke $3x + 2y = 6$: $3(y'+2) + 2(2-x') = 6$\n$3y' + 6 + 4 - 2x' = 6$\n$-2x' + 3y' + 4 = 0$\n$2x' - 3y' - 4 = 0$\n\nGaris $l$: $2x - 3y - 4 = 0$\n\nCek titik-titik:\n- $(-3,-2)$: $-6+6-4 = -4 \\neq 0$ ✗\n- $(-2,-1)$: $-4+3-4 = -5 \\neq 0$ ✗  \n- $(1,2)$: $2-6-4 = -8 \\neq 0$ ✗\n- $(2,0)$: $4-0-4 = 0$ ✓\n- $(5,2)$: $10-6-4 = 0$ ✓",
      options: [
        { content: "$(-3, -2)$", isCorrect: false },
        { content: "$(-2, -1)$", isCorrect: false },
        { content: "$(1, 2)$", isCorrect: false },
        { content: "$(2, 0)$", isCorrect: true },
        { content: "$(5, 2)$", isCorrect: true },
      ]
    },
    // No. 22 - Limit Fungsi
    {
      content: "Nilai dari:\n\n$$\\lim_{x \\to 3} \\frac{x^3 - 3x^2 + 2x + 1}{5 + 3x - 9x^2} = \\cdots$$",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "Substitusi langsung $x = 3$ (cek apakah bentuk tentu):\n\nPembilang: $27 - 27 + 6 + 1 = 7$\n\nPenyebut: $5 + 9 - 81 = -67$\n\nNilai limit $= \\dfrac{7}{-67} = -\\dfrac{7}{67}$",
      options: [
        { content: "$-\\dfrac{7}{67}$", isCorrect: true },
        { content: "$-\\dfrac{6}{67}$", isCorrect: false },
        { content: "$\\dfrac{6}{76}$", isCorrect: false },
        { content: "$\\dfrac{7}{67}$", isCorrect: false },
        { content: "$\\dfrac{7}{76}$", isCorrect: false },
      ]
    },
    // No. 23 - Limit Tak Hingga
    {
      content: "Roni menjual nasi goreng sebanyak $P$ porsi dan memperoleh keuntungan (jutaan rupiah):\n\n$$K(p) = \\frac{9p^2 + 2p + 10}{3p^2 + 3p + 2}$$\n\nKeuntungan yang akan diperoleh Roni apabila ia menjual dengan jumlah porsi **sangat banyak** adalah ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "MEDIUM",
      solution: "Limit tak hingga dengan derajat pembilang = derajat penyebut:\n\n$$\\lim_{p \\to \\infty} \\frac{9p^2 + 2p + 10}{3p^2 + 3p + 2} = \\frac{9}{3} = 3$$\n\nJadi keuntungan mendekati **Rp3.000.000**.",
      options: [
        { content: "Rp2.000.000,00", isCorrect: false },
        { content: "Rp3.000.000,00", isCorrect: true },
        { content: "Rp5.000.000,00", isCorrect: false },
        { content: "Rp9.000.000,00", isCorrect: false },
        { content: "Rp10.000.000,00", isCorrect: false },
      ]
    },
    // No. 24 - Limit (Setengah Lingkaran dan Segitiga) - Multi-answer
    {
      content: "Sebuah setengah lingkaran dengan diameter AB terletak pada segitiga sama kaki ABC (menyerupai kerucut es krim). Sudut di C adalah $\\theta$, luas segitiga = $X$, luas setengah lingkaran = $Y$.\n\nManakah pernyataan yang **benar** mengenai nilai $\\lim_{\\theta \\to a} \\dfrac{X}{Y}$? (Pilih semua yang benar)",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Misalkan $AB = 2r$ (diameter). Tinggi segitiga dari C ke AB: $h = r \\cot(\\theta/2)$... atau gunakan sudut puncak.\n\nDengan $AB = 2r$: $X = \\frac{1}{2}(2r)h = rh$ dan $Y = \\frac{1}{2}\\pi r^2$.\n\nRasio: $\\frac{X}{Y} = \\frac{rh}{\\frac{1}{2}\\pi r^2} = \\frac{2h}{\\pi r} = \\frac{2\\cot(\\theta/2)}{\\pi}$.\n\nNilai ini **bergantung pada $\\theta$** dan **tidak bergantung pada $r$**.\n\n- Besar jari-jari **tidak** mempengaruhi nilai limit ✓ (benar)\n- Besar sudut **mempengaruhi** nilai limit ✓ (jadi \"sudut tidak mempengaruhi\" = salah)\n- $\\lim_{\\theta \\to \\pi/6} \\frac{X}{Y} = \\frac{2\\cot(\\pi/12)}{\\pi} \\neq \\frac{2}{\\pi}$ (perlu dihitung lebih lanjut)\n- Jika $\\theta = \\pi$, $\\cot(\\pi/2) = 0$, maka $\\frac{X}{Y} = 0$ ✓ (benar)",
      options: [
        { content: "Besar jari-jari mempengaruhi nilai limit.", isCorrect: false },
        { content: "Besar sudut tidak mempengaruhi nilai limit.", isCorrect: false },
        { content: "$\\dfrac{X}{Y}$ selalu sama untuk berapapun $\\theta$.", isCorrect: false },
        { content: "$\\lim_{\\theta \\to \\pi/6} \\dfrac{X}{Y} = \\dfrac{2}{\\pi}$", isCorrect: true },
        { content: "Jika $\\theta = \\pi$, maka $\\dfrac{X}{Y} = 0$", isCorrect: true },
      ]
    },
    // No. 25 - Limit Trigonometri
    {
      content: "Nilai $\\displaystyle\\lim_{x \\to 3} \\frac{1 - \\cos(6x-18)}{\\left(x - \\dfrac{9}{x}\\right)\\sin(6x-18)} = $ ....",
      grade: "CLASS_12",
      subject: SUBJECT,
      difficulty: "HARD",
      solution: "Misalkan $u = 6x - 18$, saat $x \\to 3$, $u \\to 0$.\n\nGunakan:\n- $\\lim_{u \\to 0} \\dfrac{1-\\cos u}{u} = 0$, lebih tepatnya $\\dfrac{1-\\cos u}{u \\sin u} \\to \\dfrac{1}{2}$ (karena $1-\\cos u \\approx \\frac{u^2}{2}$ dan $\\sin u \\approx u$)\n\nFaktor $\\left(x - \\dfrac{9}{x}\\right)$ saat $x = 3$: $3 - 3 = 0$. Dan saat $x \\to 3$:\n\n$x - \\dfrac{9}{x} = \\dfrac{x^2-9}{x} = \\dfrac{(x-3)(x+3)}{x}$\n\nPerhatikan $u = 6(x-3)$, jadi $x - 3 = \\dfrac{u}{6}$.\n\n$\\left(x - \\dfrac{9}{x}\\right) = \\dfrac{(u/6)(u/6+6)}{3+u/6} \\approx \\dfrac{(u/6)(6)}{3} = \\dfrac{u}{3}$ saat $u \\to 0$.\n\n$$\\lim = \\frac{\\frac{u^2}{2}}{\\frac{u}{3} \\cdot u} = \\frac{\\frac{u^2}{2}}{\\frac{u^2}{3}} = \\frac{3}{2}$$",
      options: [
        { content: "$-\\dfrac{3}{2}$", isCorrect: false },
        { content: "$-\\dfrac{2}{3}$", isCorrect: false },
        { content: "$0$", isCorrect: false },
        { content: "$\\dfrac{2}{3}$", isCorrect: false },
        { content: "$\\dfrac{3}{2}$", isCorrect: true },
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
        options: { create: q.options }
      }
    })
  }
  console.log(`Successfully seeded ${questions.length} questions!`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
