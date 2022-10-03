import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteLoan, updateLoan } from "../../../redux/api";
import DeleteModal from "../../utils/DeleteModal";
import { WindowSharp } from "@mui/icons-material";

const TLtableRow = ({ index, loan, allloans, setallloans }) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [ConfirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteConfirm = () => {
    setdeleteModalOpen(false);
    setConfirmDelete(true);
  };
  const handleDeleteCancel = () => {
    setdeleteModalOpen(false);
  };
  const handleDeleteloan = (e) => {
    e.preventDefault();
    setdeleteModalOpen(true);
  };
  const handleConfirmDeleteloan = async (id) => {
    try {
      const updatedloans = allloans.filter((b) => b._id !== id);
      setallloans(updatedloans);
      await deleteLoan(id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (e) => {
    console.log(loan);
    const newOrder = e.target.value;
    console.log(newOrder);
    var order = alert(`order set to ${e.target.value}`);
    console.log(e.target.name);
    const formData = {
      id: loan?._id,
      order: newOrder,
    };
    try {
      const res = await updateLoan(formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (ConfirmDelete) {
      handleConfirmDeleteloan(loan._id);
    }
  }, [ConfirmDelete]);

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>
          <img
            style={{ height: "10vh", width: "8vw" }}
            src={loan.logo}
            alt=""
          />
        </td>

        <td>{loan.name}</td>
        <td>{loan.interest}</td>
        <td>{loan.description}</td>
        <td className="text-right">
          <div
            className="actions"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Link to={`/trendingloans/edit/${loan._id}`}>
              {" "}
              <button className="edit-btn">
                <ModeEditIcon />{" "}
              </button>
            </Link>
            <Link onClick={(e) => handleDeleteloan(e)} to={"#"}>
              <button className="delete-btn">
                <DeleteIcon />{" "}
              </button>
            </Link>
          </div>
        </td>
      </tr>
      {deleteModalOpen && (
        <DeleteModal
          show={deleteModalOpen}
          handleConfirm={handleDeleteConfirm}
          handleCancel={handleDeleteCancel}
          categorytag="Loan"
        />
      )}
    </>
  );
};

export default TLtableRow;
