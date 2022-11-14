import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addCareerForm.css';
import { useParams, useHistory } from 'react-router-dom';
import { getCareerById, updateCareer } from '../../redux/api';
import LoadingPage from '../utils/LoadingPage';
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
const EditCareerForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const [careerData, setCareerData] = useState({});

  const [error, setError] = useState({
    location: false,
    description: false,
    department: false,
    name: false,
    experience: false,
    bannerUrl: false,
  });
  const getCareerData = async () => {
    setLoading(true);
    try {
      const res = await getCareerById(id);
      const cdata = res.data.data;
      setCareerData({
        ...cdata,
        salary: cdata.salary.slice(0, -1),
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getCareerData(id);
  }, []);

  const handleInputchange = (name) => (event) => {
    setCareerData({ ...careerData, [name]: event.target.value });
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
          console.log(url);
          setCareerData({ ...careerData, bannerUrl: url });
        });
      }
    );
  };
  const handlerValidatedFormSubmit = async () => {
    try {
      await updateCareer({
        ...careerData,
        salary: careerData.salary + 'L',
        id: careerData._id,
      });
      history.push('/career');
      setspinn(false);
    } catch (error) {
      console.log(error);
      setspinn(false);
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      location: careerData.location === '' ? true : false,
      description: careerData.description === '' ? true : false,
      department: careerData.department === '' ? true : false,
      name: careerData.name === '' ? true : false,
      experience: careerData.experience === '' ? true : false,
      bannerUrl: careerData.bannerUrl === '' ? true : false,
    };
    setError(updatedError);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } else {
      if (
        !error.location &&
        !error.description &&
        !error.department &&
        !error.name &&
        !error.experience &&
        !error.salary &&
        !error.bannerUrl
      ) {
        setspinn(true);
        handlerValidatedFormSubmit();
      }
    }
  }, [error]);

  return (
    <form>
      <div className="addcareer-container">
        {loading ? (
          <LoadingPage />
        ) : (
          <form>
            <div className="addcareer-container">
              <div className="addcareer-personalDetails">
                {/* 1st row */}
                <div className="addcareer-alignRow">
                  {/* Career Name */}
                  <div className="addcareer-inputFieldDiv form-group">
                    <label className="addcareer-inputLabel ">
                      Career Name{' '}
                      <span style={{ color: 'red', fontSize: '1.2rem' }}>
                        *
                      </span>{' '}
                    </label>
                    <input
                      value={careerData.name}
                      type="text"
                      name="Career Name"
                      placeholder="Career Name"
                      className="addcareer-inputField"
                      id={error.name ? 'red-border' : ''}
                      onChange={handleInputchange('name')}
                    />
                  </div>
                  {/* Department*/}
                  <div className="addcareer-inputFieldDiv form-group">
                    <label className="addcareer-inputLabel">
                      Department{' '}
                      <span style={{ color: 'red', fontSize: '1.2rem' }}>
                        *
                      </span>{' '}
                    </label>
                    <input
                      type="text"
                      id={error.department ? 'red-border' : ''}
                      name="Title"
                      placeholder="Department Name"
                      className="addcareer-inputField"
                      value={careerData.department}
                      onChange={handleInputchange('department')}
                    />
                  </div>
                </div>

                {/* 2nd row */}
                <div className="addcareer-alignRow">
                  {/* Location */}
                  <div className="addcareer-inputFieldDiv form-group">
                    <label className="addcareer-inputLabel">
                      Location{' '}
                      <span style={{ color: 'red', fontSize: '1.2rem' }}>
                        *
                      </span>{' '}
                    </label>
                    <input
                      type="text"
                      name="location"
                      id={error.location ? 'red-border' : ''}
                      placeholder="Location"
                      className="addcareer-inputField"
                      value={careerData.location}
                      onChange={handleInputchange('location')}
                    />
                  </div>
                
                  {/* Experience*/}
                  <div className="addcareer-inputFieldDiv form-group">
                    <label className="addcareer-inputLabel">
                      Experience{' '}
                      <span style={{ color: 'red', fontSize: '1.2rem' }}>
                        *
                      </span>{' '}
                    </label>
                    <input
                      type="text"
                      name="experience"
                      id={error.experience ? 'red-border' : ''}
                      placeholder="Experience"
                      className="addcareer-inputField"
                      value={careerData.experience}
                      onChange={handleInputchange('experience')}
                    />
                  </div>
                  {/* Salary (in Lpa)*/}
                  {/* <div className="addcareer-inputFieldDiv">
                    <label className="addcareer-inputLabel">
                      Salary (in Lpa)
                      <span style={{ color: 'red', fontSize: '1.2rem' }}>
                        *
                      </span>{' '}
                    </label>
                    <input
                      name="salary"
                      id={error.salary ? 'red-border' : ''}
                      value={careerData.salary}
                      onChange={handleInputchange('salary')}
                      className="addcareer-inputField"
                      placeholder="Salary"
                      type="text"
                    />
                  </div> */}

                </div>
                {/* 3rd row */}
{/* 
                <div className="addcareer-alignRow">
                
                  <div className="addcareer-inputFieldDiv form-group">
                    <label className="addcareer-inputLabel">
                      Banner Image
                      <span style={{ color: 'red', fontSize: '1.2rem' }}>
                        *
                      </span>{' '}
                    </label>
                    <input
                      type="file"
                      name="Banner Image"
                      placeholder="Banner Image"
                      className="addcareer-inputField"
                      onChange={handleFileInputchange('CareerBanner')}
                      id={error.bannerUrl ? 'red-border' : ''}
                    />
                  </div>
                </div> */}
                {/* Banner Image Preview */}
                {/* <div className="addcareer-alignRow">
                  <div className="addcareer-inputFieldDiv-image">
                    <img
                      src={careerData.bannerUrl}
                      className="border border-dark p-2 rounded"
                      height="200px"
                      alt="product image"
                    />
                  </div>
                </div> */}
                {/* 4th Row  */}
                <div className="addcareer-alignRow">
                  <div className="addcareer-textFieldDiv">
                    <label className="addcareer-inputLabel">
                      Description{' '}
                      <span style={{ color: 'red', fontSize: '1.2rem' }}>
                        *
                      </span>{' '}
                    </label>
                    <textarea
                      className="addcareer-textField"
                      value={careerData.description}
                      onChange={handleInputchange('description')}
                      name="description"
                      id={error.description ? 'red-border' : ''}
                    ></textarea>
                  </div>
                </div>
                {/* Submit */}
                <div className="addcareer-submitDetailDiv">
                  <button
                    className="addcareer-submitDetailBtn"
                    onClick={handlesubmit}
                  >
                    Update career
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
              </div>
            </div>
          </form>
        )}
      </div>
    </form>
  );
};

export default EditCareerForm;
