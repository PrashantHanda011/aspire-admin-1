import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import LoadingPage from '../utils/LoadingPage';
import addIcon from '../../images/addIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import '../../styles/newstyles/unitdetails.css';
import { getUnitDetailByPropertyId, getUSP } from '../../redux/api';
import AUTable from './AllUSP/AUTable';

const USP = () => {
  const history = useHistory();
  const { id } = useParams();
  const [USPData, setUSPData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [filterData, setfilterData] = useState([]);

  useEffect(() => {
    getUnitDetailsData(id);
  }, []);

  const getUnitDetailsData = async () => {
    setLoading(true);
    try {
    const dataform = {
        id:id
    }
      const res = await getUSP(dataform);
      const uddata = res.data.data.usp;
      setUSPData(uddata);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const searchItems = (searchValue) => {
    setsearchInput(searchValue);
    if (searchValue !== '') {
      let filteredData = USPData.filter((item) => {
        return Object.values(item)
          .join('')
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setfilterData(filteredData);
    } else {
      setfilterData(USPData);
    }
  };

  return (
    <div className="unitdetails-container">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="unitdetails-firstSection">
            <div className="unitdetails-searchDiv">
              <img src={searchIcon} alt="search" className="searchIcon" />
              <input
                type="text"
                placeholder="Enter a Name , Description or More"
                className="unitdetails-searchInput"
                id="searchInput"
                value={searchInput}
                onChange={(e) => searchItems(e.target.value)}
              />
            </div>
            <div className="unitdetails-addloanDiv">
              <button
                className="unitdetails-addBtn"
                onClick={() => history.push(`/property/usp/add/${id}`)}
              >
                <img src={addIcon} alt="add" className="unitdetails-addIcon" />
                <span>Add USP</span>
              </button>
            </div>
          </div>
          <div className="unitdetails-tableSection">
            {searchInput.length ? (
              <AUTable unitDetailsData={filterData} propid={id} />
            ) : (
              <AUTable unitDetailsData={USPData} propid={id} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default USP;
