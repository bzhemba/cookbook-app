document.addEventListener('DOMContentLoaded', () => {
    const clientLoadTime = performance.now();
    document.getElementById('client-time').textContent = Math.round(clientLoadTime);
});