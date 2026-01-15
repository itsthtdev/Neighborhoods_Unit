// Check API health on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('API Status:', data);
    } catch (error) {
        console.error('Error checking API health:', error);
    }
});

// Add click handler for CTA button
document.querySelector('.btn-primary').addEventListener('click', () => {
    alert('Welcome to Neighbors Unite! Community features coming soon.');
});
