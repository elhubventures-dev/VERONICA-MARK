import {
  PWA_SPLASH_IMAGE,
  pwaSplashBootCss,
  pwaSplashBootScript,
} from "@/lib/pwa/splash-boot";

/**
 * Server-rendered splash + inline boot script.
 * The script runs as the body is parsed (before React hydrates) and only
 * activates on mobile/tablet, once per browser session.
 */
export function PwaSplashBoot() {
  return (
    <>
      <style id="vm-pwa-splash-style" dangerouslySetInnerHTML={{ __html: pwaSplashBootCss }} />
      <script
        id="vm-pwa-splash-boot"
        dangerouslySetInnerHTML={{ __html: pwaSplashBootScript }}
      />
      <div id="vm-pwa-splash" role="presentation" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- boot splash must not wait on Next/Image */}
        <img src={PWA_SPLASH_IMAGE} alt="" decoding="sync" fetchPriority="high" />
      </div>
    </>
  );
}
