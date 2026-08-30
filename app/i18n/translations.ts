export type Locale = "en" | "ur";

export const locales: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "ur", label: "اردو", dir: "rtl" },
];

const en = {
  common: {
    requiredError: "This field is required.",
    invalidEmailError: "Please enter a valid email address.",
    invalidPhoneError: "Please enter a valid phone number.",
    invalidNumberError: "Please enter a valid number greater than 0.",
    submitError: "Something went wrong. Please try again.",
    formHasErrors: "Please review the highlighted fields below.",
    guestCountUnsupportedError: "This guest count isn't supported for the selected service. Please contact us directly for a custom quote.",
  },
  nav: {
    links: {
      home: "Home",
      about: "About",
      services: "Our Services",
      howItWorks: "How It Works",
      cities: "Cities We Serve",
      gallery: "Gallery",
      faqs: "FAQs",
      contact: "Contact",
    },
    bookNow: "Book Now",
  },
  hero: {
    badge: "Women-Only Security & Privacy",
    title: "Private moments, protected spaces.",
    description:
      "WII Security delivers trusted, all-female security and privacy protection for women-only events — combining a warm, discreet presence with professional-grade safeguarding of your space, your guests, and your moments.",
    bookNow: "Book Now",
    getQuote: "Get a Quote",
    stats: [
      { value: "3", label: "Cities served" },
      { value: "100%", label: "Female staff" },
      { value: "86+", label: "Events secured" },
    ],
    testimonialQuote: "We felt completely at ease.",
    testimonialAuthor: "Bride, Lahore",
  },
  about: {
    eyebrow: "About WII Security",
    title: "Built by women, for women-only spaces.",
    paragraph: {
      before: "Founded by ",
      handle: "womeninislam.wii",
      after:
        " to close a gap that many women-only events face: the need for security and privacy protection that respects modesty and cultural sensitivity without feeling intrusive. Our all-female teams are trained in event security, privacy compliance, and calm, professional guest management — so hosts and guests alike can relax and celebrate with complete peace of mind.",
    },
    values: [
      {
        title: "Trustworthy",
        desc: "Vetted, background-checked female personnel you can welcome into your most private moments.",
      },
      {
        title: "Secure",
        desc: "Trained protocols for access control, privacy monitoring, and on-site incident response.",
      },
      {
        title: "Professional",
        desc: "Discreet, well-presented teams that blend into your event rather than disrupt it.",
      },
      {
        title: "Welcoming",
        desc: "A warm, respectful presence that honors modesty and puts guests at ease.",
      },
    ],
  },
  services: {
    eyebrow: "Our Services",
    title: "Comprehensive privacy & security, tailored for women-only events",
    learnMore: "Learn more",
    items: [
      {
        title: "Women-Only Event Security",
        subtitle: "Privacy Monitoring",
        desc: "All-female security teams manage access control, guest verification, and on-site privacy monitoring so your event stays safe, exclusive, and completely comfortable.",
        bullets: ["Female Monitors", "Roll up Banners", "Designated area"],
      },
      {
        title: "Phone Pouch Service",
        subtitle: "Device Privacy",
        desc: "Guest phones and cameras are securely pouched at entry, preventing unauthorized photos or recordings and protecting the privacy of every attendee.",
        bullets: ["Phone Pouches", "Female Monitors", "Roll up Banners"],
      },
      {
        title: "Photography & Videography Service",
        subtitle: "Event Media",
        desc: "We coordinate with photographers and videographers to enforce agreed guidelines, ensuring images and footage respect the privacy wishes of your guests.",
        bullets: ["Female photographer", "Reels, Cinematic highlights, Testimonials", "Edited by female"],
      },
    ],
  },
  cities: {
    eyebrow: "Cities We Serve",
    title: "Present where your celebrations are",
    items: [
      {
        name: "Karachi",
        desc: "Our founding city — full-service event security, phone pouch, and photography compliance teams.",
      },
      {
        name: "Lahore",
        desc: "Dedicated teams for weddings, and private celebrations across the city.",
      },
      {
        name: "Islamabad",
        desc: "Discreet, professional coverage for corporate and private women-only functions.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "How It Works",
    title: "Booking peace of mind in four simple steps",
    steps: [
      {
        n: "01",
        title: "Submit your request",
        desc: "Tell us about your event — date, venue, guest count, and the services you need.",
      },
      {
        n: "02",
        title: "Get a custom quote",
        desc: "We assess your event and send a tailored plan and quote within 24 hours.",
      },
      {
        n: "03",
        title: "Confirm & prepare",
        desc: "Once booked, our team coordinates logistics, briefings, and venue walkthroughs.",
      },
      {
        n: "04",
        title: "Enjoy a secure event",
        desc: "Our all-female team manages security and privacy on the day, start to finish.",
      },
    ],
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Moments protected, memories celebrated",
    description:
      "Imagery will feature our teams and client events with full consent.",
    items: [
      "Phone Pouch Stations",
      "Monitoring",
      "Photography & Videography",
      "Rollup Banners",
    ],
    viewFullScreen: "View full screen",
  },
  faqs: {
    eyebrow: "FAQs",
    title: "Frequently asked questions",
    searchPlaceholder: "Search questions...",
    noResults: "No questions match your search.",
    viewAll: "View all FAQs",
    items: [
      {
        q: "Is your team completely female?",
        a: "Yes. Our entire on-ground team is female.",
      },
      {
        q: "Are photos edited by females?",
        a: "Yes. All photos are edited by female editors only.",
      },
      {
        q: "Do you provide albums or hard copies?",
        a: "No. We only provide soft copies, transferred securely via an online link or USB.",
      },
      {
        q: "How can we trust your service regarding privacy?",
        a: "We treat every event as an amanah (trust). Your photos are transferred to you immediately via a secure link or USB and are then permanently deleted from our devices.",
      },
      {
        q: "How can we view your photography work?",
        a: "Some of the faceless content is available to view on our page. We don't share any work of client as it is not consented. Only faceless consented photos are shared personally.",
      },
      {
        q: "Which cities do you serve?",
        a: "We currently serve Karachi, Lahore, and Islamabad.",
      },
      {
        q: "How far in advance should we book?",
        a: "Ideally, book at least one month in advance. The minimum recommended notice is one week, so we can assign and prepare our volunteer team.",
      },
      {
        q: "Do you require an advance payment?",
        a: "Yes. We require an advance payment to confirm your booking, with the remaining balance due on the day of the event.",
      },
      {
        q: "Do you offer customised packages?",
        a: "Absolutely. Every quotation is tailored to your event, guest count, venue, and privacy requirements. Send us a message for a personalised plan.",
      },
      {
        q: "What is the Phone Pouch Service?",
        a: "Our phone pouches block both the front and back cameras while allowing guests to continue using their phones. This package also includes female monitors and roll-up privacy banners.",
      },
      {
        q: "What is the Non-Phone Pouch Service?",
        a: "Our female monitors safeguard your event by preventing unauthorised photography. This service also includes roll-up privacy banners and, where required, a designated private photo area for guests.",
      },
      {
        q: "What does your female photography package include?",
        a: "Basic Package — bridal & couple shoot, 120–150 professionally edited photos. Premium Package — full-day event coverage, unlimited professionally edited photos.",
      },
      {
        q: "What does your videography package include?",
        a: "Packages are tailored to your needs and may include: cinematic highlight film, Instagram-style short reels, testimonial videos, and full event coverage.",
      },
    ],
  },
  bookCta: {
    eyebrow: "Get a Quote",
    title: "Get a personalized security quote",
    description:
      "Tell us about your event and we'll send you a tailored security and privacy quote.",
    perks: [
      "All-female, background-checked staff",
      "Instant quote",
      "Phone pouch & photography compliance included",
      "Available in Karachi, Lahore & Islamabad",
    ],
    form: {
      fullName: "Full name",
      phoneNumber: "Phone number",
      phoneCodes: [
        { code: "+92", country: "Pakistan" },
        { code: "+971", country: "UAE" },
        { code: "+966", country: "Saudi Arabia" },
        { code: "+44", country: "United Kingdom" },
        { code: "+1", country: "USA / Canada" },
      ],
      email: "Email",
      city: "City",
      citySelectPlaceholder: "Select your city",
      cityOptions: ["Karachi", "Lahore", "Islamabad"],
      eventDate: "Event date",
      femaleGuests: "Number of female guests",
      hearAboutUs: "How did you hear about us?",
      hearAboutUsOptions: ["LinkedIn", "Instagram", "Friend/Relative", "Other"],
      otherOptionValue: "Other",
      otherPlaceholder: "Please specify",
      guestServiceLabel: "Phone pouches or monitoring",
      guestServiceOptions: [
        {
          value: "phone-pouches",
          label: "Phone Pouches",
          description:
            "Guest phones and cameras are securely pouched at entry, preventing unauthorized photos or recordings.",
        },
        {
          value: "monitoring",
          label: "Monitoring (Non-Pouches)",
          description:
            "On-site privacy monitoring and access control without pouching — our team watches for unauthorized photography instead.",
        },
      ],
      photographyLabel: "Female Photography",
      photographyTierLabel: "Photography package",
      videographyLabel: "Videography",
      videographyTierLabel: "Videography package",
      atLeastOneServiceError: "Please select at least one service for this event.",
      details: "Special requests or details",
      detailsPlaceholder:
        "Special instructions, event type, or anything else we should know",
      eventLabel: "Event",
      addEvent: "Add another event",
      removeEvent: "Remove",
      submit: "Request a Quote",
      submitting: "Submitting…",
    },
    review: {
      title: "Review your request",
      contactHeading: "Your details",
      edit: "Edit",
      confirm: "Confirm & Submit",
      confirming: "Getting your quote…",
      notProvided: "Not specified",
      submitError: "Something went wrong submitting your request. Please try again.",
    },
    success: {
      title: "Request received",
      message:
        "Thanks! Your estimated quote has been downloaded as a PDF. Our team will follow up within 24 hours.",
      downloadPdf: "Didn't get your PDF? Download it here",
    },
  },
  booking: {
    eyebrow: "Book Your Event",
    title: "Confirm your booking",
    description:
      "Fill in your event details and share your payment receipt to confirm your booking.",
    perks: [
      "All-female, background-checked staff",
      "Confirmed booking within 24 hours",
      "Secure, private payment verification",
    ],
    form: {
      fullName: "Full name",
      contactNumber: "Contact number",
      eventDate: "Event date",
      reportingTime: "Event reporting time",
      eventType: "Event type",
      eventTypeOptions: ["Barat", "Valima", "Other"],
      otherOptionValue: "Other",
      otherPlaceholder: "Please specify",
      city: "City",
      citySelectPlaceholder: "Select your city",
      cityOptions: ["Karachi", "Lahore", "Islamabad"],
      venue: "Venue",
      femaleGuests: "Number of female guests",
      totalAmount: "Total amount to be paid (PKR)",
      dueNowPrefix: "Pay now (50%):",
      dueNowExample: "e.g. Total 25,000 → Pay now 12,500",
      eventLabel: "Event",
      addEvent: "Add another event",
      removeEvent: "Remove",
      accountDetailsHeading: "Bank Account Details",
      accountTitleLabel: "Account Title",
      accountTitleValue: "NABIA HASSAN SABZWARI",
      accountNumberLabel: "Account Number",
      accountNumberValue: "3123456789012345",
      bankNameLabel: "Bank Name",
      bankNameValue: "Faysal Bank",
      receiptLabel: "Payment receipt screenshot",
      receiptPlaceholder: "Choose a file...",
      receiptBrowse: "Browse",
      termsPrefix: "I agree to the",
      termsLinkLabel: "Terms & Conditions",
      terminationDisclaimer:
        "Violating our Terms & Conditions — including providing false or misleading event information — will lead to immediate termination of service.",
      submit: "Submit Booking",
    },
    review: {
      title: "Review your booking",
      edit: "Edit",
      confirm: "Confirm & Submit",
      submitting: "Submitting...",
      notProvided: "Not specified",
      termsAgreed: "Agreed",
      termsNotAgreed: "Not agreed",
    },
    success: {
      title: "Booking received",
      message:
        "Thanks! We've received your booking and payment details. Our team will confirm everything shortly.",
    },
  },
  footer: {
    tagline:
      "Trusted, discreet security and privacy protection for women-only events across Pakistan.",
    companyHeading: "Company",
    companyLinks: [
      "About WII Security",
      "Our Services",
      "How It Works",
      "Careers",
    ],
    careersSoon: "(soon)",
    legalHeading: "Legal",
    legalLinks: ["Privacy Policy", "Terms & Conditions"],
    followHeading: "Follow Us",
    social: ["Instagram"],
    contactHeading: "Contact",
    contactCities: "Karachi · Lahore · Islamabad",
    copyright: "WII Security. All rights reserved.",
    designedWithCare: "Designed with care, for women.",
  },
};

const ur: typeof en = {
  common: {
    requiredError: "یہ خانہ پُر کرنا ضروری ہے۔",
    invalidEmailError: "براہ کرم درست ای میل ایڈریس درج کریں۔",
    invalidPhoneError: "براہ کرم درست فون نمبر درج کریں۔",
    invalidNumberError: "براہ کرم 0 سے زیادہ درست نمبر درج کریں۔",
    submitError: "کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔",
    formHasErrors: "براہ کرم نیچے نشان زد خانوں کا جائزہ لیں۔",
    guestCountUnsupportedError: "منتخب کردہ سروس کے لیے اتنے مہمانوں کی تعداد قابل قبول نہیں ہے۔ براہ کرم اپنی مرضی کے مطابق قیمت کے لیے براہ راست رابطہ کریں۔",
  },
  nav: {
    links: {
      home: "ہوم",
      about: "تعارف",
      services: "ہماری خدمات",
      howItWorks: "طریقہ کار",
      cities: "شہر",
      gallery: "گیلری",
      faqs: "اکثر سوالات",
      contact: "رابطہ",
    },
    bookNow: "ابھی بک کریں",
  },
  hero: {
    badge: "خواتین کے لیے مخصوص سیکیورٹی اور پرائیویسی",
    title: "بااحتشام تحفظ، بے سمجھوتہ رازداری۔",
    description:
      "WII سیکیورٹی خواتین کی مخصوص تقریبات کے لیے قابلِ اعتماد، مکمل طور پر خواتین پر مشتمل سیکیورٹی اور پرائیویسی تحفظ فراہم کرتی ہے — ایک نرم، باوقار موجودگی کو آپ کی جگہ، مہمانوں اور یادگار لمحات کے پیشہ ورانہ تحفظ کے ساتھ یکجا کرتے ہوئے۔",
    bookNow: "ابھی بک کریں",
    getQuote: "قیمت معلوم کریں",
    stats: [
      { value: "3", label: "شہروں میں خدمات" },
      { value: "100%", label: "خواتین عملہ" },
      { value: "500+", label: "محفوظ تقریبات" },
    ],
    testimonialQuote: "ہم بالکل بےفکر محسوس کر رہے تھے۔",
    testimonialAuthor: "دلہن، لاہور",
  },
  about: {
    eyebrow: "WII سیکیورٹی کے بارے میں",
    title: "خواتین کی جانب سے، خواتین کے مخصوص مقامات کے لیے تیار کردہ۔",
    paragraph: {
      before: "",
      handle: "womeninislam.wii",
      after:
        " کی جانب سے اس خلا کو پر کرنے کے لیے قائم کیا گیا جس کا سامنا بہت سی خواتین کی مخصوص تقریبات کو ہوتا ہے: ایسی سیکیورٹی اور پرائیویسی تحفظ کی ضرورت جو حیا اور ثقافتی حساسیت کا احترام کرے بغیر مداخلت کا احساس دلائے۔ ہماری مکمل خواتین ٹیمیں تقریب کی سیکیورٹی، پرائیویسی کی پابندی، اور پرسکون، پیشہ ورانہ مہمان نوازی میں تربیت یافتہ ہیں — تاکہ میزبان اور مہمان دونوں مکمل ذہنی سکون کے ساتھ جشن منا سکیں۔",
    },
    values: [
      {
        title: "قابلِ اعتماد",
        desc: "تصدیق شدہ اور مکمل پس منظر کی جانچ شدہ خواتین عملہ جنہیں آپ اپنے نجی ترین لمحات میں خوش آمدید کہہ سکتے ہیں۔",
      },
      {
        title: "محفوظ",
        desc: "رسائی کے کنٹرول، پرائیویسی کی نگرانی، اور موقع پر ہنگامی ردعمل کے لیے تربیت یافتہ طریقہ کار۔",
      },
      {
        title: "پیشہ ورانہ",
        desc: "باوقار، خوش لباس ٹیمیں جو آپ کی تقریب میں گھل مل جاتی ہیں نہ کہ خلل ڈالتی ہیں۔",
      },
      {
        title: "خوش آمدید",
        desc: "ایک گرمجوش، باادب موجودگی جو حیا کا احترام کرتی ہے اور مہمانوں کو بےفکر رکھتی ہے۔",
      },
    ],
  },
  services: {
    eyebrow: "ہماری خدمات",
    title: "خواتین کی مخصوص تقریبات کے لیے تیار کردہ جامع پرائیویسی اور سیکیورٹی",
    learnMore: "مزید جانیں",
    items: [
      {
        title: "خواتین کے لیے مخصوص تقریب سیکیورٹی",
        subtitle: "پرائیویسی کی نگرانی",
        desc: "مکمل خواتین سیکیورٹی ٹیمیں رسائی کنٹرول، مہمانوں کی تصدیق، اور موقع پر پرائیویسی نگرانی کا انتظام کرتی ہیں تاکہ آپ کی تقریب محفوظ، خصوصی اور مکمل طور پر آرام دہ رہے۔",
        bullets: ["خواتین مانیٹرز", "رول اپ بینرز", "مخصوص ایریا"],
      },
      {
        title: "فون پاؤچ سروس",
        subtitle: "ڈیوائس پرائیویسی",
        desc: "مہمانوں کے موبائل فون اور کیمرے داخلے پر محفوظ طریقے سے پاؤچ میں بند کر دیے جاتے ہیں، جس سے غیر مجاز تصاویر یا ریکارڈنگ روکی جاتی ہے اور ہر شریک کی پرائیویسی محفوظ رہتی ہے۔",
        bullets: ["فون پاؤچز", "خواتین مانیٹرز", "رول اپ بینرز"],
      },
      {
        title: "فوٹوگرافی سروس",
        subtitle: "مواد کا کنٹرول",
        desc: "ہم فوٹوگرافرز اور ویڈیوگرافرز کے ساتھ رابطہ کر کے طے شدہ ہدایات کو یقینی بناتے ہیں، تاکہ تصاویر اور فوٹیج آپ کے مہمانوں کی پرائیویسی کی خواہشات کا احترام کریں۔",
        bullets: ["خواتین فوٹوگرافر", "خواتین کی جانب سے ایڈٹ شدہ"],
      },
    ],
  },
  cities: {
    eyebrow: "ہماری خدمات کے شہر",
    title: "جہاں آپ کا جشن ہے، ہم وہاں موجود ہیں",
    items: [
      {
        name: "کراچی",
        desc: "ہمارا بنیادی شہر — مکمل تقریب سیکیورٹی، فون پاؤچ اور فوٹوگرافی کی پابندی کی ٹیمیں۔",
      },
      {
        name: "لاہور",
        desc: "شہر بھر میں شادیوں، مہندیوں اور نجی تقریبات کے لیے مخصوص ٹیمیں۔",
      },
      {
        name: "اسلام آباد",
        desc: "کارپوریٹ اور نجی خواتین کے مخصوص تقریبات کے لیے باوقار، پیشہ ورانہ کوریج۔",
      },
    ],
  },
  howItWorks: {
    eyebrow: "طریقہ کار",
    title: "چار آسان مراحل میں ذہنی سکون بک کریں",
    steps: [
      {
        n: "01",
        title: "اپنی درخواست جمع کروائیں",
        desc: "ہمیں اپنی تقریب کے بارے میں بتائیں — تاریخ، مقام، مہمانوں کی تعداد، اور درکار خدمات۔",
      },
      {
        n: "02",
        title: "اپنی مخصوص قیمت حاصل کریں",
        desc: "ہم آپ کی تقریب کا جائزہ لے کر 24 گھنٹوں میں ایک مخصوص منصوبہ اور قیمت بھیجتے ہیں۔",
      },
      {
        n: "03",
        title: "تصدیق اور تیاری",
        desc: "بکنگ کے بعد ہماری ٹیم لاجسٹکس، بریفنگز اور مقام کے دورے کا انتظام کرتی ہے۔",
      },
      {
        n: "04",
        title: "محفوظ تقریب سے لطف اندوز ہوں",
        desc: "ہماری مکمل خواتین ٹیم تقریب کے آغاز سے اختتام تک سیکیورٹی اور پرائیویسی کا انتظام کرتی ہے۔",
      },
    ],
  },
  gallery: {
    eyebrow: "گیلری",
    title: "محفوظ لمحات، یادگار جشن",
    description:
      "تقریب کی تصاویر جلد شامل کی جائیں گی — تصاویر میں ہماری ٹیمیں اور کلائنٹ کی تقریبات مکمل رضامندی کے ساتھ دکھائی جائیں گی۔",
    items: [
      "فون پاؤچ اسٹیشنز",
      "نگرانی",
      "فوٹوگرافی",
      "رول اپ بینرز",
    ],
    viewFullScreen: "پوری اسکرین پر دیکھیں",
  },
  faqs: {
    eyebrow: "اکثر سوالات",
    title: "اکثر پوچھے گئے سوالات",
    searchPlaceholder: "سوالات تلاش کریں...",
    noResults: "آپ کی تلاش سے کوئی سوال مطابقت نہیں رکھتا۔",
    viewAll: "تمام سوالات دیکھیں",
    items: [
      {
        q: "کیا آپ کی پوری ٹیم مکمل طور پر خواتین پر مشتمل ہے؟",
        a: "جی ہاں۔ ہماری مکمل آن گراؤنڈ ٹیم خواتین پر مشتمل ہے۔",
      },
      {
        q: "کیا تصاویر خواتین ایڈیٹرز کے ذریعے ایڈٹ کی جاتی ہیں؟",
        a: "جی ہاں۔ تمام تصاویر صرف خواتین ایڈیٹرز کے ذریعے ایڈٹ کی جاتی ہیں۔",
      },
      {
        q: "کیا آپ البم یا ہارڈ کاپیز فراہم کرتے ہیں؟",
        a: "نہیں۔ ہم صرف سافٹ کاپیز فراہم کرتے ہیں، جو ایک محفوظ آن لائن لنک یا USB کے ذریعے منتقل کی جاتی ہیں۔",
      },
      {
        q: "پرائیویسی کے حوالے سے ہم آپ کی سروس پر کیسے بھروسہ کر سکتے ہیں؟",
        a: "ہم ہر تقریب کو امانت سمجھتے ہیں۔ آپ کی تصاویر فوری طور پر ایک محفوظ لنک یا USB کے ذریعے آپ کو منتقل کر دی جاتی ہیں اور اس کے بعد ہمارے آلات سے مستقل طور پر حذف کر دی جاتی ہیں۔",
      },
      {
        q: "ہم آپ کے فوٹوگرافی کام کو کیسے دیکھ سکتے ہیں؟",
        a: "بغیر چہرے والا کچھ مواد ہمارے پیج پر دیکھنے کے لیے دستیاب ہے۔ ہم کسی کلائنٹ کا کوئی کام شیئر نہیں کرتے کیونکہ اس کے لیے رضامندی نہیں لی گئی ہوتی۔ صرف رضامندی شدہ، بغیر چہرے والی تصاویر ذاتی طور پر شیئر کی جاتی ہیں۔",
      },
      {
        q: "آپ کن شہروں میں خدمات فراہم کرتے ہیں؟",
        a: "ہم فی الحال کراچی، لاہور اور اسلام آباد میں خدمات فراہم کرتے ہیں۔",
      },
      {
        q: "ہمیں کتنا پہلے بکنگ کروانی چاہیے؟",
        a: "بہتر ہے کہ کم از کم ایک ماہ پہلے بکنگ کروائیں۔ کم از کم تجویز کردہ نوٹس ایک ہفتہ ہے، تاکہ ہم اپنی رضاکار ٹیم مختص اور تیار کر سکیں۔",
      },
      {
        q: "کیا آپ ایڈوانس ادائیگی کا تقاضا کرتے ہیں؟",
        a: "جی ہاں۔ آپ کی بکنگ کی تصدیق کے لیے ایڈوانس ادائیگی درکار ہے، جبکہ باقی رقم تقریب کے دن ادا کی جاتی ہے۔",
      },
      {
        q: "کیا آپ حسبِ ضرورت پیکجز پیش کرتے ہیں؟",
        a: "بالکل۔ ہر کوٹیشن آپ کی تقریب، مہمانوں کی تعداد، مقام اور پرائیویسی کی ضروریات کے مطابق تیار کی جاتی ہے۔ ذاتی نوعیت کے منصوبے کے لیے ہمیں پیغام بھیجیں۔",
      },
      {
        q: "فون پاؤچ سروس کیا ہے؟",
        a: "ہمارے فون پاؤچز موبائل کے فرنٹ اور بیک دونوں کیمرے بلاک کر دیتے ہیں جبکہ مہمان اپنا فون استعمال کرتے رہ سکتے ہیں۔ اس پیکج میں خواتین مانیٹرز اور رول اپ پرائیویسی بینرز بھی شامل ہیں۔",
      },
      {
        q: "نان فون پاؤچ سروس کیا ہے؟",
        a: "ہماری خواتین مانیٹرز غیر مجاز فوٹوگرافی کو روک کر آپ کی تقریب کو محفوظ بناتی ہیں۔ اس سروس میں رول اپ پرائیویسی بینرز اور، جہاں ضرورت ہو، مہمانوں کے لیے مخصوص نجی فوٹو ایریا بھی شامل ہے۔",
      },
      {
        q: "آپ کے خواتین فوٹوگرافی پیکج میں کیا شامل ہے؟",
        a: "بیسک پیکج — دلہن اور کپل شوٹ، 120 سے 150 پیشہ ورانہ ایڈٹ شدہ تصاویر۔ پریمیم پیکج — پوری دن کی تقریب کی کوریج، لامحدود پیشہ ورانہ ایڈٹ شدہ تصاویر۔",
      },
      {
        q: "آپ کے ویڈیوگرافی پیکج میں کیا شامل ہے؟",
        a: "پیکجز آپ کی ضروریات کے مطابق تیار کیے جاتے ہیں اور ان میں شامل ہو سکتے ہیں: سینیمیٹک ہائی لائٹ فلم، انسٹاگرام طرز کی مختصر ریلز، تعریفی ویڈیوز، اور مکمل تقریب کی کوریج۔",
      },
    ],
  },
  bookCta: {
    eyebrow: "قیمت حاصل کریں",
    title: "اپنی ذاتی نوعیت کی سیکیورٹی قیمت حاصل کریں",
    description:
      "ہمیں اپنی تقریب کے بارے میں بتائیں اور ہم آپ کو ایک مخصوص سیکیورٹی اور پرائیویسی قیمت بھیجیں گے۔",
    perks: [
      "مکمل خواتین، پس منظر کی جانچ شدہ عملہ",
      "24 گھنٹوں میں مخصوص قیمت",
      "فون پاؤچ اور فوٹوگرافی کی پابندی شامل",
      "کراچی، لاہور اور اسلام آباد میں دستیاب",
    ],
    form: {
      fullName: "پورا نام",
      phoneNumber: "فون نمبر",
      phoneCodes: [
        { code: "+92", country: "پاکستان" },
        { code: "+971", country: "متحدہ عرب امارات" },
        { code: "+966", country: "سعودی عرب" },
        { code: "+44", country: "برطانیہ" },
        { code: "+1", country: "امریکہ / کینیڈا" },
      ],
      email: "ای میل",
      city: "شہر",
      citySelectPlaceholder: "شہر منتخب کریں",
      cityOptions: ["کراچی", "لاہور", "اسلام آباد"],
      eventDate: "تقریب کی تاریخ",
      femaleGuests: "خواتین مہمانوں کی تعداد",
      hearAboutUs: "آپ کو ہمارے بارے میں کیسے پتا چلا؟",
      hearAboutUsOptions: ["لنکڈان", "انسٹاگرام", "دوست/رشتہ دار", "دیگر"],
      otherOptionValue: "دیگر",
      otherPlaceholder: "براہ کرم وضاحت کریں",
      guestServiceLabel: "فون پاؤچز یا نگرانی",
      guestServiceOptions: [
        {
          value: "phone-pouches",
          label: "فون پاؤچز",
          description:
            "مہمانوں کے فون اور کیمرے داخلے پر محفوظ طریقے سے پاؤچ میں بند کیے جاتے ہیں، جس سے غیر مجاز تصاویر یا ریکارڈنگ روکی جاتی ہے۔",
        },
        {
          value: "monitoring",
          label: "نگرانی (بغیر پاؤچ)",
          description:
            "پاؤچنگ کے بغیر موقع پر پرائیویسی نگرانی اور رسائی کنٹرول — ہماری ٹیم غیر مجاز فوٹوگرافی پر نظر رکھتی ہے۔",
        },
      ],
      photographyLabel: "خواتین فوٹوگرافی",
      photographyTierLabel: "فوٹوگرافی پیکج",
      videographyLabel: "ویڈیوگرافی",
      videographyTierLabel: "ویڈیوگرافی پیکج",
      atLeastOneServiceError: "براہ کرم اس ایونٹ کے لیے کم از کم ایک سروس منتخب کریں۔",
      details: "خصوصی درخواست یا تفصیلات",
      detailsPlaceholder:
        "خصوصی ہدایات، تقریب کی قسم، یا کوئی اور بات جو ہمیں معلوم ہونی چاہیے",
      eventLabel: "تقریب",
      addEvent: "ایک اور تقریب شامل کریں",
      removeEvent: "حذف کریں",
      submit: "قیمت کی درخواست دیں",
      submitting: "جمع ہو رہا ہے…",
    },
    review: {
      title: "اپنی درخواست کا جائزہ لیں",
      contactHeading: "آپ کی تفصیلات",
      edit: "ترمیم کریں",
      confirm: "تصدیق اور جمع کروائیں",
      confirming: "آپ کی قیمت حاصل کی جا رہی ہے…",
      notProvided: "فراہم نہیں کیا گیا",
      submitError: "آپ کی درخواست جمع کرانے میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔",
    },
    success: {
      title: "درخواست موصول ہو گئی",
      message:
        "شکریہ! آپ کی تخمینی قیمت PDF کے طور پر ڈاؤن لوڈ ہو گئی ہے۔ ہماری ٹیم 24 گھنٹوں میں رابطہ کرے گی۔",
      downloadPdf: "PDF نہیں ملی؟ یہاں سے ڈاؤن لوڈ کریں",
    },
  },
  booking: {
    eyebrow: "اپنی تقریب بک کریں",
    title: "اپنی بکنگ کی تصدیق کریں",
    description:
      "اپنی تقریب کی تفصیلات پُر کریں اور بکنگ کی تصدیق کے لیے ادائیگی کی رسید شیئر کریں۔",
    perks: [
      "مکمل خواتین، پس منظر کی جانچ شدہ عملہ",
      "24 گھنٹوں میں بکنگ کی تصدیق",
      "محفوظ، نجی ادائیگی کی تصدیق",
    ],
    form: {
      fullName: "پورا نام",
      contactNumber: "رابطہ نمبر",
      eventDate: "تقریب کی تاریخ",
      reportingTime: "تقریب کے رپورٹنگ کا وقت",
      eventType: "تقریب کی قسم",
      eventTypeOptions: ["بارات", "ولیمہ", "دیگر"],
      otherOptionValue: "دیگر",
      otherPlaceholder: "براہ کرم وضاحت کریں",
      city: "شہر",
      citySelectPlaceholder: "شہر منتخب کریں",
      cityOptions: ["کراچی", "لاہور", "اسلام آباد"],
      venue: "مقام",
      femaleGuests: "خواتین مہمانوں کی تعداد",
      totalAmount: "کل ادا کی جانے والی رقم (PKR)",
      dueNowPrefix: "ابھی ادا کریں (50%):",
      dueNowExample: "مثال: کل 25,000 → ابھی ادائیگی 12,500",
      eventLabel: "تقریب",
      addEvent: "ایک اور تقریب شامل کریں",
      removeEvent: "حذف کریں",
      accountDetailsHeading: "بینک اکاؤنٹ کی تفصیلات",
      accountTitleLabel: "اکاؤنٹ ٹائٹل",
      accountTitleValue: "NABIA HASSAN SABZWARI",
      accountNumberLabel: "اکاؤنٹ نمبر",
      accountNumberValue: "3123456789012345",
      bankNameLabel: "بینک کا نام",
      bankNameValue: "فیصل بینک",
      receiptLabel: "ادائیگی کی رسید کا اسکرین شاٹ",
      receiptPlaceholder: "فائل منتخب کریں...",
      receiptBrowse: "براؤز کریں",
      termsPrefix: "میں شرائط و ضوابط سے اتفاق کرتا/کرتی ہوں",
      termsLinkLabel: "شرائط و ضوابط",
      terminationDisclaimer:
        "ہماری شرائط و ضوابط کی خلاف ورزی — بشمول تقریب کے بارے میں غلط یا گمراہ کن معلومات فراہم کرنا — سروس کی فوری منسوخی کا باعث بنے گی۔",
      submit: "بکنگ جمع کروائیں",
    },
    review: {
      title: "اپنی بکنگ کا جائزہ لیں",
      edit: "ترمیم کریں",
      confirm: "تصدیق اور جمع کروائیں",
      submitting: "جمع کروایا جا رہا ہے...",
      notProvided: "فراہم نہیں کیا گیا",
      termsAgreed: "اتفاق کیا گیا",
      termsNotAgreed: "اتفاق نہیں کیا گیا",
    },
    success: {
      title: "بکنگ موصول ہو گئی",
      message:
        "شکریہ! ہمیں آپ کی بکنگ اور ادائیگی کی تفصیلات موصول ہو گئی ہیں۔ ہماری ٹیم جلد ہی تصدیق کرے گی۔",
    },
  },
  footer: {
    tagline:
      "پاکستان بھر میں خواتین کی مخصوص تقریبات کے لیے قابلِ اعتماد، باوقار سیکیورٹی اور پرائیویسی تحفظ۔",
    companyHeading: "کمپنی",
    companyLinks: ["WII سیکیورٹی کے بارے میں", "ہماری خدمات", "طریقہ کار", "کیریئرز"],
    careersSoon: "(جلد)",
    legalHeading: "قانونی",
    legalLinks: ["پرائیویسی پالیسی", "شرائط و ضوابط"],
    followHeading: "ہمیں فالو کریں",
    social: ["انسٹاگرام"],
    contactHeading: "رابطہ",
    contactCities: "کراچی · لاہور · اسلام آباد",
    copyright: "WII سیکیورٹی۔ جملہ حقوق محفوظ ہیں۔",
    designedWithCare: "خواتین کے لیے، محبت سے تیار کردہ۔",
  },
};

export const translations = { en, ur } as const;

export type Translations = typeof en;
