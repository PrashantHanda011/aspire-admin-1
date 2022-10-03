import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteUnitDetail } from "../../../redux/api";
import DeleteModal from "../../utils/DeleteModal";

const UDtableRow = ({
  index,
  propid,
  bhk,
  detaildata,
  allUnitDetails,
  setallUnitDetails,
}) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [ConfirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteConfirm = () => {
    setdeleteModalOpen(false);
    setConfirmDelete(true);
  };
  const handleDeleteCancel = () => {
    setdeleteModalOpen(false);
  };
  const handleDeleteUnitDetail = (e) => {
    e.preventDefault();
    setdeleteModalOpen(true);
  };
  const handleConfirmDelete = async (propid, bhk, did) => {
    try {
      const updatedDetails = {
        ...allUnitDetails,
        unitDetails: allUnitDetails.unitDetails.map((unitdetail) => {
          return {
            ...unitdetail,
            detail: unitdetail.detail.filter((d) => {
              return d._id != did;
            }),
          };
        }),
      };
      setallUnitDetails(updatedDetails);
      await deleteUnitDetail(propid, bhk, did);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(index);

  useEffect(() => {
    if (ConfirmDelete) {
      handleConfirmDelete(propid, bhk, detaildata._id);
    }
  }, [ConfirmDelete]);

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{bhk}</td>
        <td>{detaildata.facing}</td>
        <td>{detaildata.size}</td>
        <td>{detaildata.price}</td>
        <td>
          <Link onClick={(e) => handleDeleteUnitDetail(e)} to={"#"}>
            <button className="delete-btn">
              <DeleteIcon />{" "}
            </button>
          </Link>
        </td>
      </tr>
      {deleteModalOpen && (
        <DeleteModal
          show={deleteModalOpen}
          handleConfirm={handleDeleteConfirm}
          handleCancel={handleDeleteCancel}
          categorytag="UnitDetail"
        />
      )}
    </>
  );
};

export default UDtableRow;
