import React, {useMemo} from "react";
import {TimeRow} from "../TimeRow/TimeRow";
import './TableByNames.css';
import {useTranslation} from "react-i18next";
import {forEach, map} from 'lodash-es';

// pages
// pages[0].result.facilitatorToRows
// pages[0].result.rows
// pages[0].result.session

/*
Flavius Mui: (3) [4, 5, 6]
Hubert Chau: (3) [5, 6, 8]
Lo Lo Yue: (5) [0, 3, 5, 6, 9]
Qing Jun Zhang: (3) [5, 6, 7]
Wei Yang: (4) [1, 2, 5, 6]

Edmond Chui: (3) [5, 6, 7]
Flavius Mui: (3) [1, 5, 6]
Lo Lo Yue: (6) [0, 4, 5, 6, 8, 9]
Qing Jun Zhang: (3) [2, 5, 6]
Wei Yang: (3) [3, 5, 6]
*/

function reduceIndexes(pages) {
  return pages.reduce((memo, page, pageIndex) => {
    const existing = page.result.facilitatorToRows;
    forEach(existing, (rows, name) => {
      if (!memo[name]) {
        memo[name] = [];
      }
      memo[name][pageIndex] = rows;
    });
    return memo;
  }, {});  // name -> [sessions[rows]]
}

export function TableByNames(props) {
  const {pages} = props;
  const [t] = useTranslation();
  const nameToSessionRowsMap = useMemo(() => reduceIndexes(pages), [pages]);
  return <div className="table-by-names">
    {map(nameToSessionRowsMap, (sessionsRows, name) => {
      return <div key={name}>
        <h2>{name}</h2>
        {sessionsRows.map((rowIndexes, sessionIndex) => {
          const page = pages[sessionIndex];
          const session = page.result.session;
          return <div key={sessionIndex}>
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
              {rowIndexes.map((rowI, index) => {
                const row = page.result.rows[rowI];
                const errors = page.meta.errors.rows[rowI];
                !row && console.error("row", row, rowIndexes, sessionsRows, name);
                return (
                  <TimeRow
                    key={index}
                    errors={errors}
                    {...row}
                  />
                );
              })}
              </tbody>
            </table>
          </div>;
        })}
      </div>;
    })}
  </div>;
}
