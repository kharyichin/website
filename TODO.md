# TODO

- [ ] Personal CFO case study (`products/personal-cfo.html`, added 2026-09-02).
      Hero/homepage card use the real team photo (`images/personal-cfo-hero.jpg`,
      converted from `images/Snowflake/IMG_7564.HEIC`), and a Screenshots
      section uses `images/personal-cfo-{dashboard,memory-panel,chat-afford,
      cortex-deepdive}.png` + `personal-cfo-walkthrough.gif` (converted from
      the 88s screen recording in `images/Snowflake/`). Still needed:
      **Reflection section** — left out of the page entirely for now per
      Khar Yi's request ("leave it blank, will talk about reflections
      later"). Once she gives the content, add a `#reflection`
      `product-section` (see PropertyAgent's for the pattern) and a
      matching `product-toc` link, on this page only.
      Once the page is finalized, consider deleting the now-unused
      `images/Snowflake/` source folder (raw screenshots + .mov + .heic,
      ~50MB) to keep the repo lean — left in place for now in case a
      different crop/frame is wanted.

- [x] Add a FinClarity demo GIF/screenshot next to the "Selected Work" card on
      the homepage (`index.html`, `.work` section). Done (2026-07-12):
      captured a viewport screenshot of https://getfinclarity.vercel.app/demo
      (onboarding tooltips dismissed for a clean shot) and saved it to
      `images/finclarity-demo.png`. Wired it into `.work-card` as a
      `.work-card-media` panel alongside `.work-card-inner`, widened and
      centered `.work-grid` (`max-width: 960px; margin: 0 auto`), and updated
      the mobile breakpoint so the image stacks above the text on narrow
      screens.

- [x] Add GIFs under the FinClarity product page. Done (2026-07-12): recorded
      two flows from the live demo with Playwright (guided tooltip
      walkthrough + a scroll through the dashboard) and encoded them to GIF
      with ffmpeg — `images/finclarity-tour.gif` and
      `images/finclarity-scroll.gif`. Un-commented the `#screenshots` section
      in `products/finclarity.html`, replaced the old placeholder tiles with
      real `.screenshot-card` images, and restored the TOC link. Note: the
      other placeholder ideas (upload flow, streak counter) aren't capturable
      from the public demo since it's static sample data with no real upload
      or streak state.

- [x] Add a second hero CTA, "My Products", anchored to the Selected Work
      section. Done (2026-07-12): added `<a href="#work" class="btn
      btn-secondary">My Products</a>` in `.hero-cta` (`index.html`) between
      "Learn more about me" and "Get in touch" — no CSS changes needed since
      `.hero-cta` already wraps.

- [x] Make the FinClarity screenshot GIFs expandable on click, and capture the
      app's other nav routes too. Done (2026-07-12): added a vanilla-JS
      lightbox (`js/main.js` + `.lightbox` styles in `css/product.css`) that
      opens any `.screenshot-card img` full-size on click, closable via ×,
      backdrop click, or Escape. Also recorded a third GIF,
      `images/finclarity-nav.gif`, clicking through Breakdown → Budget →
      Upload History → Settings and toggling dark mode — confirmed the
      /demo sample data doesn't persist to those routes (they're the real,
      unauthenticated empty state), so this shows app structure/interaction
      rather than fake data.

- [ ] Decide whether to keep the homepage hero cursor-glow + parallax effect
      (uncommitted as of 2026-07-30). Changes are already made and working,
      just sitting in the working tree, not committed/pushed:
      - `index.html`: hero-decor markup restructured — added `.hero-glow` div
        and wrapped each blob/pixel-icon in a `.hero-parallax` div with an
        inline `--depth` custom property.
      - `css/style.css`: `.hero-glow` (cursor-following radial light,
        `.hero--pointer-active` toggles opacity) and `.hero-parallax`
        (translates via `--hero-px`/`--hero-py` custom properties, composed
        with each blob's existing idle float animation). Respects
        `prefers-reduced-motion`.
      - `js/main.js`: new "hero cursor-reactive glow + parallax" block —
        mousemove/mouseleave listeners on `.hero`, gated on
        `(pointer: fine)` and not `prefers-reduced-motion`, rAF-throttled.
      - Also reverted the hero-photo desktop change from earlier in the same
        session (photo was appearing twice vs. the About section photo) —
        `hero-photo` is back to mobile-only, just renamed from
        `hero-photo-mobile`.
      - If keeping it: commit and push. If not: `git checkout` these three
        files to discard.
