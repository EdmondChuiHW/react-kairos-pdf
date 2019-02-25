import React, {Suspense, useState} from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/es/CssBaseline";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar";
import {PdfFilePicker} from "./components/PdfFilePicker/PdfFilePicker";
import {Loading} from "./components/Loading/Loading";
import {RawPage} from "./components/RawPage/RawPage";

export function App() {
  const [pages, setPages] = useState(null);
  //pages
  // (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  // 0:
  // meta: {discarded: {…}, errors: {…}}
  // result:
  // rows: (11) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  // session: {sessionNumber: 1, date: Moment}
  return (
    <div className="App">
      <CssBaseline/>
      <Suspense fallback={<Loading/>}>
        <ButtonAppBar/>
        {!!pages
          ? pages.map(page => {
            return <RawPage
              key={page.result.session.sessionNumber}
              rows={page.result.rows}
              session={page.result.session}
              errors={page.meta.errors}
            />;
          })
          : <PdfFilePicker onPagesLoaded={setPages}/>
        }
      </Suspense>
    </div>
  );
}
