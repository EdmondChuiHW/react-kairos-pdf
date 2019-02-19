import {Observable, throwError} from "rxjs";

export const readFileAsArrayBuffer = (file) => {
  if (!file) {
    return throwError(new Error(`file cannot be undefined`));
  }
  return new Observable(subscriber => {
    const reader = new FileReader();
    reader.onload = () => {
      subscriber.next(reader.result);
      subscriber.complete();
    };
    reader.onerror = ev => {
      subscriber.error(ev);
    };
    reader.readAsArrayBuffer(file);
    return () => reader.abort();
  });
};
