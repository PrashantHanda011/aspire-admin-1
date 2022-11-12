import React, { useState, useEffect } from 'react';
import LoadingPage from '../utils/LoadingPage';
import searchIcon from '../../images/searchIcon.svg';
import '../../styles/newstyles/expert.css';
import AAtable from './AllApplication/AAtable';
import { getAllCareerApplication, getAllExperts } from '../../redux/api';
import { CSVLink, CSVDownload } from "react-csv";


const Application = () => {
  const [AllApplication, setAllApplication] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [filterData, setfilterData] = useState([]);

  const fetchexpertList = async () => {
    setLoading(true);
    try {
      const res = await getAllCareerApplication();
      setAllApplication(res.data.data);
      console.log(res.data.data)
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchexpertList();
  }, []);

  const searchItems = (searchValue) => {
    setsearchInput(searchValue);
    if (searchValue !== '') {
      let filteredData = AllApplication.filter((item) => {
        return Object.values(item)
          .join('')
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setfilterData(filteredData);
    } else {
      setfilterData(AllApplication);
    }
  };

  return (
    <div className="expert-container">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="expert-firstSection">
            <div className="expert-searchDiv">
              <img src={searchIcon} alt="search" className="searchIcon" />
              <input
                type="text"
                placeholder="Enter a Title , Author or Category"
                className="expert-searchInput"
                id="searchInput"
                value={searchInput}
                onChange={(e) => searchItems(e.target.value)}
              />
            </div>
            <CSVLink data={AllApplication} filename={"AllApplication.csv"}>
              <button className='btn btn-primary'>Export</button>
          </CSVLink>;
          </div>
          <div className="expert-tableSection">
            {searchInput.length ? (
              <AAtable expertData={filterData} />
            ) : (
              <AAtable expertData={AllApplication} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Application;
