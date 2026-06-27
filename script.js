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

            // Clone the container and remove the download button from the clone
            // This ensures the button never appears in the generated PDF
            const sourceElement = document.querySelector('.container');
            const pdfElement = sourceElement.cloneNode(true);
            const pdfBtn = pdfElement.querySelector('#download-pdf');
            if (pdfBtn) {
                pdfBtn.remove();
            }
            pdfElement.style.position = 'absolute';
            pdfElement.style.left = '-9999px';
            pdfElement.style.top = '-9999px';
            document.body.appendChild(pdfElement);

            const opt = {
                margin: 0,
                filename: 'Zengani-Banda-CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(pdfElement).save().then(() => {
                // Clean up clone and reset button state
                document.body.removeChild(pdfElement);
                downloadBtn.innerHTML = originalBtnText;
                downloadBtn.disabled = false;
            }).catch(err => {
                console.error('PDF generation failed:', err);
                // Clean up clone and reset button state on error
                if (document.body.contains(pdfElement)) {
                    document.body.removeChild(pdfElement);
                }
                downloadBtn.innerHTML = originalBtnText;
                downloadBtn.disabled = false;
                alert('Failed to generate PDF. Please try again.');
            });
        });
    }
});
