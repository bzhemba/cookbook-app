import {SSENotifier} from "./SseNotifier.js";

document.addEventListener("DOMContentLoaded", async function () {

    const createIngredientButton = document.getElementById("createIngredient");
    const addIngredientButton = document.getElementById("addIngredient");
    const ingredientModal = document.getElementById("ingredientModal");
    const closeModal = document.querySelector(".close-button");
    const imageInput = document.getElementById('modalImage');
    const preloader = document.querySelector('.preloader');
    const ingredientForm = document.getElementById("ingredientForm");
    const ingredientImageInput = document.getElementById("ingredientImage");
    const combinedForm = document.getElementById('combinedForm');

    let ingredients = [];
    let cachedMeasurements = [];
    const selectedIngredients = {};
    let imageId = null;
    let selectedRecipeImage = null;
    let ingredientSelect;
    let tagsSelect;
    let categorySelect;
    let ingredientsFilled = false;
    let descriptionFilled = false;
    let imageUploaded = false;

    addIngredientButton.addEventListener("click", () => {
        ingredientModal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        ingredientModal.style.display = "none";
    });

    createIngredientButton.addEventListener('click', async function () {
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

    document.getElementById('ingredientsBtn').onclick = function () {
        document.getElementById('ingredientsModal').style.display = 'block';
    }

    document.getElementById('imageBtn').onclick = function () {
        document.getElementById('imageModal').style.display = 'block';
    }
    document.getElementById('detailsBtn').onclick = function () {
        document.getElementById('combinedModal').style.display = 'block';
    }

    document.querySelectorAll('.close-button').forEach(function (closeBtn) {
        closeBtn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            const form = modal.querySelector('form');
            closeModalAndReset(modal.id, form ? form.id : null);
        });
    });

    document.querySelectorAll('#pre-save').forEach(function (closeBtn) {
        closeBtn.onclick = function () {
            if (this.closest('#ingredientsModal')) {
                ingredientsFilled = true;
                document.getElementById('ingredientsBtn').closest('.icon-wrapper').classList.add('completed');
            }
            if (this.closest('#combinedModal')) {
                descriptionFilled = true;
                document.getElementById('detailsBtn').closest('.icon-wrapper').classList.add('completed');
            }

            if (this.closest('#imageModal')) {
                imageUploaded = true;
                document.getElementById('imageBtn').closest('.icon-wrapper').classList.add('completed');
            }

            checkAllFlags();

            this.closest('.modal').style.display = 'none';
        }
    });

    window.onclick = function (event) {
        if (event.target.className === 'modal') {
            event.target.style.display = 'none';
        }
    }

    document.getElementById('modalImage').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const previewImg = document.getElementById('previewImage');
                const defaultImg = document.getElementById('defaultImage');

                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                defaultImg.style.display = 'none';
            }

            reader.readAsDataURL(file);
        }
    });

    document.querySelector('.close-button').addEventListener('click', function () {
        const previewImg = document.getElementById('previewImage');
        if (previewImg) {
            previewImg.style.display = 'none';
            previewImg.src = '';
        }
        document.getElementById('defaultImage').style.display = 'block';
        document.getElementById('modalImage').value = '';
    });

    document.getElementById('createIngredient').onclick = function () {
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

    document.getElementById('createRecipeButton').addEventListener('click', async function (e) {
        e.preventDefault();

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                return new Error('No authentication token found');
            }

            await createRecipe(token);
            window.location.reload();

        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    });

    async function createRecipe(token) {
        contentBlocker.style.display = 'block';
        preloader.style.display = 'flex';
        preloader.classList.remove('hidden');

        try {
            selectedRecipeImage = imageInput.files[0];
            imageId = await uploadImage(selectedRecipeImage, token);

            const formData = new FormData(combinedForm);
            const user = localStorage.getItem('username');

            const recipe = {
                createdByUser: user,
                name: formData.get("modalName"),
                description: formData.get("modalDescription"),
                ingredients: ingredients,
                instructions: formData.get("modalInstructions"),
                prepTime: parseInt(formData.get("modalPrepTime")),
                cookingTime: parseInt(formData.get("modalCookTime")),
                servings: parseInt(formData.get("modalServings")),
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

            return await response.json();

        } catch (error) {
            console.error("Error creating recipe:", error);
            throw error;
        } finally {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
                contentBlocker.style.display = 'none';
            }, 300);
        }
    }

    function showToast(eventData) {
        const toast = document.createElement('div');
        toast.className = `toast ${eventData.type.toLowerCase()}`;

        let message = '';
        switch (eventData.type) {
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

        let allIngredients = [];
        let nextUrl = "/ingredients";
        let totalIngredients = 0;
        let loadedIngredients = 0;

        while (nextUrl) {
            const response = await fetch(nextUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
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
        let options = [];
        ingredients.forEach(ingredient => {
            const option = {
                id: ingredient.id,
                name: ingredient.name,
            }
            options.push(option);
        });

        ingredientSelect = new MultiSelect('#dynamic', {
            data: options,
            placeholder: 'Select ingredients',
            search: true,
            selectAll: false,
            listAll: false,
            onSelect: function(id, name, element) {
                addIngredientToSelectedList(id, name);
            },
            onUnselect: function(id, element) {
                removeIngredientFromSelectedList(id);
            }
        });
    }

    function populateTags(tags) {
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

    async function loadMeasurements() {
        const response = await fetch('/dictionary/measurements', {
            method: 'GET'
        });

        const result = await response.json();

        await Promise.all(result.map(async (value) => {
            const { id, name, symbol } = value;

            cachedMeasurements.push(value);
        }));
    }

    await loadIngredients();
    await loadTags();
    await loadCategories();
    await loadMeasurements();

    function checkAllFlags() {
        const createButton = document.getElementById('createRecipeButton');
        if (ingredientsFilled && descriptionFilled && imageUploaded) {
            createButton.style.display = 'block';
        } else {
            createButton.style.display = 'none';
        }
    }


    function addIngredientToSelectedList(id, name) {
        if (selectedIngredients[id]) return;

        const container = document.getElementById('selectedIngredientsList');

        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'selected-ingredient';
        ingredientDiv.dataset.id = id;

        ingredientDiv.innerHTML = `
        <span class="ingredient-name">${name}</span>
        <input type="number"
               class="ingredient-amount"
               placeholder="Amount"
               min="0"
               step="0.01"
               required>
        <select class="ingredient-unit">
            ${Array.from(cachedMeasurements).map(unit =>
            `<option value="${unit.symbol}">${unit.symbol} (${unit.name})</option>`
        ).join('')}
        </select>
        <button class="remove-ingredient">×</button>
    `;

        ingredientDiv.querySelector('.remove-ingredient').addEventListener('click', () => {
            ingredientSelect.deselect(id);
        });

        container.appendChild(ingredientDiv);
        selectedIngredients[id] = { id, name, element: ingredientDiv };
    }


    function removeIngredientFromSelectedList(id) {
        if (!selectedIngredients[id]) return;

        selectedIngredients[id].element.remove();
        delete selectedIngredients[id];
    }

    document.getElementById('pre-save').addEventListener('click', function() {

        document.querySelectorAll('.selected-ingredient').forEach(item => {
            ingredients.push({
                id: item.dataset.id,
                name: item.querySelector('.ingredient-name').textContent,
                amount: parseFloat(item.querySelector('.ingredient-amount').value),
                unit: item.querySelector('.ingredient-unit').value
            });
        });

        console.log('Ingredients to save:', ingredients);
    });
});

function closeModalAndReset(modalId, formId = null) {
    const modal = document.getElementById(modalId);
    if (formId) {
        const form = document.getElementById(formId);
        if (form) form.reset();
    }
    modal.style.display = 'none';
}