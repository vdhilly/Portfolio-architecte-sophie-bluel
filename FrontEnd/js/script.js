const works = fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) =>
    data.forEach((element) => {
      const img = document.createElement("img");
      img.src = element.imageUrl;
      img.alt = element.title;

      const figcaption = document.createElement("figcaption");
      figcaption.innerText = element.title;

      const figure = document.createElement("figure");
      figure.append(img, figcaption);

      console.log(figure);
      const gallery = document.querySelector(".gallery");

      gallery.appendChild(figure);
    })
  );
