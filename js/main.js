// strip utm_ params from the visible URL after analytics has captured them
(() => {
  if (!window.location.search) return;
  const params = new URLSearchParams(window.location.search);
  let touched = false;
  [...params.keys()].forEach((key) => {
    if (key.startsWith("utm_")) {
      params.delete(key);
      touched = true;
    }
  });
  if (!touched) return;
  const query = params.toString();
  const cleanUrl = window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
  window.history.replaceState({}, document.title, cleanUrl);
})();

// animated favicon intro — cycles ◦ • ☻ then holds on ☻
(() => {
  const frames = ["◦", "•", "☻"];
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  const setFrame = (char) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='54' font-size='88' text-anchor='middle' dominant-baseline='middle'>${char}</text></svg>`;
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };
  frames.forEach((char, i) => setTimeout(() => setFrame(char), i * 350));
})();

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("nav-toggle");
  const links  = document.getElementById("nav-links");

  const openNav  = () => { toggle.classList.add("active");    links.classList.add("open");    };
  const closeNav = () => { toggle.classList.remove("active"); links.classList.remove("open"); };

  const closeBtn = document.getElementById("nav-close");
  if (closeBtn) closeBtn.addEventListener("click", closeNav);

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    links.classList.contains("open") ? closeNav() : openNav();
  });

  links.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => {
    if (links.classList.contains("open")) closeNav();
  });

  // close when any link inside the sidebar is clicked (navigation follows naturally)
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

  // Scroll to an anchor using the page's native smooth-scroll (CSS
  // `scroll-behavior: smooth` on <html>), then re-issue the same scroll a
  // few times as follow-ups. A single native call can't fight itself the
  // way a manual requestAnimationFrame loop calling scrollTo every frame
  // would (each of those re-triggers the CSS smooth animation and they
  // cancel each other out). The follow-ups exist because none of this
  // page's images have width/height set, so lazy-loaded images below the
  // target keep shifting the layout for a bit after the first scroll.
  function smoothScrollTo(getTargetY) {
    const scrollToTarget = () => window.scrollTo({ top: getTargetY(), left: 0, behavior: "smooth" });
    scrollToTarget();
    [300, 700, 1200].forEach((delay) => setTimeout(scrollToTarget, delay));
  }

  // smooth-scroll for in-page anchors only
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      closeNav();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height"));
      smoothScrollTo(() => target.getBoundingClientRect().top + window.scrollY - offset - 12);
    });
  });

  // experience accordion
  document.querySelectorAll(".timeline-header").forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.closest(".timeline-item");
      const isOpen = item.classList.contains("open");
      item.classList.toggle("open");
      header.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // case-study page TOC scroll-spy
  const toc = document.querySelector(".product-toc");
  if (toc) {
    const tocLinks = toc.querySelectorAll("a");
    const sections = Array.from(tocLinks)
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => tocObserver.observe(s));

    // reading-progress rail: fills as the reader moves through .product-main
    const tocFill = toc.querySelector(".product-toc-rail-fill");
    const mainContent = document.querySelector(".product-main");
    if (tocFill && mainContent) {
      const headerH = () => parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height")) || 0;
      let ticking = false;
      const updateRail = () => {
        const rect = mainContent.getBoundingClientRect();
        const total = rect.height - window.innerHeight + headerH();
        const scrolled = headerH() - rect.top;
        const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
        tocFill.style.height = `${progress * toc.getBoundingClientRect().height}px`;
        ticking = false;
      };
      updateRail();
      window.addEventListener("scroll", () => {
        if (!ticking) { requestAnimationFrame(updateRail); ticking = true; }
      }, { passive: true });
      window.addEventListener("resize", updateRail);
    }
  }

  // staggered reveal for grid/list children (case-study scrollytelling groups)
  const staggerGroups = document.querySelectorAll(".stagger");
  staggerGroups.forEach((group) => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty("--i", i));
  });
  const staggerObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      staggerObserver.unobserve(e.target);
    }),
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  staggerGroups.forEach((g) => staggerObserver.observe(g));

  // animated count-up for stat numbers (e.g. "80,000+", "82%")
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length && !reduceMotion) {
    const countUp = (el) => {
      const match = el.textContent.trim().match(/^(\D*)([\d,]+)(.*)$/);
      if (!match) return;
      const [, prefix, digits, suffix] = match;
      const target = parseInt(digits.replace(/,/g, ""), 10);
      if (!Number.isFinite(target)) return;
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${Math.round(target * eased).toLocaleString("en-US")}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const statObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countUp(e.target);
        statObserver.unobserve(e.target);
      }),
      { threshold: 0.4 }
    );
    statNumbers.forEach((el) => statObserver.observe(el));
  }

  // channel hub-and-spoke: lines draw out and nodes pop along each spoke as it scrolls into view
  const hub = document.querySelector(".channel-hub");
  if (hub) {
    if (reduceMotion) {
      hub.classList.add("hub-visible");
    } else {
      const lines = hub.querySelectorAll(".channel-hub-lines line");
      const circles = hub.querySelectorAll(".channel-hub-lines circle");
      const nodes = hub.querySelectorAll(".channel-node");
      lines.forEach((line, i) => {
        const len = line.getTotalLength();
        line.style.strokeDasharray = String(len);
        line.style.strokeDashoffset = String(len);
        line.style.setProperty("--i", i);
      });
      circles.forEach((c, i) => c.style.setProperty("--i", i));
      nodes.forEach((n, i) => n.style.setProperty("--i", i));

      const hubObserver = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (!e.isIntersecting) return;
          hub.classList.add("hub-visible");
          lines.forEach((line) => { line.style.strokeDashoffset = "0"; });
          hubObserver.unobserve(e.target);
        }),
        { threshold: 0.3 }
      );
      hubObserver.observe(hub);
    }
  }

  // GTM funnel: stages drop into place top to bottom as it scrolls into view
  const funnel = document.querySelector(".gtm-funnel2");
  if (funnel) {
    if (reduceMotion) {
      funnel.classList.add("funnel-visible");
    } else {
      const setIndices = (selector) => funnel.querySelectorAll(selector)
        .forEach((el, i) => el.style.setProperty("--i", i));
      setIndices(".gtm-funnel2-shape");
      setIndices(".gtm-funnel2-arrow");
      setIndices(".gtm-funnel2-card");

      const funnelObserver = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (!e.isIntersecting) return;
          funnel.classList.add("funnel-visible");
          funnelObserver.unobserve(e.target);
        }),
        { threshold: 0.2 }
      );
      funnelObserver.observe(funnel);
    }
  }

  // screenshot lightbox
  const shots = document.querySelectorAll(".screenshot-card img");
  if (shots.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><figure class="lightbox-figure"><img class="lightbox-img" alt=""><figcaption class="lightbox-caption"></figcaption></figure>';
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");

    const openLightbox = (img) => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      const caption = img.closest(".screenshot-card")?.querySelector(".screenshot-card-caption");
      lightboxCaption.textContent = caption ? caption.textContent : "";
      lightbox.classList.add("open");
      document.body.classList.add("lightbox-locked");
    };
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      document.body.classList.remove("lightbox-locked");
    };

    shots.forEach((img) => img.addEventListener("click", () => openLightbox(img)));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-close")) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // scroll-reveal
  const fadeEls = document.querySelectorAll(
    ".about-content, .work-card, .timeline-item, .edu-card, .namecard-flip, .section-label, .product-section"
  );
  fadeEls.forEach((el) => el.classList.add("fade-in"));
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  fadeEls.forEach((el) => revealObserver.observe(el));

  // namecard flip easter egg
  document.querySelectorAll(".namecard-flip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const flip = document.getElementById(btn.dataset.flipTarget);
      if (flip) flip.classList.toggle("is-flipped");
    });
  });

  // work-card image galleries
  document.querySelectorAll(".work-card-media.gallery").forEach((media) => {
    const imgs = media.querySelectorAll("img");
    if (imgs.length < 2) return;

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "work-card-dots";
    imgs.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      dotsWrap.appendChild(dot);
    });
    media.appendChild(dotsWrap);
    const dots = dotsWrap.querySelectorAll("span");

    let active = 0;
    setInterval(() => {
      imgs[active].classList.remove("is-active");
      dots[active].classList.remove("is-active");
      active = (active + 1) % imgs.length;
      imgs[active].classList.add("is-active");
      dots[active].classList.add("is-active");
    }, 5000);
  });
});
