# TODO

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
