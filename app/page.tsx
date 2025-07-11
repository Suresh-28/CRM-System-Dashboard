"use client"

import { CRMProvider } from "@/components/crm-provider"
import { CRMLayout } from "@/components/crm-layout"

export default function Home() {
  return (
    <CRMProvider>
      <CRMLayout />
    </CRMProvider>
  )
}
