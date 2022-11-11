import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingPage from '../utils/LoadingPage';
import addIcon from '../../images/addIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import '../../styles/newstyles/requirement.css';
import Rtable from './AllRequirements/Rtable';
import { getAllRequirements } from '../../redux/api';
import { CSVLink, CSVDownload } from "react-csv";

const Requirements = () => {
  const history = useHistory();
  const [allrequirementData, setallrequirementData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [filterData, setfilterData] = useState([]);

  const fetchrequirementList = async () => {
    setLoading(true);
    try {
      const res = await getAllRequirements();
      setallrequirementData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchrequirementList();
  }, []);

  const searchItems = (searchValue) => {
    setsearchInput(searchValue);
    if (searchValue !== '') {
      let filteredData = allrequirementData.filter((item) => {
        return Object.values(item)
          .join('')
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setfilterData(filteredData);
    } else {
      setfilterData(allrequirementData);
    }
  };

  return (
    <div className="requirement-container">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="requirement-firstSection">
            <div className="requirement-searchDiv">
              <img src={searchIcon} alt="search" className="searchIcon" />
              <input
                type="text"
                placeholder="Enter a Title , Author or Category"
                className="requirement-searchInput"
                id="searchInput"
                value={searchInput}
                onChange={(e) => searchItems(e.target.value)}
              />
            </div>

            <div>
            <CSVLink data={allrequirementData} filename="Requirement.csv">
              <button className='btn btn-primary'>Export</button>
          </CSVLink>;
            </div>

          </div>
          <div className="requirement-tableSection">
            {searchInput.length ? (
              <Rtable requirementData={filterData} />
            ) : (
              <Rtable requirementData={allrequirementData} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Requirements;
