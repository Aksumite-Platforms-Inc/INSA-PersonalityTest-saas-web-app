"use client"

import * as React from "react"

type Language = "en" | "am"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
}

export const LanguageContext = React.createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>("en")

  // Load saved language preference from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}
