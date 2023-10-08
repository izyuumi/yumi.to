export default async function useExternalRedirect(
  url: string = "https://yumiizumi.com/",
  code: number = 302
) {
  if (process.server) {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext?.event) {
      await nuxtApp.callHook("app:redirected");
      if (nuxtApp.ssrContext?.event) {
        return sendRedirect(nuxtApp.ssrContext.event, url, code);
      }
    }
  } else {
    window.location.href = url;
  }
  throw new Error("Failed to redirect");
}
