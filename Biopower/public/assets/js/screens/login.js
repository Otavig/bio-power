// src/js/auth/auth-login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!loginForm) return;

  const showAlert = (options) => {
    if (window.Swal) return window.Swal.fire(options);
    console.log(options.title || options.text || "");
    return Promise.resolve();
  };

  loginForm.addEventListener("submit", (e) => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      e.preventDefault();
      showAlert({
        icon: "warning",
        title: "Por favor, preencha todos os campos.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      showAlert({
        icon: "warning",
        title: "Por favor, insira um e-mail válido.",
      });
      return;
    }

    // Se a validação passar, deixa o formulário ser enviado para o servidor.
  });
});
