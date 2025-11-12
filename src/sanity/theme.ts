import {buildLegacyTheme} from 'sanity'

const brandPrimary = '#ef4444'
const brandPrimaryStrong = '#dc2626'
const brandAccent = '#f97316'
const brandBlack = '#0b0f19'
const brandWhite = '#f8fafc'

export const owlTechTheme = buildLegacyTheme({
  '--black': brandBlack,
  '--white': brandWhite,
  '--gray': '#1f2937',
  '--component-bg': '#111827',
  '--component-text-color': brandWhite,
  '--component-bg-hover': '#152238',
  '--component-border-color': '#1f2937',
  '--focus-color': brandAccent,
  '--link-color': brandAccent,
  '--brand-primary': brandPrimary,
  '--brand-primary--inverted': brandWhite,
  '--default-button-color': brandPrimary,
  '--default-button-primary-color': brandPrimary,
  '--default-button-success-color': '#22c55e',
  '--default-button-warning-color': '#facc15',
  '--default-button-danger-color': '#ef4444',
  '--state-danger-color': '#f87171',
  '--state-warning-color': '#facc15',
  '--state-success-color': '#22c55e',
  '--state-info-color': brandPrimaryStrong,
})
