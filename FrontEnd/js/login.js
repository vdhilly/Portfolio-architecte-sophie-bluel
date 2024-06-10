const form = document.getElementById("login-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log(event);

  const email = event.target.email.value;
  console.log(email);
  const password = event.target.password.value;
  console.log(password);
  if (email === "" || password === "") {
    return alert("Erreur dans l’identifiant ou le mot de passe");
  } else {
    const formData = JSON.stringify({
      email: email,
      password: password,
    });

    console.log(formData);
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData,
    }).then(async (response) => {
      const data = await response.json();
      if (response.status === 200) {
        const token = data.token;
        localStorage.setItem("Token", data.token);
        window.location.replace("index.html");
      }
    });
  }
});
