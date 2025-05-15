const recipes_container = document.querySelector(".recipes_container");
const searchInput = document.querySelector('.finder__input');
const filterBtn = document.querySelector('.filter-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const cancelBtn = document.querySelector('.cancel-btn');
const timeSlider = document.getElementById('cooking-time');
const timeValue = document.getElementById('time-value');
const preloader = document.querySelector('.preloader');
const closeModalBtn = document.querySelector('.close-modal');
const recipesContainer = document.querySelector('.recipes_container');
const contentBlocker = document.getElementById('contentBlocker');
let ingredientSelect;
let tagsSelect;
let categorySelect;
let currentPage = 1;
const recipesPerPage = 10;
let totalPages = 0;
let totalRecipes = 0;
function adjustNameTextSizeToFitBoundary(textElement, boundaryElement) {
    const boundaryRect = boundaryElement.getBoundingClientRect();
    let textRect = textElement.getBoundingClientRect();
    let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    const minFontSize = 8;

    while ((textRect.bottom > boundaryRect.top) && fontSize > minFontSize) {
        fontSize -= 0.5;
        textElement.style.fontSize = `${fontSize}px`;
        textRect = textElement.getBoundingClientRect();
    }

    while (textRect.bottom < boundaryRect.top && fontSize < 30) {
        fontSize += 0.5;
        textElement.style.fontSize = `${fontSize}px`;
        textRect = textElement.getBoundingClientRect();
    }
}

function adjustVerticalDescriptionTextSizeToFitBoundary(textElement, boundaryElement) {
    const boundaryRect = boundaryElement.getBoundingClientRect();
    let textRect = textElement.getBoundingClientRect();
    let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    const minFontSize = 8;

    while ((textRect.bottom > boundaryRect.top || textRect.left < boundaryRect.right) && fontSize > minFontSize) {
        fontSize -= 0.5;
        textElement.style.fontSize = `${fontSize}px`;
        textRect = textElement.getBoundingClientRect();
    }

    while (textRect.bottom < boundaryRect.top && textRect.left > boundaryRect.right && fontSize < 25) {
        fontSize += 0.5;
        textElement.style.fontSize = `${fontSize}px`;
        textRect = textElement.getBoundingClientRect();
    }
}

function adjustHorizontalDescriptionTextSizeToFitBoundary(textElement, boundaryElement) {

    const boundaryRect = boundaryElement.getBoundingClientRect();
    let textRect = textElement.getBoundingClientRect();
    let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    const minFontSize = 10;

    while ((textRect.bottom > boundaryRect.top || textRect.right > boundaryRect.left) && fontSize > minFontSize) {
        fontSize -= 0.5;
        textElement.style.fontSize = `${fontSize}px`;
        textRect = textElement.getBoundingClientRect();
    }

    while (textRect.bottom < boundaryRect.top && textRect.right < boundaryRect.left && fontSize < 25) {
        fontSize += 0.5;
        textElement.style.fontSize = `${fontSize}px`;
        textRect = textElement.getBoundingClientRect();
    }
}

function adjustAllTextsToBoundaries() {
    document.querySelectorAll('.recipe-name').forEach(nameElement => {
        const boundary = nameElement.closest('.text-overlay').querySelector('.name-boundary');
        if (boundary) adjustNameTextSizeToFitBoundary(nameElement, boundary);
    });
    document.querySelectorAll('.horizontal-paper.description .recipe-description').forEach(descElement => {
        const boundary = descElement.closest('.text-overlay').querySelector('.description-boundary');
        if (boundary) adjustHorizontalDescriptionTextSizeToFitBoundary(descElement, boundary);
    });
    document.querySelectorAll('.vertical-paper.description .recipe-description').forEach(descElement => {
        const boundary = descElement.closest('.text-overlay').querySelector('.description-boundary');
        if (boundary) adjustVerticalDescriptionTextSizeToFitBoundary(descElement, boundary);
    });
}

const fetchApi = async (query) => {
    recipesContainer.innerHTML = '';

    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('No token found, please log in');
            return;
        }

        if (query) {
            await fetchSpecific(query).then(adjustAllTextsToBoundaries);
            searchInput.value = query;
            return;
        }

        await fetchAll(token);

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
        });

    } catch (er) {
        recipes_container.innerHTML =
            "<h1 class='errormsg'>Something went wrong. Please try again.</h1>";
        console.error(er);
    } finally {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            contentBlocker.style.display = 'none';
        }, 1000);
    }
};

async function fetchSpecific(query) {
    contentBlocker.style.display = 'block';
    preloader.style.display = 'flex';
    preloader.classList.remove('hidden');

    try {
        const url = `/recipes/name/${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            method: "GET"
        });

        const data = await response.json();
        await showData(data);

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
        });

    } catch (er) {
        recipes_container.innerHTML =
            "<h1 class='errormsg'>Something went wrong. Please try again.</h1>";
        console.error(er);
    } finally {
        preloader.classList.add('hidden');
    }
}

async function fetchAll(token) {
    let allRecipes = [];
    let nextUrl = "/recipes";
    let loadedRecipes = 0;
    while (nextUrl) {
        let cached = getFromLocalStorage(nextUrl);
        const headers = {
            "Authorization": `Bearer ${token}`,
        };

        if (cached?.etag) {
            headers["If-None-Match"] = cached.etag;
        }

        const response = await fetch(nextUrl, {
            method: "GET",
            headers: headers
        });

        let data;
        if (response.status === 304) {
            if (!cached) {
                throw new Error("Received 304 but no cached data available");
            }
            data = cached.data.data;
            console.log(`Using cached data for ${nextUrl}`);
        } else if (!response.ok) {
            throw new Error("Failed to load recipes");
        } else {
            const responseData = await response.json();
            const etag = response.headers.get('ETag');

            data = responseData.data;

            saveToLocalStorage(nextUrl, {
                data: responseData,
                etag: etag,
                timestamp: Date.now()
            });
        }

        allRecipes = [...allRecipes, ...data];
        nextUrl = data.links?.next;
        totalRecipes = data.meta?.total || totalRecipes;
        loadedRecipes += data.length;
    }

    await showData(allRecipes);
}

async function fetchImageUrl(key) {
    const url = `/images/${encodeURIComponent(key)}`;
    const response = await fetch(url, {
        method: "GET",
    });

    return response.text();
}

async function fetchFiltered(page = 1) {
    contentBlocker.style.display = 'block';
    preloader.style.display = 'flex';
    preloader.classList.remove('hidden');

    let allRecipes = [];

    const categories = categorySelect.selectedIds;
    const tags = tagsSelect.selectedIds;
    const ingredients = ingredientSelect.selectedIds;
    const cookingTime = timeSlider.value;
    let loadedRecipes = 0;
    let data;

    let url = new URL('/recipes/filter', window.location.origin);

    url.searchParams.append('page', page);
    url.searchParams.append('limit', recipesPerPage);

    if (categories.length > 0) url.searchParams.append('categories', categories.join(','));
    if (tags.length > 0) url.searchParams.append('tags', tags.join(','));
    if (ingredients.length > 0) url.searchParams.append('ingredients', ingredients.join(','));
    if (cookingTime) url.searchParams.append('maxCookingTime', cookingTime);

    try {
            const response = await fetch(url.toString());

            if (!response.ok) {
                return new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            data = responseData.data;

            allRecipes = [...allRecipes, ...data];
            totalRecipes = responseData.meta?.total || totalRecipes;
            currentPage = responseData.meta?.page;
            totalPages = responseData.meta?.lastPage;

        await showData(allRecipes);
        renderPaginationControls();

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                setTimeout(resolve, 3000);
            });
        });
    } catch (error) {
        console.error('Error fetching filtered recipes:', error);
        throw error;
    } finally {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            contentBlocker.style.display = 'none';
        }, 300);
    }
}

const showData = async (resp) => {
    try {
        recipes_container.innerHTML = "";

        const result = await resp;

        result.map(async (value) => {
            const {
                id,
                name,
                description,
                imageData,
                ingredients,
                instructions
            } = value;

            const recipe_card = document.createElement("div");
            recipe_card.setAttribute("class", "recipe_card");

            const imageKey = imageData.imageData;
            const imageUrl = await fetchImageUrl(imageKey);

            recipe_card.innerHTML = `
<div class="recipe-container">
    <div class="recipe-card" id="recipe-card-${id}">
        <div class="recipe-image-wrapper">
            <img src="${imageUrl}" alt="${name}" class="recipe-image" onload="setPaperOrientation(this, '${description}')"/>
        </div>
        <div class="text-overlay">
            <h3 class="recipe-name">${name}</h3>
            <div class="text-boundary name-boundary"></div>
            ${description ? `
            <p class="recipe-description">${description}</p>
        ` : ''}
            <div class="text-boundary description-boundary"></div>
        </div>
    </div>
            <div class="recipe-tabs">
                <div class="recipe-tab ingredients" onclick="showIngredientsModal('${id}')"></div>
                <div class="recipe-tab instructions" onclick="showInstructionsModal('${id}')"></div>
        </div>
            <div id="ingredients-modal-${id}" class="tab-modal-overlay" style="display: none">
    <div class="recipe-modal-content">
        <span class="close-modal" onclick="closeModal('ingredients-modal-${id}')">&times;</span>
        <h2>Ingredients</h2>
        <ul class="ingredients-list">
            ${ingredients.map(ing => `
                <li class="ingredient-item">
                    <i class="fas fa-check-circle"></i> ${ing.ingredient.name}
                </li>
            `).join("")}
        </ul>
    </div>
</div>

<div id="instructions-modal-${id}" class="tab-modal-overlay" style="display: none">
    <div class="recipe-modal-content">
        <span class="close-modal" onclick="closeModal('instructions-modal-${id}')">&times;</span>
        <h2>Instructions</h2>
        <div class="instructions-content">
            <p>${instructions}</p>
        </div>
    </div>
</div>
</div>
    </div>
            `;

            recipes_container.appendChild(recipe_card);
        });

    } catch (err) {
        console.error("Error fetching recipes:", err);
        recipes_container.innerHTML = "<h1 class='errormsg'>Recipes not found</h1>";
    }
};

function renderPaginationControls() {
    const paginationContainer = document.getElementById('pagination-container') ||
        document.createElement('div');
    paginationContainer.className = 'pagination';
    paginationContainer.id = 'pagination-container';
    paginationContainer.innerHTML = '';

    const paginationPrev = document.createElement('div');
    paginationPrev.className = 'pagination-previous';

    const paginationNext = document.createElement('div');
    paginationNext.className = 'pagination-next';

    const paginationCurr = document.createElement('div');
    paginationCurr.className = 'pagination-current';

    if (currentPage > 1) {
        const prevOuter = document.createElement('div');
        prevOuter.className = 'pagination-item__outer';

        const prevInner = document.createElement('div');
        prevInner.className = 'pagination-item__inner';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
        prevBtn.addEventListener('click', () => fetchFiltered(currentPage - 1));

        prevInner.appendChild(prevBtn);
        prevOuter.appendChild(prevInner);
        paginationPrev.appendChild(prevOuter);
        paginationContainer.appendChild(paginationPrev);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageOuter = document.createElement('div');
        pageOuter.className = 'pagination-item__outer';

        const pageInner = document.createElement('div');
        pageInner.className = 'pagination-item__inner';

        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.disabled = true;
        }
        pageBtn.addEventListener('click', () => fetchFiltered(i));

        pageInner.appendChild(pageBtn);
        pageOuter.appendChild(pageInner);
        paginationCurr.appendChild(pageOuter);
        paginationContainer.appendChild(paginationCurr);
    }

    if (currentPage < totalPages) {
        const nextOuter = document.createElement('div');
        nextOuter.className = 'pagination-item__outer';

        const nextInner = document.createElement('div');
        nextInner.className = 'pagination-item__inner';

        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => fetchFiltered(currentPage + 1));

        nextInner.appendChild(nextBtn);
        nextOuter.appendChild(nextInner);
        paginationNext.appendChild(nextOuter);
        paginationContainer.appendChild(paginationNext);
    }


    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    paginationContainer.appendChild(pageInfo);

    if (!document.getElementById('pagination-container')) {
        recipesContainer.after(paginationContainer);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    contentBlocker.style.display = 'block';
    preloader.style.display = 'flex';
    preloader.classList.remove('hidden');

    async function loadIngredients() {
        let allIngredients = [];
        let nextUrl = "/ingredients";
        let totalIngredients = 0;
        let loadedIngredients = 0;

        while (nextUrl) {
            const response = await fetch(nextUrl, {
                method: "GET"
            });

            if (!response.ok) throw new Error("Failed to load recipes");

            const {data, meta, links} = await response.json();

            allIngredients = [...allIngredients, ...data];
            nextUrl = links.next;
            totalIngredients = meta.total;
            loadedIngredients += data.length;
        }

        await populateIngredients(allIngredients);
    }

    async function loadTags() {
        try {
            const response = await fetch("/recipe-tags", {
                method: "GET"
            });
            if (!response.ok) return new Error("Failed to load tags");
            const data = await response.json();
            populateTags(data);
        } catch (error) {
            console.error("Error loading tags:", error);
        }
    }

    async function loadCategories() {
        try {
            const response = await fetch("/categories", {
                method: "GET"
            });
            if (!response.ok) return new Error("Failed to load categories");
            const data = await response.json();
            populateCategories(data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    function populateIngredients(ingredients) {
        console.log(ingredients);
        let options = [];
        ingredients.forEach(ingredient => {
            const option = {
                id: ingredient.id,
                name: ingredient.name,
            }
            options.push(option);
        });

        ingredientSelect = new MultiSelect('#dynamicIngredients', {
            data: options,
            placeholder: 'Select ingredients',
            search: true,
            selectAll: true,
            listAll: false,
            onChange: function (id, name, element) {
                console.log('Change:', id, name, element);
            },
            onSelect: function (id, name, element) {
                console.log('Selected:', id, name, element);
            },
            onUnselect: function (id, name, element) {
                console.log('Unselected:', id, name, element);
            }
        });
    }

    function populateTags(tags) {
        console.log(tags);
        let options = [];
        tags.forEach(tag => {
            const option = {
                id: tag.id,
                name: tag.name,
            }
            options.push(option);
        });
        tagsSelect = new MultiSelect('#dynamicTags',
            {
                data: options,
                placeholder: 'Select an option',
                search: true,
                selectAll: false,
                listAll: false
            })
    }

    function populateCategories(categories) {
        console.log(categories);
        let options = [];
        categories.forEach(category => {
            const option = {
                id: category.id,
                name: category.categoryTitle,
            }
            options.push(option);
        });

        categorySelect = new MultiSelect('#dynamicCategories',
            {
                data: options,
                placeholder: 'Select an option',
                search: true
            })
    }

    await loadIngredients();
    await loadTags();
    await loadCategories();
});

window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('search');
    const searchInput = document.getElementById('searchBox');

    if (param) {
        searchInput.placeholder = '';
    } else {
        searchInput.placeholder = 'search what I want today...';
    }
    await fetchApi(param).then(adjustAllTextsToBoundaries);

    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', function() {
            const encodedId = encodeURIComponent(btoa(this.id.split('-')[2])); // Двойное кодирование
            window.openRecipePage(encodedId);
        });
    });
});

function showIngredientsModal(id) {
    closeModal(`instructions-modal-${id}`);
    document.getElementById(`ingredients-modal-${id}`).style.display = "flex";
}

function showInstructionsModal(id) {
    closeModal(`ingredients-modal-${id}`)
    document.getElementById(`instructions-modal-${id}`).style.display = "flex";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = "none";
    }
}

window.onclick = function (event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

function setPaperOrientation(img, description) {
    const card = img.closest('.recipe-card');
    const isVertical = img.naturalHeight > img.naturalWidth;
    const hasDescription = description && description.trim() !== '';

    card.classList.add(isVertical ? 'vertical-paper' : 'horizontal-paper');
    card.classList.add(hasDescription ? 'description' : 'no-description');
    card.style.setProperty('--image-height', `${img.naturalHeight}px`);
    card.style.setProperty('--image-width', `${img.naturalWidth}px`);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

filterBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
})

cancelBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
});


timeSlider.addEventListener('input', () => {
    timeValue.textContent = `${timeSlider.value} minutes`;
});

const filterForm = document.querySelector('.filter-form');

filterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    modalOverlay.style.display = 'none';
    await fetchFiltered().then(adjustAllTextsToBoundaries);
});

function openRecipePage(recipeId) {
    try {
        window.open(`recipe-details?recipe=${recipeId}`, '_blank');
    } catch (error) {
        console.error('Error opening recipe:', error);
        alert('Failed to open recipe');
    }
}

