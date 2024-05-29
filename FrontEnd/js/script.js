// fetch pour aller chercher les travaux
const works = fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) =>
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
    })
  );

function createCategoryBtn(title, categoryId) {
  const container = document.querySelector(".gallery-categories");
  const Btn = document.createElement("button");
  Btn.innerText = title;
  Btn.dataset.categoryId = categoryId;
  Btn.classList.add("category-btn");

  Btn.addEventListener("click", () => handleFilters(categoryId));
  container.appendChild(Btn);
}

// fetch categories
const categories = fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) =>
    categories.forEach((category, index) => {
      if (index === 0) createCategoryBtn("Tous", "");
      createCategoryBtn(category.name, category.id);
    })
  );

function handleFilters(categoryId) {
  const works = document.querySelectorAll(".work");
  works.forEach((work) => {
    const category = Number(work.dataset.category);
    if (category === categoryId) work.style.display = "block";
    else if (categoryId === "") work.style.display = "block";
    else work.style.display = "none";
  });
}
