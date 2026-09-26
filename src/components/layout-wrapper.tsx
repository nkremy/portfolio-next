"use client"

import { Navbar } from "@/components/Navbar"
// import { HireMe } from "@/components/hire-me"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SmoothScroll } from "@/components/smooth-scroll"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      {children}
      {/* <HireMe /> */}
      <Footer />
      <ScrollToTop />
    </SmoothScroll>
  )
}
