// This file contains additional functionality specific to the resources page
// Most of the tab functionality is handled in main.js

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Helpline button functionality
const helplineButtons = document.querySelectorAll('.btn-primary:contains("Call the Helpline")');

if (helplineButtons.length > 0) {
    helplineButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('This would connect you to the National Problem Gambling Helpline: 1-800-522-4700');
        });
    });
}

// Helper function for button text matching
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Add :contains selector
if (typeof jQuery !== 'undefined') {
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
} else {
    console.warn('jQuery is not defined. The :contains selector will not work.');
}