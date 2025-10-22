const preloader = document.querySelector('.preloader');

document.addEventListener('DOMContentLoaded', async () => {

  const token = localStorage.getItem('auth_token');
  const username = localStorage.getItem('username');

  if (!token) {
    console.error('No token found, please log in');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch(`/users/username/${username}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    if (response.status === 401) {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('returnUrl', currentPath);

      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userData = await response.json();
    await renderCollections(userData);


    const modalHTML = `
            <div id="deleteCollectionModal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Delete Collection</h3>
                    <p>Are you sure you want to delete this collection? This action cannot be undone.</p>
                    <div class="modal-actions">
                        <button id="cancelDeleteBtn">Cancel</button>
                        <button id="confirmDeleteBtn">Delete</button>
                    </div>
                </div>
            </div>
`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  catch (error) {
    console.error('Error loading profile data:', error);
    alert('Failed to load profile data');
  }
});

async function renderCollections(userData) {
  contentBlocker.style.display = 'block';
  preloader.style.display = 'flex';
  preloader.classList.remove('hidden');

  const collectionsContainer = document.getElementById('collectionsContainer');

  try {
    const mainCollection = await createCollectionCard({
      id: 'my-recipes',
      name: 'My Recipes',
      recipes: userData.recipes,
      isMain: true
    });
    collectionsContainer.appendChild(mainCollection);

    const userCollections = await fetchUserCollections();

    for (const collection of userCollections) {
      const collectionCard = await createCollectionCard({
        id: collection.id,
        name: collection.name,
        recipes: collection.recipesConnection.map(r => r.recipe),
        isMain: false
      });
      collectionsContainer.appendChild(collectionCard);
    }

    await new Promise(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    });
  }
  finally {
    contentBlocker.style.display = 'none';
    preloader.classList.add('hidden');
  }
}

async function createCollectionCard({id, name, recipes, isMain}) {
  const card = document.createElement('div');
  card.className = `collection-card ${isMain ? 'main-collection' : ''}`;

  const cover = document.createElement('div');
  cover.className = 'collection-cover';

  const coverRecipes = recipes.slice(0, 1);

  const recipe_card = document.createElement("div");
  recipe_card.setAttribute("class", "recipe_card");

  const fragment = document.createDocumentFragment();

  for (const recipe of coverRecipes) {
    const img = new Image();
    img.className = 'collection-cover-item';
    img.loading = "lazy";

    img.src = recipe.imageData?.imageData
      ? await fetchImageUrl(recipe.imageData.imageData)
      : '/public/images/placeholder.png';

    img.alt = recipe.title;
    fragment.appendChild(img);
  }
  cover.appendChild(fragment);

  const info = document.createElement('div');
  info.className = 'collection-info';

  const title = document.createElement('h3');
  title.className = 'collection-title';
  title.textContent = name;
  info.appendChild(title);

  const count = document.createElement('div');
  count.className = 'collection-count';
  count.textContent = `${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'}`;
  info.appendChild(count);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-collection-btn';
  deleteBtn.innerHTML = '×';
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    const collectionTitle = card.querySelector('.collection-title').textContent;
    showDeleteModal(id, card, collectionTitle);
  };

  info.appendChild(deleteBtn);
  card.appendChild(cover);
  card.appendChild(info);

  card.addEventListener('click', () => {
    window.location.href = `/recipe-gallery?id=${id}`;
  });

  return card;
}


function showDeleteModal(collectionId, card, title) {
  const deleteModal = document.getElementById('deleteCollectionModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  deleteModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  deleteModal.querySelector('p').innerHTML =
    `Are you sure you want to delete <em>${title}</em> collection? This action cannot be undone.`;

  cancelDeleteBtn.onclick = function () {
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  confirmDeleteBtn.onclick = async function () {
    await deleteCollection(collectionId);
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    card.remove();
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

async function deleteCollection(collectionId) {
  try {
    const response = await fetch(`collections/${collectionId}`, {method: 'DELETE'});
    if (!response.ok) throw new Error('Failed to delete collection');
  } catch (error) {
    console.error('Error deleting collection:', error);
    alert('Failed to delete collection');
  }
}

async function fetchImageUrl(key) {
  const url = `/images/${encodeURIComponent(key)}`;
  const response = await fetch(url, {
    method: "GET",
  });

  return response.text();
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
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) return new Error("Failed to update note");

    const data = await response.json();
    console.log(data);
    return data;

  } catch (error) {
    preloader.classList.add('hidden');
    console.error("Error loading notes:", error);
  }
}