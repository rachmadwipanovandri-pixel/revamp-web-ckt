import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type Locale = "en" | "id";
type Stat = { value: string; label: string };

const CONTENT_ROOT = path.join(__dirname, "industries");

const EXPECTED_STATS: Record<
  string,
  Record<Locale, { replacement: Stat[]; unchanged: Stat[] }>
> = {
  airlines: {
    en: {
      replacement: [
        {
          value: "75%",
          label:
            "cost saving on Customer Service at Gamal Men by using AI agents",
        },
        {
          value: "5 sec",
          label: "reply time to customer chats at Lunica, down from 15 minutes",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "schedule, baggage, and refund questions answered",
        },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "75%",
          label:
            "penghematan biaya Customer Service di Gamal Men dengan AI agent",
        },
        {
          value: "5 detik",
          label: "waktu balas chat pelanggan di Lunica, turun dari 15 menit",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "pertanyaan jadwal, bagasi, dan refund terjawab",
        },
        { value: "3.000+", label: "bisnis pakai Cekat.AI" },
      ],
    },
  },
  entertainment: {
    en: {
      replacement: [
        {
          value: "2×",
          label: "increase in booking revenue at Puffy Cotton Candy",
        },
        {
          value: "2×",
          label:
            "increase in chat handling capacity at Kezka Printing within 6 months",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "showtime, ticket, and booking questions answered",
        },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        { value: "2×", label: "kenaikan omzet booking di Puffy Cotton Candy" },
        {
          value: "2×",
          label:
            "peningkatan kapasitas penanganan chat di Kezka Printing dalam 6 bulan",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "pertanyaan showtime, tiket, dan booking terjawab",
        },
        { value: "3.000+", label: "bisnis pakai Cekat.AI" },
      ],
    },
  },
  isp: {
    en: {
      replacement: [
        {
          value: "+30%",
          label: "increase in subscribers at Lintas Jaringan Nusantara",
        },
        {
          value: "5 sec",
          label: "reply time to customer chats at Lunica, down from 15 minutes",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "outage reports, billing, and install bookings answered",
        },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "+30%",
          label: "kenaikan jumlah pelanggan di Lintas Jaringan Nusantara",
        },
        {
          value: "5 detik",
          label: "waktu balas chat pelanggan di Lunica, turun dari 15 menit",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "laporan gangguan, tagihan, dan jadwal instalasi terjawab",
        },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  fmcg: {
    en: {
      replacement: [
        { value: "+50%", label: "increase in monthly revenue at Nature Craft" },
        {
          value: "2×",
          label:
            "increase in chat handling capacity at Kezka Printing within 6 months",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        { value: "+50%", label: "kenaikan omzet bulanan di Nature Craft" },
        {
          value: "2×",
          label:
            "peningkatan kapasitas penanganan chat di Kezka Printing dalam 6 bulan",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  logistics: {
    en: {
      replacement: [
        { value: "+50%", label: "increase in revenue at GPS Supertrack" },
        {
          value: "2×",
          label:
            "increase in chat handling capacity at Kezka Printing within 6 months",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        { value: "+50%", label: "kenaikan omzet di GPS Supertrack" },
        {
          value: "2×",
          label:
            "peningkatan kapasitas penanganan chat di Kezka Printing dalam 6 bulan",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  hospitality: {
    en: {
      replacement: [
        {
          value: "2×",
          label: "increase in booking revenue at Puffy Cotton Candy",
        },
        {
          value: "5 sec",
          label: "reply time to customer chats at Lunica, down from 15 minutes",
        },
      ],
      unchanged: [
        { value: "3,000+", label: "businesses run on Cekat.AI" },
        { value: "15+", label: "industries served" },
      ],
    },
    id: {
      replacement: [
        { value: "2×", label: "kenaikan omzet booking di Puffy Cotton Candy" },
        {
          value: "5 detik",
          label: "waktu balas chat pelanggan di Lunica, turun dari 15 menit",
        },
      ],
      unchanged: [
        { value: "3.000+", label: "bisnis pakai Cekat.AI" },
        { value: "15+", label: "industri terlayani" },
      ],
    },
  },
  "gym-sports": {
    en: {
      replacement: [
        {
          value: "2×",
          label:
            "increase in booked client visits per month at Graha Pesona Cikeas",
        },
        {
          value: "+10%",
          label: "increase in membership revenue at Midas Cuan",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "court, class, and membership questions answered",
        },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "2×",
          label:
            "peningkatan kunjungan klien terjadwal per bulan di Graha Pesona Cikeas",
        },
        { value: "+10%", label: "kenaikan omzet membership di Midas Cuan" },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  saas: {
    en: {
      replacement: [
        {
          value: "+30%",
          label: "increase in subscribers at Lintas Jaringan Nusantara",
        },
        {
          value: "+8%",
          label:
            "increase in qualified leads at Multi Flashindo Karisma within 4 months",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "product questions, onboarding, and tickets answered",
        },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "+30%",
          label: "kenaikan jumlah pelanggan di Lintas Jaringan Nusantara",
        },
        {
          value: "+8%",
          label:
            "kenaikan lead terkualifikasi di Multi Flashindo Karisma dalam 4 bulan",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  transport: {
    en: {
      replacement: [
        { value: "+50%", label: "increase in revenue at GPS Supertrack" },
        {
          value: "<1 min",
          label: "response time from the AI contact centre at Rumah Zakat",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        { value: "+50%", label: "kenaikan omzet di GPS Supertrack" },
        {
          value: "<1 menit",
          label: "waktu respons contact center AI di Rumah Zakat",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  automotive: {
    en: {
      replacement: [
        {
          value: "2×",
          label:
            "increase in booked client visits per month at Graha Pesona Cikeas",
        },
        {
          value: "28%",
          label:
            "conversion from lead to appointment at Wall Street English, up from 20%",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "2×",
          label:
            "peningkatan kunjungan klien terjadwal per bulan di Graha Pesona Cikeas",
        },
        {
          value: "28%",
          label:
            "konversi dari lead ke appointment di Wall Street English, naik dari 20%",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  outsourcing: {
    en: {
      replacement: [
        {
          value: "75%",
          label:
            "cost saving on Customer Service at Gamal Men by using AI agents",
        },
        { value: "+30%", label: "increase in monthly revenue at Happy GSR" },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "75%",
          label:
            "penghematan biaya Customer Service di Gamal Men dengan AI agent",
        },
        { value: "+30%", label: "kenaikan omzet bulanan di Happy GSR" },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  "professional-services": {
    en: {
      replacement: [
        {
          value: "28%",
          label:
            "conversion from lead to appointment at Wall Street English, up from 20%",
        },
        {
          value: "+8%",
          label:
            "increase in qualified leads at Multi Flashindo Karisma within 4 months",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "28%",
          label:
            "konversi dari lead ke appointment di Wall Street English, naik dari 20%",
        },
        {
          value: "+8%",
          label:
            "kenaikan lead terkualifikasi di Multi Flashindo Karisma dalam 4 bulan",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  clinics: {
    en: {
      replacement: [
        {
          value: "+30%",
          label:
            "increase in revenue at Glams Aesthetic Clinic within 3 months",
        },
        {
          value: "200+",
          label: "customer chats handled per day at Sociamedic Clinic",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "registration, doctor schedules, and bookings answered",
        },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "+30%",
          label: "kenaikan omzet di Glams Aesthetic Clinic dalam 3 bulan",
        },
        {
          value: "200+",
          label: "chat pelanggan tertangani per hari di Sociamedic Clinic",
        },
      ],
      unchanged: [
        {
          value: "24/7",
          label: "pendaftaran, jadwal dokter, dan booking terjawab",
        },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  schools: {
    en: {
      replacement: [
        {
          value: "+60%",
          label: "increase in student enrolment at Matana University",
        },
        {
          value: "+90%",
          label:
            "increase in response rate to inquiries at Universitas Multimedia Nusantara",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "+60%",
          label: "kenaikan jumlah pendaftaran mahasiswa di Matana University",
        },
        {
          value: "+90%",
          label:
            "peningkatan tingkat respons pertanyaan masuk di Universitas Multimedia Nusantara",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  pharmacy: {
    en: {
      replacement: [
        {
          value: "5 sec",
          label: "reply time to customer chats at Lunica, down from 15 minutes",
        },
        {
          value: "200+",
          label: "customer chats handled per day at Sociamedic Clinic",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "5 detik",
          label: "waktu balas chat pelanggan di Lunica, turun dari 15 menit",
        },
        {
          value: "200+",
          label: "chat pelanggan tertangani per hari di Sociamedic Clinic",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  barbershop: {
    en: {
      replacement: [
        {
          value: "28%",
          label:
            "conversion from lead to appointment at Wall Street English, up from 20%",
        },
        {
          value: "75%",
          label:
            "cost saving on Customer Service at Gamal Men by using AI agents",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "28%",
          label:
            "konversi dari lead ke appointment di Wall Street English, naik dari 20%",
        },
        {
          value: "75%",
          label:
            "penghematan biaya Customer Service di Gamal Men dengan AI agent",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
  edutech: {
    en: {
      replacement: [
        {
          value: "+60%",
          label: "increase in student enrolment at Matana University",
        },
        {
          value: "+10%",
          label: "increase in membership revenue at Midas Cuan",
        },
      ],
      unchanged: [
        { value: "24/7", label: "[existing industry 24/7 line — leave as is]" },
        { value: "3,000+", label: "businesses run on Cekat.AI" },
      ],
    },
    id: {
      replacement: [
        {
          value: "+60%",
          label: "kenaikan jumlah pendaftaran mahasiswa di Matana University",
        },
        { value: "+10%", label: "kenaikan omzet membership di Midas Cuan" },
      ],
      unchanged: [
        { value: "24/7", label: "[baris 24/7 industri yang ada — biarkan]" },
        { value: "3.000+", label: "bisnis berjalan di Cekat.AI" },
      ],
    },
  },
};

const FALLBACK_PROOF = {
  en: "More than 3,000 businesses in Indonesia run customer service on Cekat.AI.",
  id: "Lebih dari 3.000 bisnis di Indonesia menjalankan customer service di Cekat.AI.",
} as const;

const HANSEN_EDUCATION_PROOF = {
  en: {
    metaDescription:
      "Schools and campuses use Cekat.AI to answer prospective students 24/7 through admission season. Matana University increased student enrolment by nearly 60–70%.",
    stat: {
      value: "+60–70%",
      label: "increase in student enrolment at Matana University",
    },
    inquiries: {
      value: "~100",
      label: "student inquiries handled daily at Matana University",
    },
    pillar:
      "Matana University increased student enrolment by nearly 60–70% with Cekat.AI, thanks to faster responses and stronger prospective-student engagement.",
    testimonial: {
      quote:
        "Cekat.AI helps us respond to prospective students faster, build engagement, and increase student enrolment by nearly 60–70%.",
      name: "Hansen Iskandar",
      role: "Head of Marketing, Admission & Sales of Matana University",
      image: "/images/home/hansen-iskandar.png",
    },
    faq:
      "Matana University increased student enrolment by nearly 60–70% with Cekat.AI, according to its Head of Marketing, Admission & Sales. Faster, more consistent responses helped build prospective-student engagement and let the team work more efficiently.",
  },
  id: {
    metaDescription:
      "Kampus & sekolah pakai Cekat.AI buat jawab calon mahasiswa 24/7 di musim PMB. Matana University meningkatkan jumlah mahasiswa hampir 60–70%.",
    stat: {
      value: "+60–70%",
      label: "kenaikan jumlah mahasiswa di Matana University",
    },
    inquiries: {
      value: "~100",
      label: "inquiry calon mahasiswa tertangani per hari di Matana University",
    },
    pillar:
      "Matana University meningkatkan jumlah mahasiswa hampir 60–70% dengan Cekat.AI, berkat respons yang lebih cepat dan engagement calon mahasiswa yang lebih kuat.",
    testimonial: {
      quote:
        "Cekat.AI membantu kami merespons calon mahasiswa lebih cepat, membangun engagement, dan meningkatkan jumlah mahasiswa hampir 60–70%.",
      name: "Hansen Iskandar",
      role: "Head of Marketing, Admission & Sales of Matana University",
      image: "/images/home/hansen-iskandar.png",
    },
    faq:
      "Matana University meningkatkan jumlah mahasiswa hampir 60–70% dengan Cekat.AI, menurut Head of Marketing, Admission & Sales-nya. Respons yang lebih cepat dan konsisten membantu membangun engagement calon mahasiswa dan membuat tim bekerja lebih efisien.",
  },
} as const;

function readIndustry(slug: string, locale: Locale) {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_ROOT, slug, `${locale}.json`), "utf8"),
  ) as {
    meta: { description: string };
    stats: Stat[];
    caseStudy?: { client: string; title?: string; body: string };
    pillars: Array<{ body: string }>;
    faq: Array<{ a: string }>;
    testimonial?: {
      quote: string;
      name: string;
      role: string;
      image?: string;
    };
  };
}

describe("industry replacement copy", () => {
  it("uses the document metrics while preserving the existing 24/7 and 3,000+ boxes", () => {
    for (const [slug, locales] of Object.entries(EXPECTED_STATS)) {
      for (const locale of ["en", "id"] as const) {
        const content = readIndustry(slug, locale);
        expect(
          content.stats.slice(0, 2),
          `${slug}/${locale} replacements`,
        ).toEqual(locales[locale].replacement);
        expect(
          content.stats.slice(2).map(({ value }) => value),
          `${slug}/${locale} unchanged boxes`,
        ).toEqual(locales[locale].unchanged.map(({ value }) => value));
      }
    }
  });

  it("replaces every Entertainment case-study placement with the provided Puffy copy", () => {
    const en = readIndustry("entertainment", "en");
    const id = readIndustry("entertainment", "id");

    expect(en.caseStudy).toMatchObject({
      client: "Puffy Cotton Candy",
      title:
        "How Puffy Cotton Candy Doubled Booking Revenue — and Hit 2–4× in Peak Season",
      body: "Puffy Cotton Candy runs 35 mall outlets and a home-service division that brings cotton-candy booths to birthdays, corporate events and parties. Event inquiries came in over WhatsApp and were answered by hand: slow, inconsistent, often missing the detail a host needed to decide. After moving the home-service line onto Cekat.AI, every inquiry gets an instant, informative reply. The result: more leads handled, faster handling time, booking revenue roughly double the pre-AI baseline, and 2–4× during Lebaran, Christmas and New Year.",
    });
    expect(en.pillars[2].body).toBe(
      "Puffy Cotton Candy took event and party bookings from manual replies to instant AI handling: booking revenue doubled, and 2–4× in peak season.",
    );
    expect(en.faq[7].a).toContain("Puffy Cotton Candy");

    expect(id.caseStudy).toMatchObject({
      client: "Puffy Cotton Candy",
      title:
        "Bagaimana Puffy Cotton Candy Menggandakan Omzet Booking — dan 2–4× di High Season",
      body: "Puffy Cotton Candy mengelola 35 gerai mall dan divisi home service yang membawa booth cotton candy ke ulang tahun, acara perusahaan, dan pesta. Pertanyaan event masuk lewat WhatsApp dan dibalas manual: lambat, tidak konsisten, sering kurang informatif. Setelah divisi home service dipindahkan ke Cekat.AI, setiap pertanyaan dijawab instan dan informatif. Hasilnya: leads tertangani naik, handling time lebih cepat, omzet booking sekitar dua kali dari sebelum AI, dan 2–4× saat Lebaran, Natal, dan Tahun Baru.",
    });
    expect(id.pillars[2].body).toBe(
      "Puffy Cotton Candy memindahkan booking event dan pesta dari balasan manual ke AI instan: omzet booking naik dua kali, dan 2–4× di high season.",
    );
    expect(id.faq[7].a).toContain("Puffy Cotton Candy");
  });

  it("uses the plain 3,000+ proof for legacy claim-only cards", () => {
    for (const slug of [
      "fmcg",
      "logistics",
      "transport",
      "automotive",
      "outsourcing",
      "professional-services",
    ]) {
      for (const locale of ["en", "id"] as const) {
        const content = readIndustry(slug, locale);
        expect(
          content.pillars[2].body,
          `${slug}/${locale} fallback proof`,
        ).toBe(FALLBACK_PROOF[locale]);
      }
    }
  });

  it("uses Hansen Iskandar's reported Matana University result on Education", () => {
    for (const locale of ["en", "id"] as const) {
      const content = readIndustry("education", locale);
      const expected = HANSEN_EDUCATION_PROOF[locale];

      expect(content.meta.description).toBe(expected.metaDescription);
      expect(content.stats[0]).toEqual(expected.stat);
      expect(content.stats[1]).toEqual(expected.inquiries);
      expect(content.pillars[2].body).toBe(expected.pillar);
      expect(content.testimonial).toEqual(expected.testimonial);
      expect(content.faq[6].a).toBe(expected.faq);
    }
  });
});
