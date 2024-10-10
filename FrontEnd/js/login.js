const form = document.getElementById("login-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;
  if (email === "" || password === "") {
    return alert("Erreur dans l’identifiant ou le mot de passe");
  } else {
    const formData = JSON.stringify({
      email: email,
      password: password,
    });
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          const token = data.token;
          localStorage.setItem("Token", token);
          window.location.replace("index.html");

          const msgExist = document.querySelector(".red-message");
          if (msgExist) msgExist.remove();
        } else {
          const form = document.getElementById("login-form");

          const message = document.createElement("p");
          message.classList.add("red-message");
          message.innerText = "Email ou Mot de passe incorrect";

          form.prepend(message);
        }
      })
      .catch((error) => {
        return alert("Quelque chose ne s'est pas passé comme prévu");
      });
  }
});
