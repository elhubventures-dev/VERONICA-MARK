import Image from "next/image";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { siteMedia } from "@/lib/storefront/site-media";

export default function StorefrontLoading() {
  return (
    <div className="relative isolate flex min-h-[60svh] items-center justify-center overflow-hidden bg-[var(--color-brand-deep)] text-white">
      <Image
        src={siteMedia.loadingScreenBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <MediaScrim variant="center" />
      <div className="relative text-center">
        <p className="text-xs font-semibold tracking-[0.28em] text-[var(--color-accent)] uppercase">
          VERONICA MARK
        </p>
        <p className="mt-4 font-display text-3xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-4xl">
          Preparing your edit…
        </p>
      </div>
    </div>
  );
}
