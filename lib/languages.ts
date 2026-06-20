export type LanguageCode =
  | "en"
  | "hi" | "bn" | "te" | "mr" | "ta" | "ur" | "gu" | "kn" | "ml"
  | "or" | "pa" | "as" | "mai" | "sa" | "ne" | "sd" | "ks" | "kok"
  | "mni" | "doi" | "brx" | "sat";

export type Language = {
  code: LanguageCode;
  name: string;
  native: string;
  locale: string;
  script?: string;
};

export const LANGUAGES: Language[] = [
  { code: "en",  name: "English",   native: "English",        locale: "en-IN" },
  { code: "hi",  name: "Hindi",     native: "हिन्दी",          locale: "hi-IN" },
  { code: "bn",  name: "Bengali",   native: "বাংলা",          locale: "bn-IN" },
  { code: "te",  name: "Telugu",    native: "తెలుగు",        locale: "te-IN" },
  { code: "mr",  name: "Marathi",   native: "मराठी",          locale: "mr-IN" },
  { code: "ta",  name: "Tamil",     native: "தமிழ்",          locale: "ta-IN" },
  { code: "ur",  name: "Urdu",      native: "اُردُو",          locale: "ur-IN" },
  { code: "gu",  name: "Gujarati",  native: "ગુજરાતી",        locale: "gu-IN" },
  { code: "kn",  name: "Kannada",   native: "ಕನ್ನಡ",          locale: "kn-IN" },
  { code: "ml",  name: "Malayalam", native: "മലയാളം",        locale: "ml-IN" },
  { code: "or",  name: "Odia",      native: "ଓଡ଼ିଆ",           locale: "or-IN" },
  { code: "pa",  name: "Punjabi",   native: "ਪੰਜਾਬੀ",          locale: "pa-IN" },
  { code: "as",  name: "Assamese",  native: "অসমীয়া",        locale: "as-IN" },
  { code: "mai", name: "Maithili",  native: "मैथिली",          locale: "mai-IN" },
  { code: "sa",  name: "Sanskrit",  native: "संस्कृतम्",        locale: "sa-IN" },
  { code: "ne",  name: "Nepali",    native: "नेपाली",          locale: "ne-NP" },
  { code: "sd",  name: "Sindhi",    native: "سنڌي",          locale: "sd-IN" },
  { code: "ks",  name: "Kashmiri",  native: "کٲشُر",          locale: "ks-IN" },
  { code: "kok", name: "Konkani",   native: "कोंकणी",         locale: "kok-IN" },
  { code: "mni", name: "Manipuri",  native: "ꯃꯤꯇꯩ ꯂꯣꯟ",      locale: "mni-IN" },
  { code: "doi", name: "Dogri",     native: "डोगरी",           locale: "doi-IN" },
  { code: "brx", name: "Bodo",      native: "बड़ो",            locale: "brx-IN" },
  { code: "sat", name: "Santali",   native: "ᱥᱟᱱᱛᱟᱲᱤ",        locale: "sat-IN" }
];

export const findLanguage = (code: string): Language | undefined =>
  LANGUAGES.find((l) => l.code === code);
