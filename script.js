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
        '.skill-text',
        '.reference-name',
        '.reference-title',
        '.reference-contact'
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

            // Show/hide add buttons
            document.querySelectorAll('.add-item-btn').forEach(btn => {
                btn.style.display = isEditMode ? 'flex' : 'none';
            });

            // Show/hide delete buttons
            document.querySelectorAll('.delete-item-btn').forEach(btn => {
                btn.style.display = isEditMode ? 'flex' : 'none';
            });

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

    // Add delete buttons to existing items
    function createDeleteButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'delete-item-btn';
        btn.style.display = 'none';
        btn.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        `;
        return btn;
    }

    document.querySelectorAll('.education-item, .project-item, .reference-item').forEach(item => {
        const deleteBtn = createDeleteButton();
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            item.remove();
        });
        item.insertBefore(deleteBtn, item.firstChild);
    });

    document.querySelectorAll('.skill-tag').forEach(skill => {
        const deleteBtn = createDeleteButton();
        deleteBtn.classList.add('delete-skill-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            skill.remove();
        });
        skill.insertBefore(deleteBtn, skill.firstChild);

        // Ensure skill text is wrapped in a span
        if (!skill.querySelector('.skill-text')) {
            const textSpan = document.createElement('span');
            textSpan.className = 'skill-text';
            while (skill.childNodes.length > 1) {
                textSpan.appendChild(skill.childNodes[1]);
            }
            skill.appendChild(textSpan);
        }
    });

    // Add item functionality
    document.querySelectorAll('.add-item-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const type = this.dataset.type;
            const section = this.closest('.section');
            let newItem;

            if (type === 'education') {
                newItem = document.createElement('div');
                newItem.className = 'education-item';
                newItem.innerHTML = `
                    <div class="education-header">
                        <h3 class="education-school">School Name</h3>
                        <span class="education-period">Period</span>
                    </div>
                    <p class="education-details">Description</p>
                `;
                const deleteBtn = createDeleteButton();
                deleteBtn.style.display = 'flex';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    newItem.remove();
                });
                newItem.insertBefore(deleteBtn, newItem.firstChild);
                section.querySelector('.education-item:last-of-type').after(newItem);
            } else if (type === 'skill') {
                newItem = document.createElement('div');
                newItem.className = 'skill-tag';
                newItem.innerHTML = '<span class="skill-text">New Skill</span>';
                const deleteBtn = createDeleteButton();
                deleteBtn.classList.add('delete-skill-btn');
                deleteBtn.style.display = 'flex';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    newItem.remove();
                });
                newItem.insertBefore(deleteBtn, newItem.firstChild);
                section.querySelector('.skills-grid').appendChild(newItem);
            } else if (type === 'experience') {
                newItem = document.createElement('div');
                newItem.className = 'project-item';
                newItem.innerHTML = `
                    <h3 class="project-title">Job Title</h3>
                    <p class="project-description">Description</p>
                `;
                const deleteBtn = createDeleteButton();
                deleteBtn.style.display = 'flex';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    newItem.remove();
                });
                newItem.insertBefore(deleteBtn, newItem.firstChild);
                section.querySelector('.project-item:last-of-type').after(newItem);
            } else if (type === 'reference') {
                newItem = document.createElement('div');
                newItem.className = 'reference-item';
                newItem.innerHTML = `
                    <h3 class="reference-name">Reference Name</h3>
                    <p class="reference-title">Position, Company</p>
                    <p class="reference-contact">
                        <a href="mailto:email@example.com">email@example.com</a> | 
                        <a href="tel:+260123456789">+260 123 456 789</a>
                    </p>
                `;
                const deleteBtn = createDeleteButton();
                deleteBtn.style.display = 'flex';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    newItem.remove();
                });
                newItem.insertBefore(deleteBtn, newItem.firstChild);
                section.querySelector('.reference-item:last-of-type').after(newItem);
            }

            // Make new item editable
            if (newItem) {
                newItem.querySelectorAll('.education-school, .education-period, .education-details, .project-title, .project-description, .skill-text, .reference-name, .reference-title, .reference-contact').forEach(el => {
                    el.contentEditable = true;
                });
            }
        });
    });

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
            document.querySelectorAll('.add-item-btn, .delete-item-btn').forEach(btn => {
                btn.style.display = 'none';
            });

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
                    document.querySelectorAll('.add-item-btn, .delete-item-btn').forEach(btn => {
                        btn.style.display = 'flex';
                    });
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
                    document.querySelectorAll('.add-item-btn, .delete-item-btn').forEach(btn => {
                        btn.style.display = 'flex';
                    });
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
