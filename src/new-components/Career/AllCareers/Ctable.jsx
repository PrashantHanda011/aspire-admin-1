import React, { useState, useEffect } from 'react';
import '../../../styles/newstyles/table.css';
import CtableRow from './CtableRow';
const Ctable = ({ careerData }) => {
  useEffect(() => {
    setallcareers(careerData);
  }, [careerData]);

  const [allcareers, setallcareers] = useState(careerData);
  return (
    <div className="table-wrapper" id="#scrollBar">
      <table className="fl-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Experience</th>
            <th>Location</th>
            <th style={{ textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {careerData &&
            allcareers.map((career, index) => {
              return (
                <CtableRow
                  key={index}
                  index={index}
                  career={career}
                  allcareers={allcareers}
                  setallcareers={setallcareers}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Ctable;
