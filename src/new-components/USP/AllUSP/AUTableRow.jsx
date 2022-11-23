import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteUnitDetail } from "../../../redux/api";
import DeleteModal from "../../utils/DeleteModal";

const AUTableRow = ({
  index,
  detail,
  icon,
  id,
  handleDelete
}) => {

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>
          <img src={icon} height={100} width={100} alt="unitimg" />
        </td>
        <td>{detail}</td>
        <td>
          <Link onClick={(e) => handleDelete(id)} to={"#"}>
            <button className="delete-btn">
              <DeleteIcon />{" "}
            </button>
          </Link>
        </td>
      </tr>
    </>
  );
};

export default AUTableRow;
