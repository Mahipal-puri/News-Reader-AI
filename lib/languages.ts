export type LanguageCode =
  | "en"
  | "hi" | "bn" | "te" | "mr" | "ta" | "ur" | "gu" | "kn" | "ml"
  | "or" | "pa" | "as" | "mai" | "sa" | "ne" | "sd" | "ks" | "kok"
  | "mni" | "doi" | "brx" | "sat";

export type Language = {
  code: LanguageCode;
  name: string;
  native: string;
  script?: string;
};

export const LANGUAGES: Language[] = [
  { code: "en",  name: "English",   native: "English" },
  { code: "hi",  name: "Hindi",     native: "हिन्दी" },
  { code: "bn",  name: "Bengali",   native: "বাংলা" },
  { code: "te",  name: "Telugu",    native: "తెలుగు" },
  { code: "mr",  name: "Marathi",   native: "मराठी" },
  { code: "ta",  name: "Tamil",     native: "தமிழ்" },
  { code: "ur",  name: "Urdu",      native: "اُردُو" },
  { code: "gu",  name: "Gujarati",  native: "ગુજરાતી" },
  { code: "kn",  name: "Kannada",   native: "ಕನ್ನಡ" },
  { code: "ml",  name: "Malayalam", native: "മലയാളം" },
  { code: "or",  name: "Odia",      native: "ଓଡ଼ିଆ" },
  { code: "pa",  name: "Punjabi",   native: "ਪੰਜਾਬੀ" },
  { code: "as",  name: "Assamese",  native: "অসমীয়া" },
  { code: "mai", name: "Maithili",  native: "मैथिली" },
  { code: "sa",  name: "Sanskrit",  native: "संस्कृतम्" },
  { code: "ne",  name: "Nepali",    native: "नेपाली" },
  { code: "sd",  name: "Sindhi",    native: "سنڌي" },
  { code: "ks",  name: "Kashmiri",  native: "کٲشُر" },
  { code: "kok", name: "Konkani",   native: "कोंकणी" },
  { code: "mni", name: "Manipuri",  native: "ꯃꯤꯇꯩ ꯂꯣꯟ" },
  { code: "doi", name: "Dogri",     native: "डोगरी" },
  { code: "brx", name: "Bodo",      native: "बड़ो" },
  { code: "sat", name: "Santali",   native: "ᱥᱟᱱᱛᱟᱲᱤ" }
];

export const findLanguage = (code: string): Language | undefined =>
  LANGUAGES.find((l) => l.code === code);
