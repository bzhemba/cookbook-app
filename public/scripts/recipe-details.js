const preloader = document.querySelector('.preloader');
const recipes_container = document.querySelector(".recipes_container");
const contentBlocker = document.getElementById('contentBlocker');

async function fetchDetails(query) {
    contentBlocker.style.display = 'block';
    preloader.style.display = 'flex';
    preloader.classList.remove('hidden');
    try {
        const url = `/recipes/${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            method: "GET"
        });

        const data = await response.json();
        await showData(data);

    } catch (er) {
        recipes_container.innerHTML =
            "<h1 class='errormsg'>Something went wrong. Please try again.</h1>";
        console.error(er);
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
        const {
            id,
            name,
            description,
            category,
            imageData,
            ingredients,
            instructions,
            recipeTags,
            createdByUser
        } = resp

        const recipe_card = document.createElement("div");
        recipe_card.setAttribute("class", "recipe_card");

        const imageUrl = await fetchImageUrl(imageData);

        const ingredientsList = ingredients.map(ingredient =>
            `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.ingredient}</li>`
        ).join('');

        const modalHTML = `
<div id="imageModal" class="modal">
  <span class="close">&times;</span>
  <img class="modal-content" id="modalImage">
</div>
`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const instructionsContent = `
            <div class="recipe-section">
                <h2>Instructions:</h2>
                <p>${instructions}</p>
            </div>
        ` ;

        const tagsContent = recipeTags && recipeTags.length > 0 ? `
            <div class="recipe-tags">
                <h2>Tags:</h2>
                <ul>
                    ${recipeTags.map(tag => `<li>${tag}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        const createdByContent =
            `
            <div class="recipe-author">
                <p>Created by: ${createdByUser}</p>
            </div>
        `;

        recipe_card.innerHTML = `
<div class="recipe-container">
    <div class="recipe-card" id="recipe-card-${id}">
    <div class="image-container"
        <div class="recipe-image-wrapper">
            <img src="${imageUrl}" alt="${name}" class="recipe-image" onload="setPaperOrientation(this, '${description}')"/>
        </div>
        </div>
        <div class="text-overlay">
            <h1 class="recipe-name">${name}</h1>
            <div class="text-boundary name-boundary"></div>
            ${description ? `<p class="recipe-description">${description}</p>` : ''}
            <div class="text-boundary description-boundary"></div>
            
            <div class="recipe-details">
                ${category ? `<p class="recipe-category"><strong>Category:</strong> ${category}</p>` : ''}
                
                <div class="recipe-section">
                    <h2>Ingredients:</h2>
                    <ul class="ingredients-list">
                        ${ingredientsList}
                    </ul>
                </div>
                
                ${instructionsContent}
                ${tagsContent}
                ${createdByContent}
            </div>
        </div>
    </div>
</div>
    `;

        recipes_container.appendChild(recipe_card);

        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImage");
        const closeBtn = document.querySelector(".close");

        recipe_card.querySelector('.recipe-image').onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            document.body.style.overflow = "hidden";
        }

        closeBtn.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }

        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        }

    } catch (err) {
        console.error("Error fetching recipes:", err);
        recipes_container.innerHTML = "<h1 class='errormsg'>Recipes not found</h1>";
    }
};

window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const encodedId = params.get('recipe');

    if (!encodedId) throw new Error('No ID in URL');
    const recipeId = atob(decodeURIComponent(encodedId));

    await fetchDetails(recipeId);
});

async function fetchImageUrl(key) {
    const url = `/images/${encodeURIComponent(key)}`;
    const response = await fetch(url, {
        method: "GET",
    });

    return response.text();
}