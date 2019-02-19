import React from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/es/CssBaseline";
import ButtonAppBar from "./ButtonAppBar/ButtonAppBar";
import {PdfFilePicker} from "./PdfFilePicker/PdfFilePicker";

export function App() {
  return (
    <div className="App">
      <CssBaseline/>
      <ButtonAppBar/>
      <PdfFilePicker/>
    </div>
  );
}
