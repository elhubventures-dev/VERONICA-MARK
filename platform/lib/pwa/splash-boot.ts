/**
 * Inline mobile splash boot — runs while the body is parsed, before React hydrates.
 * Kept as plain strings so root layout can inject without a client bundle.
 */
export const PWA_SPLASH_IMAGE = "/media/site/mobile-app-splash-screen.webp";
export const PWA_SPLASH_BG = "#1A0F2E";
export const PWA_SPLASH_SESSION_KEY = "vm-pwa-splash-shown";
export const PWA_SPLASH_MIN_MS = 1600;
export const PWA_SPLASH_FADE_MS = 450;

export const pwaSplashBootCss = `
#vm-pwa-splash{display:none;position:fixed;inset:0;z-index:2147483646;background:${PWA_SPLASH_BG};margin:0;padding:0;pointer-events:auto}
html.vm-pwa-splash-active #vm-pwa-splash{display:block}
#vm-pwa-splash img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
#vm-pwa-splash.is-fading{opacity:0;transition:opacity ${PWA_SPLASH_FADE_MS}ms ease-out;pointer-events:none}
`.trim();

/** Decide on mobile, show splash, then fade after timers. */
export const pwaSplashBootScript = `
(function(){
  try {
    var key=${JSON.stringify(PWA_SPLASH_SESSION_KEY)};
    var minMs=${PWA_SPLASH_MIN_MS};
    var fadeMs=${PWA_SPLASH_FADE_MS};
    var ua = navigator.userAgent || "";
    var mobile =
      window.matchMedia("(max-width: 1023px)").matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!mobile) return;
    if (sessionStorage.getItem(key) === "1") return;
    sessionStorage.setItem(key, "1");
    document.documentElement.classList.add("vm-pwa-splash-active");
    function dismiss(){
      var el = document.getElementById("vm-pwa-splash");
      document.documentElement.classList.remove("vm-pwa-splash-active");
      if (!el) return;
      el.classList.add("is-fading");
      window.setTimeout(function(){ el.remove(); }, fadeMs);
    }
    window.setTimeout(dismiss, minMs);
  } catch (e) {}
})();
`.trim();
