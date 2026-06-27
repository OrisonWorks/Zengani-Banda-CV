// CV functionality
document.addEventListener('DOMContentLoaded', function() {
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
        footerYear.innerHTML = `&copy; ${currentYear} Zengani Banda. Powered by <a href="https://orison-softworks.github.io/OrisonWorksite/" rel="noopener noreferrer">OrisonWorks</a>`;
    }

    // Edit Mode functionality
    const editModeBtn = document.getElementById('edit-mode');
    const saveHtmlBtn = document.getElementById('save-html');
    let isEditMode = false;
    const editableElements = [
        '.name',
        '.title',
        '.section-content',
        '.education-details',
        '.project-description',
        '.education-school',
        '.education-period',
        '.project-title',
        '.skill-tag'
    ];

    if (editModeBtn) {
        editModeBtn.addEventListener('click', function() {
            isEditMode = !isEditMode;

            editableElements.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.contentEditable = isEditMode;
                });
            });

            // Show/hide Save HTML button
            if (saveHtmlBtn) {
                saveHtmlBtn.style.display = isEditMode ? 'flex' : 'none';
            }

            // Update button text and style
            if (isEditMode) {
                editModeBtn.innerHTML = `
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                    Cancel
                `;
                editModeBtn.style.background = 'rgba(239, 68, 68, 0.3)';
                editModeBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            } else {
                // Explicitly disable contentEditable when canceling
                editableElements.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        el.contentEditable = false;
                    });
                });

                editModeBtn.innerHTML = `
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Mode
                `;
                editModeBtn.style.background = '';
                editModeBtn.style.borderColor = '';
            }
        });
    }

    // Save HTML functionality
    if (saveHtmlBtn) {
        saveHtmlBtn.addEventListener('click', function() {
            try {
                const updatedHTML = document.documentElement.outerHTML;
                const blob = new Blob([updatedHTML], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'index.html';
                a.click();
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Save HTML failed:', err);
                alert('Failed to save HTML. Please try again.');
            }
        });
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
            editModeBtn.style.display = 'none';
            saveHtmlBtn.style.display = 'none';

            const sourceElement = document.querySelector('.container');
            if (!sourceElement) {
                console.error('Container element not found');
                downloadBtn.style.display = '';
                downloadBtn.innerHTML = originalBtnText;
                downloadBtn.disabled = false;
                editModeBtn.style.display = '';
                if (isEditMode) {
                    saveHtmlBtn.style.display = 'flex';
                }
                alert('Failed to generate PDF. Container element not found.');
                return;
            }
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
                editModeBtn.style.display = '';
                if (isEditMode) {
                    saveHtmlBtn.style.display = 'flex';
                }
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
                editModeBtn.style.display = '';
                if (isEditMode) {
                    saveHtmlBtn.style.display = 'flex';
                }
                sections.forEach((section, index) => {
                    section.style.opacity = originalSectionStyles[index].opacity;
                    section.style.transform = originalSectionStyles[index].transform;
                });
                alert('Failed to generate PDF. Please try again.');
            });
        });
    }
});
