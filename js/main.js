document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      links.classList.remove("open");
    });
  });

  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      toggle.classList.remove("active");
      links.classList.remove("open");
      const headerOffset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height")
      );
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  const fadeEls = document.querySelectorAll(
    ".about-content, .work-card, .timeline-item, .edu-card, .contact-content"
  );
  fadeEls.forEach((el) => el.classList.add("fade-in"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  fadeEls.forEach((el) => observer.observe(el));
});
