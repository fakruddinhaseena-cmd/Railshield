import { createContext, useContext, useState, ReactNode } from 'react'

const translations = {
  en: {
    dashboard: 'Dashboard', assets: 'Assets', threats: 'Threats',
    alerts: 'Alerts', compliance: 'Compliance', aiEngine: 'AI Engine',
    railMap: 'Rail Map', reports: 'Reports',
    totalAssets: 'Total Assets', activeThreats: 'Active Threats',
    blockedToday: 'Blocked Today', complianceScore: 'Compliance',
    liveThreatFeed: 'Live Threat Feed', secure: 'Secure',
    warning: 'Warning', critical: 'Critical', networkHealth: 'Network Health',
    kavachNodes: 'Kavach Nodes', systemOnline: 'System Online',
    indiaModule: 'India Module',
  },
  hi: {
    dashboard: 'डैशबोर्ड', assets: 'संपत्ति', threats: 'खतरे',
    alerts: 'अलर्ट', compliance: 'अनुपालन', aiEngine: 'AI इंजन',
    railMap: 'रेल मानचित्र', reports: 'रिपोर्ट',
    totalAssets: 'कुल संपत्ति', activeThreats: 'सक्रिय खतरे',
    blockedToday: 'आज अवरुद्ध', complianceScore: 'अनुपालन',
    liveThreatFeed: 'लाइव खतरा फ़ीड', secure: 'सुरक्षित',
    warning: 'चेतावनी', critical: 'गंभीर', networkHealth: 'नेटवर्क स्वास्थ्य',
    kavachNodes: 'कवच नोड्स', systemOnline: 'सिस्टम ऑनलाइन',
    indiaModule: 'भारत मॉड्यूल',
  },
}

type Lang = 'en' | 'hi'
type T = typeof translations.en

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: T
}

const LangContext = createContext<LangContextType>({} as LangContextType)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
