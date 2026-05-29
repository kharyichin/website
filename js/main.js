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

  // smooth-scroll for in-page anchors only
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      closeNav();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height"));
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 12,
                        behavior: "smooth" });
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
