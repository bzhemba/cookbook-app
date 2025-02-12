window.addEventListener('load', () => {
    let loadTime = performance.now();
    const footer = document.getElementById('load-time');
    if (footer) {
        footer.innerHTML = 'Load time: ' + loadTime.toFixed(3) + ' ms';
    }
});