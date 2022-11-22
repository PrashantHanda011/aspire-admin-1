import React from 'react';
import AAtablerow from './AAtablerow';
import '../../../styles/newstyles/table.css';

const AAtable = ({ expertData }) => {
  return (
    <div className="table-wrapper" id="#scrollBar">
      <table className="fl-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Position</th>
            <th>Experience</th>
            <th>Previous Industry</th>
            <th>Resumes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expertData &&
            expertData.map((expert, index) => {
              return <AAtablerow key={index} index={index} expert={expert} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AAtable;
