import {SSENotifier} from "./SseNotifier.js";
document.addEventListener("DOMContentLoaded", async function () {

const createIngredientButton = document.getElementById("createIngredient");
const ingredientModal = document.getElementById("ingredientModal");
const createButton = document.getElementById('createRecipeButton');
const closeModal = document.querySelector(".close-button");
const imageInput = document.getElementById("image");
const ingredientForm = document.getElementById("ingredientForm");
const ingredientImageInput = document.getElementById("ingredientImage");

let imageId = null;
let ingredientSelect;
let tagsSelect;
let categorySelect;

createIngredientButton.addEventListener("click", () => {
    ingredientModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    ingredientModal.style.display = "none";
});

createButton.addEventListener('click', async function() {
    const ingredientName = document.getElementById("ingredientName").value;
    const ingredientImageFile = ingredientImageInput.files[0];
    const token = localStorage.getItem('auth_token');
    let imageId = null;

    if (!ingredientName) {
        alert("Please fill in ingredient name");
        return;
    }

    try {
        if (ingredientImageFile) {
            imageId = await uploadImage(ingredientImageFile, token);
        }

        const newIngredient = await createIngredient(ingredientName, imageId, token);
        ingredientSelect.addOption(newIngredient.id, newIngredient.name);
        ingredientForm.reset()

    } catch (error) {
        console.error("Error creating ingredient:", error);
        alert("Failed to create ingredient");
    }
});

    document.getElementById('ingredientsBtn').onclick = function() {
        document.getElementById('ingredientsModal').style.display = 'block';
    }

    document.getElementById('imageBtn').onclick = function() {
        document.getElementById('imageModal').style.display = 'block';
    }
    document.getElementById('detailsBtn').onclick = function() {
        document.getElementById('combinedModal').style.display = 'block';
    }

// Обработчики для закрытия модальных окон
    document.querySelectorAll('.close').forEach(function(closeBtn) {
        closeBtn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        }
    });

// Обработчики для закрытия модальных окон
    document.querySelectorAll('.close-button').forEach(function(closeBtn) {
        closeBtn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        }
    });

// Закрытие при клике вне модального окна
    window.onclick = function(event) {
        if (event.target.className === 'modal') {
            event.target.style.display = 'none';
        }
    }

    document.getElementById('modalImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                let previewImg = document.getElementById('previewImage');
                if (!previewImg) {
                    previewImg = document.createElement('img');
                    previewImg.id = 'previewImage';
                    previewImg.className = 'preview-image';
                    document.querySelector('.image-frame-container').appendChild(previewImg);
                }

                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                document.getElementById('defaultImage').style.display = 'none';
            }

            reader.readAsDataURL(file);
        }
    });

    document.querySelector('.close-button').addEventListener('click', function() {
        const previewImg = document.getElementById('previewImage');
        if (previewImg) {
            previewImg.style.display = 'none';
            previewImg.src = '';
        }
        document.getElementById('defaultImage').style.display = 'block';
        document.getElementById('modalImage').value = '';
    });

    document.getElementById('createIngredient').onclick = function() {
        document.getElementById('ingredientModal').style.display = 'block';
    }

async function uploadImage(file, token) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/images/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    const imageData = await response.json();
    return imageData.id;
}

async function createIngredient(name, imageId, token) {
    const ingredientDto = {
        name: name,
        imageId: imageId,
    };

    console.log(ingredientDto);

    const response = await fetch("/ingredients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(ingredientDto),
    });

    if (!response.ok) {
        throw new Error("Failed to create ingredient");
    }

    return await response.json();
}


imageInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem('auth_token');
    imageId = await uploadImage(file, token);
});

window.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    await createRecipe(token);
});

async function createRecipe(token) {
    const formData = new FormData(recipeForm);
    const user = localStorage.getItem('username');
    const recipe = {
        createdByUser: user,
        name: formData.get("name"),
        description: formData.get("description"),
        ingredientIds: ingredientSelect.selectedIds,
        instructions: formData.get("instructions"),
        prepTime: parseInt(formData.get("prepTime")),
        cookTime: parseInt(formData.get("cookTime")),
        servings: parseInt(formData.get("servings")),
        recipeTagIds: tagsSelect.selectedIds,
        categoryId: categorySelect.selectedIds[0],
        createdAt: Date.now(),
        imageId: imageId,
    };
    const response = await fetch("/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
    });

    if (!response.ok) throw new Error("Failed to create recipe");
    ingredientSelect.reset()
    categorySelect.reset()
    tagsSelect.reset()
}

function showToast(eventData) {
    console.log(eventData)
    const toast = document.createElement('div');
    toast.className = `toast ${eventData.type.toLowerCase()}`;

    let message = '';
    switch(eventData.type) {
        case 'RECIPE_CREATED':
            message = `Recipe successfully created`;
            break;
        case 'INGREDIENT_CREATED':
            message = `Ingredient successfully created`;
            break;
        default:
            message = `Event: ${eventData.type}`;
    }

    toast.innerHTML = `
      <div class="toast-content">${message}</div>
      <button class="toast-close">&times;</button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);

    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

    new SSENotifier({
        eventSourceUrl: '/sse',
        channel: 'ingredients',
        onMessage: (data) => {
            showToast(data);
        },
    });

    new SSENotifier({
        eventSourceUrl: '/sse',
        channel: 'recipes',
        onMessage: (data) => {
            showToast(data);
        },
    });

    async function loadIngredients() {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error('No token found, please log in');
            return;
        }

        try {
            const response = await fetch("/ingredients", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) return new Error("Failed to load ingredients");
            const data = await response.json();
            populateIngredients(data.data);
        } catch (error) {
            console.error("Error loading ingredients:", error);
        }
    }

    async function loadTags() {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error('No token found, please log in');
            return;
        }

        try {
            const response = await fetch("/recipe-tags", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) return new Error("Failed to load tags");
            const data = await response.json();
            populateTags(data);
        } catch (error) {
            console.error("Error loading tags:", error);
        }
    }

    async function loadCategories() {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error('No token found, please log in');
            return;
        }

        try {
            const response = await fetch("/categories", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
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
        window.ingredientSelect = new MultiSelect('#dynamic', {
            data: options,
            placeholder: 'Select ingredients',
            search: true,
            selectAll: true,
            listAll: false,
            onChange: function(id, name, element) {
                console.log('Change:', id, name, element);
            },
            onSelect: function(id, name, element) {
                console.log('Selected:', id, name, element);
            },
            onUnselect: function(id, name, element) {
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
        tagsSelect = new MultiSelect('#modalDynamicTags',
            {
                data: options,
                placeholder: 'Select an option',
                search: true,
                selectAll: false,
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

        categorySelect = new MultiSelect('#modalDynamicCategories',
            {
                data: options,
                placeholder: 'Select an option',
                max: 1,
                search: true,
                onChange: function (id, name, element) {
                    console.log('Change:', id, name, element);
                },
                onSelect: function (id, name, element) {
                    console.log('Selected:', id, name, element);
                },
                onUnselect: function (id, name, element) {
                    console.log('Unselected:', id, name, element);
                }
            })
    }

    await loadIngredients();
    await loadTags();
    await loadCategories();
});