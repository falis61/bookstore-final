import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          home: "Home",
          shop: "Shop",
          about: "About Us",
          contact: "Contact",
          category: "Category",
          login: "Login",
          all: "All",
          title: "Title",
          author: "Author",
          subject: "Subject",
          list: "List",
          searchBy: "Search by",
          novel: "Novel",
          romance: "Romance",
          education: "Education",
          islamic: "Islamic",
          children: "Children",
          technology: "Technology",
        },
      },
      tr: {
        translation: {
          home: "Ana Sayfa",
          shop: "Mağaza",
          about: "Hakkında",
          contact: "İletişim",
          category: "Kategori",
          login: "Giriş Yap",
          all: "Tümü",
          title: "Başlık",
          author: "Yazar",
          subject: "Konu",
          list: "Liste",
          searchBy: "Şuna göre ara",
          novel: "Roman",
          romance: "Romantik",
          education: "Eğitim",
          islamic: "İslami",
          children: "Çocuk",
          technology: "Teknoloji",
        },
      },
      ar: {
        translation: {
          home: "الرئيسية",
          shop: "المتجر",
          about: "من نحن",
          contact: "تواصل",
          category: "الفئات",
          login: "تسجيل الدخول",
          all: "الكل",
          title: "العنوان",
          author: "الكاتب",
          subject: "الموضوع",
          list: "القائمة",
          searchBy: "ابحث حسب",
          novel: "رواية",
          romance: "رومانسي",
          education: "تعليم",
          islamic: "إسلامي",
          children: "أطفال",
          technology: "تقنية",
        },
      },
    },
  });

export default i18n;