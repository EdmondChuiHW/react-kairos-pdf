import React from 'react';
import './App.css';
import {DropzoneArea} from "material-ui-dropzone";
import {useTranslation} from "react-i18next";
import CssBaseline from "@material-ui/core/es/CssBaseline";

export function App() {
  const {t, i18n} = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="App">
      <CssBaseline/>
      <h1>{t('title')}</h1>
      <button onClick={() => changeLanguage('en')}>en</button>
      <button onClick={() => changeLanguage('zh-hk')}>zh-hk</button>
      <button onClick={() => changeLanguage('zh-cn')}>zh-cn</button>
      <DropzoneArea/>
    </div>
  );
}
