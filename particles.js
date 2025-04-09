// Particles.js - A lightweight JavaScript library for creating particles
document.addEventListener("DOMContentLoaded", () => {
  // Get all particle containers
  const homeParticles = document.getElementById("particles-home")
  const aboutParticles = document.getElementById("particles-about")
  const skillsParticles = document.getElementById("particles-skills")
  const contactParticles = document.getElementById("particles-contact")

  // Initialize all particle containers
  if (homeParticles) initParticlesCanvas(homeParticles, "home")
  if (aboutParticles) initParticlesCanvas(aboutParticles, "about")
  if (skillsParticles) initParticlesCanvas(skillsParticles, "skills")
  if (contactParticles) initParticlesCanvas(contactParticles, "contact")

  // Function to initialize a particle canvas
  function initParticlesCanvas(container, type) {
    // Create canvas element
    const canvas = document.createElement("canvas")
    canvas.className = "particles-canvas"
    container.appendChild(canvas)

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles based on type
    let particles = []
    const config = getParticleConfig(type)

    // Initialize particles
    initParticles()

    // Start animation
    drawParticles()

    // Handle mouse interaction
    const mouse = {
      x: null,
      y: null,
      radius: config.interactivity.radius || 100,
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x
      mouse.y = e.y
    })

    // Initialize particles
    function initParticles() {
      particles = []
      for (let i = 0; i < config.particles.number; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particles.push(new Particle(x, y, config))
      }
    }

    // Draw particles and connections
    function drawParticles() {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(mouse, canvas, particles, config)
        particle.draw(ctx)
      })

      // Draw connections if enabled
      if (config.particles.lineLinked.enable) {
        drawConnections(ctx, particles, config)
      }

      requestAnimationFrame(drawParticles)
    }

    // Draw connections between particles
    function drawConnections(ctx, particles, config) {
      const maxDistance = config.particles.lineLinked.distance

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * config.particles.lineLinked.opacity

            ctx.strokeStyle = `rgba(${config.particles.lineLinked.color.r}, ${config.particles.lineLinked.color.g}, ${config.particles.lineLinked.color.b}, ${opacity})`
            ctx.lineWidth = config.particles.lineLinked.width
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      resizeCanvas()
      initParticles()
    })
  }

  // Particle class
  class Particle {
    constructor(x, y, config) {
      this.x = x
      this.y = y
      this.size = Math.random() * config.particles.size.max + config.particles.size.min
      this.baseSize = this.size
      this.speedX = Math.random() * (config.particles.speed * 2) - config.particles.speed
      this.speedY = Math.random() * (config.particles.speed * 2) - config.particles.speed
      this.color = config.particles.color
      this.opacity =
        Math.random() * (config.particles.opacity.max - config.particles.opacity.min) + config.particles.opacity.min
      this.shape = config.particles.shape

      // Special properties for different effects
      if (config.type === "skills") {
        this.angle = Math.random() * 360
        this.angleSpeed = Math.random() * 2 - 1
      }

      if (config.type === "contact") {
        this.glowing = Math.random() > 0.7
        this.glowIntensity = 0
        this.glowDirection = 1
      }
    }

    update(mouse, canvas, particles, config) {
      // Basic movement
      this.x += this.speedX
      this.y += this.speedY

      // Boundary check
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX = -this.speedX
      }

      if (this.y < 0 || this.y > canvas.height) {
        this.speedY = -this.speedY
      }

      // Mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouse.radius) {
          if (config.interactivity.mode === "repel") {
            const force = (mouse.radius - distance) / mouse.radius
            const directionX = dx / distance
            const directionY = dy / distance

            this.speedX -= directionX * force * config.interactivity.strength
            this.speedY -= directionY * force * config.interactivity.strength
          } else if (config.interactivity.mode === "attract") {
            const force = (mouse.radius - distance) / mouse.radius
            const directionX = dx / distance
            const directionY = dy / distance

            this.speedX += directionX * force * config.interactivity.strength
            this.speedY += directionY * force * config.interactivity.strength
          }
        }
      }

      // Special updates for different effects
      if (config.type === "home") {
        // Slow down particles over time
        this.speedX *= 0.99
        this.speedY *= 0.99

        // Randomly change direction slightly
        if (Math.random() < 0.01) {
          this.speedX += (Math.random() - 0.5) * 0.1
          this.speedY += (Math.random() - 0.5) * 0.1
        }
      }

      if (config.type === "about") {
        // Particles slowly drift downward
        this.speedY += 0.01

        // Size fluctuation
        this.size = this.baseSize + Math.sin(Date.now() * 0.001) * this.baseSize * 0.2
      }

      if (config.type === "skills") {
        // Rotating particles
        this.angle += this.angleSpeed

        // Occasionally change speed
        if (Math.random() < 0.02) {
          this.speedX = Math.random() * (config.particles.speed * 2) - config.particles.speed
          this.speedY = Math.random() * (config.particles.speed * 2) - config.particles.speed
        }
      }

      if (config.type === "contact") {
        // Glowing effect
        if (this.glowing) {
          this.glowIntensity += 0.05 * this.glowDirection
          if (this.glowIntensity > 1) {
            this.glowDirection = -1
          } else if (this.glowIntensity < 0) {
            this.glowDirection = 1
          }
        }

        // Occasional size pulse
        if (Math.random() < 0.01) {
          this.size = this.baseSize * 1.5
          setTimeout(() => {
            this.size = this.baseSize
          }, 200)
        }
      }

      // Speed limit
      const maxSpeed = config.particles.maxSpeed || 2
      if (Math.abs(this.speedX) > maxSpeed) {
        this.speedX = this.speedX > 0 ? maxSpeed : -maxSpeed
      }
      if (Math.abs(this.speedY) > maxSpeed) {
        this.speedY = this.speedY > 0 ? maxSpeed : -maxSpeed
      }
    }

    draw(ctx) {
      const color = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`

      ctx.save()
      ctx.translate(this.x, this.y)

      if (this.shape === "circle") {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        // Glow effect for contact section
        if (this.glowing && this.glowIntensity > 0) {
          ctx.shadowBlur = 15 * this.glowIntensity
          ctx.shadowColor = color
          ctx.beginPath()
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fill()
          ctx.shadowBlur = 0
        }
      } else if (this.shape === "square") {
        ctx.fillStyle = color
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2)
      } else if (this.shape === "triangle") {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(0, -this.size)
        ctx.lineTo(-this.size, this.size)
        ctx.lineTo(this.size, this.size)
        ctx.closePath()
        ctx.fill()
      } else if (this.shape === "star") {
        if (this.angle !== undefined) {
          ctx.rotate((this.angle * Math.PI) / 180)
        }

        ctx.fillStyle = color
        ctx.beginPath()

        const spikes = 5
        const outerRadius = this.size
        const innerRadius = this.size / 2

        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (i * Math.PI) / spikes
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.closePath()
        ctx.fill()
      }

      ctx.restore()
    }
  }

  // Get particle configuration based on section type
  function getParticleConfig(type) {
    const baseConfig = {
      particles: {
        number: 50,
        size: {
          min: 1,
          max: 3,
        },
        opacity: {
          min: 0.1,
          max: 0.5,
        },
        speed: 0.5,
        lineLinked: {
          enable: true,
          distance: 150,
          color: {
            r: 255,
            g: 255,
            b: 255,
          },
          opacity: 0.2,
          width: 1,
        },
      },
      interactivity: {
        mode: "repel",
        radius: 100,
        strength: 0.5,
      },
    }

    // Home section - subtle floating particles
    if (type === "home") {
      return {
        ...baseConfig,
        type: "home",
        particles: {
          ...baseConfig.particles,
          number: 70,
          shape: "circle",
          color: {
            r: 255,
            g: 255,
            b: 255,
          },
          opacity: {
            min: 0.05,
            max: 0.2,
          },
          size: {
            min: 1,
            max: 4,
          },
          speed: 0.3,
          lineLinked: {
            ...baseConfig.particles.lineLinked,
            opacity: 0.1,
          },
        },
        interactivity: {
          mode: "attract",
          radius: 150,
          strength: 0.2,
        },
      }
    }

    // About section - flowing particles
    if (type === "about") {
      return {
        ...baseConfig,
        type: "about",
        particles: {
          ...baseConfig.particles,
          number: 40,
          shape: "circle",
          color: {
            r: 200,
            g: 200,
            b: 220,
          },
          opacity: {
            min: 0.1,
            max: 0.3,
          },
          size: {
            min: 2,
            max: 5,
          },
          speed: 0.2,
          lineLinked: {
            ...baseConfig.particles.lineLinked,
            enable: true,
            distance: 200,
            opacity: 0.05,
          },
        },
      }
    }

    // Skills section - geometric shapes
    if (type === "skills") {
      return {
        ...baseConfig,
        type: "skills",
        particles: {
          ...baseConfig.particles,
          number: 30,
          shape: "star",
          color: {
            r: 220,
            g: 220,
            b: 220,
          },
          opacity: {
            min: 0.05,
            max: 0.2,
          },
          size: {
            min: 3,
            max: 6,
          },
          speed: 0.4,
          maxSpeed: 1,
          lineLinked: {
            ...baseConfig.particles.lineLinked,
            enable: true,
            distance: 150,
            opacity: 0.1,
          },
        },
        interactivity: {
          mode: "repel",
          radius: 120,
          strength: 0.8,
        },
      }
    }

    // Contact section - glowing particles
    if (type === "contact") {
      return {
        ...baseConfig,
        type: "contact",
        particles: {
          ...baseConfig.particles,
          number: 50,
          shape: "circle",
          color: {
            r: 255,
            g: 255,
            b: 255,
          },
          opacity: {
            min: 0.1,
            max: 0.4,
          },
          size: {
            min: 1,
            max: 4,
          },
          speed: 0.3,
          lineLinked: {
            ...baseConfig.particles.lineLinked,
            enable: true,
            distance: 120,
            opacity: 0.15,
          },
        },
        interactivity: {
          mode: "attract",
          radius: 150,
          strength: 0.3,
        },
      }
    }

    return baseConfig
  }
})
