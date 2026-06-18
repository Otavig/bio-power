const express = require("express");
const UsuariosController = require("../controllers/usuariosController");

const router = express.Router();
const controller = new UsuariosController();

router.get("/auth", controller.autentificacao);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/register", controller.register);
router.post("/register", controller.registerPost.bind(controller));


module.exports = router;
