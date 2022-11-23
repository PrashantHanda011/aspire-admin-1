import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteProperty, updateProject, updateProperty } from "../../../redux/api";
import DeleteModal from "../../utils/DeleteModal";
const PtableRow = ({ index, property, allproperty, setallproperty }) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const handleDeleteConfirm = () => {
    setdeleteModalOpen(false);
    setConfirmDelete(true);
  };
  const handleDeleteCancel = () => {
    setdeleteModalOpen(false);
  };
  const handleDeleteProperty = (e) => {
    e.preventDefault();
    setdeleteModalOpen(true);
  };

  const handleChange = async (e) => {
    const newOrder = e.target.value;
    // console.log(property);
    var order = alert(`order set to ${parseInt(e.target.value) + 1} `);
    // console.log(e.target.name);
    const formData = {
      id: property?._id,
      order: newOrder,
    };
    try {
      const res = await updateProperty(formData);
      // console.log(res);
      window.location.reload(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirmDeleteProperty = async (id) => {
    try {
      const updatedproperty = allproperty.filter((b) => b._id !== id);
      setallproperty(updatedproperty);
      await deleteProperty(id);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (ConfirmDelete) {
      handleConfirmDeleteProperty(property._id);
    }
  }, [ConfirmDelete]);



  const [featured, setfeatured] = useState(property.isFeatured)
  const handleFeature = async()=>{
    try {
      const newdata = {
        id:property._id,
        isFeatured: !property.isFeatured
      }
      const data =await updateProperty(newdata);
      console.log(data)
      setfeatured(!featured)
    } catch (error) {
      
    }
  }

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{property.name}</td>
        <td>
          <select
            onChange={(e) => handleChange(e)}
            selected={property?.order}
            class=""
            aria-label="Default select example"
          >
            <option selected={property?.order + 1}>
              {property?.order + 1}
            </option>
            {allproperty?.map((item, index) => (
              <option value={index}>{index + 1}</option>
            ))}
          </select>
        </td>
        <td>{property.location}</td>
        <td className="w-100">
              {
                featured ? (
                  <button onClick={handleFeature} className=" btn btn-danger"> Unfeature</button>
                ):(
                  <button onClick={handleFeature} className=" btn btn-success">Feature</button>
                )
              }
        </td>

        <td>{property.area}</td>
        <td>{property.ready ? "Yes" : "No"}</td>
        <td>{property.unitsLeft}</td>
        <td>{property.price}</td>
        <td>
        <Link to={`/property/usp/${property._id}`}>
              <button className="btn btn-outline-secondary btn-sm">View</button>
            </Link>
            </td>
        <td style={{ textAlign: "center" }}>
          {property.unitDetails.length ? (
            <Link to={`/property/unitdetail/${property._id}`}>
              <button className="btn btn-outline-secondary btn-sm">View</button>
            </Link>
          ) : (
            <Link to={`/property/unitdetail/add/${property._id}`}>
              <button type="button" class="btn btn-outline-success btn-sm">
                Add
              </button>
            </Link>
          )}
        </td>
        <td style={{ textAlign: "center" }}>
          {property.developer ? (
            <Link to={`/property/editdev/${property._id}`}>
              <button className="btn btn-outline-secondary btn-sm">Edit</button>
            </Link>
          ) : (
            <Link to={`/property/adddev/${property._id}`}>
              <button type="button" class="btn btn-outline-success btn-sm">
                Add
              </button>
            </Link>
          )}
        </td>
        <td className="text-right">
          <div
            className="actions"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Link to={`/property/edit/${property._id}`}>
              {" "}
              <button className="edit-btn">
                <ModeEditIcon />{" "}
              </button>
            </Link>
            <Link onClick={(e) => handleDeleteProperty(e)} to={"#"}>
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
          categorytag="Property"
        />
      )}
    </>
  );
};

export default PtableRow;
