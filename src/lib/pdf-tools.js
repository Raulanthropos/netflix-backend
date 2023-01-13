import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";
import { selectMedia } from "./media-tools.js";

export const createMediaPdf = async (id) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const selectedMedia = await selectMedia(id);

  const mediaPosterBase64 = await imageToBase64(selectedMedia.poster);
  const mediaPosterImage = "data:image/jpeg;base64," + mediaPosterBase64;

  const docDefinition = {
    content: [
      {
        image: "mediaPoster",
        width: 450,
        alignment: "center",
      },
      {
        text: "\n" + selectedMedia.title + "\n\n",
        style: "header",
        alignment: "center",
      },
      {
        text: "\n" + selectedMedia.year + "\n\n",
        style: "subheader",
        alignment: "center",
      },
      {
        text: selectedMedia.type,
        alignment: "center",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
      defaultStyle: {
        font: "Helvetica",
      },
    },
    images: {
      mediaPoster: mediaPosterImage,
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);

  pdfReadableStream.end();

  return pdfReadableStream;
};