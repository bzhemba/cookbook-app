const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
let liveSuggestions = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: '/recipes/suggestions/%QUERY',
        wildcard: '%QUERY',
        transform: (response) => response.map(title => ({value: title}))
    }
});

$('#search .finder__input').typeahead(
    {
        highlight: true,
        minLength: 1,
    },
    {
        display: 'value',
        source: liveSuggestions,
        templates: {
            suggestion: (data) => `<div>${data.value}</div>`
        }
    }
);

searchBox.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (query.length === 0) {
        suggestions.innerHTML = "";
    }
});



searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        performSearch();
    }
});

function performSearch() {
    const query = searchBox.value.trim();
    window.location.href = query ? `/all-recipes?search=${encodeURIComponent(query)}` : "/all-recipes";
}
