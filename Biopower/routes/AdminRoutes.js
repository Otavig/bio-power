const express = require("express");
const multer = require("multer");
const AdminController = require("../controllers/AdminController");

const router = express.Router();
const controller = new AdminController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(req, file, cb) {
    if (/image\/(jpeg|png|webp|gif)/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Apenas imagens JPEG, PNG, WEBP ou GIF são permitidas."));
  },
});

function hasRole(req, roles) {
  return req.session.user && roles.includes(req.session.user.role);
}

function ensureDashboardAccess(req, res, next) {
  if (hasRole(req, ["admin", "staff", "supplier", "professional"])) {
    return next();
  }
  return res.redirect("/login");
}

function ensureAdmin(req, res, next) {
  if (hasRole(req, ["admin", "staff"])) {
    return next();
  }
  return res.redirect("/login");
}

function ensurePurchaseReceiveAccess(req, res, next) {
  if (hasRole(req, ["admin", "staff", "supplier"])) {
    return next();
  }
  return res.redirect("/login");
}

function ensureContractedServicesAccess(req, res, next) {
  if (hasRole(req, ["admin", "staff", "professional"])) {
    return next();
  }
  return res.redirect("/login");
}

router.get("/", ensureDashboardAccess, (req, res, next) => {
  Promise.resolve(controller.dashboard(req, res)).catch(next);
});
// rota legado para /dashboard/dashboard
router.get("/dashboard", ensureDashboardAccess, (req, res) => res.redirect("/dashboard"));
router.get("/reports/pdf", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.exportReportPdf(req, res)).catch(next),
);
router.post("/products", ensureAdmin, upload.single("imagem"), (req, res, next) =>
  Promise.resolve(controller.addProduct(req, res)).catch(next),
);
router.post("/products/:id", ensureAdmin, upload.single("imagem"), (req, res, next) =>
  Promise.resolve(controller.updateProduct(req, res)).catch(next),
);
router.post("/products/delete/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.deleteProduct(req, res)).catch(next),
);
router.post("/stock/update/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.updateStock(req, res)).catch(next),
);
router.post("/categories", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.createCategory(req, res)).catch(next),
);
router.post("/categories/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.updateCategory(req, res)).catch(next),
);
router.post("/categories/delete/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.deleteCategory(req, res)).catch(next),
);

router.get("/services", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.listServices(req, res)).catch(next),
);
router.post("/services", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.createService(req, res)).catch(next),
);
router.put("/services/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.updateService(req, res)).catch(next),
);
router.delete("/services/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.deleteService(req, res)).catch(next),
);

router.get("/services/contratos", ensureContractedServicesAccess, (req, res, next) =>
  Promise.resolve(controller.listContractedServices(req, res)).catch(next),
);
router.put("/services/contratos/:id/status", ensureContractedServicesAccess, (req, res, next) =>
  Promise.resolve(controller.updateContractedServiceStatus(req, res)).catch(next),
);

router.put("/orders/:id/status", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.updateVendaStatus(req, res)).catch(next),
);

router.post("/compras", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.createCompra(req, res)).catch(next),
);

router.post("/compras/:id/receber", ensurePurchaseReceiveAccess, (req, res, next) =>
  Promise.resolve(controller.receberCompra(req, res)).catch(next),
);

router.post("/fornecedores", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.createFornecedor(req, res)).catch(next),
);

router.post("/descartes/lotes/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.confirmarDescarte(req, res)).catch(next),
);

// Usuarios (admin)
router.post("/users", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.createUser(req, res)).catch(next),
);
router.put("/users/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.updateUser(req, res)).catch(next),
);
router.delete("/users/:id", ensureAdmin, (req, res, next) =>
  Promise.resolve(controller.deleteUser(req, res)).catch(next),
);

//efetuar compras

//cupons
router.get("/cupons", ensureAdmin, (req, res, next) => {
  Promise.resolve(controller.buscarCupons(req, res)).catch(next);
});

router.post("/cupons/create", ensureAdmin, (req, res, next) => {
  Promise.resolve(controller.criarCupons(req, res)).catch(next);
});

router.put("/cupons/update/:id", ensureAdmin, (req, res, next) => {
  Promise.resolve(controller.atualizarCupom(req, res)).catch(next);
});
router.delete("/cupons/delete/:id", ensureAdmin, (req, res, next) => {
  Promise.resolve(controller.excluirCupom(req, res)).catch(next);
});


module.exports = router;
