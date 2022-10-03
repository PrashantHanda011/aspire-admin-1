import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingPage from "../utils/LoadingPage";
import addIcon from "../../images/addIcon.svg";
import searchIcon from "../../images/searchIcon.svg";
import "../../styles/newstyles/property.css";
import Ptable from "./AllProperty/Ptable";
import { getAllProperty } from "../../redux/api";

const Property = () => {
  const history = useHistory();
  const [allpropertyData, setallpropertyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setsearchInput] = useState("");
  const [filterData, setfilterData] = useState([]);

  const fetchpropertyList = async () => {
    setLoading(true);
    try {
      const res = await getAllProperty();
      setallpropertyData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchpropertyList();
  }, []);

  const searchItems = (searchValue) => {
    setsearchInput(searchValue);
    if (searchValue !== "") {
      let filteredData = allpropertyData.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setfilterData(filteredData);
    } else {
      setfilterData(allpropertyData);
    }
  };

  return (
    <div className="property-container">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="property-firstSection">
            <div className="property-searchDiv">
              <img src={searchIcon} alt="search" className="searchIcon" />
              <input
                type="text"
                placeholder="Enter a Title , Author or Category"
                className="property-searchInput"
                id="searchInput"
                value={searchInput}
                onChange={(e) => searchItems(e.target.value)}
              />
            </div>
            <div className="property-addpropertyDiv">
              <button
                className="property-addBtn"
                onClick={() => history.push("/property/add")}
              >
                <img src={addIcon} alt="add" className="property-addIcon" />
                <span>Add Property</span>
              </button>
            </div>
          </div>
          <div className="property-tableSection">
            {searchInput.length ? (
              <Ptable propertyData={filterData} />
            ) : (
              <Ptable propertyData={allpropertyData} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Property;
