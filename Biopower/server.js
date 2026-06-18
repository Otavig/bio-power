const express = require("express");
const expressEjsLayout = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");

/* Paginas */
const homeRoutes = require("./routes/HomeRoutes");
const storeRoutes = require("./routes/StoreRoutes");
const aboutUsRoutes = require("./routes/AboutUsRoutes");
const autentificacaoRoutes = require("./routes/AutentificacaoRoutes");
const servicesRoutes = require("./routes/ServicesRoutes");
const recebimentoCompraRoutes = require("./routes/recebimentoCompraRoutes");
const efetuarCompraRoutes = require("./routes/efetuarCompraroutes");

const adminRoutes = require("./routes/AdminRoutes");
const recebimentoRouter = require("./routes/recebimentoRouter");
const server = express();
const PORT = 5000;
server.set("view engine", "ejs");
server.set("layout", "./layout.ejs");
server.use(express.static("public"));
// Carrega .env relativo ao arquivo server.js garantindo que funcione dentro do container

server.use(expressEjsLayout);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
  session({
    secret: process.env.SESSION_SECRET ?? "bio_power_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

server.use((req, res, next) => {
  res.locals.sessionUser = req.session.user;
  next();
});

server.use("/", homeRoutes);
server.use("/", autentificacaoRoutes);
server.use("/dashboard", adminRoutes);
server.use("/store", storeRoutes);
server.use("/about-us", aboutUsRoutes);
server.use("/", servicesRoutes);
server.use("/receber-compra", recebimentoCompraRoutes);
server.use("/efetuar-compra", efetuarCompraRoutes);
server.use("/recebimento", recebimentoRouter);
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
