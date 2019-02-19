import React from 'react';
import './App.css';
import {DropzoneArea} from "material-ui-dropzone";
import CssBaseline from "@material-ui/core/es/CssBaseline";
import ButtonAppBar from "./ButtonAppBar/ButtonAppBar";

export function App() {
  return (
    <div className="App">
      <CssBaseline/>
      <ButtonAppBar/>
      <DropzoneArea/>
    </div>
  );
}
