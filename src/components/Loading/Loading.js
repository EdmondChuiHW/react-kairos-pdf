import React from 'react';
import CircularProgress from "@material-ui/core/es/CircularProgress";
import "./Loading.css";

export function Loading() {
  return <div className="loading-container"><CircularProgress/></div>
}
