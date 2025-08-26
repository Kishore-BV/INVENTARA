"use client"

import { useState, useEffect, useCallback } from "react"
import { Settings, X, Palette, Layout, Menu, Square, RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"

interface ThemeConfig {
  menuState: "full" | "collapsed" | "hidden"
  layout: "ltr" | "rtl"
  colors: {
    light: {
      background: string
      foreground: string
      primary: string
      primaryForeground: string
      secondary: string
      secondaryForeground: string
      accent: string
      accentForeground: string
      muted: string
      mutedForeground: string
      border: string
      input: string
      ring: string
      card: string
      cardForeground: string
      menuText: string
      menuTextHover: string
      menuIcon: string
      menuIconHover: string
      menuSectionLabel: string
    }
    dark: {
      background: string
      foreground: string
      primary: string
      primaryForeground: string
      secondary: string
      secondaryForeground: string
      accent: string
      accentForeground: string
      muted: string
      mutedForeground: string
      border: string
      input: string
      ring: string
      card: string
      cardForeground: string
      menuText: string
      menuTextHover: string
      menuIcon: string
      menuIconHover: string
      menuSectionLabel: string
    }
  }
  card: {
    borderRadius: number
    borderWidth: number
    padding: number
  }
  typography: {
    fontSize: number
    fontWeight: string
    lineHeight: number
  }
  button: {
    borderRadius: number
    fontSize: number
    padding: string
  }
}

const defaultConfig: ThemeConfig = {
  menuState: "full",
  layout: "ltr",
  colors: {
    light: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      primary: "222.2 47.4% 11.2%",
      primaryForeground: "210 40% 98%",
      secondary: "210 40% 96%",
      secondaryForeground: "222.2 84% 4.9%",
      accent: "210 40% 96%",
      accentForeground: "222.2 84% 4.9%",
      muted: "210 40% 96%",
      mutedForeground: "215.4 16.3% 46.9%",
      border: "214.3 31.8% 91.4%",
      input: "214.3 31.8% 91.4%",
      ring: "222.2 84% 4.9%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      menuText: "222.2 84% 4.9%",
      menuTextHover: "222.2 84% 4.9%",
      menuIcon: "222.2 84% 4.9%",
      menuIconHover: "222.2 84% 4.9%",
      menuSectionLabel: "215.4 16.3% 35%",
    },
    dark: {
      background: "240 10% 3.9%",
      foreground: "0 0% 98%",
      primary: "0 0% 98%",
      primaryForeground: "240 5.9% 10%",
      secondary: "240 3.7% 15.9%",
      secondaryForeground: "0 0% 98%",
      accent: "240 3.7% 15.9%",
      accentForeground: "0 0% 98%",
      muted: "240 3.7% 15.9%",
      mutedForeground: "240 5% 64.9%",
      border: "240 3.7% 15.9%",
      input: "240 3.7% 15.9%",
      ring: "240 4.9% 83.9%",
      card: "240 10% 3.9%",
      cardForeground: "0 0% 98%",
      menuText: "0 0% 98%",
      menuTextHover: "0 0% 98%",
      menuIcon: "0 0% 98%",
      menuIconHover: "0 0% 98%",
      menuSectionLabel: "240 5% 75%",
    },
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
  },
  typography: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 1.5,
  },
  button: {
    borderRadius: 6,
    fontSize: 14,
    padding: "8px 16px",
  },
}

export function ThemeCustomizer({ embed = false }: { embed?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig)
  const [editingDarkMode, setEditingDarkMode] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    localStorage.setItem("theme-config", JSON.stringify(config))
    alert("Theme configuration saved!")
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    localStorage.removeItem("theme-config")
    alert("Theme configuration reset to default!")
  }

  const updateConfig = (path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = JSON.parse(JSON.stringify(prev))
      const keys = path.split(".")
      let current: any = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value

      return newConfig
    })
  }

  const handleDarkModeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const ColorInput = ({ label, path, value }: { label: string; path: string; value: string }) => {
    const safeValue = value || "0 0% 0%"

    return (
      <div className="space-y-2">
        <Label className="text-xs font-medium">{label}</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={safeValue}
            onChange={(e) => updateConfig(path, e.target.value)}
            className="flex-1 h-8 text-xs"
            placeholder="0 0% 100%"
          />
        </div>
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  const panelPosition = config.layout === "rtl" ? "left-0" : "right-0"
  const buttonPosition = config.layout === "rtl" ? "left-4" : "right-4"

  if (embed) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Theme Customizer</h2>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4" />
                <Label className="font-medium">Menu</Label>
              </div>
              <Select
                value={config.menuState}
                onValueChange={(value: "full" | "collapsed" | "hidden") => updateConfig("menuState", value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[110]">
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="collapsed">Collapsed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <Label className="font-medium">Layout</Label>
              </div>
              <Select value={config.layout} onValueChange={(value: "ltr" | "rtl") => updateConfig("layout", value)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[110]">
                  <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                  <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label className="font-medium">Dark Mode</Label>
              <Switch checked={theme === "dark"} onCheckedChange={handleDarkModeToggle} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="font-medium">Edit Dark Colors</Label>
              <Switch checked={editingDarkMode} onCheckedChange={setEditingDarkMode} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <Label className="font-medium">Colors ({editingDarkMode ? "Dark" : "Light"})</Label>
              </div>

              <div className="grid gap-3 max-h-80 overflow-y-auto">
                <ColorInput
                  label="Background"
                  path={`colors.${editingDarkMode ? "dark" : "light"}.background`}
                  value={editingDarkMode ? config.colors.dark.background : config.colors.light.background}
                />
                <ColorInput
                  label="Foreground"
                  path={`colors.${editingDarkMode ? "dark" : "light"}.foreground`}
                  value={editingDarkMode ? config.colors.dark.foreground : config.colors.light.foreground}
                />
                <ColorInput
                  label="Primary"
                  path={`colors.${editingDarkMode ? "dark" : "light"}.primary`}
                  value={editingDarkMode ? config.colors.dark.primary : config.colors.light.primary}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${buttonPosition} top-1/2 -translate-y-1/2 z-[80] p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
        title="Theme Customizer"
      >
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[90]" onClick={() => setIsOpen(false)} />
          <div
            className={`fixed ${panelPosition} top-0 h-full w-80 bg-white dark:bg-gray-900 border-${config.layout === "rtl" ? "r" : "l"} border-gray-200 dark:border-gray-700 z-[100] overflow-y-auto`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Theme Customizer</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Floating mode content would go here</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
