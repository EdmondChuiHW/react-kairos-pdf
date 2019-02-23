import React, {Suspense} from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/es/CssBaseline";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar";
import {PdfFilePicker} from "./components/PdfFilePicker/PdfFilePicker";
import {Loading} from "./components/Loading/Loading";

export function App() {
  return (
    <div className="App">
      <CssBaseline/>
      <Suspense fallback={<Loading/>}>
        <ButtonAppBar/>
        <PdfFilePicker/>
      </Suspense>
    </div>
  );
}
