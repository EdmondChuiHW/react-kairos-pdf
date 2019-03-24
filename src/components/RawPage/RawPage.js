import React from "react";
import {TimeRow} from "../TimeRow/TimeRow";
import './RawPage.css';
import {useTranslation} from "react-i18next";

export function RawPage(props) {
  const {rows, session} = props;
  const [t] = useTranslation();
  return <div className="raw-page">
    <h2>{t('sessionTitle', {num: session.sessionNumber})}</h2>
    <h3>{session.date.format('ddd ll')}</h3>
    <table>
      <thead>
      <tr>
        <th>
          {t('time')}
        </th>
        <th>
          {t('duration')}
        </th>
        <th>
          {t('activity')}
        </th>
        <th>
          {t('facilitator')}
        </th>
      </tr>
      </thead>
      <tbody>
      {rows.map((row, index) => (
        <TimeRow
          key={index}
          {...row}
        />
      ))}
      </tbody>
    </table>
  </div>;
}
