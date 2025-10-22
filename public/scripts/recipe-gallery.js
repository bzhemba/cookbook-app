let isEditMode = false;
let isMyRecipes = false;
let username;
let collectionId;
let token;
document
  .getElementById('editCollectionBtn')
  .addEventListener('click', toggleEditMode);

document.addEventListener('DOMContentLoaded', async () => {
  const preloader = document.querySelector('.preloader');

  contentBlocker.style.display = 'block';
  preloader.style.display = 'flex';
  preloader.classList.remove('hidden');

  const params = new URLSearchParams(window.location.search);
  const collectionIdentifier = params.get('id');

  isMyRecipes = collectionIdentifier === 'my-recipes';

  token = localStorage.getItem('auth_token');
  username = localStorage.getItem('username');

  if (!token) {
    console.error('No token found, please log in');
    window.location.href = '/login';
    return;
  }
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const modalHTML = `
            <div id="deleteCollectionModal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Delete Recipe</h3>
                    <p>Are you sure you want to delete this recipe? This action cannot be undone.</p>
                    <div class="modal-actions">
                        <button id="cancelDeleteBtn">Cancel</button>
                        <button id="confirmDeleteBtn">Delete</button>
                    </div>
                </div>
            </div>
`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  try {
    let recipes = [];
    let collectionName = 'My Recipes';

    if (isMyRecipes) {
      const response = await fetch(`/users/username/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return new Error('Failed to fetch profile data');
      }

      const userData = await response.json();
      recipes = userData.recipes;
      await renderGallery(recipes);
    } else {
      collectionId = parseInt(collectionIdentifier);
      if (collectionId == null) {
        return new Error('Invalid collection ID');
      }

      const response = await fetch(`/collections/id/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const collection = await response.json();
      recipes = collection.recipesConnection.map((r) => r.recipe);
      collectionName = collection.name;

      await renderGallery(recipes);
    }

    document.getElementById('collectionTitle').textContent = collectionName;
    document.getElementById('headingText').style.opacity = 1;
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('imageGallery').innerHTML = `
            <div class="error-message">
                Failed to load recipes. Please try again later.
            </div>
        `;
  } finally {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
      contentBlocker.style.display = 'none';
    }, 300);
  }
});

function showDeleteModal(recipeId, recipeElement) {
  const deleteModal = document.getElementById('deleteCollectionModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  deleteModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  deleteModal.querySelector('p').textContent = isMyRecipes
    ? `Are you sure you want to delete this recipe from the cookbook? This action cannot be undone.`
    : `Are you sure you want to delete this recipe from collection? This action cannot be undone.`;

  cancelDeleteBtn.onclick = function () {
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  confirmDeleteBtn.onclick = async function () {
    if (isMyRecipes) {
      await deleteRecipe(recipeId);
    } else {
      await removeRecipeFromCollection(recipeId);
    }
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    recipeElement.remove();
  };

  deleteModal.onclick = function (e) {
    if (e.target === deleteModal) {
      deleteModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };

  const closeSpan = document.querySelector('.close-modal');
  closeSpan.onclick = function () {
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

async function deleteRecipe(recipeId) {
  console.log('DELETING');
  try {
    const response = await fetch(`recipes/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: recipeId, username: username }),
    });
    if (!response.ok) return new Error('Failed to delete recipe');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    alert('Failed to delete recipe');
  }
}

async function renderGallery(recipes) {
  const gallery = document.getElementById('imageGallery');
  gallery.innerHTML = '';
  gallery.classList.toggle('edit-mode', isEditMode);

  gallery.style.display = 'grid';
  gallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
  gallery.style.gap = '20px';

  for (const recipe of recipes) {
    const recipeCard = await createRecipeCard(recipe, isEditMode);
    gallery.appendChild(recipeCard);
  }
}

async function createRecipeCard(recipe, showDeleteBtn = false) {
  const item = document.createElement('div');
  item.className = 'image-item';

  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';

  const placeholder = document.createElement('div');
  placeholder.className = 'image-loading';
  placeholder.innerHTML = '<img src="/public/images/placeholder.png" alt="Загрузка..." style="width:100%;height:100%;object-fit:cover; background: white; z-index: 11">';

  imageContainer.appendChild(placeholder);

  const img = document.createElement('img');
  const imageKey = recipe.imageData?.imageData;

  img.classList.add('recipe-image');
  img.alt = recipe.title || recipe.name;

  img.onload = function() {
    item.style.pointerEvents = 'none';
    img.style.pointerEvents = 'none';

    if (img.complete && img.naturalHeight !== 0) {
      showImage();
    } else {
      setTimeout(showImage, 150);
    }
  };

  function showImage() {
    placeholder.style.display = 'none';
    img.style.display = 'block';

    img.style.opacity = '0';
    item.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
      img.style.transition = 'opacity 0.3s ease';
      img.style.opacity = '1';
    });
  }

  img.onerror = function() {
    // В случае ошибки также скрываем placeholder
    placeholder.style.display = 'block';
    img.src = '/public/images/placeholder.png';
    img.style.display = 'block';
    img.alt = 'Изображение не загружено';
  };

  imageContainer.appendChild(img);

  try {
    const imageUrl = await fetchImageUrl(imageKey);
    if (imageUrl) {
      // Создаем временное изображение для предзагрузки
      const tempImg = new Image();
      tempImg.src = imageUrl;

      await new Promise((resolve) => {
        tempImg.onload = resolve;
        tempImg.onerror = resolve;
        setTimeout(resolve, 10); // Таймаут на случай проблем
      });

      // Только после предзагрузки устанавливаем src
      img.src = imageUrl;
    } else {
      placeholder.style.display = 'block';
      img.style.display = 'block';
    }

    img.alt = recipe.title || recipe.name;

    imageContainer.appendChild(img);
    item.appendChild(imageContainer);

    const overlay = document.createElement('div');
    overlay.className = 'recipe-overlay';

    const overlayBg = document.createElement('div');
    overlayBg.className = 'overlay-bg';
    overlay.appendChild(overlayBg);

    const title = document.createElement('h3');
    title.className = 'recipe-title';
    title.textContent = recipe.title || recipe.name;
    overlay.appendChild(title);

    item.appendChild(overlay);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.display = showDeleteBtn ? 'flex' : 'none';

    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      showDeleteModal(recipe.id, item);
    };

    item.appendChild(deleteBtn);
  } catch (error) {
    console.error('Error loading image:', error);
    img.src = '/public/images/placeholder.png';
    img.style.display = 'block';
    img.alt = 'Изображение не загружено';
    imageContainer.appendChild(img);
    item.appendChild(imageContainer);
  }

  item.addEventListener('click', () => {
    if (isEditMode) return;
    const recipeId = encodeURIComponent(btoa(recipe.id));
    window.location.href = `/recipe-details?recipe=${recipeId}`;
  });

  return item;
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  const btn = document.getElementById('editCollectionBtn');
  isEditMode
    ? btn.classList.add('edit-mode')
    : btn.classList.remove('edit-mode');
  const gallery = document.getElementById('imageGallery');
  gallery.classList.toggle('edit-mode', isEditMode);
  updateDeleteButtonsVisibility();
}

function updateDeleteButtonsVisibility() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach((btn) => {
    btn.style.display = isEditMode ? 'flex' : 'none';
  });
}

async function removeRecipeFromCollection(recipeId) {
  const url = `/collections/${encodeURIComponent(collectionId)}/recipes/${encodeURIComponent(recipeId)}`;
  await fetch(url, {
    method: 'DELETE',
  });
}

async function fetchImageUrl(key) {
  const url = `/images/${encodeURIComponent(key)}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  return response.text();
}
