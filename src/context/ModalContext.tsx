"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface ModalContextType {
  isSearchOpen: boolean
  searchTab: "location" | "bus"
  openSearch: (tab?: "location" | "bus") => void
  closeSearch: () => void
  isAccountOpen: boolean
  openAccount: () => void
  closeAccount: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTab, setSearchTab] = useState<"location" | "bus">("location")
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const openSearch = (tab: "location" | "bus" = "location") => {
    setSearchTab(tab)
    setIsSearchOpen(true)
  }

  const closeSearch = () => setIsSearchOpen(false)

  const openAccount = () => setIsAccountOpen(true)
  const closeAccount = () => setIsAccountOpen(false)

  return (
    <ModalContext.Provider
      value={{
        isSearchOpen,
        searchTab,
        openSearch,
        closeSearch,
        isAccountOpen,
        openAccount,
        closeAccount,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
