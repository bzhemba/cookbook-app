const recipes_container = document.querySelector(".recipes_container");
const fetchApi = async (query) => {
    recipes_container.innerHTML = `
        <div class="preloader">
            <img src="../images/loading.gif" class="loader_img" alt="Loading..." />
        </div>
    `;

    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('No token found, please log in');
            return;
        }

        if (query){
            await fetchSpecific(query, token);
            return;
        }

        await fetchAll(token)

    } catch (er) {
        recipes_container.innerHTML =
            "<h1 class='errormsg'>Something went wrong. Please try again.</h1>";
        console.error(er);
    }
};

async function fetchSpecific(query, token) {
    const url = `/recipes/${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();
    await showData(data);
}

async function fetchAll(token){
    let allRecipes = [];
    let nextUrl = "/recipes";
    let totalRecipes = 0;
    let loadedRecipes = 0;

    while (nextUrl) {
        const response = await fetch(nextUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Failed to load recipes");

        const { data, meta, links } = await response.json();

        allRecipes = [...allRecipes, ...data];
        nextUrl = links.next;
        totalRecipes = meta.total;
        loadedRecipes += data.length;
    }

    await showData(allRecipes);
}

const showData = async (resp) => {
    try {
        recipes_container.innerHTML = "";

        const result = await resp;

        result.map((value) => {
            const {
                id,
                name,
                category,
                imageData,
                ingredients,
                instructions,
                recipeTags,
                createdByUser
            } = value;

            const recipe_card = document.createElement("div");
            recipe_card.setAttribute("class", "recipe_card");

            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            const imageUrl = `${baseUrl}${imageData.imageData}`;


            recipe_card.innerHTML = `
<div class="recipe-container">
    <div class="recipe-card" id="recipe-card-${id}">
        <div class="recipe-image-wrapper">
            <img 
                src="${imageUrl}" 
                alt="${name}" 
                class="recipe-image"
                onerror="this.src='placeholder.jpg'"
                onload="setPaperOrientation(this, '${name}')"
            />
            <div class="title-overlay"></div>
        </div>
    </div>
            <div class="recipe-tabs">
            <div class="recipe-tab ingredients" onclick="showIngredientsModal('${id}')">
            </div>
            <div class="recipe-tab instructions" onclick="showInstructionsModal('${id}')">
            </div>
        </div>
    </div>
    
    <div id="ingredients-modal-${id}" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal('ingredients-modal-${id}')">&times;</span>
        <h2>${name} - Ingredients</h2>
        <ul class="ingredients-list">
            ${ingredients.map(ing => `
                <li class="ingredient-item">
                    <i class="fas fa-check-circle"></i> ${ing.name}
                </li>
            `).join("")}
        </ul>
    </div>
</div>

<div id="instructions-modal-${id}" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal('instructions-modal-${id}')">&times;</span>
        <h2>${name} - Instructions</h2>
        <div class="instructions-content">
            <p>${instructions}</p>
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

window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('search');
    await fetchApi(param);
});
function showIngredientsModal(id) {
    document.getElementById(`ingredients-modal-${id}`).style.display = "block";
}

function showInstructionsModal(id) {
    document.getElementById(`instructions-modal-${id}`).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

window.onclick = function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

function setPaperOrientation(img, name) {
    const card = img.closest('.recipe-card');
    const isVertical = img.naturalHeight > img.naturalWidth;

    card.classList.add(isVertical ? 'vertical-paper' : 'horizontal-paper');
    card.style.setProperty('--image-height', `${img.naturalHeight}px`);
    card.style.setProperty('--image-width', `${img.naturalWidth}px`);

    const titleOverlay = card.querySelector('.title-overlay');
    titleOverlay.setAttribute('data-title', name);
}