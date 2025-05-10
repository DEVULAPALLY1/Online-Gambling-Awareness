// News page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load more articles functionality
    const loadMoreBtn = document.getElementById('load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles();
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simulate form submission
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = 'Subscribing...';
                
                setTimeout(() => {
                    // Show success message
                    const formContainer = newsletterForm.parentElement;
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;"></i>
                            <h3>Thank You for Subscribing!</h3>
                            <p>You've been added to our newsletter. We'll keep you updated with the latest news and research.</p>
                        </div>
                    `;
                }, 1500);
            }
        });
    }
});

// Function to load more articles
function loadMoreArticles() {
    const loadMoreBtn = document.getElementById('load-more');
    const newsGrid = document.querySelector('#all .news-grid');
    
    if (!newsGrid || !loadMoreBtn) return;
    
    // Show loading state
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';
    
    // Simulate loading delay
    setTimeout(() => {
        // Create new articles
        const newArticles = [
            {
                category: 'research',
                date: 'March 15, 2025',
                title: 'Genetic Factors in Gambling Addiction Identified',
                excerpt: 'A new twin study has identified several genetic markers that may predispose individuals to gambling disorder.'
            },
            {
                category: 'treatment',
                date: 'March 10, 2025',
                title: 'New Medication Shows Promise in Clinical Trials',
                excerpt: 'A novel medication targeting impulse control has shown significant results in reducing gambling urges in early trials.'
            },
            {
                category: 'awareness',
                date: 'March 5, 2025',
                title: 'Professional Sports Leagues Partner on Responsible Gambling',
                excerpt: 'Major sports leagues announce new initiatives to promote responsible gambling among fans and prevent addiction.'
            }
        ];
        
        // Add new articles to the grid
        newArticles.forEach(article => {
            const categoryClass = article.category;
            const categoryText = article.category.charAt(0).toUpperCase() + article.category.slice(1);
            
            const articleHTML = `
                <div class="news-card">
                    <div class="news-image"></div>
                    <div class="news-content">
                        <div class="article-meta">
                            <span class="badge ${categoryClass}">${categoryText}</span>
                            <span class="article-date"><i class="far fa-clock"></i> ${article.date}</span>
                        </div>
                        <h3>${article.title}</h3>
                        <p>${article.excerpt}</p>
                        <a href="news-article.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            
            newsGrid.insertAdjacentHTML('beforeend', articleHTML);
        });
        
        // Update button state
        loadMoreBtn.textContent = 'No More Articles';
        loadMoreBtn.disabled = true;
        
        // Add animation to new articles
        const newCards = newsGrid.querySelectorAll('.news-card:nth-last-child(-n+3)');
        newCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Trigger animation
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
        
    }, 1500);
}

// Function to filter articles by category
function filterArticles() {
    // This functionality is handled by the tab system in main.js
    // The tabs allow users to filter articles by category (All, Research, Treatment, Awareness)
    
    // If we wanted to add additional filtering (like by date or search), we could implement it here
}

// Function to share article on social media
function shareArticle(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support the Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    }
}

// Add share buttons to articles if JS is enabled
document.addEventListener('DOMContentLoaded', function() {
    const articleTitles = document.querySelectorAll('.news-content h3');
    
    articleTitles.forEach(title => {
        const articleContainer = title.closest('.news-content');
        const readMoreLink = articleContainer.querySelector('.read-more');
        
        if (readMoreLink) {
            const shareButton = document.createElement('button');
            shareButton.className = 'share-button';
            shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
            shareButton.addEventListener('click', function(e) {
                e.preventDefault();
                const articleUrl = window.location.origin + '/news-article.html';
                const articleTitle = title.textContent;
                shareArticle(articleUrl, articleTitle);
            });
            
            // Insert share button before read more link
            readMoreLink.parentNode.insertBefore(shareButton, readMoreLink.nextSibling);
        }
    });
});