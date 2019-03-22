import pdf from "./pdf-parse";
import {from} from "rxjs";
import {makeHandlePage} from "./handle-page";
import {handleSession} from "./handle-session";
import {flip, pipe} from "ramda";

const pdfOptionThenBuffer = flip(pdf);

const renderOptions = {
  normalizeWhitespace: true,
  disableCombineTextItems: true,
};

const renderPage = pageData => pageData
  .getTextContent(renderOptions)
  .then(makeHandlePage(handleSession));

export const readBufferToPages = pipe(
  pdfOptionThenBuffer({pagerender: renderPage}),
  from,
);
