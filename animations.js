// Apple-inspired Canvas Animations
document.addEventListener("DOMContentLoaded", () => {
  // Get all canvas elements
  const homeCanvas = document.getElementById("home-canvas")
  const aboutCanvas = document.getElementById("about-canvas")
  const skillsCanvas = document.getElementById("skills-canvas")
  const contactCanvas = document.getElementById("contact-canvas")

  // Initialize all canvases
  if (homeCanvas) initHomeCanvas(homeCanvas)
  if (aboutCanvas) initAboutCanvas(aboutCanvas)
  if (skillsCanvas) initSkillsCanvas(skillsCanvas)
  if (contactCanvas) initContactCanvas(contactCanvas)

  // Home Canvas - Floating Particles with Connections
  function initHomeCanvas(canvas) {
    const ctx = canvas.getContext("2d")
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Particles array
    const particles = []
    const particleCount = 80
    const connectionDistance = 150
    const mouseRadius = 150

    // Mouse position
    const mouse = {
      x: null,
      y: null,
    }

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        // Move particles
        this.x += this.speedX
        this.y += this.speedY

        // Boundary check
        if (this.x < 0 || this.x > width) this.speedX *= -1
        if (this.y < 0 || this.y > height) this.speedY *= -1

        // Mouse interaction
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRadius) {
            const angle = Math.atan2(dy, dx)
            const force = (mouseRadius - distance) / mouseRadius
            this.speedX -= Math.cos(angle) * force * 0.2
            this.speedY -= Math.sin(angle) * force * 0.2
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    function createParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    // Connect particles with lines
    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      connectParticles()
      requestAnimationFrame(animate)
    }

    // Track mouse movement
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x
      mouse.y = e.y
    })

    // Handle window resize
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    })

    // Initialize and start animation
    createParticles()
    animate()
  }

  // About Canvas - Flowing Wave Effect
  function initAboutCanvas(canvas) {
    const ctx = canvas.getContext("2d")
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Wave parameters
    const waves = []
    const waveCount = 3

    // Create waves
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        y: height * (0.3 + i * 0.2),
        length: width * (1.2 - i * 0.2),
        amplitude: 20 + i * 10,
        speed: 0.03 + i * 0.01,
        offset: 0,
        color: `rgba(255, 255, 255, ${0.03 + i * 0.02})`,
      })
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Draw each wave
      waves.forEach((wave) => {
        ctx.fillStyle = wave.color
        ctx.beginPath()
        ctx.moveTo(0, height)

        // Update wave offset
        wave.offset += wave.speed

        // Draw wave path
        for (let x = 0; x <= width; x += 5) {
          const y = wave.y + Math.sin(x / wave.length + wave.offset) * wave.amplitude
          ctx.lineTo(x, y)
        }

        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight

      // Update wave positions
      waves.forEach((wave, index) => {
        wave.y = height * (0.3 + index * 0.2)
        wave.length = width * (1.2 - index * 0.2)
      })
    })

    // Start animation
    animate()
  }

  // Skills Canvas - Geometric Shapes
  function initSkillsCanvas(canvas) {
    const ctx = canvas.getContext("2d")
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Shapes array
    const shapes = []
    const shapeCount = 20

    // Shape types
    const shapeTypes = ["circle", "square", "triangle"]

    // Shape class
    class Shape {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 30 + 10
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.rotation = 0
        this.rotationSpeed = Math.random() * 0.02 - 0.01
        this.type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.05 + 0.02})`
      }

      update() {
        // Move shapes
        this.x += this.speedX
        this.y += this.speedY

        // Rotate shapes
        this.rotation += this.rotationSpeed

        // Boundary check
        if (this.x < -this.size) this.x = width + this.size
        if (this.x > width + this.size) this.x = -this.size
        if (this.y < -this.size) this.y = height + this.size
        if (this.y > height + this.size) this.y = -this.size
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.fillStyle = this.color

        if (this.type === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (this.type === "square") {
          ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2)
        } else if (this.type === "triangle") {
          ctx.beginPath()
          ctx.moveTo(0, -this.size)
          ctx.lineTo(-this.size, this.size)
          ctx.lineTo(this.size, this.size)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }
    }

    // Create shapes
    function createShapes() {
      for (let i = 0; i < shapeCount; i++) {
        shapes.push(new Shape())
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Update and draw shapes
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].update()
        shapes[i].draw()
      }

      requestAnimationFrame(animate)
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    })

    // Initialize and start animation
    createShapes()
    animate()
  }

  // Contact Canvas - Glowing Particles
  function initContactCanvas(canvas) {
    const ctx = canvas.getContext("2d")
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Particles array
    const particles = []
    const particleCount = 50

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 3 + 1
        this.baseSize = this.size
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.glowing = Math.random() > 0.7
        this.glowIntensity = 0
        this.glowDirection = 1
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        // Move particles
        this.x += this.speedX
        this.y += this.speedY

        // Boundary check
        if (this.x < 0 || this.x > width) this.speedX *= -1
        if (this.y < 0 || this.y > height) this.speedY *= -1

        // Glow effect
        if (this.glowing) {
          this.glowIntensity += 0.02 * this.glowDirection

          if (this.glowIntensity > 1) {
            this.glowDirection = -1
          } else if (this.glowIntensity < 0) {
            this.glowDirection = 1
          }
        }

        // Random size pulse
        if (Math.random() < 0.01) {
          this.size = this.baseSize * 1.5
          setTimeout(() => {
            this.size = this.baseSize
          }, 200)
        }
      }

      draw() {
        ctx.fillStyle = this.color

        // Draw glowing particles
        if (this.glowing && this.glowIntensity > 0) {
          ctx.shadowBlur = 15 * this.glowIntensity
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)"
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Reset shadow
        ctx.shadowBlur = 0
      }
    }

    // Create particles
    function createParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      requestAnimationFrame(animate)
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    })

    // Initialize and start animation
    createParticles()
    animate()
  }
})
