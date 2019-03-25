import React, {Suspense, useEffect, useState} from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/es/CssBaseline";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar";
import {PdfFilePicker} from "./components/PdfFilePicker/PdfFilePicker";
import {Loading} from "./components/Loading/Loading";
import {TableByCategories} from "./components/TableByCategories/TableByCategories";
import {TableBySessions} from "./components/TableBySessions/TableBySessions";
import {TableExport} from "tableexport";
import "tableexport/dist/css/tableexport.min.css";
import Typography from "@material-ui/core/Typography";

export function App() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (result) {
      new TableExport(document.getElementsByTagName("table"), {
        bootstrap: true,
        trimWhitespace: false,
        formats: ['xlsx'],
      });
    }
  });
  //pages
  // (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  //
  //   0:
  //     rows: (11) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  //     sessions: {sessionNumber: 1, date: Moment}
  return (
    <div className="App">
      <CssBaseline/>
      <Suspense fallback={<Loading/>}>
        <ButtonAppBar/>
        {!!result
          ? <div style={{textAlign: 'center'}}>
            <div className="container">
              <Typography variant="h5" gutterBottom>
                Schedule by Facilitator
              </Typography>
              <TableByCategories {...result}/>
            </div>
            <div className="container">
              <Typography variant="h5" gutterBottom>
                Schedule by Session
              </Typography>
              <TableBySessions {...result}/>
            </div>
          </div>
          : <PdfFilePicker onResultLoaded={setResult}/>
        }
      </Suspense>
    </div>
  );
}
