import React, { useState, useEffect } from "react";
import PtableRow from "./PtableRow";
import "../../../styles/newstyles/table.css";

const Btable = ({ propertyData }) => {
  useEffect(() => {
    setallproperty(propertyData);
  }, [propertyData]);

  const [allproperty, setallproperty] = useState(propertyData);
  return (
    <div className="table-wrapper" id="#scrollBar">
      <table className="fl-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Order</th>
            <th>Location</th>
            <th>Area</th>
            <th>Ready To Move</th>
            <th>Units Left</th>
            <th>Price Range</th>
            <th style={{ textAlign: "center" }}>Unit Details</th>
            <th style={{ textAlign: "center" }}>Developer</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {propertyData &&
            allproperty.map((property, index) => {
              return (
                <PtableRow
                  key={index}
                  index={index}
                  property={property}
                  allproperty={allproperty}
                  setallproperty={setallproperty}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Btable;
