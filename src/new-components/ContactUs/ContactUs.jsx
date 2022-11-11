import React, { useState, useEffect } from 'react';
import LoadingPage from '../utils/LoadingPage';
import searchIcon from '../../images/searchIcon.svg';
import '../../styles/newstyles/contact.css';
import Ctable from './AllContactUs/Ctable';
import { getAllContacts } from '../../redux/api';
import { CSVLink, CSVDownload } from "react-csv";


const ContactUs = () => {
  const [allcontactData, setallcontactData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setsearchInput] = useState('');
  const [filterData, setfilterData] = useState([]);

  const fetchcontactList = async () => {
    setLoading(true);
    try {
      const res = await getAllContacts();
      setallcontactData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchcontactList();
  }, []);

  const searchItems = (searchValue) => {
    setsearchInput(searchValue);
    if (searchValue !== '') {
      let filteredData = allcontactData.filter((item) => {
        return Object.values(item)
          .join('')
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setfilterData(filteredData);
    } else {
      setfilterData(allcontactData);
    }
  };

  return (
    <div className="contact-container">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="contact-firstSection">
            <div className="contact-searchDiv">
              <img src={searchIcon} alt="search" className="searchIcon" />
              <input
                type="text"
                placeholder="Enter a Title , Author or Category"
                className="contact-searchInput"
                id="searchInput"
                value={searchInput}
                onChange={(e) => searchItems(e.target.value)}
              />
            </div>
            <CSVLink data={allcontactData} filename={"ContactUs.csv"}>
              <button className='btn btn-primary'>Export</button>
          </CSVLink>;
          </div>
          <div className="contact-tableSection">
            {searchInput.length ? (
              <Ctable contactData={filterData} />
            ) : (
              <Ctable contactData={allcontactData} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default ContactUs;
