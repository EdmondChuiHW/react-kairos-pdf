import React from "react";
import './TimeRow.css';

export function TimeRow(props) {
  const {errors, startTime, declaredDuration, activityTexts, facilitator} = props;
  const hasErrors = errors && errors.length;
  return <tr className={hasErrors ? 'with-errors' : ''}>
    <td>{startTime.format('H:mm')}</td>
    <td>{declaredDuration.isValid() ? declaredDuration.asMinutes() : ''}</td>
    <td>{activityTexts.map((t, i) => <div key={i}>{t}</div>)}</td>
    <td>{facilitator}</td>
  </tr>;
}
