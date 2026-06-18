document.addEventListener("DOMContentLoaded", () => {
  // Referências dos elementos do navbar
  const profile = document.getElementById("navbarProfile");
  const avatar = document.getElementById("profileAvatar");
  const loginBtn = document.getElementById("loginBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const profileName = document.getElementById("profileName");
  const logoutBtn = document.getElementById("logoutBtn");
  const token = localStorage.getItem("token");

  // Referências do menu mobile
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const closeMenuButton = document.getElementById("closeMenuButton");
  const mobileAuthLoggedOut = document.getElementById("mobileAuthLoggedOut");
  const mobileAuthLoggedIn = document.getElementById("mobileAuthLoggedIn");
  const mobileAvatar = document.getElementById("mobileAvatar");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
  const mobileLoginButton = document.querySelector(".mobile-login-button");

  // Pesquisa — toggle overlay
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchOverlayInput = document.getElementById("searchOverlayInput");
  const searchOverlayClose = document.getElementById("searchOverlayClose");

  const openSearch = () => {
    if (!searchOverlay) return;
    searchOverlay.classList.add("open");
    searchToggleBtn && searchToggleBtn.classList.add("active");
    setTimeout(() => searchOverlayInput && searchOverlayInput.focus(), 50);
  };

  const closeSearch = () => {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("open");
    searchToggleBtn && searchToggleBtn.classList.remove("active");
    if (searchOverlayInput) searchOverlayInput.value = "";
  };

  if (searchToggleBtn) searchToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (searchOverlay) {
      searchOverlay.classList.contains("open") ? closeSearch() : openSearch();
    }
  });

  if (searchOverlayClose) searchOverlayClose.addEventListener("click", closeSearch);

  if (searchOverlayInput) searchOverlayInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "Enter") {
      const term = searchOverlayInput.value.trim();
      if (term) window.location.href = `/store?q=${encodeURIComponent(term)}`;
    }
  });

  document.addEventListener("click", (e) => {
    if (searchOverlay && searchOverlay.classList.contains("open") &&
      !searchOverlay.contains(e.target) && e.target !== searchToggleBtn) {
      closeSearch();
    }
  });

  // Navbar fixo com scroll
  const navbar = document.querySelector(".navbar");

  // Login / Logout
  if (token) {
    const avatarImg =
      "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70 + 1);
    if (avatar) {
      avatar.src = avatarImg;
      avatar.style.display = "block";
    }
    if (loginBtn) loginBtn.style.display = "none";
    if (profileName) profileName.textContent = "Minha Conta";
    if (profile) profile.classList.add("logged-in");

    if (mobileAuthLoggedIn) mobileAuthLoggedIn.style.display = "flex";
    if (mobileAuthLoggedOut) mobileAuthLoggedOut.style.display = "none";
    if (mobileAvatar) mobileAvatar.src = avatarImg;
  } else {
    if (avatar) avatar.style.display = "none";
    if (loginBtn) loginBtn.style.display = "flex";

    if (mobileAuthLoggedIn) mobileAuthLoggedIn.style.display = "none";
    if (mobileAuthLoggedOut) mobileAuthLoggedOut.style.display = "block";
    if (mobileLoginButton)
      mobileLoginButton.onclick = () => (window.location.href = "/login");
  }

  if (logoutBtn) logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  // Menu mobile
  if (hamburgerMenu && mobileMenuOverlay) hamburgerMenu.addEventListener("click", () => {
    mobileMenuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  if (closeMenuButton && mobileMenuOverlay) closeMenuButton.addEventListener("click", () => {
    mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener("click", (e) => {
    if (e.target === mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Marcar link ativo baseado na URL atual
  const currentPath = window.location.pathname;
  document.querySelectorAll(".navbar-links a, .mobile-menu-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href !== "#" && currentPath.startsWith(href)) {
      link.classList.add("active");
    }
  });

  // Efeito scroll na navbar
  window.addEventListener("scroll", () => {
    if (!navbar) return;
    if (window.scrollY > 0) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Modal de Categorias
  const modal = document.getElementById("modalCategorias");
  const abrirModalBtn = document.getElementById("abrirModalBtn");
  const fecharModal = modal ? modal.querySelector(".fechar") : null;
  const categoriaArrow = document.getElementById("categoriaArrow");

  const abrirCategorias = () => {
    if (!modal) return;
    modal.style.display = "block";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    if (categoriaArrow) categoriaArrow.classList.add("rotated");
  };

  const fecharCategorias = () => {
    if (!modal) return;
    modal.style.display = "none";
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (categoriaArrow) categoriaArrow.classList.remove("rotated");
  };

  if (abrirModalBtn && modal) {
    abrirModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const aberto = modal.classList.contains("open") || modal.style.display === "block";
      aberto ? fecharCategorias() : abrirCategorias();
    });
  }

  if (fecharModal) fecharModal.addEventListener("click", fecharCategorias);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      fecharCategorias();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") fecharCategorias();
  });
});
