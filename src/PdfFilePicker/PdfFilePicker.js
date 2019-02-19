import React, {useEffect, useState} from 'react';
import {DropzoneArea} from "material-ui-dropzone";
import {readFileAsArrayBuffer} from "../Utils";
import {useTranslation} from "react-i18next";
import Snackbar from "@material-ui/core/es/Snackbar";
import {finalize, switchMap} from "rxjs/operators";
import CircularProgress from "@material-ui/core/es/CircularProgress";
import "./PdfFilePicker.css";
import {readBufferToPages} from "../libs/karios-pdf-parser";

export function PdfFilePicker() {
  const {t} = useTranslation();
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    const sub = readFileAsArrayBuffer(file)
      .pipe(
        switchMap(readBufferToPages),
        finalize(() => setIsLoading(false)),
      )
      .subscribe(pages => {
        console.log('pages', pages);

      }, error => {
        console.error(error);
        setSnackBarMessage(t('uploadFileFailed'));
      });

    return () => sub.unsubscribe();
  }, [file]);

  const onDrop = file => {
    setIsLoading(true);
    setFile(file);
  };

  const onDropRejected = () => {
    setSnackBarMessage(t('uploadFileFailed'));
  };

  return (
    <div className="pdf-file-picker">
      {isLoading
        ? <div className="loading-container"><CircularProgress/></div>
        : <DropzoneArea
          dropZoneClass="drop-zone"
          filesLimit={1}
          acceptedFiles={['application/pdf']}
          dropzoneText={t('uploadFilePrompt')}
          showPreviewsInDropzone={true}
          showFileNamesInPreview={true}
          showAlerts={false}
          onDrop={onDrop}
          onDropRejected={onDropRejected}/>
      }
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!snackBarMessage}
        autoHideDuration={5000}
        onClose={() => setSnackBarMessage('')}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{snackBarMessage}</span>}
      />
    </div>
  );
}
