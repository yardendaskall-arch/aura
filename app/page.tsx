"use client";

import { useEffect, useState } from "react";
import { HeroScrollDemo } from "@/components/demo";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Dynamic Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow') as HTMLElement;
    if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
      const moveGlow = (e: MouseEvent) => {
        requestAnimationFrame(() => {
          cursorGlow.style.left = `${e.clientX}px`;
          cursorGlow.style.top = `${e.clientY}px`;
        });
      };
      document.addEventListener('mousemove', moveGlow);

      const clickables = document.querySelectorAll('a, .glass-card, button');
      clickables.forEach(link => {
        const el = link as HTMLElement;
        el.addEventListener('mouseenter', () => {
          cursorGlow.style.width = '450px';
          cursorGlow.style.height = '450px';
          cursorGlow.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(0, 0, 0, 0) 70%)';
        });
        el.addEventListener('mouseleave', () => {
          cursorGlow.style.width = '300px';
          cursorGlow.style.height = '300px';
          cursorGlow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)';
        });
      });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const scrollNav = () => {
      if (window.scrollY > 50) navbar?.classList.add('scrolled');
      else navbar?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', scrollNav);

    // Observer for Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
      el.classList.add('hidden');
      observer.observe(el);
    });

    // Shapes Parallax
    const shapes = document.querySelectorAll('.abstract-shape');
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        shapes.forEach((shape, index) => {
          const speed = (index + 1) * 30;
          const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
          const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
          (shape as HTMLElement).style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
      });
    }

    // Modals Initialization
    const setupModal = (modalId: string, openBtnsSelector: string, closeBtnSelector: string, formId: string, successId: string, onSubmit: Function) => {
      const modal = document.getElementById(modalId);
      const openBtns = document.querySelectorAll(openBtnsSelector);
      const closeBtn = document.querySelector(closeBtnSelector);
      const form = document.getElementById(formId) as HTMLFormElement;
      const success = document.getElementById(successId);
      if (!modal || !form) return;

      openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          modal.classList.add('open');
          form.reset();
          success?.classList.add('hidden');
          form.style.display = 'flex';
        });
      });

      const closeModal = () => modal.classList.remove('open');
      closeBtn?.addEventListener('click', closeModal);
      window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        onSubmit(form, success, closeModal);
      });
    };

    setupModal('contactModal', '.open-modal-btn', '.contact-close', 'contactForm', 'formSuccess', (form: any, success: any, closeModal: any) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.remove('hidden');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        setTimeout(closeModal, 3000);
      }, 1000);
    });

    setupModal('addProjectModal', '#openAddProjectModal', '.project-close', 'addProjectForm', 'projectSuccess', async (form: any, success: any, closeModal: any) => {
      const title = (document.getElementById('projectTitle') as HTMLInputElement).value;
      const image_url = (document.getElementById('projectImage') as HTMLInputElement).value;
      const description = (document.getElementById('projectDesc') as HTMLTextAreaElement).value;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Publishing...';
      submitBtn.disabled = true;
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, image_url })
        });
        if (response.ok) {
          form.style.display = 'none';
          success.classList.remove('hidden');
          setTimeout(() => {
            fetchProjects();
            closeModal();
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to add project.");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    // Fetch Initial DB data
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();

  }, []);

  return (
    <>
      <div className="cursor-glow"></div>

      <nav className="navbar">
        <div className="logo">AURA</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><GradientButton asChild><a href="#" className="open-modal-btn">Get Started</a></GradientButton></li>
        </ul>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <header id="home" className="hero">
        <div className="hero-content fade-in-up">
          <h1 className="gradient-text">Experience The Extraordinary</h1>
          <p>We blend art and state-of-the-art technology to build digital masterpieces that defy expectations.</p>
          <div className="hero-buttons">
            <GradientButton asChild><a href="#features">Discover More</a></GradientButton>
            <GradientButton variant="variant" asChild><a href="#showcase">View Showcase</a></GradientButton>
          </div>
        </div>
        <div className="hero-visual">
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>
        </div>
      </header>

      {/* SHADCN SCROLL ANIMATION HERO DEMO INJECTED DIRECTLY INTO THE PRE-EXISTING WEBSITE */}
      <section className="bg-black/20 pb-20 mt-[-100px] relative z-20">
        <HeroScrollDemo />
      </section>

      <section id="features" className="features pt-0">
        <h2 className="section-title fade-in-up">Pushing Boundaries</h2>
        <div className="cards-container">
          <div className="glass-card slide-in-left">
            <div className="card-icon">✨</div>
            <h3>Immersive Design</h3>
            <p>Captivate your audience with fluid animations and stunning visual fidelity.</p>
          </div>
          <div className="glass-card fade-in-up delay-1">
            <div className="card-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Engineered for performance. Experience seamless interactions with zero lag.</p>
          </div>
          <div className="glass-card slide-in-right delay-2">
            <div className="card-icon">🔒</div>
            <h3>Fort Knox Security</h3>
            <p>Enterprise-grade protection ensuring your data is safe and sound always.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-content fade-in-up">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-text">Aura is a collective of visionary designers, engineers, and strategists. We don't just build websites; we craft digital ecosystems that leave a lasting impact. Our mission is to push the boundaries of what is possible on the web, combining aesthetic brilliance with rock-solid engineering.</p>
          <div className="stats-container">
            <div className="stat-box">
              <h3 className="gradient-text">150+</h3>
              <p>Projects Delivered</p>
            </div>
            <div className="stat-box">
              <h3 className="gradient-text">10B+</h3>
              <p>User Interactions</p>
            </div>
            <div className="stat-box">
              <h3 className="gradient-text">99%</h3>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="showcase-section">
        <h2 className="section-title fade-in-up">Selected Works</h2>
        <div id="showcaseContainer" className="showcase-grid">
          {projects.length > 0 ? projects.map((val: any, idx: number) => {
            const delayClass = (idx % 3 === 0) ? 'slide-in-left' : (idx % 3 === 1) ? 'fade-in-up delay-1' : 'slide-in-right delay-2';
            return (
              <div key={idx} className={`showcase-item glass-card ${delayClass}`}>
                <div className="showcase-img" style={{ backgroundImage: `url('${val.image_url}')` }}></div>
                <h3>{val.title}</h3>
                <p>{val.description}</p>
              </div>
            );
          }) : (
            <p style={{ textAlign: "center", width: "100%", gridColumn: "1/-1" }}>Loading projects...</p>
          )}
        </div>
        <div className="add-project-wrapper fade-in-up delay-2">
          <GradientButton id="openAddProjectModal">
            <span>+</span> Add Project
          </GradientButton>
        </div>
      </section>

      <section className="cta-section hidden fade-in-up">
        <div className="cta-box glass-card">
          <h2 className="gradient-text">Ready to elevate your brand?</h2>
          <p>Join the revolution of digital excellence.</p>
          <GradientButton className="open-modal-btn" style={{ marginTop: "2rem", fontSize: "1.2rem", padding: "1rem 3rem" }}>Start Project</GradientButton>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">AURA</div>
          <p>&copy; 2026 Aura Digital. All rights reserved.</p>
        </div>
      </footer>

      <div id="contactModal" className="modal">
        <div className="modal-content glass-card">
          <span className="close-modal contact-close">&times;</span>
          <h2 className="gradient-text">Let's Talk</h2>
          <p>Fill out the form below and we will get back to you shortly.</p>
          <form id="contactForm" className="contact-form">
            <div className="form-group">
              <input type="text" id="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" id="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea id="message" rows={4} placeholder="How can we help?" required></textarea>
            </div>
            <GradientButton type="submit" className="form-submit-btn">Send Message</GradientButton>
          </form>
          <div id="formSuccess" className="hidden success-message">Thanks! We'll be in touch soon.</div>
        </div>
      </div>

      <div id="addProjectModal" className="modal">
        <div className="modal-content glass-card">
          <span className="close-modal project-close">&times;</span>
          <h2 className="gradient-text">Add New Project</h2>
          <p>Publish a new digital masterpiece to the database.</p>
          <form id="addProjectForm" className="contact-form">
            <div className="form-group">
              <input type="text" id="projectTitle" placeholder="Project Title" required />
            </div>
            <div className="form-group">
              <input type="text" id="projectImage" placeholder="Image URL (e.g. https://images.unsplash.com/...)" required />
            </div>
            <div className="form-group">
              <textarea id="projectDesc" rows={3} placeholder="Short description" required></textarea>
            </div>
            <GradientButton type="submit" className="form-submit-btn">Publish Project</GradientButton>
          </form>
          <div id="projectSuccess" className="hidden success-message">Project completely published!</div>
        </div>
      </div>
    </>
  );
}
