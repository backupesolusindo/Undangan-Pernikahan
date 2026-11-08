const bride = {
  name: "Devi Aryaning Tyas, A.Md.Kom.",
  nickname: "Devi",
  father: "Bpk. Riyanto",
  mother: "Ibu Siti Julaeha",
  photo: "/assets/bride.jpg",
  instagram: "@deviaryaningt",
};

const groom = {
  name: "Dimas Ainur Fanani, A.Md.T.",
  nickname: "Dimas",
  father: "Bpk. Edy Suyanti",
  mother: "Ibu Siti Badriyah",
  photo: "/assets/groom.jpg",
  instagram: "@dimasainur_",
};

export const weddingConfig = {
  bride,
  groom,
  eventDate: "2026-09-30T08:00:00+07:00",
  eventDateFormatted: "Minggu, 30 September 2026",
  audioUrl: "https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/wedding_music.mp3",
  heroImage: "/assets/hero_cover.jpg",
  heroFullscreenImage: "/assets/videoframe_17420.png",
  videoUrl: "https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/opening_video2.mp4",
  quote: {
    text: "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga pernikahan ini keberkahan bagi kami, keluarga kami, dan keturunan kami di dunia & akhirat.",
    source: "QS. Ar-Rum: 21"
  },
  akad: {
    title: "Akad Nikah",
    date: "Minggu, 30 September 2026",
    time: "08:00 WIB - Selesai",
    location: "Pendopo Kedhaton Jawa",
    address: "Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah",
    mapsUrl: "https://maps.google.com/?q=Surakarta",
  },
  resepsi: {
    title: "Upacara Panggih & Resepsi",
    date: "Minggu, 30 September 2026",
    time: "11:00 - 14:00 WIB",
    location: "Grand Ballroom Pendopo Agung",
    address: "Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah",
    mapsUrl: "https://maps.google.com/?q=Surakarta",
  },
  stories: [
    {
      year: "2021",
      title: "Pisanan Kepanggih (Pertama Bertemu)",
      description: "Awal mula takdir mempertemukan kami dalam suasana adat Jawa di kota Surakarta.",
      image: "/assets/story1.jpg"
    },
    {
      year: "2023",
      title: "Manunggal Jiwo (Niat Suci)",
      description: "Menyatukan niat dan tekad bersama untuk melangkah ke jenjang mahligai rumah tangga.",
      image: "/assets/story2.jpg"
    },
    {
      year: "2025",
      title: "Lamar (Nembung)",
      description: "Acara silaturahmi keluarga besar dan pengikatan janji suci lamaran.",
      image: "/assets/story3.jpg"
    }
  ],
  gallery: [
    {
      url: "/assets/gallery1.jpg",
      caption: "Busana Adat Jawa Solo Basahan"
    },
    {
      url: "/assets/gallery2.jpg",
      caption: `Moments ${bride.nickname} & ${groom.nickname}`
    },
    {
      url: "/assets/gallery3.jpg",
      caption: "Senyum Bahagia"
    },
    {
      url: "/assets/gallery4.jpg",
      caption: "Prosesi Siraman & Midodareni"
    },
    {
      url: "/assets/gallery5.jpg",
      caption: "Pendopo Ageng"
    },
    {
      url: "/assets/gallery6.jpg",
      caption: "Cinta Dalam Kebaya Javanese Art"
    }
  ],
  banks: [
    {
      bankName: "Bank BCA",
      accountNumber: "8830192841",
      accountName: bride.name,
      icon: "/assets/bca_logo.svg"
    },
    {
      bankName: "Bank Mandiri",
      accountNumber: "1380092104812",
      accountName: groom.name,
      icon: "/assets/mandiri_logo.svg"
    }
  ],
  gift: {
    name: `${bride.nickname} & ${groom.nickname}`,
    address: "Kediaman Mempelai, Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah"
  }
};
