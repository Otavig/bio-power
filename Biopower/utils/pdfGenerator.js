const PDFDocument = require("pdfkit");
const path = require("path");

class PdfGenerator {
    constructor(content = {}, config = {}) {
        this.content = content;
        this.config = config;
        this.doc = null;

        this.theme = {
            colors: {
                primary: "#E53935",
                primaryDark: "#C62828",
                text: "#222",
                muted: "#666",
                tableHeader: "#E53935",
                rowOdd: "#f8f8f8",
                rowEven: "#ffffff",
                white: "#fff",
            },
            font: {
                title: 18,
                subtitle: 11,
                text: 10,
                small: 9,
            },
        };

        this.logo = {
            file: path.join(__dirname, "../public/assets/imgs/img-logo-bio-power.png"),
            width: 150,
            height: 100,
        };
    }

    async gerar() {
        this.doc = new PDFDocument({
            size: this.config.size || "A4",
            margin: this.config.margin || 50,
        });

        const partes = [];
        this.doc.on("data", c => partes.push(c));

        const resultado = new Promise((resolve, reject) => {
            this.doc.on("end", () => resolve(Buffer.concat(partes)));
            this.doc.on("error", reject);
        });

        this.construir();
        this.doc.end();

        return resultado;
    }

    async generate() {
        return this.gerar();
    }


    definirFonte(size, color = this.theme.colors.text, bold = false) {
        this.doc
            .fillColor(color)
            .font(bold ? "Helvetica-Bold" : "Helvetica")
            .fontSize(size);
    }

    texto(txt, x, y, opts = {}) {
        this.doc.text(txt, x, y, {
            lineBreak: true,
            ...opts,
        });
    }

    caixa(x, y, w, h, color) {
        this.doc.save().rect(x, y, w, h).fill(color).restore();
    }

    larguraPagina() {
        const { left, right } = this.doc.page.margins;
        return this.doc.page.width - left - right;
    }

    construir() {
        this.desenharCabecalho();
        this.desenharFiltros();
        this.desenharTabela();
        this.desenharRodape();
    }
    
    desenharCabecalho() {
        const { title = "Relatório", subtitle = "" } = this.content;

        const esquerda = this.doc.page.margins.left;
        const largura = this.larguraPagina();

        const cabecalhoY = this.doc.y;

        this.caixa(esquerda, cabecalhoY, largura, 18, this.theme.colors.primary);

        const conteudoY = cabecalhoY + 22;

        this.definirFonte(14, "#ff0000", true);
        this.texto(
            "Bio-Power",
            esquerda, 
            conteudoY - 0
        );

        this.definirFonte(this.theme.font.title, this.theme.colors.text, true);
        this.texto(title, esquerda, conteudoY + 30);

        if (subtitle) {
            this.doc.moveDown(0.3);
            this.definirFonte(this.theme.font.subtitle, this.theme.colors.muted);
            this.texto(subtitle, esquerda);
        }

        this.doc.moveDown(1.2);
    }

    desenharFiltros() {
        const filtros = this.content.filters || [];
        if (!filtros.length) return;

        this.definirFonte(10, "#444", true);
        this.texto("Filtros aplicados:");

        this.definirFonte(9, this.theme.colors.text);

        filtros.forEach(f => {
            this.texto(`${f.label}: ${f.value}`);
        });

        this.doc.moveDown(0.5);
    }

    desenharTabela() {
        const { columns = [], rows = [], summary } = this.content;

        if (!columns.length || !rows.length) {
            if (summary) {
                this.definirFonte(10);
                this.texto(summary);
            }
            return;
        }

        const esquerda = this.doc.page.margins.left;
        const largura = this.larguraPagina();

        const padding = 5;
        const alturaMinima = 20;

        const largurasColuna = columns.map(() => largura / columns.length);

        let x = esquerda;
        let y = this.doc.y;

        this.definirFonte(10, "#fff", true);

        columns.forEach((col, i) => {
            this.caixa(x, y, largurasColuna[i], alturaMinima, this.theme.colors.tableHeader);

            this.texto(col.label || col.key, x + padding, y + 5, {
                width: largurasColuna[i] - padding * 2,
            });

            x += largurasColuna[i];
        });

        y += alturaMinima;

        rows.forEach((row, i) => {
            const fill = i % 2
                ? this.theme.colors.rowEven
                : this.theme.colors.rowOdd;

            x = esquerda;

            this.definirFonte(9);

            let alturaLinha = alturaMinima;

            columns.forEach((col, j) => {
                const value = this.formatar(row[col.key], col.format);

                const h = this.doc.heightOfString(value, {
                    width: largurasColuna[j] - padding * 2,
                });

                alturaLinha = Math.max(alturaLinha, h + 10);
            });

            this.caixa(x, y, largura, alturaLinha, fill);

            columns.forEach((col, j) => {
                const value = this.formatar(row[col.key], col.format);

                this.texto(value, x + padding, y + 5, {
                    width: largurasColuna[j] - padding * 2,
                });

                x += largurasColuna[j];
            });

            y += alturaLinha;
        });

        this.doc.y = y + 10;
    }

    desenharRodape() {
        if (!this.content.footer) return;

        const esquerda = this.doc.page.margins.left;
        const largura = this.larguraPagina();
        const y = this.doc.page.height - 70;

        this.doc
            .strokeColor("#ddd")
            .moveTo(esquerda, y)
            .lineTo(esquerda + largura, y)
            .stroke();

        this.definirFonte(9, this.theme.colors.muted);
        this.texto(this.content.footer, esquerda, y + 10, {
            width: largura,
            align: "center",
        });
    }

    formatar(value, formato) {
        if (value == null) return "";

        if (typeof formato === "function") return formato(value);

        if (formato === "date") {
            return new Date(value).toLocaleDateString("pt-BR");
        }

        if (formato === "currency") {
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(value);
        }

        return String(value);
    }
}

module.exports = { PdfGenerator };