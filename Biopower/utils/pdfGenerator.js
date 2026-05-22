import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
  * Instância responsável por gerar o PDF.
  * É necessário chamar `.init()` para inicializar a instância.
 */
/*Ela precisa de 2 parametros sendo { content, config }.
 * O content é esperado um objeto com as informações.
 * O config é esperado um objeto com as configurações do PDF.*/
class PdfGenerator {
    // #pdfDoc;
    // #pdfFont;
    // #pdfPage;
    // #width;
    // #height;
    // #pdfBytes;

    // async init() {
    //     this.#pdfDoc = await PDFDocument.create();

    //     this.#pdfFont = await this.#pdfDoc.embedFont(
    //         StandardFonts.TimesRoman
    //     );

    //     this.#pdfPage = this.#pdfDoc.addPage();

    //     const { width, height } = this.#pdfPage.getSize();

    //     this.#width = width;
    //     this.#height = height;
    // }

    // async save() {
    //     this.#pdfBytes = await this.#pdfDoc.save();

    //     return this.#pdfBytes;
    // }
}

export { PdfGenerator };