import React, { useState, useEffect } from 'react';
import BtableRow from './BtableRow';
import '../../../styles/newstyles/table.css';

const Btable = ({ blogData }) => {
  useEffect(() => {
    setallblogs(blogData);
  }, [blogData]);

  const [allblogs, setallblogs] = useState(blogData);
  return (
    <div className="table-wrapper" id="#scrollBar">
      <table className="fl-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Author</th>
            <th>Date</th>
            <th>Feature</th>
            <th>Read Time</th>
            <th>Title</th>
            <th>Category</th>
            <th style={{ textAlign: 'center' }}>Blog Picture</th>
            <th style={{ textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {blogData &&
            allblogs.map((blog, index) => {
              return (
                <BtableRow
                  key={index}
                  index={index}
                  blog={blog}
                  allblogs={allblogs}
                  setallblogs={setallblogs}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Btable;
