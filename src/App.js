import React, {Suspense, useState} from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/es/CssBaseline";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar";
import {PdfFilePicker} from "./components/PdfFilePicker/PdfFilePicker";
import {Loading} from "./components/Loading/Loading";
import {TableByCategories} from "./components/TableByCategories/TableByCategories";
import {TableBySessions} from "./components/TableBySessions/TableBySessions";

export function App() {
  const [result, setResult] = useState(null);
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
          ? <>
            <TableByCategories {...result}/>
            <TableBySessions {...result}/>
            {/*{*/}
            {/*result.sessions.map((session, sessionIndex) => {*/}
            {/*const rows = filter(propEq('sessionIndex', sessionIndex), result.rows);*/}
            {/*return <RawPage*/}
            {/*key={sessionIndex}*/}
            {/*rows={rows}*/}
            {/*session={session}*/}
            {/*errors={[]}*/}
            {/*/>;*/}
            {/*})*/}
            {/*}*/}
          </>
          : <PdfFilePicker onResultLoaded={setResult}/>
        }
      </Suspense>
    </div>
  );
}
