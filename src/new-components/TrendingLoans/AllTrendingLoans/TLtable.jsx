import React, { useState, useEffect } from "react";
import "../../../styles/newstyles/table.css";
import TLtableRow from "./TLtableRow";

const TLtable = ({ loanData }) => {
  useEffect(() => {
    setallloans(loanData);
  }, [loanData]);

  const [allloans, setallloans] = useState(loanData);
  console.log(allloans);
  return (
    <div className="table-wrapper" id="#scrollBar">
      <table className="fl-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Logo</th>
            <th>Name</th>
            <th>Interest</th>
            <th>Description</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loanData &&
            allloans.map((loan, index) => {
              return (
                <TLtableRow
                  key={index}
                  index={index}
                  loan={loan}
                  allloans={allloans}
                  setallloans={setallloans}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TLtable;
