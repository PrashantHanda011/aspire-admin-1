import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteUnitDetail } from "../../../redux/api";
import DeleteModal from "../../utils/DeleteModal";

const APTableRow = ({
  index,
  detail,
  name,
  phone,email,
  id,
  property,
  handleDelete
}) => {

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{name}</td>
        <td>{phone}</td>
        <td>{email}</td>
        <td>{property}</td>
  
      </tr>
    </>
  );
};

export default APTableRow;
