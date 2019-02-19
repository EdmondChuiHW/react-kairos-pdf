var PDFJS = null;

function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  //ret.text = ret.text ? ret.text : "";

  let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false
  };

  return pageData.getTextContent(render_options)
    .then(function (textContent) {
      let lastY = null;
      let text = '';
      //https://github.com/mozilla/pdf.js/issues/8963
      //https://github.com/mozilla/pdf.js/issues/2140
      //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
      //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
      for (let item of textContent.items) {
        if (!lastY || lastY === item.transform[5]) {
          text += item.str;
        } else {
          text += '\n' + item.str;
        }
        lastY = item.transform[5];
      }
      //let strings = textContent.items.map(item => item.str);
      //let text = strings.join("\n");
      //text = text.replace(/[ ]+/ig," ");
      //ret.text = `${ret.text} ${text} \n\n`;
      return text;
    });
}

const DEFAULT_OPTIONS = {
  pagerender: render_page,
  max: 0,
};

async function PDF(dataBuffer, options) {
  let ret = {
    numpages: 0,
    numrender: 0,
    info: null,
    metadata: null,
    text: "",
    version: null
  };

  if (typeof options == 'undefined') options = DEFAULT_OPTIONS;
  if (typeof options.pagerender != 'function') options.pagerender = DEFAULT_OPTIONS.pagerender;
  if (typeof options.max != 'number') options.max = DEFAULT_OPTIONS.max;

  PDFJS = PDFJS ? PDFJS : require(`pdfjs-dist`);

  ret.version = PDFJS.version;

  // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).
  // PDFJS.disableWorker = true;
  // see postinstall in package.json
  PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
  let doc = await PDFJS.getDocument(dataBuffer);
  ret.numpages = doc.numPages;

  let metaData = await doc.getMetadata().catch(function (err) {
    console.error(err);
    return null;
  });

  ret.info = metaData ? metaData.info : null;
  ret.metadata = metaData ? metaData.metadata : null;

  let counter = options.max <= 0 ? doc.numPages : options.max;
  counter = counter > doc.numPages ? doc.numPages : counter;

  ret.text = "";
  ret.raw = [];

  for (var i = 1; i <= counter; i++) {
    let rendered = await doc.getPage(i).then(pageData => options.pagerender(pageData)).catch((err) => {
      console.error(err);
      return "";
    });

    ret.raw.push(rendered);
    ret.text = `${ret.text}\n\n${rendered}`;
  }

  ret.numrender = counter;
  doc.destroy();

  return ret;
}

export default PDF;
