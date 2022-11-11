import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addDeveloperForm.css';
import { useParams, useHistory } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../../redux/api';
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import LoadingPage from '../utils/LoadingPage';
import ReactQuill from "react-quill";
import Form from "react-bootstrap/Form";
import "react-quill/dist/quill.snow.css";



const EditDeveloperForm = () => {
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  EditDeveloperForm.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
  EditDeveloperForm.modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  

  const [developerData, setdeveloperData] = useState({
    name: '',
    picture: '',
    description: '',
    area: '',
    possessions: '',
    totalProjects: '',
  });

  const [error, setError] = useState({
    name: false,
    picture: false,
    description: false,
    area: false,
    possessions: false,
    totalProjects: false,
  });

  const getPropertyData = async () => {
    setLoading(true);
    try {
      const res = await getPropertyById(id);
      const pdata = res.data.data;
      setdeveloperData(pdata.developer);
      setLoading(false);
      console.log(pdata.developer);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getPropertyData(id);
  }, []);

  const handleInputchange = (name) => (event) => {
    setdeveloperData({ ...developerData, [name]: event.target.value });
  };

  const handlerValidatedFormSubmit = async () => {
    try {
      const payloaddata = {
        id: id,
        developer: developerData,
      };
      await updateProperty(payloaddata);
      history.push(`/property/`);
      setspinn(false);
    } catch (error) {
      console.log(error);
      setspinn(false);
    }
  };
  const handleFileInputchange = (name) => async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `${name}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setdeveloperData({ ...developerData, picture: url });
        });
      }
    );
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      name: developerData.name === '' ? true : false,
      picture: developerData.picture === '' ? true : false,
      description: developerData.description === '' ? true : false,
      area: developerData.area === '' ? true : false,
      possessions: developerData.possessions === '' ? true : false,
      totalProjects: developerData.totalProjects === '' ? true : false,
    };
    setError(updatedError);
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } else {
      if (
        !error.name &&
        !error.picture &&
        !error.description &&
        !error.area &&
        !error.possessions &&
        !error.totalProjects
      ) {
        setspinn(true);
        handlerValidatedFormSubmit();
      }
    }
  }, [error]);

  console.log(developerData)
  return (
    <form>
      <div className="developer-container">
        {loading ? (
          <LoadingPage />
        ) : (
          <div className="developer-personalDetails">
            {/* 1st row */}
            <div className="developer-alignRow">
              {/* Name */}
              <div className="developer-inputFieldDiv form-group">
                <label className="developer-inputLabel ">
                  Name{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="Name"
                  placeholder="Name"
                  className="developer-inputField"
                  id={error.name ? 'red-border' : ''}
                  onChange={handleInputchange('name')}
                  value={developerData.name}
                />
              </div>
              {/* Area*/}
              <div className="developer-inputFieldDiv form-group">
                <label className="developer-inputLabel">
                  Area{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  id={error.area ? 'red-border' : ''}
                  name="Area"
                  placeholder="Area"
                  className="developer-inputField"
                  onChange={handleInputchange('area')}
                  value={developerData.area}
                />
              </div>
            </div>
            {/* 2nd Row */}
            <div className="developer-alignRow">
              {/* Possessions */}
              <div className="developer-inputFieldDiv form-group">
                <label className="developer-inputLabel">
                  Founded In{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  id={error.possessions ? 'red-border' : ''}
                  name="Possessions"
                  placeholder="Founded In"
                  className="developer-inputField"
                  onChange={handleInputchange('possessions')}
                  value={developerData.possessions}
                />
              </div>
              {/* TotalProjects*/}
              <div className="developer-inputFieldDiv form-group">
                <label className="developer-inputLabel">
                  TotalProjects{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="number"
                  id={error.totalProjects ? 'red-border' : ''}
                  name="TotalProjects"
                  placeholder="TotalProjects"
                  className="developer-inputField"
                  onChange={handleInputchange('totalProjects')}
                  value={developerData.totalProjects}
                />
              </div>
            </div>
            {/* 3rd Row  */}
            <div className="developer-alignRow">
              {/* Picture */}
              <div className="developer-textFieldDiv form-group">
                <label className="developer-inputLabel ">
                  Picture{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="file"
                  name="Picture"
                  placeholder="Picture"
                  className="developer-inputField"
                  id={error.picture ? 'red-border' : ''}
                  onChange={handleFileInputchange('developer')}
                />
                <div className="developer-inputFieldDiv-image">
                  <img
                    src={developerData.picture}
                    height="100px"
                    width="100px"
                    alt="Developer image"
                  />
                </div>
              </div>
            </div>
            {/* 4th Row */}
            <div className="developer-alignRow">
              {/* Description*/}
              <div className="developer-textFieldDiv">
                <label className="developer-inputLabel">
                  Description{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <ReactQuill
                className="addblog-textField"
                placeholder="Add Blog Content here"
                id={error.content ? "red-border" : ""}
                modules={EditDeveloperForm.modules}
                formats={EditDeveloperForm.formats}
                theme="snow"
                value={developerData.description}
                onChange={(content, delta, source, editor) => {
                  setdeveloperData({ ...developerData, description: editor.getHTML() });
                }}
              />
                {/* <textarea
                  className="developer-textField"
                  onChange={handleInputchange('description')}
                  name="caption"
                  id={error.description ? 'red-border' : ''}
                  value={developerData.description}
                ></textarea> */}
              </div>
            </div>
            {/* Submit */}`
            <div className="developer-submitDetailDiv">
              <button
                className="developer-submitDetailBtn"
                onClick={handlesubmit}
              >
                Add Developer
                {spinn ? (
                  <div
                    class="spinner-border spinner-border-sm text-white mx-2"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  ''
                )}
              </button>
            </div>
            `
          </div>
        )}
      </div>
    </form>
  );
};

export default EditDeveloperForm;
