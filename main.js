// DOM Elements
const menuToggle = document.getElementById("menu-toggle")
const nav = document.querySelector("nav")
const links = document.querySelectorAll("nav a")
const sections = document.querySelectorAll("section")

// Mobile Menu Toggle
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active")
    nav.classList.toggle("active")
  })
}

// Close mobile menu when clicking on a link
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    // Prevent default only for hash links
    if (link.getAttribute("href").startsWith("#")) {
      e.preventDefault()

      // Get the target section
      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      // Scroll to the section
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70 // Adjust for header height
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    }

    // Close mobile menu if open
    if (nav.classList.contains("active")) {
      menuToggle.classList.remove("active")
      nav.classList.remove("active")
    }
  })
})

// Update active link based on scroll position
function updateActiveLink() {
  const scrollPosition = window.scrollY

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove active class from all links
      links.forEach((link) => {
        link.classList.remove("active")
      })

      // Add active class to current section link
      const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`)
      if (activeLink) {
        activeLink.classList.add("active")
      }
    }
  })
}

// Animate elements when they enter the viewport
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in, .reveal-text, .reveal-image, .reveal-card",
  )

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementBottom = element.getBoundingClientRect().bottom
    const isVisible = elementTop < window.innerHeight - 50 && elementBottom > 0

    if (isVisible) {
      element.style.animationPlayState = "running"
    }
  })
}

// Show/hide section-specific particles based on scroll position
function updateParticlesVisibility() {
  const scrollPosition = window.scrollY
  const homeParticles = document.getElementById("home-canvas")
  const aboutParticles = document.getElementById("about-canvas")
  const skillsParticles = document.getElementById("skills-canvas")
  const contactParticles = document.getElementById("contact-canvas")

  // Hide all particle containers first
  if (homeParticles) homeParticles.style.opacity = "0"
  if (aboutParticles) aboutParticles.style.opacity = "0"
  if (skillsParticles) skillsParticles.style.opacity = "0"
  if (contactParticles) contactParticles.style.opacity = "0"

  // Show the particle container for the current section
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      const particlesContainer = document.getElementById(`${sectionId}-canvas`)
      if (particlesContainer) {
        particlesContainer.style.opacity = "1"
      }
    }
  })
}

// Initialize animations and scroll events
window.addEventListener("load", () => {
  // Set initial active link
  updateActiveLink()

  // Start animations
  animateOnScroll()

  // Set initial particles visibility
  updateParticlesVisibility()

  // Add scroll event listeners
  window.addEventListener("scroll", () => {
    updateActiveLink()
    animateOnScroll()
    updateParticlesVisibility()
  })
})

// Profile image hover effect (on home page)
const profileImage = document.getElementById("profile-image")
if (profileImage) {
  const profileCircle = document.querySelector(".profile-circle")

  profileCircle.addEventListener("mouseenter", () => {
    profileImage.style.transform = "scale(1.05)"
  })

  profileCircle.addEventListener("mouseleave", () => {
    profileImage.style.transform = "scale(1)"
  })
}

// Animate skill bars when they come into view
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar) => {
    const barTop = bar.getBoundingClientRect().top
    const windowHeight = window.innerHeight

    if (barTop < windowHeight - 50) {
      const width = bar.parentElement.previousElementSibling.querySelector(".skill-level").textContent
      bar.style.width = "0"

      setTimeout(() => {
        bar.style.transition = "width 1s ease-in-out"
        bar.style.width = width
      }, 100)
    }
  })
}

// Filter skills
const filterButtons = document.querySelectorAll(".filter-btn")
const skillCards = document.querySelectorAll(".skill-card")

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"))

    // Add active class to clicked button
    button.classList.add("active")

    // Get filter value
    const filterValue = button.getAttribute("data-filter")

    // Filter skill cards
    skillCards.forEach((card) => {
      if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  })
})

// Call animateSkillBars on scroll
window.addEventListener("scroll", () => {
  animateSkillBars()
  updateActiveLink()
  animateOnScroll()
  updateParticlesVisibility()
})

// Add scroll class to header when scrolled
window.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})
