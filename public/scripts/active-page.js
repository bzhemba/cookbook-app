const activePage = window.location.pathname;

document.querySelectorAll('nav a').forEach(link => {
    if (link.href.includes(`${activePage}`)) {
        link.classList.add("activeLink");
    }
})