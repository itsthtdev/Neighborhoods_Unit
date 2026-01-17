// Check API health on page load and display features
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        const statusDiv = document.getElementById('api-status');
        if (data.status === 'healthy') {
            statusDiv.className = 'status-display success';
            statusDiv.innerHTML = `
                <p><strong>✓ API Status:</strong> ${data.message}</p>
                <p><strong>Available Features:</strong></p>
                <ul>
                    ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;
        }
        
        console.log('API Status:', data);
    } catch (error) {
        console.error('Error checking API health:', error);
        const statusDiv = document.getElementById('api-status');
        statusDiv.className = 'status-display error';
        statusDiv.innerHTML = '<p><strong>✗ API Status:</strong> Connection failed</p>';
    }
});

// Handle sign-in button
const getStartedBtn = document.getElementById('get-started-btn');
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        // In production, this would redirect to Google OAuth
        window.location.href = '/api/auth/google';
    });
}

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/current');
        const data = await response.json();
        
        if (data.user) {
            console.log('User authenticated:', data.user);
            // Could redirect to dashboard or update UI
        }
    } catch (error) {
        console.log('User not authenticated');
    }
}

checkAuth();
