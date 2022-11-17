import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCareer } from '../../../redux/api';
import DeleteModal from '../../utils/DeleteModal';

const CtableRow = ({ index, career, allcareers, setallcareers }) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [ConfirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteConfirm = () => {
    setdeleteModalOpen(false);
    setConfirmDelete(true);
  };
  const handleDeleteCancel = () => {
    setdeleteModalOpen(false);
  };
  const handleDeletecareer = (e) => {
    e.preventDefault();
    setdeleteModalOpen(true);
  };
  const handleConfirmDeletecareer = async (id) => {
    try {
      const updatedcareers = allcareers.filter((b) => b._id !== id);
      setallcareers(updatedcareers);
      await deleteCareer(id);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (ConfirmDelete) {
      handleConfirmDeletecareer(career._id);
    }
  }, [ConfirmDelete]);

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{career.name}</td>
        <td>{career.description}</td>
        <td>{career.experience}</td>
        <td>{career.location}</td>
        <td className="text-right">
          <div
            className="actions"
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
          >
            <Link to={`/career/edit/${career._id}`}>
              {' '}
              <button className="edit-btn">
                <ModeEditIcon />{' '}
              </button>
            </Link>
            <Link onClick={(e) => handleDeletecareer(e)} to={'#'}>
              <button className="delete-btn">
                <DeleteIcon />{' '}
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
          categorytag="Career"
        />
      )}
    </>
  );
};

export default CtableRow;
