import AppLayout from "@/components/layouts/appLayout"
import { ThemeProvider } from "@/components/providers/themeProvider"
import { Toaster } from "@/components/ui/sonner"
import Web3ModalProvider from "@/components/web3/context/appContext"
import SheWellProvider from "@/components/web3/context/sheWellContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Web3ModalProvider>
        <SheWellProvider>
          <AppLayout>
            <Component {...pageProps} />
            <Toaster />
          </AppLayout>
        </SheWellProvider>
      </Web3ModalProvider>
    </ThemeProvider>
  )
}
