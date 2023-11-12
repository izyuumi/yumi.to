// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    "@nuxtjs/robots",
    "nuxt-primevue",
  ],
  css: ["primevue/resources/themes/lara-dark-teal/theme.css"],
  supabase: {
    redirect: false,
  },
  robots: {
    UserAgent: "*",
    Disallow: "/",
  },
  primevue: {
    components: {
      prefix: "P",
      include: ["Calendar"],
    },
  },
});
