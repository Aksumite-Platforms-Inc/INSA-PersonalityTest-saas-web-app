"use client"

import { useContext } from "react"
import { LanguageContext } from "@/components/language-provider"
import { translations } from "@/lib/translations"

export function useTranslation() {
  const { language } = useContext(LanguageContext)

  const t = (key: string, params?: Record<string, string | number>) => {
    // Split the key by dots to access nested properties
    const keys = key.split(".")

    // Get the translation object for the current language
    let translation: any = translations[language] || translations.en

    // Navigate through the nested properties
    for (const k of keys) {
      translation = translation?.[k]

      // If translation is not found, return the key
      if (!translation) return key
    }

    // If the translation is not a string, return the key
    if (typeof translation !== "string") return key

    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue))
      }, translation)
    }

    return translation
  }

  return { t, language }
}
