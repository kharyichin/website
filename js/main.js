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

  // custom eased scroll
  function smoothScrollTo(targetY, duration = 700) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
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
      smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - offset - 12);
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
    ".about-content, .work-card, .timeline-item, .edu-card, .contact-content"
  );
  fadeEls.forEach((el) => el.classList.add("fade-in"));
  new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  ).observe && fadeEls.forEach((el) =>
    new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    ).observe(el)
  );
});
