// fetch pour aller chercher les travaux
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  displayWorks(data);

  return data;
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((element) => {
    const img = document.createElement("img");
    img.src = element.imageUrl;
    img.alt = element.title;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = element.title;

    const figure = document.createElement("figure");
    figure.append(img, figcaption);
    figure.classList.add("work");
    figure.dataset.category = element.categoryId;

    const gallery = document.querySelector(".gallery");

    gallery.appendChild(figure);
  });
}

// fetch categories
// Question : Set utile pour Modale ?

async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const data = await response.json();

  const categories = Array.from(new Set(data.map((category) => category.name))).map((name) =>
    data.find((category) => category.name === name)
  );

  displayCategoryMenu(categories);

  return categories;
}

function displayCategoryMenu(categories) {
  const menu = document.querySelector(".gallery-categories");

  categories.forEach((category, index) => {
    if (index === 0) createCategoryBtn("Tous", 0);
    createCategoryBtn(category.name, category.id);
  });
}

function createCategoryBtn(title, categoryId) {
  const container = document.querySelector(".gallery-categories");
  const Btn = document.createElement("button");
  Btn.innerText = title;
  Btn.dataset.categoryId = categoryId;
  Btn.classList.add("category-btn");

  Btn.addEventListener("click", () => handleFilters(categoryId, Btn));
  container.appendChild(Btn);
}

async function handleFilters(categoryId, Btn) {
  const works = await fetchWorks();
  const filteredWorks = categoryId === 0 ? works : works.filter((work) => work.categoryId === categoryId);

  displayWorks(filteredWorks);

  // Catégorie Btn selectionné
  const selected = document.querySelector(".selected");
  if (selected) selected.classList.remove("selected");
  Btn.classList.add("selected");
}

fetchWorks();
fetchCategories();
