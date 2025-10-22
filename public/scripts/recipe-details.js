import { SSENotifier } from './SseNotifier.js';

const preloader = document.querySelector('.preloader');
const recipes_container = document.querySelector('.recipes_container');
const contentBlocker = document.getElementById('contentBlocker');
let collectionsList = document.getElementById('collectionsList');
let recipeId;
let ingredientsList = {};
let originalIngredients = {};

async function fetchDetails(query) {
  contentBlocker.style.display = 'block';
  preloader.style.display = 'flex';
  preloader.classList.remove('hidden');
  try {
    const url = `/recipes/${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();
    await showData(data, query);
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

const showData = async (resp, id) => {
  recipeId = id;
  try {
    recipes_container.innerHTML = '';
    const {
      name,
      description,
      category,
      imageData,
      ingredients,
      instructions,
      servings,
      recipeTags,
      createdByUser,
    } = resp;

    const currentUser = localStorage.getItem('username');
    const isAuthor = currentUser === createdByUser;
    const isAuthenticatedUser = await isAuthenticated();
    const isAuthenticatedAuthor = !!isAuthenticatedUser && isAuthor;
    const recipeCard = document.createElement('div');
    recipeCard.setAttribute('class', 'recipe_card');

    const imageUrl = imageData
      ? await fetchImageUrl(imageData)
      : '/public/images/plate1.png';
    let nutrition = calculateNutrition(ingredients, servings);

    ingredientsList = ingredients
      .map(
        (ingredient) =>
          `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.ingredient}</li>`,
      )
      .join('');

    initRecipe(id, ingredients);

    const collectionsModalHTML = `
<div id="collectionsModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>Save to Collection</h2>
    <div id="collectionsList"></div>
    <button id="createNewCollectionBtn">Create New Collection</button>
  </div>
</div>
`;
    const createCollectionsModalHTML = `
            <div id="createCollectionModal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Create New Collection</h3>
                    <input type="text" id="collectionNameInput" placeholder="Enter collection name">
                        <div class="modal-actions">
                            <button id="cancelCollectionBtn">Cancel</button>
                            <button id="confirmCollectionBtn">Create</button>
                        </div>
                </div>
            </div>`;
    document.body.insertAdjacentHTML('beforeend', collectionsModalHTML);
    document.body.insertAdjacentHTML('beforeend', createCollectionsModalHTML);

    const saveToCollectionBtn = isAuthenticatedAuthor
      ? `
    <button class="save-to-collection-btn" onclick="showCollectionsModal('${id}')">
      <img src="public/images/collection.png" alt="Save Recipe">
    </button>
    `
      : '';
    const modalHTML = `
      <div id="imageModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImage">
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const instructionsContent = `
    <div class="recipe-section" id="recipe-instructions-${id}">
        <h2>Instructions:</h2>
        <p>${instructions}</p>
    </div>
`;

    const tagsContent =
      recipeTags && recipeTags.length > 0
        ? `
    <div class="recipe-tags">
        <h2>Tags:</h2>
        <ul>
            ${recipeTags.map((tag) => `<li>${tag}</li>`).join('')}
        </ul>
    </div>
`
        : '';

    const createdByContent = `
    <div class="recipe-author">
        <p>Created by: ${createdByUser}</p>
    </div>
`;

    const nutritionContent = `
    <div class="recipe-section nutrition-facts">
        <h2>Nutrition Facts (per serving):</h2>
        <div class="nutrition-grid">
            <div class="nutrition-item">
                <span class="nutrition-label">Calories:</span>
                <span class="nutrition-value">${nutrition.calories || 'N/A'}</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Protein:</span>
                <span class="nutrition-value">${nutrition.protein || 'N/A'}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Fat:</span>
                <span class="nutrition-value">${nutrition.fat || 'N/A'}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Carbs:</span>
                <span class="nutrition-value">${nutrition.carbs || 'N/A'}g</span>
            </div>
        </div>
    </div>
`;

    const editControls = isAuthenticatedAuthor
      ? `
<div class="edit-controls">
    <button class="edit-btn" data-recipe-id="${id}"></button>
    <button class="save-btn hidden" data-recipe-id="${id}"></button>
    <button class="cancel-btn hidden" data-recipe-id="${id}"></button>
</div>
`
      : '';

    recipeCard.innerHTML = `
<div class="recipe-container">
    ${editControls}
    ${saveToCollectionBtn}
    <div class="recipe-card" id="recipe-card-${id}">
   <div class="image-container">
            <div class="recipe-image-wrapper" id="image-wrapper-${id}">
                ${imageUrl ? `
                    <div class="image-placeholder" id="placeholder-${id}">
                        <img src="/public/images/placeholder.png" alt="Загрузка..." class="placeholder-img">
                    </div>
                    <img src="${imageUrl}" alt="${name}" class="recipe-image" id="recipe-img-${id}" style="display: none;">
                ` : '<div class="no-image">No Image</div>'}
            </div>
        </div>
        <div class="text-overlay">
            <h1 class="recipe-name" id="recipe-name-${id}">${name}</h1>
            <div class="text-boundary name-boundary"></div>
            ${description ? `<p class="recipe-description" id="recipe-description-${id}">${description}</p>` : ''}
            <div class="text-boundary description-boundary"></div>

            <div class="servings-control">
                <h3>Servings:</h3>
                <div class="servings-selector">
                    <button class="servings-btn minus-btn" onclick="adjustServings(${id}, -1)">
                    </button>
                    <span class="servings-count" id="servings-${id}">${servings || 1}</span>
                    <button class="servings-btn plus-btn" onclick="adjustServings(${id}, 1)">
                    </button>
                </div>
            </div>

            <div class="recipe-details">
                ${category ? `<p class="recipe-category"><strong>Category:</strong> ${category}</p>` : ''}

                <div class="recipe-section">
                    <h2>Ingredients:</h2>
                    <ul class="ingredients-list" id="ingredients-${id}">
                        ${ingredientsList}
                    </ul>
                </div>

                ${nutritionContent}
                ${instructionsContent}
                ${tagsContent}
                ${createdByContent}
            </div>
        </div>
    </div>
</div>
    `;

    setTimeout(() => {
      if (imageUrl) {
        const img = document.getElementById(`recipe-img-${id}`);
        const placeholder = document.getElementById(`placeholder-${id}`);
        const imageWrapper = document.getElementById(`image-wrapper-${id}`);

        if (img && placeholder) {
          if (img.complete && img.naturalHeight !== 0) {
            img.style.display = 'block';
            placeholder.style.display = 'none';
          } else {
            img.onload = function() {
              img.style.display = 'block';
              img.style.opacity = '0';

              requestAnimationFrame(() => {
                img.style.transition = 'opacity 0.6s ease';
                img.style.opacity = '1';

                setTimeout(() => {
                  placeholder.style.display = 'none';
                }, 10);
              });
            };

            img.onerror = function() {
              console.error('Ошибка загрузки изображения:', imageUrl);
              placeholder.innerHTML = '<div class="image-error">Ошибка загрузки изображения</div>';
            };
          }
        }
      }
    }, 0);

    initCollectionsModal();

    async function isAuthenticated() {
      const response = await fetch('/auth/check-auth', {
        credentials: 'include',
      });
      const data = await response.json();

      const authState = data.isAuthenticated;
      sessionStorage.setItem('sessionActive', authState);

      return authState;
    }

    recipes_container.appendChild(recipeCard);

    const imageModal = document.getElementById('imageModal');
    const collectionsModal = document.getElementById('collectionsModal');
    const modalImg = document.getElementById('modalImage');

    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const recipeId = btn.dataset.recipeId;
        enableEditMode(recipeId);
      });
    });

    document.querySelectorAll('.save-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const recipeId = btn.dataset.recipeId;
        saveRecipe(recipeId);
      });
    });

    document.querySelectorAll('.cancel-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const recipeId = btn.dataset.recipeId;
        cancelEdit(recipeId);
      });
    });

    recipeCard.querySelector('.recipe-image').onclick = function () {
      imageModal.style.display = 'block';
      modalImg.src = this.src;
      document.body.style.overflow = 'hidden';
    };

    collectionsModal.querySelector('.close').addEventListener('click', (e) => {
      collectionsModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    imageModal.querySelector('.close').addEventListener('click', (e) => {
      imageModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    imageModal.onclick = function (e) {
      if (e.target === imageModal) {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    };
  } catch (err) {
    console.error('Error fetching recipes:', err);
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

window.showCollectionsModal = function () {
  const modal = document.getElementById('collectionsModal');
  modal.style.display = 'block';
};

window.saveRecipeToCollection = function (recipeId, collectionId) {
  fetch(`/collections/save/${collectionId}/${recipeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        console.error('Error saving recipe:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Error saving recipe:', error);
    });
};

function initCollectionsModal() {
  const modal = document.getElementById('collectionsModal');
  const span = modal.querySelector('.close');

  span.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  document.getElementById('createNewCollectionBtn').onclick =
    async function () {
      openCollectionModal();
    };

  function openCollectionModal() {
    const modal = document.getElementById('createCollectionModal');
    const input = document.getElementById('collectionNameInput');

    input.value = '';

    modal.style.display = 'flex';
    input.focus();

    modal.onclick = function (e) {
      if (e.target === modal) {
        closeCollectionModal();
      }
    };

    document.getElementById('cancelCollectionBtn').onclick =
      closeCollectionModal;
    document.getElementById('confirmCollectionBtn').onclick =
      async function () {
        const collectionName = input.value.trim();
        if (collectionName) {
          await createNewCollection(collectionName);
          closeCollectionModal();
        }
      };

    document.addEventListener('keydown', function onKeyDown(e) {
      if (e.key === 'Escape') {
        closeCollectionModal();
        document.removeEventListener('keydown', onKeyDown);
      }
    });
  }

  function closeCollectionModal() {
    document.getElementById('createCollectionModal').style.display = 'none';
  }

  collectionsList = document.getElementById('collectionsList');

  fetchUserCollections().then((collections) => {
    collectionsList.innerHTML = collections
      .map(
        (collection) => `
                <div class="collection-item" onclick="saveRecipeToCollection('${recipeId}', '${collection.id}')">
                    <h3>${collection.name}</h3>
                    <p>${collection.recipesConnection.length} recipes</p>
                </div>
            `,
      )
      .join('');
  });
}

async function fetchUserCollections() {
  const token = localStorage.getItem('auth_token');
  const username = localStorage.getItem('username');

  if (!token) {
    console.error('No token found, please log in');
    return;
  }

  try {
    const url = `/collections/${encodeURIComponent(username)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return new Error('Failed to fetch collections');

    const data = await response.json();
    console.log(`collections ${data}`);
    return data;
  } catch (error) {
    console.error('Error loading collections:', error);
  }
}

async function createNewCollection(name) {
  const token = localStorage.getItem('auth_token');
  const username = localStorage.getItem('username');

  if (!token) {
    console.error('No token found, please log in');
    return;
  }

  try {
    const response = await fetch(`/collections`, {
      method: 'POST',
      body: JSON.stringify({ name: name, createdByUser: username }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return new Error('Failed to create collection');

    const newCollection = await response.json();

    const collectionsList = document.getElementById('collectionsList');
    collectionsList.innerHTML += `
            <div class="collection-item" onclick="saveRecipeToCollection('${recipeId}', '${newCollection.id}')">
                <h3>${newCollection.name}</h3>
                <p>0 recipes</p>
            </div>
            `;
  } catch (error) {
    console.error('Error loading notes:', error);
  }
}

async function fetchImageUrl(key) {
  const url = `/images/${encodeURIComponent(key)}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  return response.text();
}

function calculateNutrition(ingredients, servings) {
  let total = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };

  ingredients.forEach((ing) => {
    const factor = ing.amount / 100 / servings;

    total.calories += (ing.calories || 0) * factor;
    total.protein += (ing.protein || 0) * factor;
    total.fat += (ing.fat || 0) * factor;
    total.carbs += (ing.carbohydrates || 0) * factor;
  });

  return {
    calories: Math.round(total.calories),
    protein: Math.round(total.protein * 10) / 10,
    fat: Math.round(total.fat * 10) / 10,
    carbs: Math.round(total.carbs * 10) / 10,
  };
}

function storeOriginalIngredients(recipeId, ingredients) {
  originalIngredients[recipeId] = ingredients.map((ing) => ({
    ...ing,
    originalAmount: ing.amount,
  }));
}

window.adjustServings = function (recipeId, change) {
  console.log(recipeId);
  const servingsElement = document.getElementById(`servings-${recipeId}`);
  let servings = parseInt(servingsElement.textContent);
  servings += change;

  if (servings < 1) servings = 1;

  servingsElement.textContent = servings;
  updateIngredients(recipeId, servings);
};

function updateIngredients(recipeId, newServings) {
  const ingredientsList = document.getElementById(`ingredients-${recipeId}`);
  const originalServings = 1;
  const ratio = newServings / originalServings;

  if (!originalIngredients[recipeId]) return;

  ingredientsList.innerHTML = originalIngredients[recipeId]
    .map((ingredient) => {
      const newAmount =
        Math.round(ingredient.originalAmount * ratio * 100) / 100;
      return `
            <li>
                ${newAmount} ${ingredient.unit} ${ingredient.ingredient}
            </li>
        `;
    })
    .join('');
}

function initRecipe(recipeId, ingredients) {
  storeOriginalIngredients(recipeId, ingredients);
}

function enableEditMode(recipeId) {
  document.getElementById(`recipe-name-${recipeId}`).contentEditable = true;
  document.getElementById(`recipe-description-${recipeId}`).contentEditable =
    true;
  document.querySelector(`#recipe-instructions-${recipeId} p`).contentEditable =
    true;

  document
    .querySelectorAll(`#recipe-card-${recipeId} [contenteditable="true"]`)
    .forEach((el) => {
      el.classList.add('editable');
    });

  document.querySelector(`.edit-controls .edit-btn`).classList.add('hidden');
  document.querySelector(`.edit-controls .save-btn`).classList.remove('hidden');
  document
    .querySelector(`.edit-controls .cancel-btn`)
    .classList.remove('hidden');
}

function cancelEdit(recipeId) {
  document.getElementById(`recipe-name-${recipeId}`).contentEditable = false;
  document.getElementById(`recipe-description-${recipeId}`).contentEditable =
    false;
  document.querySelector(`#recipe-instructions-${recipeId} p`).contentEditable =
    false;

  document
    .querySelectorAll(`#recipe-card-${recipeId} .editable`)
    .forEach((el) => {
      el.classList.remove('editable');
    });

  document.querySelector(`.edit-controls .edit-btn`).classList.remove('hidden');
  document.querySelector(`.edit-controls .save-btn`).classList.add('hidden');
  document.querySelector(`.edit-controls .cancel-btn`).classList.add('hidden');

  location.reload();
}

async function saveRecipe(recipeId) {
  try {
    const recipeData = {
      id: recipeId,
      name: document.getElementById(`recipe-name-${recipeId}`).textContent,
      description: document.getElementById(`recipe-description-${recipeId}`)
        .textContent,
      instructions: document.getElementById(`recipe-instructions-${recipeId}`)
        .textContent,
    };

    const response = await fetch(`/recipes/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(recipeData),
    });

    if (response.ok) {
      cancelEdit(recipeId);
    } else {
      throw new Error('Failed to update recipe');
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
    alert('Error saving recipe. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SSENotifier({
    eventSourceUrl: '/sse',
    channel: 'recipes',
    onMessage: (data) => {
      showToast(data);
    },
  });

  new SSENotifier({
    eventSourceUrl: '/sse',
    channel: 'collections',
    onMessage: (data) => {
      showToast(data);
    },
  });
});

function showToast(eventData) {
  console.log(eventData);
  const toast = document.createElement('div');
  toast.className = `toast ${eventData.type.toLowerCase()}`;

  let message = '';
  switch (eventData.type) {
    case 'RECIPE_UPDATED':
      message = `Recipe successfully updated`;
      break;
    case 'RECIPE_DELETED':
      message = `Recipe successfully deleted`;
      break;
    case 'COLLECTION_UPDATED':
      message = `Recipe added to collection`;
      break;
    case 'COLLECTION_CREATED':
      message = `Collection successfully created`;
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
