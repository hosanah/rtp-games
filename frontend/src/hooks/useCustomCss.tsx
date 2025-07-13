import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { settingsApi } from '@/lib/api'

interface CustomCssContextProps {
  css: string
  updateCss: (css: string) => Promise<void>
}

const CustomCssContext = createContext<CustomCssContextProps | undefined>(undefined)

function applyCss(css: string) {
  let tag = document.getElementById('custom-css') as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement('style')
    tag.id = 'custom-css'
    document.head.appendChild(tag)
  }
  tag.innerHTML = css
}

export function CustomCssProvider({ children }: { children: ReactNode }) {
  const [css, setCss] = useState('')

  useEffect(() => {
    settingsApi.getTheme()
      .then(res => {
        setCss(res.data.css || '')
        applyCss(res.data.css || '')
      })
      .catch(() => {})
  }, [])

  const updateCss = async (newCss: string) => {
    await settingsApi.updateTheme({ css: newCss })
    setCss(newCss)
    applyCss(newCss)
  }

  return (
    <CustomCssContext.Provider value={{ css, updateCss }}>
      {children}
    </CustomCssContext.Provider>
  )
}

export function useCustomCss() {
  const ctx = useContext(CustomCssContext)
  if (!ctx) throw new Error('useCustomCss must be used within CustomCssProvider')
  return ctx
}
