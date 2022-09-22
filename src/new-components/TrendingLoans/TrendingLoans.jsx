import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingPage from "../utils/LoadingPage";
import addIcon from "../../images/addIcon.svg";
import searchIcon from "../../images/searchIcon.svg";
import "../../styles/newstyles/loans.css";
import { getAllLoan } from "../../redux/api";
import TLtable from "./AllTrendingLoans/TLtable";

const TrendingLoans = () => {
  const history = useHistory();
  const [allLoanData, setallLoanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setsearchInput] = useState("");
  const [filterData, setfilterData] = useState([]);

  const fetchCarrerList = async () => {
    setLoading(true);
    try {
      const res = await getAllLoan();
      setallLoanData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCarrerList();
  }, []);

  const searchItems = (searchValue) => {
    setsearchInput(searchValue);
    if (searchValue !== "") {
      let filteredData = allLoanData.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setfilterData(filteredData);
    } else {
      setfilterData(allLoanData);
    }
  };
  console.log(filterData);
  return (
    <div className="loan-container">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="loan-firstSection">
            <div className="loan-searchDiv">
              <img src={searchIcon} alt="search" className="searchIcon" />
              <input
                type="text"
                placeholder="Enter a Name , Description or More"
                className="loan-searchInput"
                id="searchInput"
                value={searchInput}
                onChange={(e) => searchItems(e.target.value)}
              />
            </div>
            <div className="loan-addloanDiv">
              <button
                className="loan-addBtn"
                onClick={() => history.push("/trendingloans/add")}
              >
                <img src={addIcon} alt="add" className="loan-addIcon" />
                <span>Add Loan</span>
              </button>
            </div>
          </div>
          <div className="loan-tableSection">
            {searchInput.length ? (
              <TLtable loanData={filterData} />
            ) : (
              <TLtable loanData={allLoanData} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default TrendingLoans;
