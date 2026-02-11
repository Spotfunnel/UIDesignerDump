/**
 * SpotFunnel Scrollytelling Engine
 * Handles scroll progress normalization and CSS variable binding
 */

class ScrollEngine {
    constructor() {
        this.ticking = false;
        this.stickySections = document.querySelectorAll('[data-sticky-section]');
        this.animatableElements = document.querySelectorAll('[data-scroll-anim]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.onScroll(), { passive: true });
        this.onScroll(); // Initial calculation
    }

    onScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.update();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    update() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // Handle Sticky Sections
        this.stickySections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const top = rect.top;
            const height = rect.height;

            // Calculate progress: 0 when top enters viewport, 1 when bottom leaves viewport
            // For sticky, we often want 0 when it *starts* sticking, and 1 when it *stops*
            // But a generic progress 0 -> 1 over the section's total height is versatile.

            let progress = (viewportHeight - top) / (height + viewportHeight);

            // clamped progress 0 to 1
            const clamped = Math.max(0, Math.min(1, progress));

            // Specific sticking progress (useful for pinning)
            // If the element is larger than viewport and sticky, we calculate how far we've scrolled *within* it
            const stickyProgress = Math.max(0, Math.min(1, -top / (height - viewportHeight)));

            section.style.setProperty('--scroll-progress', clamped);
            section.style.setProperty('--sticky-progress', stickyProgress);
        });

        // Handle generic scroll animations (appearing, parallax)
        this.animatableElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // 0 when entering bottom, 1 when showing fully (simplified)
            // Let's do: 0 (entering bottom) -> 1 (exiting top)
            const globalProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
            el.style.setProperty('--element-scroll', globalProgress.toFixed(4));
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ScrollEngine();
});
