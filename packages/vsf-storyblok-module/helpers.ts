const defaultSettings = {
  addRoutes: true,
  hreflangPrefix: '',
}

export const getSettings = (settings = {}) => ({
  ...defaultSettings,
  ...settings
})
