// fetch pour aller chercher les travaux
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();
const gallery = document.querySelector(".gallery");
displayWorks(works, gallery);

function displayWorks(works, gallery) {
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

    gallery.appendChild(figure);
  });
}

// fetch categories
// Question : Set utile pour Modale ?
// à l'ajout il ne faut pas actualiser la page, d'où le Set qui empêchera les doublons des images

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
  const filteredWorks = categoryId === 0 ? works : works.filter((work) => work.categoryId === categoryId);

  displayWorks(filteredWorks);

  const selected = document.querySelector(".selected");
  if (selected) selected.classList.remove("selected");
  Btn.classList.add("selected");
}

fetchCategories();
// TO DO FAIRE DECONNEXION
// localStorage.removeItem("Token");

// Question, add qui slide ou simple apparition ?
// Question Déroulant grave ?

const token = localStorage.getItem("Token");
if (token) {
  displayEditMode();
  displayModalGallery();
  displayModalAddCategories();
  openAndCloseModal();
}
function openAndCloseModal() {
  const modify = document.querySelector(".modifyBtn");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalAdd = document.getElementById("modal-add");
  const btnAddImg = document.querySelector(".btn-add-img");
  const modalAddWork = document.getElementById("modal-add-content");
  const closeModals = document.querySelectorAll(".fa-xmark");
  const returnBtn = document.querySelector(".fa-arrow-left");

  modify.addEventListener("click", function () {
    modal.style.display = "flex";
    modalContent.style.display = "flex";
  });

  // Echap fermer
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      modalContent.style.display = "none";
      modalAdd.style.display = "none";
    }
  });
  closeModals.forEach((closeModal) => {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      modalContent.style.display = "none";
      modalAdd.style.display = "none";
    });
  });

  btnAddImg.addEventListener("click", () => {
    modalContent.style.display = "none";
    modalAddWork.style.display = "block";
  });
  returnBtn.addEventListener("click", () => {
    modalContent.style.display = "flex";
    modalAddWork.style.display = "none";
  });
}
function displayModalGallery() {
  const divGallery = document.querySelector(".gallery-modal");
  works.forEach((work) => {
    const workId = work.id;
    const figure = document.createElement("figure");
    figure.classList.add(`figure-${workId}`);
    figure.id = `figure-${workId}`;
    const img = document.createElement("img");
    const elementTrash = document.createElement("i");
    elementTrash.classList.add("fa-solid", "fa-trash-can");
    img.src = work.imageUrl;
    divGallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(elementTrash);

    elementTrash.addEventListener("click", async function (event) {
      deleteWorks(workId);
    });
  });
}
async function displayModalAddCategories() {
  const select = document.getElementById("select-category");
  const categories = await fetchCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.innerText = category.name;
    select.appendChild(option);
  });
}

function deleteWorks(workId) {
  const confirmed = confirm("Voulez vous vraiment supprimer ce projet ?");
  if (!confirmed) return;

  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) return;

      const figure = document.getElementById(`figure-${workId}`);
      figure.remove();
    })
    .catch((error) => {
      console.log(error);
    });
}

function displayEditMode() {
  const toShow = document.querySelectorAll(".edit-mode");
  toShow.forEach((element) => {
    element.style.display = "block";
  });
  const toHide = document.querySelectorAll(".edit-mode-hide");
  toHide.forEach((element) => {
    element.style.display = "none";
  });
  const PortfolioTitle = document.querySelector("#portfolio h2");
  const modifyBtn = document.createElement("a");
  modifyBtn.href = "#";
  modifyBtn.classList.add("modifyBtn");
  modifyBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"><span>modifier</span></i>`;
  PortfolioTitle.appendChild(modifyBtn);
}
