
import React from 'react';
import moment from 'moment/moment';
const AAtablerow = ({ index, expert }) => {
  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{expert.name}</td>
        <td>{expert.number}</td>
        <td>{expert.email}</td>
        <td>{expert.experience}</td>
        <td>{expert.previousIndustry}</td>
        <td>{expert.cv}</td>
        <td>{moment(expert.createdAt).format('MM/DD/YYYY')}</td>
      </tr>
    </>
  );
};

export default AAtablerow;
