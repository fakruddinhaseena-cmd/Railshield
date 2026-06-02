import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { AuthProvider } from '../utils/auth'
import { LangProvider } from '../utils/i18n'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LangProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </LangProvider>
  )
}
