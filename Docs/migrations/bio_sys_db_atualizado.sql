CREATE DATABASE IF NOT EXISTS `bio_sys_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bio_sys_db`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `tb_Fluxo_Caixa_Venda`;
DROP TABLE IF EXISTS `tb_Fluxo_Caixa_Compra`;

-- ========================================================
-- TABELAS BASE (sem dependências)
-- ========================================================

--
-- tb_typeUser (TypeUserModels)
--
DROP TABLE IF EXISTS `tb_typeUser`;
CREATE TABLE `tb_typeUser` (
  `typ_id` int NOT NULL AUTO_INCREMENT,
  `typ_descricao` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`typ_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_typeUser` WRITE;
INSERT INTO `tb_typeUser` VALUES (1,'Administrador'),(2,'Funcionario'),(3,'Profissional'),(4,'Cliente');
UNLOCK TABLES;

--
-- tb_status_diversos
--
DROP TABLE IF EXISTS `tb_status_diversos`;
CREATE TABLE `tb_status_diversos` (
  `sta_id` int NOT NULL AUTO_INCREMENT,
  `sta_dominio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sta_codigo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sta_descricao` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`sta_id`),
  UNIQUE KEY `uq_status_dominio_codigo` (`sta_dominio`,`sta_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_status_diversos` WRITE;
INSERT INTO `tb_status_diversos` VALUES
(1,'agendamento_status','CONFIRMADO','Agendamento confirmado'),
(2,'agendamento_status','AGUARDANDO_PAGAMENTO','Aguardando pagamento'),
(3,'agendamento_status','CANCELADO','Agendamento cancelado'),
(4,'agendamento_status','CONCLUIDO','Agendamento concluido'),
(5,'devolucao_status','PENDENTE','Aguardando avaliacao'),
(6,'devolucao_status','APROVADO','Devolucao aprovada'),
(7,'devolucao_status','RECUSADO','Devolucao recusada'),
(8,'fluxo_caixa_tipo','RECEITA','Entrada de recursos'),
(9,'fluxo_caixa_tipo','DESPESA','Saida de recursos'),
(10,'pedido_status','SOLICITADO','Pedido solicitado'),
(11,'pedido_status','EM_ANDAMENTO','Pedido em andamento'),
(12,'pedido_status','CONCLUIDO','Pedido concluido'),
(13,'venda_metodo_pagamento','PIX','Pagamento via PIX'),
(14,'venda_metodo_pagamento','CREDITO','Cartao de credito'),
(15,'venda_metodo_pagamento','DEBITO','Cartao de debito'),
(16,'venda_metodo_pagamento','BOLETO','Pagamento por boleto'),
(17,'venda_status','AGUARDANDO','Aguardando pagamento'),
(18,'venda_status','PAGO','Pagamento confirmado'),
(19,'venda_status','CANCELADO','Venda cancelada'),
(20,'venda_status','ENTREGUE','Venda entregue');
UNLOCK TABLES;

--
-- tb_Categorias (CategoriasModels)
--
DROP TABLE IF EXISTS `tb_Categorias`;
CREATE TABLE `tb_Categorias` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Categorias` WRITE;
INSERT INTO `tb_Categorias` VALUES (1,'Creatina'),(2,'Whey'),(3,'Pré-treino'),(4,'Termogênico'),(5,'Hipercalórico');
UNLOCK TABLES;

--
-- tb_Laboratorios (LaboratoriosModels)
--
DROP TABLE IF EXISTS `tb_Laboratorios`;
CREATE TABLE `tb_Laboratorios` (
  `lab_id` int NOT NULL AUTO_INCREMENT,
  `lab_nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`lab_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Laboratorios` WRITE;
INSERT INTO `tb_Laboratorios` VALUES
(1,'Growth'),(2,'Integral Médica'),(3,'DUX'),(4,'Dark Lab'),(5,'Black Skull'),
(6,'Max Titanium'),(7,'Universal Nutrition'),(8,'Iridium Labs'),(9,'Probiótica'),
(10,'Cellucor'),(11,'Integralmédica'),(12,'BodyAction'),(13,'Adaptogen Nutrition'),
(15,'Eli Lilly');
UNLOCK TABLES;

--
-- tb_Fornecedores (FornecedoresModels)
-- Diagrama (imagem 4): for_id, for_nome_fantasia, for_cnpj, for_email, for_telefone, for_razao_social
--
DROP TABLE IF EXISTS `tb_Fornecedores`;
CREATE TABLE `tb_Fornecedores` (
  `for_id` int NOT NULL AUTO_INCREMENT,
  `for_nome_fantasia` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `for_cnpj` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `for_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `for_telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `for_razao_social` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`for_id`),
  UNIQUE KEY `for_cnpj` (`for_cnpj`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- USUÁRIOS
-- ========================================================

--
-- tb_Usuarios (UsuariosModels)
-- Diagrama (imagem 1 e 5): usu_id, usu_nome, usu_email, usu_senha, usu_cpf_cnpj, usu_typ_id, usu_ativo
--
DROP TABLE IF EXISTS `tb_Cliente`;
DROP TABLE IF EXISTS `tb_Usuarios`;
CREATE TABLE `tb_Usuarios` (
  `usu_id` int NOT NULL AUTO_INCREMENT,
  `usu_nome` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usu_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usu_senha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usu_cpf_cnpj` char(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usu_typ_id` int NOT NULL,
  `usu_ativo` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usu_id`),
  UNIQUE KEY `usu_email` (`usu_email`),
  UNIQUE KEY `usu_cpf_cnpj` (`usu_cpf_cnpj`),
  KEY `usu_typ_id` (`usu_typ_id`),
  CONSTRAINT `fk_usu_typ` FOREIGN KEY (`usu_typ_id`) REFERENCES `tb_typeUser` (`typ_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Usuarios` WRITE;
INSERT INTO `tb_Usuarios` VALUES
(1,'Breno','breno@gmail.com','123456','61569572003',1,1,'2026-03-25 14:42:42','2026-03-25 14:42:42'),
(2,'Admin','admin@biopower.com','admin123','18715096025',1,1,'2026-03-25 17:19:29','2026-03-25 17:19:29'),
(3,'Mariana Souza','mariana.souza@biopower.com','admin123','04715623005',1,1,'2026-03-25 17:20:57','2026-03-25 17:20:57'),
(4,'Carlos Pereira','carlos.pereira@biopower.com','func123','72060914078',2,1,'2026-03-25 17:20:57','2026-03-25 17:20:57'),
(5,'Fernanda Lima','fernanda.lima@biopower.com','func123','32569640018',2,1,'2026-03-25 17:20:57','2026-03-25 17:20:57'),
(6,'Joao Silva','joao.silva@biopower.com','cliente123','57651177088',4,1,'2026-03-25 17:20:57','2026-03-25 17:20:57'),
(7,'Ana Paula','ana.paula@biopower.com','cliente123','37128169016',4,1,'2026-03-25 17:20:57','2026-03-25 17:20:57'),
(8,'Ricardo Mendes','ricardo.mendes@biopower.com','cliente123','04989873025',4,0,'2026-03-25 17:20:57','2026-03-25 17:20:57'),
(9,'Assis','assis@biopower.com','123456','16805046068',1,0,'2026-03-26 14:08:33','2026-03-26 14:08:45'),
(11,'Breno Passarela','passarela@gmail.com','123456','19966571000',1,0,'2026-03-26 14:18:08','2026-03-26 14:43:53'),
(12,'Breno H','brenof@gmail.com','123456','87901724005',2,1,'2026-03-26 14:39:37','2026-03-26 14:39:37'),
(13,'Paulo Nutri','paulo.nutri@biopower.com','prof123','47384462070',2,1,'2026-03-26 16:10:00','2026-03-26 16:10:00'),
(14,'Camila Alves','camila.alves@biopower.com','prof123','73147285006',2,1,'2026-03-26 16:12:00','2026-03-26 16:12:00'),
(15,'Rafael Costa','rafael.costa@biopower.com','prof123','88835997054',2,1,'2026-03-26 16:14:00','2026-03-26 16:14:00');
UNLOCK TABLES;

--
-- tb_Cliente
--
DROP TABLE IF EXISTS `tb_Cliente`;
CREATE TABLE `tb_Cliente` (
  `cli_id` int NOT NULL AUTO_INCREMENT,
  `cli_usu_id` int NOT NULL,
  `cli_sobrenome` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_genero` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_data_nascimento` date NOT NULL,
  `cli_estado_civil` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_cep` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_cidade` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_estado` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_bairro` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_rua` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_numero` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cli_complemento` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cli_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cli_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cli_id`),
  UNIQUE KEY `uq_cliente_usuario` (`cli_usu_id`),
  CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`cli_usu_id`) REFERENCES `tb_Usuarios` (`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Profissional (Profissional)
-- Diagrama (imagem 1): pro_id, pro_id_usuario
--
DROP TABLE IF EXISTS `tb_Profissional`;
CREATE TABLE `tb_Profissional` (
  `pro_id` int NOT NULL AUTO_INCREMENT,
  `pro_id_usuario` int NOT NULL,
  PRIMARY KEY (`pro_id`),
  KEY `fk_prof_usuario` (`pro_id_usuario`),
  CONSTRAINT `fk_prof_usuario` FOREIGN KEY (`pro_id_usuario`) REFERENCES `tb_Usuarios` (`usu_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- PRODUTOS
-- ========================================================

--
-- tb_Produtos (ProdutosModels)
-- Diagrama (imagens 1, 2, 4, 5): pro_id, pro_nome, pro_descricao, pro_imagem,
--   pro_preco_venda, pro_porcentagem_promocao, pro_id_categoria, pro_id_laboratorio
--
DROP TABLE IF EXISTS `tb_Produtos`;
CREATE TABLE `tb_Produtos` (
  `pro_id` int NOT NULL AUTO_INCREMENT,
  `pro_nome` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pro_descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pro_imagem` longblob DEFAULT NULL,
  `pro_preco_venda` decimal(10,2) NOT NULL,
  `pro_porcentagem_promocao` decimal(5,2) DEFAULT '0.00',
  `pro_id_categoria` int DEFAULT NULL,
  `pro_id_laboratorio` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pro_id`),
  KEY `pro_id_laboratorio` (`pro_id_laboratorio`),
  KEY `idx_produto_categoria` (`pro_id_categoria`),
  KEY `idx_produto_nome` (`pro_nome`),
  CONSTRAINT `fk_pro_categoria` FOREIGN KEY (`pro_id_categoria`) REFERENCES `tb_Categorias` (`cat_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pro_laboratorio` FOREIGN KEY (`pro_id_laboratorio`) REFERENCES `tb_Laboratorios` (`lab_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Produtos` WRITE;
INSERT INTO `tb_Produtos`
  (`pro_id`, `pro_nome`, `pro_descricao`, `pro_preco_venda`, `pro_porcentagem_promocao`, `pro_id_categoria`, `pro_id_laboratorio`, `created_at`, `updated_at`)
VALUES
(1,'Creatina Monohidratada 250g','Em breve',79.92,0.00,1,1,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(2,'Whey Protein Baunilha 900g','Em breve',129.90,0.00,2,2,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(3,'Pré-Treino Explosivo DUX 300g','Em breve',98.50,0.00,3,3,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(5,'Termogênico Black Skull 60 caps','Em breve',59.90,0.00,4,5,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(6,'Whey Protein Chocolate 1kg','Em breve',134.50,0.00,2,6,'2026-03-25 19:41:26','2026-03-26 14:43:18'),
(7,'Pré-Treino Insano 280g','Em breve',89.99,0.00,3,5,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(8,'Creatina Universal 300g','Em breve',109.90,0.00,1,7,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(9,'Termogênico Kimera 60 caps','Em breve',69.90,0.00,4,8,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(10,'Whey Blend 3W 900g','Em breve',119.00,0.00,2,9,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(11,'Pré-Treino C4 Original 195g','Em breve',139.90,0.00,3,10,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(12,'Creatina Hardcore Reload 300g','Em breve',94.90,0.00,1,11,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(13,'Termogênico Thermo Flame 120 caps','Em breve',79.90,0.00,4,12,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(14,'Whey Isolado 900g','Em breve',189.90,0.00,2,3,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(15,'Pré-Treino Psycho 280g','Em breve',84.50,0.00,3,13,'2026-03-25 19:41:26','2026-03-25 19:41:26');
UNLOCK TABLES;

--
-- tb_Promocoes (Promocoes)
-- Diagrama (imagem 4): pro_id, pro_nome, pro_descricao, pro_data_inicio, pro_data_fim, pro_percentual
--
DROP TABLE IF EXISTS `tb_Promocoes`;
CREATE TABLE `tb_Promocoes` (
  `pro_id` int NOT NULL AUTO_INCREMENT,
  `pro_nome` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pro_descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pro_data_inicio` date NOT NULL,
  `pro_data_fim` date NOT NULL,
  `pro_percentual` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Itens_Promocao (Itens_Promoção)
-- Diagrama (imagem 4): itp_id, itp_id_produto, itp_id_lote, itp_valor_desconto
--
DROP TABLE IF EXISTS `tb_Itens_Promocao`;
CREATE TABLE `tb_Itens_Promocao` (
  `itp_id` int NOT NULL AUTO_INCREMENT,
  `itp_id_produto` int NOT NULL,
  `itp_id_lote` int NOT NULL,
  `itp_valor_desconto` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`itp_id`),
  KEY `fk_itp_produto` (`itp_id_produto`),
  KEY `fk_itp_lote` (`itp_id_lote`),
  CONSTRAINT `fk_itp_produto` FOREIGN KEY (`itp_id_produto`) REFERENCES `tb_Produtos` (`pro_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_itp_lote` FOREIGN KEY (`itp_id_lote`) REFERENCES `tb_Lotes_Estoque` (`lot_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- ESTOQUE
-- ========================================================

--
-- tb_Lotes_Estoque (LotesEstoqueModels)
-- Diagrama (imagens 2, 4, 5): lot_id, lot_id_produto, lot_numero_lote, lot_quantidade_atual,
--   lot_data_validade, lot_data_entrada, lot_id_fornecedor
--
DROP TABLE IF EXISTS `tb_Lotes_Estoque`;
CREATE TABLE `tb_Lotes_Estoque` (
  `lot_id` int NOT NULL AUTO_INCREMENT,
  `lot_id_produto` int NOT NULL,
  `lot_numero_lote` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lot_quantidade_atual` int NOT NULL,
  `lot_data_validade` date NOT NULL,
  `lot_data_entrada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lot_id_fornecedor` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`lot_id`),
  KEY `lot_id_produto` (`lot_id_produto`),
  KEY `lot_id_fornecedor` (`lot_id_fornecedor`),
  KEY `idx_lote_produto_validade` (`lot_id_produto`,`lot_data_validade`),
  CONSTRAINT `fk_lot_produto` FOREIGN KEY (`lot_id_produto`) REFERENCES `tb_Produtos` (`pro_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lot_fornecedor` FOREIGN KEY (`lot_id_fornecedor`) REFERENCES `tb_Fornecedores` (`for_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Lotes_Estoque` WRITE;
INSERT INTO `tb_Lotes_Estoque` VALUES
(1,1,'LOT-001',3,'2026-01-15','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(2,2,'LOT-002',47,'2026-07-10','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(3,3,'LOT-003',22,'2026-06-27','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(5,5,'LOT-005',6,'2026-06-20','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(6,6,'LOT-006',31,'2026-06-25','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(7,7,'LOT-007',8,'2026-07-18','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(8,8,'LOT-008',19,'2026-07-30','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(9,9,'LOT-009',2,'2026-08-15','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(10,10,'LOT-010',40,'2026-08-28','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(11,11,'LOT-011',12,'2027-02-14','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(12,12,'LOT-012',0,'2027-05-09','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(13,13,'LOT-013',28,'2027-08-21','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(14,14,'LOT-014',5,'2026-06-12','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(15,15,'LOT-015',16,'2027-01-30','2026-03-25 19:41:26',NULL,'2026-03-25 19:41:26','2026-03-25 19:41:26'),
(16,12,'AJUSTE-MANUAL',4,'2026-09-05','2026-03-26 11:58:10',NULL,'2026-03-26 11:58:10','2026-03-26 11:58:10');
UNLOCK TABLES;

--
-- tb_Produto_Fornecedores (relação N:N ProdutosModels <-> FornecedoresModels)
--
DROP TABLE IF EXISTS `tb_Produto_Fornecedores`;
CREATE TABLE `tb_Produto_Fornecedores` (
  `pf_id_produto` int NOT NULL,
  `pf_id_fornecedor` int NOT NULL,
  `pf_preco_compra` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`pf_id_produto`,`pf_id_fornecedor`),
  KEY `pf_id_fornecedor` (`pf_id_fornecedor`),
  CONSTRAINT `fk_pf_produto` FOREIGN KEY (`pf_id_produto`) REFERENCES `tb_Produtos` (`pro_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pf_fornecedor` FOREIGN KEY (`pf_id_fornecedor`) REFERENCES `tb_Fornecedores` (`for_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- DESCARTES
-- ========================================================

--
-- tb_Descartes (DescartesModels)
-- Diagrama (imagem 4): des_id, des_id_lote, des_id_produto, des_quantidade, des_motivo,
--   des_id_responsavel, des_data
--
DROP TABLE IF EXISTS `tb_Descartes`;
CREATE TABLE `tb_Descartes` (
  `des_id` int NOT NULL AUTO_INCREMENT,
  `des_id_lote` int NOT NULL,
  `des_id_produto` int NOT NULL,
  `des_quantidade` int NOT NULL,
  `des_motivo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `des_id_responsavel` int NOT NULL,
  `des_data` date NOT NULL,
  PRIMARY KEY (`des_id`),
  KEY `fk_des_lote` (`des_id_lote`),
  KEY `fk_des_produto` (`des_id_produto`),
  KEY `fk_des_responsavel` (`des_id_responsavel`),
  CONSTRAINT `fk_des_lote` FOREIGN KEY (`des_id_lote`) REFERENCES `tb_Lotes_Estoque` (`lot_id`),
  CONSTRAINT `fk_des_produto` FOREIGN KEY (`des_id_produto`) REFERENCES `tb_Produtos` (`pro_id`),
  CONSTRAINT `fk_des_responsavel` FOREIGN KEY (`des_id_responsavel`) REFERENCES `tb_Usuarios` (`usu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Itens_Descarte (Itens_Descarte)
-- Diagrama (imagem 4): idt_id, idt_id_produto, idt_id_responsavel, idt_id_lote,
--   idt_quantidade, idt_motivo, idt_valor_unitario, idt_data
--
DROP TABLE IF EXISTS `tb_Itens_Descarte`;
CREATE TABLE `tb_Itens_Descarte` (
  `idt_id` int NOT NULL AUTO_INCREMENT,
  `idt_id_produto` int NOT NULL,
  `idt_id_responsavel` int NOT NULL,
  `idt_id_lote` int NOT NULL,
  `idt_quantidade` int NOT NULL,
  `idt_motivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idt_valor_unitario` int NOT NULL DEFAULT '0',
  `idt_data` date NOT NULL,
  PRIMARY KEY (`idt_id`),
  KEY `fk_idt_produto` (`idt_id_produto`),
  KEY `fk_idt_responsavel` (`idt_id_responsavel`),
  KEY `fk_idt_lote` (`idt_id_lote`),
  CONSTRAINT `fk_idt_produto` FOREIGN KEY (`idt_id_produto`) REFERENCES `tb_Produtos` (`pro_id`),
  CONSTRAINT `fk_idt_responsavel` FOREIGN KEY (`idt_id_responsavel`) REFERENCES `tb_Usuarios` (`usu_id`),
  CONSTRAINT `fk_idt_lote` FOREIGN KEY (`idt_id_lote`) REFERENCES `tb_Lotes_Estoque` (`lot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- COMPRAS
-- ========================================================

--
-- tb_Pedidos_Compra (PedidoCompraModels)
-- Diagrama (imagem 4): ped_id, ped_id_fornecedor, ped_id_responsavel, ped_data_pedido,
--   ped_data_entrega_prevista, ped_status_id
--
DROP TABLE IF EXISTS `tb_Pedidos_Compra`;
CREATE TABLE `tb_Pedidos_Compra` (
  `ped_id` int NOT NULL AUTO_INCREMENT,
  `ped_id_fornecedor` int NOT NULL,
  `ped_id_responsavel` int NOT NULL,
  `ped_data_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ped_data_entrega_prevista` date DEFAULT NULL,
  `ped_status_id` int NOT NULL DEFAULT '10',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ped_id`),
  KEY `fk_ped_fornecedor` (`ped_id_fornecedor`),
  KEY `fk_ped_responsavel` (`ped_id_responsavel`),
  KEY `fk_ped_status` (`ped_status_id`),
  CONSTRAINT `fk_ped_status` FOREIGN KEY (`ped_status_id`) REFERENCES `tb_status_diversos` (`sta_id`),
  CONSTRAINT `fk_ped_fornecedor` FOREIGN KEY (`ped_id_fornecedor`) REFERENCES `tb_Fornecedores` (`for_id`),
  CONSTRAINT `fk_ped_responsavel` FOREIGN KEY (`ped_id_responsavel`) REFERENCES `tb_Usuarios` (`usu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Itens_Pedido_Compra (Itens_Pedido)
-- Diagrama (imagem 4): itp_id, itp_id_produto, itp_quantidade, itp_valor_unitario
--
DROP TABLE IF EXISTS `tb_Itens_Pedido_Compra`;
CREATE TABLE `tb_Itens_Pedido_Compra` (
  `itp_id` int NOT NULL AUTO_INCREMENT,
  `itp_id_pedido` int NOT NULL,
  `itp_id_produto` int NOT NULL,
  `itp_quantidade` int NOT NULL,
  `itp_valor_unitario` float DEFAULT NULL,
  PRIMARY KEY (`itp_id`),
  KEY `fk_itp_pedido` (`itp_id_pedido`),
  KEY `fk_itp_produto_compra` (`itp_id_produto`),
  CONSTRAINT `fk_itp_pedido` FOREIGN KEY (`itp_id_pedido`) REFERENCES `tb_Pedidos_Compra` (`ped_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_itp_produto_compra` FOREIGN KEY (`itp_id_produto`) REFERENCES `tb_Produtos` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Compra (Compra)
-- Diagrama (imagens 3, 4): com_id, com_id_fornecedor, com_data, com_valor_total, com_status
--
DROP TABLE IF EXISTS `tb_Compra`;
CREATE TABLE `tb_Compra` (
  `com_id` int NOT NULL AUTO_INCREMENT,
  `com_id_fornecedor` int NOT NULL,
  `com_data` date NOT NULL,
  `com_valor_total` double NOT NULL DEFAULT '0',
  `com_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  PRIMARY KEY (`com_id`),
  KEY `fk_com_fornecedor` (`com_id_fornecedor`),
  CONSTRAINT `fk_com_fornecedor` FOREIGN KEY (`com_id_fornecedor`) REFERENCES `tb_Fornecedores` (`for_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Itens_Compra (Itens_Compra)
-- Diagrama (imagem 4): itc_id, itc_id_produto, itc_quantidade, itc_valor_unitario
--
DROP TABLE IF EXISTS `tb_Itens_Compra`;
CREATE TABLE `tb_Itens_Compra` (
  `itc_id` int NOT NULL AUTO_INCREMENT,
  `itc_id_compra` int NOT NULL,
  `itc_id_produto` int NOT NULL,
  `itc_quantidade` int NOT NULL,
  `itc_valor_unitario` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`itc_id`),
  KEY `fk_itc_compra` (`itc_id_compra`),
  KEY `fk_itc_produto` (`itc_id_produto`),
  CONSTRAINT `fk_itc_compra` FOREIGN KEY (`itc_id_compra`) REFERENCES `tb_Compra` (`com_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_itc_produto` FOREIGN KEY (`itc_id_produto`) REFERENCES `tb_Produtos` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- VENDAS
-- ========================================================

--
-- tb_Vendas (VendasModels)
-- Diagrama (imagens 2, 3, 5): ven_id, ven_id_cliente, ven_data, ven_valor_total,
--   ven_status, ven_desconto
--
DROP TABLE IF EXISTS `tb_Vendas`;
CREATE TABLE `tb_Vendas` (
  `ven_id` int NOT NULL AUTO_INCREMENT,
  `ven_id_cliente` int NOT NULL,
  `ven_data` date NOT NULL,
  `ven_valor_total` double NOT NULL DEFAULT '0',
  `ven_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AGUARDANDO',
  `ven_status_id` int NOT NULL DEFAULT '17',
  `ven_desconto` double NOT NULL DEFAULT '0',
  `ven_metodo_pagamento_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ven_id`),
  KEY `fk_ven_cliente` (`ven_id_cliente`),
  KEY `fk_ven_status` (`ven_status_id`),
  KEY `fk_ven_metodo_pagamento` (`ven_metodo_pagamento_id`),
  CONSTRAINT `fk_ven_cliente` FOREIGN KEY (`ven_id_cliente`) REFERENCES `tb_Usuarios` (`usu_id`),
  CONSTRAINT `fk_ven_metodo_pagamento` FOREIGN KEY (`ven_metodo_pagamento_id`) REFERENCES `tb_status_diversos` (`sta_id`),
  CONSTRAINT `fk_ven_status` FOREIGN KEY (`ven_status_id`) REFERENCES `tb_status_diversos` (`sta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Vendas` WRITE;
INSERT INTO `tb_Vendas` (`ven_id`, `ven_id_cliente`, `ven_data`, `ven_valor_total`, `ven_status`, `ven_status_id`, `ven_desconto`, `ven_metodo_pagamento_id`, `created_at`, `updated_at`) VALUES
(1, 6, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 209.82, 'AGUARDANDO', 17, 0, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 7, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 351.80, 'PAGO', 18, 0, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 8, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 199.70, 'ENTREGUE', 20, 0, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 409.70, 'CANCELADO', 19, 0, 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 7, CURDATE(), 324.32, 'PAGO', 18, 0, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 8, CURDATE(), 322.50, 'AGUARDANDO', 17, 0, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
UNLOCK TABLES;

--
-- tb_Itens_Venda (Itens_Venda)
-- Diagrama (imagens 2, 5): itv_id, itv_id_venda, itv_id_produto, itv_quantidade,
--   itv_subtotal, itv_valor_unitario
--
DROP TABLE IF EXISTS `tb_Itens_Venda`;
CREATE TABLE `tb_Itens_Venda` (
  `itv_id` int NOT NULL AUTO_INCREMENT,
  `itv_id_venda` int NOT NULL,
  `itv_id_produto` int NOT NULL,
  `itv_quantidade` int NOT NULL,
  `itv_subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `itv_valor_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`itv_id`),
  KEY `fk_itv_venda` (`itv_id_venda`),
  KEY `fk_itv_produto` (`itv_id_produto`),
  CONSTRAINT `fk_itv_venda` FOREIGN KEY (`itv_id_venda`) REFERENCES `tb_Vendas` (`ven_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_itv_produto` FOREIGN KEY (`itv_id_produto`) REFERENCES `tb_Produtos` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Itens_Venda` WRITE;
INSERT INTO `tb_Itens_Venda` (`itv_id`, `itv_id_venda`, `itv_id_produto`, `itv_quantidade`, `itv_subtotal`, `itv_valor_unitario`) VALUES
(1, 1, 1, 1, 79.92, 79.92),
(2, 1, 2, 1, 129.90, 129.90),
(3, 2, 3, 2, 197.00, 98.50),
(4, 2, 5, 1, 59.90, 59.90),
(5, 2, 12, 1, 94.90, 94.90),
(6, 3, 9, 2, 139.80, 69.90),
(7, 3, 5, 1, 59.90, 59.90),
(8, 4, 14, 1, 189.90, 189.90),
(9, 4, 11, 1, 139.90, 139.90),
(10, 4, 13, 1, 79.90, 79.90),
(11, 5, 6, 1, 134.50, 134.50),
(12, 5, 8, 1, 109.90, 109.90),
(13, 5, 1, 1, 79.92, 79.92),
(14, 6, 10, 2, 238.00, 119.00),
(15, 6, 15, 1, 84.50, 84.50);
UNLOCK TABLES;

-- ========================================================
-- DEVOLUÇÕES
-- ========================================================

--
-- tb_Devolucoes (DevolucoesModels)
-- Diagrama (imagem 2): dev_id, dev_id_venda, dev_motivo, dev_status_id
--
DROP TABLE IF EXISTS `tb_Devolucoes`;
CREATE TABLE `tb_Devolucoes` (
  `dev_id` int NOT NULL AUTO_INCREMENT,
  `dev_id_venda` int NOT NULL,
  `dev_motivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dev_status_id` int NOT NULL DEFAULT '5',
  PRIMARY KEY (`dev_id`),
  KEY `fk_dev_venda` (`dev_id_venda`),
  KEY `fk_dev_status` (`dev_status_id`),
  CONSTRAINT `fk_dev_venda` FOREIGN KEY (`dev_id_venda`) REFERENCES `tb_Vendas` (`ven_id`),
  CONSTRAINT `fk_dev_status` FOREIGN KEY (`dev_status_id`) REFERENCES `tb_status_diversos` (`sta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Itens_Devolucao (Itens_Devolução)
-- Diagrama (imagem 2): itd_id, itd_id_dev, itd_id_produto, itd_quantidade,
--   itd_subtotal, itd_valor_unitario
--
DROP TABLE IF EXISTS `tb_Itens_Devolucao`;
CREATE TABLE `tb_Itens_Devolucao` (
  `itd_id` int NOT NULL AUTO_INCREMENT,
  `itd_id_dev` int NOT NULL,
  `itd_id_produto` int NOT NULL,
  `itd_quantidade` int NOT NULL,
  `itd_subtotal` int NOT NULL DEFAULT '0',
  `itd_valor_unitario` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`itd_id`),
  KEY `fk_itd_devolucao` (`itd_id_dev`),
  KEY `fk_itd_produto` (`itd_id_produto`),
  CONSTRAINT `fk_itd_devolucao` FOREIGN KEY (`itd_id_dev`) REFERENCES `tb_Devolucoes` (`dev_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_itd_produto` FOREIGN KEY (`itd_id_produto`) REFERENCES `tb_Produtos` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- ENTREGA
-- ========================================================

--
-- tb_Entrega (Entrega)
-- Diagrama (imagem 5): ent_id, ent_id_venda, ent_endereco, ent_status, ent_data_entrega
-- Checkout: cep, endereco, numero, complemento, bairro, cidade, uf
--
DROP TABLE IF EXISTS `tb_Entrega`;
CREATE TABLE `tb_Entrega` (
  `ent_id` int NOT NULL AUTO_INCREMENT,
  `ent_id_venda` int NOT NULL,
  `ent_cep` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ent_endereco` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ent_numero` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ent_complemento` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ent_bairro` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ent_cidade` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ent_uf` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ent_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  `ent_data_entrega` date DEFAULT NULL,
  PRIMARY KEY (`ent_id`),
  KEY `fk_ent_venda` (`ent_id_venda`),
  CONSTRAINT `fk_ent_venda` FOREIGN KEY (`ent_id_venda`) REFERENCES `tb_Vendas` (`ven_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Itens_Entrega (Itens_Entrega)
-- Diagrama (imagem 5): ite_id, ite_id_entrega, ite_id_lote, ite_id_produto,
--   ite_quantidade, ite_sub_total
--
DROP TABLE IF EXISTS `tb_Itens_Entrega`;
CREATE TABLE `tb_Itens_Entrega` (
  `ite_id` int NOT NULL AUTO_INCREMENT,
  `ite_id_entrega` int NOT NULL,
  `ite_id_lote` int NOT NULL,
  `ite_id_produto` int NOT NULL,
  `ite_quantidade` int NOT NULL,
  `ite_sub_total` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`ite_id`),
  KEY `fk_ite_entrega` (`ite_id_entrega`),
  KEY `fk_ite_lote` (`ite_id_lote`),
  KEY `fk_ite_produto` (`ite_id_produto`),
  CONSTRAINT `fk_ite_entrega` FOREIGN KEY (`ite_id_entrega`) REFERENCES `tb_Entrega` (`ent_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ite_lote` FOREIGN KEY (`ite_id_lote`) REFERENCES `tb_Lotes_Estoque` (`lot_id`),
  CONSTRAINT `fk_ite_produto` FOREIGN KEY (`ite_id_produto`) REFERENCES `tb_Produtos` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- SERVIÇOS E AGENDAMENTOS
-- ========================================================

--
-- tb_Servicos (ServicosModels)
-- Diagrama (imagem 1): ser_id, ser_nome, ser_descricao, ser_preco
--
DROP TABLE IF EXISTS `tb_Servicos`;
CREATE TABLE `tb_Servicos` (
  `ser_id` int NOT NULL AUTO_INCREMENT,
  `ser_nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ser_descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ser_preco` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`ser_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Servicos` WRITE;
INSERT INTO `tb_Servicos` VALUES
(1,'Avaliação Física e Composição Corporal','Avaliação completa da composição corporal do cliente.',200.00),
(2,'Consulta Nutricional Inicial','Atendimento inicial voltado para acolhimento e anamnese nutricional.',180.00),
(3,'Montagem de Stack Personalizada de Suplementos','Recomendação estratégica de suplementação com base no objetivo do cliente.',120.00),
(4,'Acompanhamento Nutricional e de Suplementação','Acompanhamento contínuo para revisão de resultados e ajustes.',250.00),
(5,'Orientação Nutricional Pré e Pós-Treino','Orientação sobre estratégias nutricionais antes e após o treino.',90.00),
(6,'Análise de Exames e Suplementação Coadjuvante','Análise complementar de exames laboratoriais.',200.00),
(7,'Plano Corporativo ou Equipe Esportiva','Pacote para empresas ou equipes esportivas.',800.00),
(8,'Workshop ou Mini-Palestra sobre Nutrição e Suplementação','Encontro educativo sobre nutrição e suplementação.',350.00);
UNLOCK TABLES;

--
-- tb_agendamentos (AgendamentosModels)
-- Diagrama (imagem 1): age_id, age_id_cliente, age_id_profissional, age_data_agendamento,
--   age_valor_total, age_observacoes
--
DROP TABLE IF EXISTS `tb_agendamentos`;
CREATE TABLE `tb_agendamentos` (
  `age_id` int NOT NULL AUTO_INCREMENT,
  `age_id_cliente` int NOT NULL,
  `age_id_profissional` int NOT NULL,
  `age_data_agendamento` date NOT NULL,
  `age_valor_total` float NOT NULL DEFAULT '0',
  `age_observacoes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`age_id`),
  KEY `fk_age_cliente` (`age_id_cliente`),
  KEY `fk_age_profissional` (`age_id_profissional`),
  CONSTRAINT `fk_age_cliente` FOREIGN KEY (`age_id_cliente`) REFERENCES `tb_Usuarios` (`usu_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_age_profissional` FOREIGN KEY (`age_id_profissional`) REFERENCES `tb_Usuarios` (`usu_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_agendamentos` WRITE;
INSERT INTO `tb_agendamentos` VALUES
(1,1,4,'2026-03-27',200.00,'Avaliação física inicial','2026-03-26 15:00:00','2026-03-26 15:00:00'),
(2,6,5,'2026-03-27',250.00,'Acompanhamento mensal','2026-03-26 15:10:00','2026-03-26 15:10:00'),
(3,7,12,'2026-03-28',180.00,'Consulta nutricional','2026-03-26 15:20:00','2026-03-26 15:20:00');
UNLOCK TABLES;

--
-- tb_Itens_Agendamento (Itens_Agendamento)
-- Diagrama (imagem 1): ita_id, ita_id_produto, ita_valor_unitario, ita_quantidade
--
DROP TABLE IF EXISTS `tb_Itens_Agendamento`;
CREATE TABLE `tb_Itens_Agendamento` (
  `ita_id` int NOT NULL AUTO_INCREMENT,
  `ita_id_agendamento` int NOT NULL,
  `ita_id_produto` int NOT NULL,
  `ita_valor_unitario` float NOT NULL DEFAULT '0',
  `ita_quantidade` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`ita_id`),
  KEY `fk_ita_agendamento` (`ita_id_agendamento`),
  KEY `fk_ita_produto` (`ita_id_produto`),
  CONSTRAINT `fk_ita_agendamento` FOREIGN KEY (`ita_id_agendamento`) REFERENCES `tb_agendamentos` (`age_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ita_produto` FOREIGN KEY (`ita_id_produto`) REFERENCES `tb_Produtos` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_itens_servicos (ItensServicosModels)
-- Diagrama (imagem 1): its_id_cliente, its_id_profissional, its_id_servico,
--   its_id_agendamento, its_status, its_valor_unitario, its_quantidade, its_valor_total
--
DROP TABLE IF EXISTS `tb_itens_servicos`;
CREATE TABLE `tb_itens_servicos` (
  `its_id` int NOT NULL AUTO_INCREMENT,
  `its_id_cliente` int NOT NULL,
  `its_id_profissional` int NOT NULL,
  `its_id_servico` int NOT NULL,
  `its_id_agendamento` int NOT NULL,
  `its_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  `its_valor_unitario` float NOT NULL DEFAULT '0',
  `its_quantidade` int NOT NULL DEFAULT '1',
  `its_valor_total` float NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`its_id`),
  KEY `fk_its_cliente` (`its_id_cliente`),
  KEY `fk_its_profissional` (`its_id_profissional`),
  KEY `fk_its_servico` (`its_id_servico`),
  KEY `fk_its_agendamento` (`its_id_agendamento`),
  CONSTRAINT `fk_its_agendamento` FOREIGN KEY (`its_id_agendamento`) REFERENCES `tb_agendamentos` (`age_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_its_cliente` FOREIGN KEY (`its_id_cliente`) REFERENCES `tb_Usuarios` (`usu_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_its_profissional` FOREIGN KEY (`its_id_profissional`) REFERENCES `tb_Usuarios` (`usu_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_its_servico` FOREIGN KEY (`its_id_servico`) REFERENCES `tb_Servicos` (`ser_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_itens_servicos` WRITE;
INSERT INTO `tb_itens_servicos` VALUES
(1,1,4,1,1,'finalizado',200.00,1,200.00,'2026-03-26 15:00:00','2026-03-26 15:00:00'),
(2,6,5,4,2,'em_andamento',250.00,1,250.00,'2026-03-26 15:10:00','2026-03-26 15:10:00'),
(3,7,12,2,3,'aprovado',180.00,1,180.00,'2026-03-26 15:20:00','2026-03-26 15:20:00');
UNLOCK TABLES;

-- ========================================================
-- FINANCEIRO
-- ========================================================

--
-- tb_Caixa (Caixa)
-- Diagrama (imagem 3): cx_id, cx_id_responsavel, cx_data_abertura, cx_data_fechamento, cx_valor_total
--
DROP TABLE IF EXISTS `tb_Caixa`;
CREATE TABLE `tb_Caixa` (
  `cx_id` int NOT NULL AUTO_INCREMENT,
  `cx_id_responsavel` int NOT NULL,
  `cx_data_abertura` date NOT NULL,
  `cx_data_fechamento` date DEFAULT NULL,
  `cx_valor_total` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`cx_id`),
  KEY `fk_cx_responsavel` (`cx_id_responsavel`),
  CONSTRAINT `fk_cx_responsavel` FOREIGN KEY (`cx_id_responsavel`) REFERENCES `tb_Usuarios` (`usu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Fluxo_Caixa (FluxoCaixaModels)
-- Diagrama (imagens 1, 3): flu_id, flu_tipo_id, flu_valor, flu_data_movimentacao,
--   flu_descricao
--   Relaciona-se com tb_Caixa (Atualiza). Vendas e compras sao vinculadas por tabelas ponte.
--
DROP TABLE IF EXISTS `tb_Fluxo_Caixa`;
CREATE TABLE `tb_Fluxo_Caixa` (
  `flu_id` int NOT NULL AUTO_INCREMENT,
  `flu_tipo_id` int NOT NULL,
  `flu_valor` float NOT NULL DEFAULT '0',
  `flu_data_movimentacao` date NOT NULL,
  `flu_descricao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `flu_id_caixa` int DEFAULT NULL,
  PRIMARY KEY (`flu_id`),
  KEY `fk_flu_tipo` (`flu_tipo_id`),
  KEY `fk_flu_caixa` (`flu_id_caixa`),
  CONSTRAINT `fk_flu_tipo` FOREIGN KEY (`flu_tipo_id`) REFERENCES `tb_status_diversos` (`sta_id`),
  CONSTRAINT `fk_flu_caixa` FOREIGN KEY (`flu_id_caixa`) REFERENCES `tb_Caixa` (`cx_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tb_Fluxo_Caixa` WRITE;
INSERT INTO `tb_Fluxo_Caixa` (`flu_id`, `flu_tipo_id`, `flu_valor`, `flu_data_movimentacao`, `flu_descricao`, `flu_id_caixa`) VALUES
(1,9,150.00,DATE_ADD(CURDATE(), INTERVAL 10 DAY),'Despesa - próximo 30d',NULL),
(2,9,180.00,DATE_ADD(CURDATE(), INTERVAL 35 DAY),'Despesa - próximo 60d',NULL),
(3,9,220.00,DATE_ADD(CURDATE(), INTERVAL 70 DAY),'Despesa - próximo 90d',NULL),
(4,8,250.00,DATE_ADD(CURDATE(), INTERVAL 10 DAY),'Receita - próximo 30d',NULL),
(5,8,280.00,DATE_ADD(CURDATE(), INTERVAL 35 DAY),'Receita - próximo 60d',NULL),
(6,8,320.00,DATE_ADD(CURDATE(), INTERVAL 70 DAY),'Receita - próximo 90d',NULL),
(7,9,120.00,DATE_ADD(CURDATE(), INTERVAL 5 DAY),'Aluguel',NULL),
(8,9,500.00,DATE_ADD(CURDATE(), INTERVAL 15 DAY),'Contas de luz',NULL),
(9,8,350.00,DATE_ADD(CURDATE(), INTERVAL 20 DAY),'Venda curso online',NULL),
(10,8,450.00,DATE_ADD(CURDATE(), INTERVAL 40 DAY),'Serviço de consultoria',NULL),
(11,9,100.00,DATE_ADD(CURDATE(), INTERVAL 25 DAY),'Manutenção de equipamentos',NULL),
(12,8,220.00,DATE_ADD(CURDATE(), INTERVAL 12 DAY),'Mensalidade',NULL);
UNLOCK TABLES;

--
-- tb_Fluxo_Caixa_Venda
-- Vincula lancamentos financeiros de receita as vendas.
--
DROP TABLE IF EXISTS `tb_Fluxo_Caixa_Venda`;
CREATE TABLE `tb_Fluxo_Caixa_Venda` (
  `fcv_id` int NOT NULL AUTO_INCREMENT,
  `fcv_id_fluxo` int NOT NULL,
  `fcv_id_venda` int NOT NULL,
  PRIMARY KEY (`fcv_id`),
  UNIQUE KEY `uk_fcv_fluxo` (`fcv_id_fluxo`),
  KEY `fk_fcv_venda` (`fcv_id_venda`),
  CONSTRAINT `fk_fcv_fluxo` FOREIGN KEY (`fcv_id_fluxo`) REFERENCES `tb_Fluxo_Caixa` (`flu_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fcv_venda` FOREIGN KEY (`fcv_id_venda`) REFERENCES `tb_Vendas` (`ven_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- tb_Fluxo_Caixa_Compra
-- Vincula lancamentos financeiros de despesa as compras.
--
DROP TABLE IF EXISTS `tb_Fluxo_Caixa_Compra`;
CREATE TABLE `tb_Fluxo_Caixa_Compra` (
  `fcc_id` int NOT NULL AUTO_INCREMENT,
  `fcc_id_fluxo` int NOT NULL,
  `fcc_id_compra` int NOT NULL,
  PRIMARY KEY (`fcc_id`),
  UNIQUE KEY `uk_fcc_fluxo` (`fcc_id_fluxo`),
  KEY `fk_fcc_compra` (`fcc_id_compra`),
  CONSTRAINT `fk_fcc_fluxo` FOREIGN KEY (`fcc_id_fluxo`) REFERENCES `tb_Fluxo_Caixa` (`flu_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fcc_compra` FOREIGN KEY (`fcc_id_compra`) REFERENCES `tb_Compra` (`com_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump atualizado conforme diagramas de classes - 2026-06-14
