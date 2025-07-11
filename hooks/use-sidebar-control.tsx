"use client"

import { useState, useCallback } from "react"

export function useSidebarControl() {
  const [isOpen, setIsOpen] = useState(true)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    toggle,
    open,
    close,
    setIsOpen,
  }
}
