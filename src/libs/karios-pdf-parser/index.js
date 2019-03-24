import pdf from "./pdf-parse";
import {from} from "rxjs";
import {handleSession} from "./handle-session";
import {flip, pipe} from "ramda";
import {oldHandlePage} from "./handle-page/handle-page";

const pdfOptionThenBuffer = flip(pdf);

const renderOptions = {
  normalizeWhitespace: true,
  disableCombineTextItems: true,
};

const renderPage = pageData => pageData
  .getTextContent(renderOptions)
  .then(oldHandlePage(handleSession));

export const readBufferToPages = pipe(
  pdfOptionThenBuffer({pagerender: renderPage}),
  from,
);
