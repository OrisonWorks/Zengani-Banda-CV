// Smooth scroll for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add current year to footer while preserving OrisonWorks attribution
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Zengani Banda. Powered by <a href="https://orison-softworks.github.io/OrisonWorksite/">OrisonWorks</a>`;
    }

    // PDF download functionality
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Show loading state
            const originalBtnText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Generating...
            `;
            downloadBtn.disabled = true;
            downloadBtn.style.display = 'none';

            const sourceElement = document.querySelector('.container');
            const sections = sourceElement.querySelectorAll('.section');
            const originalSectionStyles = [];

            // Ensure all sections are visible for PDF generation
            sections.forEach((section, index) => {
                originalSectionStyles[index] = {
                    opacity: section.style.opacity,
                    transform: section.style.transform
                };
                section.style.opacity = '1';
                section.style.transform = 'none';
            });

            const opt = {
                margin: 0,
                filename: 'Zengani-Banda-CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(sourceElement).save().then(() => {
                // Restore button state and section styles
                downloadBtn.style.display = '';
                downloadBtn.innerHTML = originalBtnText;
                downloadBtn.disabled = false;
                sections.forEach((section, index) => {
                    section.style.opacity = originalSectionStyles[index].opacity;
                    section.style.transform = originalSectionStyles[index].transform;
                });
            }).catch(err => {
                console.error('PDF generation failed:', err);
                // Restore button state and section styles on error
                downloadBtn.style.display = '';
                downloadBtn.innerHTML = originalBtnText;
                downloadBtn.disabled = false;
                sections.forEach((section, index) => {
                    section.style.opacity = originalSectionStyles[index].opacity;
                    section.style.transform = originalSectionStyles[index].transform;
                });
                alert('Failed to generate PDF. Please try again.');
            });
        });
    }
});
