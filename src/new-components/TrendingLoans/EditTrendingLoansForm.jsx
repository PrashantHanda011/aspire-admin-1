import React, { useEffect, useRef, useState } from "react";
import "../../styles/newstyles/addTrendingLoansForm.css";
import { useParams, useHistory } from "react-router-dom";
import { getLoanById, updateLoan } from "../../redux/api";
import LoadingPage from "../utils/LoadingPage";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";

const EditTrendingLoansForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const [loanData, setLoanData] = useState({});

  const [error, setError] = useState({
    interest: "",
    description: "",
    name: "",
    logo: "",
  });

  const getLoanData = async () => {
    setLoading(true);
    try {
      const res = await getLoanById(id);
      const ldata = res.data.data;
      setLoanData(ldata);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getLoanData(id);
  }, []);

  const handleInputchange = (name) => (event) => {
    setLoanData({ ...loanData, [name]: event.target.value });
  };

  const handlerValidatedFormSubmit = async () => {
    try {
      await updateLoan({
        ...loanData,
        id: loanData._id,
      });
      history.push("/trendingloans");
      setspinn(false);
    } catch (error) {
      console.log(error);
      setspinn(false);
    }
  };
  const handleFileInputchange = (name) => async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;
    const storageRef = ref(storage, `${name}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          debugger;
          setLoanData({ ...loanData, [name]: url });
          debugger;
        });
      }
    );
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      name: loanData.name === "" ? true : false,
      description: loanData.description === "" ? true : false,
      interest: loanData.interest === "" ? true : false,
    };
    setError(updatedError);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } else {
      if (!error.name && !error.description && !error.interest) {
        setspinn(true);
        handlerValidatedFormSubmit();
      }
    }
  }, [error]);

  return (
    <form>
      <div className="addloan-container">
        {loading ? (
          <LoadingPage />
        ) : (
          <div className="addloan-personalDetails">
            {/* 1st row */}
            <div className="addloan-alignRow">
              {/* Loan Name */}
              <div className="addloan-inputFieldDiv form-group">
                <label className="addloan-inputLabel ">
                  Loan Name{" "}
                  <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
                </label>
                <input
                  type="text"
                  name="Loan Name"
                  placeholder="Loan Name"
                  className="addloan-inputField"
                  value={loanData.name}
                  id={error.name ? "red-border" : ""}
                  onChange={handleInputchange("name")}
                />
              </div>
              {/* Interest*/}
              <div className="addloan-inputFieldDiv form-group">
                <label className="addloan-inputLabel">
                  Interest{" "}
                  <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
                </label>
                <input
                  type="text"
                  id={error.interest ? "red-border" : ""}
                  name="Title"
                  value={loanData.interest}
                  placeholder="Interest"
                  className="addloan-inputField"
                  onChange={handleInputchange("interest")}
                />
              </div>
            </div>
            {/* 2nd Row  */}
            <div className="addloan-alignRow">
              <div className="addloan-textFieldDiv">
                <label className="addloan-inputLabel">
                  Description{" "}
                  <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
                </label>
                <textarea
                  className="addloan-textField"
                  onChange={handleInputchange("description")}
                  name="description"
                  value={loanData.description}
                  id={error.description ? "red-border" : ""}
                ></textarea>
              </div>
            </div>
            <div className="addblog-inputFieldDiv">
              <label className="addblog-inputLabel">
                Author Profile{" "}
                <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
              </label>
              <input
                type="file"
                name="profilePic"
                placeholder="Author Profile"
                className="addblog-inputField"
                onChange={handleFileInputchange("logo")}
                id={error.logo ? "red-border" : ""}
              />
            </div>
            {/* Submit */}
            <div className="addloan-submitDetailDiv">
              <button
                className="addloan-submitDetailBtn"
                onClick={handlesubmit}
              >
                Update loan
                {spinn ? (
                  <div
                    class="spinner-border spinner-border-sm text-white mx-2"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  ""
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default EditTrendingLoansForm;
