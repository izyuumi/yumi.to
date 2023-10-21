// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    "@nuxtjs/robots",
  ],
  supabase: {
    redirect: false,
  },
  robots: {
    UserAgent: "*",
    Disallow: "/",
  },
});
