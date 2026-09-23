import { useTheme } from '@/context/ThemeContext'

// Recharts props (stroke, fill, contentStyle) need literal color values —
// they can't consume CSS custom properties the way Tailwind classes can.
// This hook mirrors the two theme palettes defined in index.css so charts
// stay legible (and on-brand, navy/teal per the pitch-deck palette) in
// both modes.
export function useChartColors() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return {
    grid: dark ? '#262B3A' : '#DDE2EA',
    axisLine: dark ? '#262B3A' : '#DDE2EA',
    tick: dark ? '#9499A6' : '#5B6472',
    tooltipBg: dark ? '#171A24' : '#FFFFFF',
    tooltipBorder: dark ? '#262B3A' : '#DDE2EA',
    tooltipLabel: dark ? '#9499A6' : '#5B6472',
    brand: dark ? '#5B8DEF' : '#1E3A5F',
    secondary: dark ? '#2DD4BF' : '#0D9488',
    mutedLine: dark ? '#5D6373' : '#8B93A1',
    barInactive: dark ? '#2A2F3F' : '#DDE2EA',
  }
}
