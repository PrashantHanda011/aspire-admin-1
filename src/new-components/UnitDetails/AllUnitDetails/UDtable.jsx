import React, { useState, useEffect } from "react";
import "../../../styles/newstyles/table.css";
import UDtableRow from "./UDtableRow";

const UDtable = ({ unitDetailsData, propid }) => {
  const [allUnitDetails, setallUnitDetails] = useState(unitDetailsData);

  useEffect(() => {
    setallUnitDetails(unitDetailsData);
  }, [unitDetailsData]);
  console.log(allUnitDetails);
  return (
    <>
      {allUnitDetails && unitDetailsData.unitDetails ? (
        <div className="table-wrapper" id="#scrollBar">
          <table className="fl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>BHK</th>
                <th>Range</th>
                <th>Size</th>
                <th>Price</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUnitDetails &&
                allUnitDetails.unitDetails &&
                allUnitDetails.unitDetails.map((unitdetail, index) =>
                  unitdetail.detail.map((detaildata, i) => {
                    return (
                      <UDtableRow
                        key={index}
                        index={index}
                        propid={propid}
                        bhk={unitdetail.bhk}
                        detaildata={detaildata}
                        allUnitDetails={allUnitDetails}
                        setallUnitDetails={setallUnitDetails}
                      />
                    );
                  })
                )}
            </tbody>
          </table>
        </div>
      ) : (
        <h6 className="text-center">No details available</h6>
      )}
    </>
  );
};

export default UDtable;
