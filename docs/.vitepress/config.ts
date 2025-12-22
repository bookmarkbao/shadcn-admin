import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Shadcn Admin Docs',
  description: 'Development and contributor guide for the Shadcn Admin dashboard.',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Architecture', link: '/reference/architecture' },
      { text: 'Scripts', link: '/reference/scripts' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Developing Docs', link: '/guide/developing-docs' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Architecture', link: '/reference/architecture' },
            { text: 'Scripts & Workflows', link: '/reference/scripts' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/satnaing/shadcn-admin' },
    ],
    search: {
      provider: 'local',
    },
  },
})
