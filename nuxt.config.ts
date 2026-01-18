// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    public: {
      webPushPublic: ''
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Global css
  css: ['~/assets/css/main.css'],

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
        { name: 'description', content: 'Fresh Inc. — это инновационный IT-проект, созданный для воплощения самых амбициозных идей и предоставления уникальных решений для игроков.' },
        { property: 'og:title', content: 'Fresh Inc.' },
        { property: 'og:description', content: 'Fresh Inc. — это инновационный IT-проект, созданный для воплощения самых амбициозных идей и предоставления уникальных решений для игроков.' },
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
      script: [
        { src: '/register-sw.js', type: 'text/javascript', defer: true }
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  colorMode: {
    classSuffix: ''
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: 'Sh',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },

  icon: {
    mode: 'css',
    cssLayer: 'base',
    componentName: 'Icon',
  },

  modules: ['@nuxtjs/color-mode', '@nuxt/icon', '@nuxtjs/device', 'shadcn-nuxt', '@pinia/nuxt', '@artmizu/yandex-metrika-nuxt'],
})