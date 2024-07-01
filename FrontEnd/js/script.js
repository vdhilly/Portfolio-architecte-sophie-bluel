// fetch pour aller chercher les travaux
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();
const gallery = document.querySelector(".gallery");
displayWorks(works, gallery);

function displayWorks(works, gallery) {
  gallery.innerHTML = "";

  works.forEach((element) => {
    addWorkToGallery(element);
  });
}
function addWorkToGallery(work) {
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.innerText = work.title;

  const figure = document.createElement("figure");
  figure.append(img, figcaption);
  figure.classList.add("work");
  figure.id = "work-" + work.id;
  figure.dataset.category = work.categoryId;

  gallery.appendChild(figure);
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

const token = localStorage.getItem("Token");
if (token) {
  displayEditMode();
  displayModalGallery();
  displayModalAddCategories();
  openAndCloseModal();
  handleSubmit();
  postNewWork();
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
    modalAddWork.style.display = "none";
  });

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
    resetAddWork();
  });
  returnBtn.addEventListener("click", () => {
    modalContent.style.display = "flex";
    modalAddWork.style.display = "none";
  });
}
function displayModalGallery() {
  works.forEach((work) => {
    addWorkToModalGallery(work);
  });
}
function resetAddWork() {
  const img = document.getElementById("img-preview");
  img.style.display = "none";
  const insertDiv = document.getElementById("insert-image-container");
  insertDiv.style.display = "flex";

  const imgInput = document.querySelector("input[name=add-image]");
  const titleInput = document.getElementById("input-title");
  const categorySelect = document.getElementById("select-category");
  imgInput.value = "";
  titleInput.value = "";
  categorySelect.value = "";
}
function addWorkToModalGallery(work) {
  console.log(work);
  const divGallery = document.querySelector(".gallery-modal");
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

      const galleryFigure = document.getElementById(`work-${workId}`);
      galleryFigure.remove();
    })
    .catch((error) => {
      console.log(error);
    });
}

function displayEditMode() {
  const toShow = document.querySelectorAll(".edit-mode");
  toShow.forEach((element) => {
    element.style.display = "block";
    if (element.classList.contains("nav-logout")) element.style.display = "inline";
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

function handleSubmit() {
  const inputAdd = document.getElementById("input-add");
  const inputTitle = document.getElementById("input-title");
  const selectCategory = document.getElementById("select-category");
  const inputSubmit = document.getElementById("input-submit");
  const updateStateBtnSubmit = () => {
    const file = inputAdd.files[0];
    if (!file || inputAdd.value === "" || inputTitle.value.trim() === "" || selectCategory.value === "") {
      inputSubmit.disabled = true;
      inputSubmit.style.cursor = "not-allowed";
      inputSubmit.style.backgroundColor = "#d3d3d3";
    } else {
      inputSubmit.disabled = false;
      inputSubmit.style.cursor = "pointer";
      inputSubmit.style.backgroundColor = "#1d6154";
    }
    if (file) {
      let imageUrl = URL.createObjectURL(file);
      const img = document.getElementById("img-preview");
      img.src = imageUrl;
      img.style.display = "block";
      const insertDiv = document.getElementById("insert-image-container");
      insertDiv.style.display = "none";
    }
  };
  updateStateBtnSubmit();
  inputAdd.addEventListener("input", updateStateBtnSubmit);
  inputTitle.addEventListener("input", updateStateBtnSubmit);
  selectCategory.addEventListener("change", updateStateBtnSubmit);
}
function postNewWork() {
  const inputAdd = document.getElementById("input-add");
  const inputTitle = document.getElementById("input-title");
  const selectCategory = document.getElementById("select-category");
  const inputSubmit = document.getElementById("input-submit");
  inputSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    if (inputAdd.value === "" || inputTitle.value.trim() === "" || selectCategory.value === "") {
      // Message pas tout rempli
    } else {
      const formData = new FormData();
      formData.append("image", inputAdd.files[0]);
      formData.append("title", inputTitle.value);
      formData.append("category", selectCategory.value);
      fetch("http://localhost:5678/api/works/", {
        method: "POST",
        body: formData,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const newWork = await response.json();
            console.log(newWork);

            // Ajout du projet dans la galerie
            addWorkToGallery(newWork);
            // Ajout de l'image dans la modale
            addWorkToModalGallery(newWork);

            const modalContent = document.getElementById("modal-content");
            const modalAddWork = document.getElementById("modal-add-content");

            modalContent.style.display = "flex";
            modalAddWork.style.display = "none";
          } else {
            const form = document.getElementById(".div-input");

            const message = document.createElement("p");
            message.classList.add("red-message");
            message.innerText = "Email ou Mot de passe incorrect";

            form.prepend(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}
function logout() {
  const logoutBtn = document.querySelector(".nav-logout.edit-mode");
  logoutBtn.addEventListener("click", function (e) {
    localStorage.removeItem("Token");
    location.reload();
  });
}
logout();
