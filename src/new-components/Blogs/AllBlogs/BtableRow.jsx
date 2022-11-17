import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteBlog, updateBlog } from '../../../redux/api';
import DeleteModal from '../../utils/DeleteModal';
const BtableRow = ({ index, blog, allblogs, setallblogs }) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [ConfirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteConfirm = () => {
    setdeleteModalOpen(false);
    setConfirmDelete(true);
  };
  const handleDeleteCancel = () => {
    setdeleteModalOpen(false);
  };
  const handleDeleteBlog = (e, id) => {
    e.preventDefault();
    setdeleteModalOpen(true);
  };
  const handleConfirmDeleteBlog = async (id) => {
    try {
      const updatedblogs = allblogs.filter((b) => b._id !== id);
      setallblogs(updatedblogs);
      await deleteBlog(id);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (ConfirmDelete) {
      handleConfirmDeleteBlog(blog._id);
    }
  }, [ConfirmDelete]);




  
  const [featured, setfeatured] = useState(blog.isFeatured)
  const handleFeature = async()=>{
    try {
      const newdata = {
        id:blog._id,
        isFeatured: !blog.isFeatured
      }
      const data =await updateBlog(newdata);
      console.log(data)
      setfeatured(!featured)
    } catch (error) {
      
    }
  }


  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{blog.authorName}</td>
        <td>{blog.updatedAt.substr(0, 10)}</td>
        <td >
              {
                featured ? (
                  <button onClick={handleFeature} className=" btn btn-danger"> Unfeature</button>
                ):(
                  <button onClick={handleFeature} className=" btn btn-success">Feature</button>
                )
              }
        </td>
        <td>{blog.timeToRead}</td>
        <td>{blog.title}</td>
        <td>{blog.category}</td>
        <td style={{ textAlign: 'center' }}>
          <img
            src={blog.picture}
            height="100px"
            width="100px"
            alt="product image"
          />
        </td>
        <td className="text-right">
          <div
            className="actions"
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
          >
            <Link to={`/blog/edit/${blog._id}`}>
              {' '}
              <button className="edit-btn">
                <ModeEditIcon />{' '}
              </button>
            </Link>
            <Link onClick={(e) => handleDeleteBlog(e)} to={'#'}>
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
          categorytag="Blog"
        />
      )}
    </>
  );
};

export default BtableRow;
