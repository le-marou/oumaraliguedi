// Matrix Background Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 8, 17, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

let lastTime = 0;
const fps = 24; // Cinematic 24fps for Matrix effect
const nextFrameTime = 1000 / fps;

function animate(currentTime) {
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= nextFrameTime) {
        drawMatrix();
        lastTime = currentTime - (deltaTime % nextFrameTime);
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Smooth scroll

// Smooth scroll with Event Delegation to handle dynamic content
document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        // Handle links that are just "#"
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });

            // Close mobile menu if it's open (for dynamic nav links)
            const menuToggle = document.getElementById('menuToggle');
            const navLinks = document.getElementById('navLinks');
            if (menuToggle && navLinks && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
    }
});


// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('fade-in');
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});


// Mobile Menu Toggle logic moved to components.js to support dynamic loading


// Portfolio Carousel & Filtering
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    // Store original cards for filtering
    const allProjects = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-nav');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentFilteredProjects = [...allProjects];
    let currentSlide = 0;

    // Helper to get items per view based on screen width
    const getItemsPerView = () => {
        const width = window.innerWidth;
        if (width <= 600) return 1;
        if (width <= 968) return 2;
        return 3;
    };

    // Update Carousel State
    const updateCarousel = (filter) => {
        // 1. Filter Projects
        currentFilteredProjects = filter === 'all'
            ? [...allProjects]
            : allProjects.filter(project => project.dataset.category === filter);

        // 2. Re-populate DOM
        track.innerHTML = '';
        currentFilteredProjects.forEach(project => track.appendChild(project));

        // 3. Reset State
        currentSlide = 0;
        track.style.transform = 'translateX(0)';

        // 4. Update UI
        updateDots();
        updateButtons();

        // If no projects found (edge case), handle gracefully
        if (currentFilteredProjects.length === 0) {
            track.innerHTML = '<div style="color:white; padding:2rem; text-align:center; width:100%;">Aucun projet trouvé pour cette catégorie.</div>';
        }
    };

    const updateDots = () => {
        const itemsPerView = getItemsPerView();
        const totalSlides = Math.max(0, currentFilteredProjects.length - itemsPerView + 1);

        // Clear existing dots
        dotsNav.innerHTML = '';

        // Only show dots if there is more than one possible position
        if (totalSlides > 0) {
            // Limit number of dots if too many (optional, but good for UX)
            // For now, create one dot per possible starting position
            // But if we scroll 1 by 1, that's a lot of dots. 
            // Let's create dots for "pages" or just verify logic.
            // Standard carousel: dots represent pages or items? 
            // Let's make dots correspond to the potential start indices.

            for (let i = 0; i < totalSlides + 1; i++) { // +1 ?? wait.
                // If items=5, view=3. Max index starts at 2 (showing 3,4,5).
                // Indices: 0 (1,2,3), 1 (2,3,4), 2 (3,4,5). Total 3 positions.
                // Length 5, view 3. totalSlides = 5 - 3 + 1 = 3. Correct.

                // Oops loop should be < totalSlides. 
                // Wait calculation: 
                // index 0 to totalSlides-1 ??
                // If length=5, view=3. valid indices: 0, 1, 2.
                // length - view = 2. So range is 0 to 2.

                // Let's simplify: Max Index = currentFilteredProjects.length - itemsPerView.
                // If we can't scroll, max index is 0.
            }

            // Re-think: Dots usually jump PAGES (sets of items).
            // But arrows move single items.
            // Let's stick to arrows mainly and maybe minimal dots or no dots if too complex for now?
            // The plan said "Pagination dots".
            // Let's implement dots for GROUPS (Pages).
            const pages = Math.ceil(currentFilteredProjects.length / itemsPerView);

            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-indicator');
                if (i === 0) dot.classList.add('current-slide');
                dot.addEventListener('click', () => {
                    // Move to the start of that page
                    const targetIndex = i * itemsPerView;
                    moveToSlide(Math.min(targetIndex, currentFilteredProjects.length - itemsPerView));
                });
                dotsNav.appendChild(dot);
            }
        }
    };

    const updateButtons = () => {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, currentFilteredProjects.length - itemsPerView);

        // Hide prev if at start
        if (currentSlide <= 0) {
            prevButton.classList.add('hidden');
        } else {
            prevButton.classList.remove('hidden');
        }

        // Hide next if at end
        if (currentSlide >= maxIndex) {
            nextButton.classList.add('hidden');
        } else {
            nextButton.classList.remove('hidden');
        }

        // Update active dot based on current slide
        const dots = Array.from(dotsNav.children);
        const activePageIndex = Math.floor(currentSlide / itemsPerView);
        dots.forEach((dot, index) => {
            if (index === activePageIndex) dot.classList.add('current-slide');
            else dot.classList.remove('current-slide');
        });
    };

    const moveToSlide = (targetIndex) => {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, currentFilteredProjects.length - itemsPerView);

        // Clamp index
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex > maxIndex) targetIndex = maxIndex;

        currentSlide = targetIndex;

        // Calculate move amount
        // Get width of one card + gap
        if (track.children.length > 0) {
            const card = track.children[0];
            // getComputedStyle for gap
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            const fullItemWidth = card.getBoundingClientRect().width + gap;

            track.style.transform = `translateX(-${currentSlide * fullItemWidth}px)`;
        }

        updateButtons();
    };

    // Event Listeners
    nextButton.addEventListener('click', () => {
        moveToSlide(currentSlide + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentSlide - 1);
    });

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            updateCarousel(filterValue);
        });
    });

    // Window Resize - reset or adjust
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-calibrating slide position to avoid being 'stuck' between views
            // Simply re-rendering or clamping the current slide
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, currentFilteredProjects.length - itemsPerView);
            if (currentSlide > maxIndex) currentSlide = maxIndex;
            moveToSlide(currentSlide);
            updateDots(); // Number of pages might change
        }, 100);
    });

    // Initial Load
    updateCarousel('all');

    // Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

