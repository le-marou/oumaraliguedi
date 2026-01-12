/**
 * Components Loader
 * Centralizes the Navigation and Footer HTML to avoid repetition.
 */

const HEADER_HTML = `
    <nav>
        <div class="container">
            <div class="logo">OAG.CYBER</div>
            <div class="menu-toggle" id="menuToggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html#home">Accueil</a></li>
                <li><a href="index.html#about">À propos</a></li>
                <li><a href="index.html#experience">Parcours</a></li>
                <li><a href="index.html#skills">Compétences</a></li>
                <li><a href="index.html#portfolio">Portfolio</a></li>
                <li><a href="index.html#contact">Contact</a></li>
            </ul>
        </div>
    </nav>
`;

const FOOTER_HTML = `
    <footer>
        <div class="container">
            <p>&copy; <span id="current-year">2025</span> Oumar Ali Mahamat Guedi - Expert Sécurité & Forensic</p>
            <p style="color: var(--text-dim); margin-top: 0.5rem;">Construire un monde numérique plus sûr, une ligne de code à la fois</p>
        </div>
    </footer>
`;

function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = HEADER_HTML;
        // Re-initialize menu toggle after injection
        initMobileMenu();
    }

    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = FOOTER_HTML;
        // Update year
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);
