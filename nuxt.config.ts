// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  // Global css
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      title: 'Fresh Inc.',
      titleTemplate: '%s | Fresh Inc.',
      charset: 'utf-8',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5 shrink-to-fit=no' },
        { hid: 'description', name: 'description', content: 'Fresh Inc. — это инновационный IT-проект, созданный для воплощения самых амбициозных идей и предоставления уникальных решений для пользователей сервера СПм.' },
        { property: 'og:title', content: 'Fresh Inc.' },
        { property: 'og:description', content: 'Fresh Inc. — это инновационный IT-проект, созданный для воплощения самых амбициозных идей и предоставления уникальных решений для пользователей сервера СПм.' },
        { property: 'og:site_name', content: 'Fresh Inc.' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:image', content: 'https://fresh.zaralx.ru/android-chrome-512x512.png' },
        { property: 'og:canonical', content: 'https://fresh.zaralx.ru' },
        { property: 'og:url', content: 'https://fresh.zaralx.ru' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Fira+Code:wght@300..700&display=swap&family=Onest:wght@100..900',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  elementPlus: {
    themes: []
  },

  colorMode: {
    classSuffix: ''
  },

  modules: ['@nuxtjs/color-mode', '@nuxtjs/tailwindcss', '@element-plus/nuxt', '@nuxt/icon'],
})