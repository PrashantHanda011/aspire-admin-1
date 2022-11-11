import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addUnitDetailForm.css';
import { useParams, useHistory } from 'react-router-dom';
import { addUnitDetail } from '../../redux/api';
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const AddUnitDetailsForm = () => {
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const [bhk, setbhk] = useState();
  const [detailData, setdetailData] = useState({
    range: '',
    floorPlan: '',
    size: '',
    price: '',
  });

  const [error, setError] = useState({
    bhk: false,
    range: false,
    floorPlan: false,
    size: false,
    price: false,
  });
  console.log(detailData)

  const handleInputchange = (name) => (event) => {
    setdetailData({ ...detailData, [name]: event.target.value });
  };
  const handleBhkInputchange = (event) => {
    setbhk(event.target.value);
  };

  const handlerValidatedFormSubmit = async () => {
    try {
      const payloaddata = {
        id: id,
        bhk: bhk,
        detail: {
          ...detailData,
          price: detailData.price + 'L',
        },
      };
      await addUnitDetail(payloaddata);
      history.push(`/property/unitdetail/${id}`);
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
          setdetailData({ ...detailData, floorPlan: url });
        });
      }
    );
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      bhk: bhk === '' ? true : false,
      range: detailData.range === '' ? true : false,
      floorPlan: detailData.floorPlan === '' ? true : false,
      size: detailData.size === '' ? true : false,
      price: detailData.price === '' ? true : false,
    };
    setError(updatedError);
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } else {
      if (
        !error.bhk &&
        !error.range &&
        !error.floorPlan &&
        !error.size &&
        !error.price
      ) {
        setspinn(true);
        handlerValidatedFormSubmit();
      }
    }
  }, [error]);

  return (
    <form>
      <div className="unitdetail-container">
        <div className="unitdetail-personalDetails">
          {/* 1st row */}
          <div className="unitdetail-alignRow">
            {/* BHK */}
            <div className="unitdetail-inputFieldDiv form-group">
              <label className="unitdetail-inputLabel ">
                BHK <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                name="BHK"
                placeholder="BHK"
                className="unitdetail-inputField"
                id={error.bhk ? 'red-border' : ''}
                onChange={handleBhkInputchange}
              />
            </div>
            {/* Facing*/}
            <div className="unitdetail-inputFieldDiv form-group">
              <label className="unitdetail-inputLabel">
                Range{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                id={error.facing ? 'red-border' : ''}
                name="range"
                placeholder="Range"
                className="unitdetail-inputField"
                onChange={handleInputchange('range')}
              />
            </div>
          </div>
          {/* 2nd Row */}
          <div className="unitdetail-alignRow">
            {/* Price */}
            <div className="unitdetail-inputFieldDiv form-group">
              <label className="unitdetail-inputLabel">
                Price (in L){' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                id={error.price ? 'red-border' : ''}
                name="Price"
                placeholder="Price (in L)"
                className="unitdetail-inputField"
                onChange={handleInputchange('price')}
              />
            </div>

            {/* Size*/}
            <div className="unitdetail-inputFieldDiv form-group">
              <label className="unitdetail-inputLabel">
                Size <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                id={error.size ? 'red-border' : ''}
                name="Size"
                placeholder="Size"
                className="unitdetail-inputField"
                onChange={handleInputchange('size')}
              />
            </div>
          </div>
          {/* 3rd Row  */}
          <div className="unitdetail-alignRow">
            {/* Floor Plan */}
            <div className="unitdetail-textFieldDiv form-group">
              <label className="unitdetail-inputLabel ">
                Floor Plan{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="file"
                name="Floor Plan"
                placeholder="Floor Plan"
                className="unitdetail-inputField"
                id={error.floorPlan ? 'red-border' : ''}
                onChange={handleFileInputchange('floorplan')}
              />
            </div>
          </div>
          {/* Submit */}`
          <div className="unitdetail-submitDetailDiv">
            <button
              className="unitdetail-submitDetailBtn"
              onClick={handlesubmit}
            >
              Add Unit
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
      </div>
    </form>
  );
};

export default AddUnitDetailsForm;
