document.addEventListener('DOMContentLoaded', () => {

    // Dynamic Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow');

    // Only enable custom cursor if it's not a touch device
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });

        // Interactive Cursor Scale on Clickable elements
        const clickables = document.querySelectorAll('a, .glass-card, button');

        clickables.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '450px';
                cursorGlow.style.height = '450px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(0, 0, 0, 0) 70%)';
            });

            link.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '300px';
                cursorGlow.style.height = '300px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)';
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // observer.unobserve(entry.target); // Optional: if you want it to trigger only once
            } else {
                // Optional: remove class to animate again when scrolling up
                entry.target.classList.remove('show');
            }
        });
    }, observerOptions);

    // Select elements that need animation
    const animateElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');

    animateElements.forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });

    // Parallax Effect for Abstract Shapes (Mouse Movement)
    const shapes = document.querySelectorAll('.abstract-shape');

    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 30;
                const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
                const yOffset = (window.innerHeight / 2 - e.clientY) / speed;

                shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });
    }

    // Modal Logic Setup
    const setupModal = (modalId, openBtnsSelector, closeBtnSelector, formId, successId, onSubmit) => {
        const modal = document.getElementById(modalId);
        const openBtns = document.querySelectorAll(openBtnsSelector);
        const closeBtn = document.querySelector(closeBtnSelector);
        const form = document.getElementById(formId);
        const success = document.getElementById(successId);

        if (!modal || !form) return;

        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('open');
                form.reset();
                success.classList.add('hidden');
                form.style.display = 'flex';
            });
        });

        const closeModal = () => modal.classList.remove('open');
        closeBtn.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            onSubmit(form, success, closeModal);
        });
    };

    // Setup Contact Modal (Simulation)
    setupModal(
        'contactModal', '.open-modal-btn', '.contact-close', 'contactForm', 'formSuccess',
        (form, success, closeModal) => {
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
        }
    );

    // Dynamic Projects Fetching
    const fetchAndRenderProjects = async () => {
        const container = document.getElementById('showcaseContainer');
        if (!container) return;

        try {
            const response = await fetch('/api/projects');
            const projects = await response.json();

            container.innerHTML = ''; // Clear container

            projects.forEach((val, idx) => {
                const delayClass = (idx % 3 === 0) ? 'slide-in-left' : (idx % 3 === 1) ? 'fade-in-up delay-1' : 'slide-in-right delay-2';

                const card = document.createElement('div');
                card.className = `showcase-item glass-card ${delayClass}`;

                // Make new card interact with custom cursor
                if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
                    card.addEventListener('mouseenter', () => {
                        cursorGlow.style.width = '450px';
                        cursorGlow.style.height = '450px';
                        cursorGlow.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(0, 0, 0, 0) 70%)';
                    });
                    card.addEventListener('mouseleave', () => {
                        cursorGlow.style.width = '300px';
                        cursorGlow.style.height = '300px';
                        cursorGlow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)';
                    });
                }

                card.innerHTML = `
                    <div class="showcase-img" style="background-image: url('${val.image_url}')"></div>
                    <h3>${val.title}</h3>
                    <p>${val.description}</p>
                `;

                container.appendChild(card);
            });

            // Trigger animation observer for new elements
            document.querySelectorAll('#showcaseContainer .glass-card').forEach(el => observer.observe(el));

        } catch (error) {
            console.error('Failed to fetch projects', error);
            container.innerHTML = '<p style="text-align:center;width:100%;grid-column:1/-1;">Failed to load projects. Ensure backend is running.</p>';
        }
    };

    // Fetch projects on initial load
    fetchAndRenderProjects();

    // Setup Add Project Modal (Real DB Integration)
    setupModal(
        'addProjectModal', '#openAddProjectModal', '.project-close', 'addProjectForm', 'projectSuccess',
        async (form, success, closeModal) => {
            const title = document.getElementById('projectTitle').value;
            const image_url = document.getElementById('projectImage').value;
            const description = document.getElementById('projectDesc').value;

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

                    // Re-fetch and render to show the new project
                    setTimeout(() => {
                        fetchAndRenderProjects();
                        closeModal();
                    }, 2000);
                } else {
                    throw new Error('Server returned an error');
                }
            } catch (error) {
                console.error('Error adding project', error);
                alert("Failed to add project. Ensure backend is running.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    );
});
