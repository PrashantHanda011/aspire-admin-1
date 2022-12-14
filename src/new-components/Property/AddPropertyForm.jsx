import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addPropertyForm.css';
import { useHistory } from 'react-router-dom';
import { addProperty } from '../../redux/api';
import { storage } from '../../firebase';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const AddPropertyForm = () => {
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const [selectedAmenities, setselectedAmenities] = useState([]);
  const history = useHistory();
  const amenitiesoptions = [
    { value: 'Car parking', label: 'Car parking' },
    { value: 'Security services', label: 'Security services' },
    { value: 'CCTV', label: 'CCTV' },
    { value: 'Water supply', label: 'Water supply' },
    { value: 'Elevators', label: 'Elevators' },
    { value: 'Power backup', label: 'Power backup' },
    { value: '24-hour maintenance', label: '24-hour maintenance' },
    { value: 'Walking/Jogging track', label: 'Walking/Jogging track' },
    { value: 'Play area', label: 'Play area' },
    { value: 'Clubhouse', label: 'Clubhouse' },
    { value: 'Swimming pool', label: 'Swimming pool' },
    { value: 'Gym', label: 'Gym' },
    { value: 'Rooftop garden/Terrace', label: 'Rooftop garden/Terrace' },
    { value: 'Private Terrace', label: 'Private Terrace' },
    { value: 'Balcony', label: 'Balcony' },
    { value: 'Indoor Games', label: 'Indoor Games' },
    { value: 'Outdoor Play area', label: 'Outdoor Play area' },
    { value: 'Kids Play area', label: 'Kids Play area' },
    { value: 'Basketball court', label: 'Basketball court' },
    { value: 'Badminton Court', label: 'Badminton Court' },
    { value: 'Elderly Sitting Area', label: 'Elderly Sitting Area' },
    { value: 'Open deck', label: 'Open deck' },
    { value: 'Sky lounge', label: 'Sky lounge' },
    { value: 'Spa/salon', label: 'Spa/salon' },
    { value: 'Cafeteria', label: 'Cafeteria' },
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Party hall', label: 'Party hall' },
    { value: 'Multi-purpose Hall', label: 'Multi-purpose Hall' },
    {
      value: 'Temple and religious activity place',
      label: 'Temple and religious activity place',
    },
    { value: 'Cinema hal', label: 'Cinema hal' },
    { value: 'Amphitheater', label: 'Amphitheater' },
    { value: 'Wi-Fi connectivity', label: 'Wi-Fi connectivity' },
    { value: 'Provision Shops', label: 'Provision Shops' },
    { value: 'Kids Swimming Pool', label: 'Kids Swimming Pool' },
    { value: 'Others', label: 'Others' },
  ];
  const [propertyData, setpropertyData] = useState({
    name: '',
    location: '',
    broucher:"",
    lat: '',
    lng: '',
    city: '',
    area: '',
    price: '',
    ready: '',
    isFeatured:false,
    unitsLeft: '',
    amenities: '',
    pictures: [],
    description: '',
  });

  const [error, setError] = useState({
    name: false,
    location: false,
    lat: false,
    lng: false,
    city: false,
    area: false,
    price: false,
    ready: false,
    unitsLeft: false,
    amenities: false,
    pictures: false,
    description: false,
  });


  //description
  AddPropertyForm.formats = [
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
  AddPropertyForm.modules = {
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

  const handleInputchange = (name) => (event) => {
    setpropertyData({ ...propertyData, [name]: event.target.value });
  };
  const handleInputAmenitieschange = (value) => {
    setselectedAmenities(value);
  };
  async function uploadImageAsPromise(file) {
    const storageRef = ref(storage, `PropertyPictures/${file.name}`);
    return new Promise(function (resolve, reject) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => { },
        function error(err) {
          reject(err);
        },
        async function complete() {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            resolve(url);
          });
        }
      );
    });
  }

  const handleFileInputchange = async (e) => {
    e.preventDefault();
    const promises = [];
    for (const file of e.target.files) {
      promises.push(uploadImageAsPromise(file));
    }
    const data = await Promise.all(promises);
    setpropertyData({ ...propertyData, pictures: data });
  };

  const handlerValidatedFormSubmit = async () => {
    try {
      const payloaddata = {
        ...propertyData,
        ready: propertyData.ready === 'YES' ? true : false,
        amenities: selectedAmenities.map((amen) => amen.value),
        area: propertyData.area,
        developer: {},
        unitDetails: [],
      };
      console.log(payloaddata);
      await addProperty(payloaddata);
      history.push('/property');
      setspinn(false);
    } catch (error) {
      console.log(error);
      setspinn(false);
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      name: propertyData.name == '' ? true : false,
      location: propertyData.location == '' ? true : false,
      lat: propertyData.lat == '' ? true : false,
      lng: propertyData.lng == '' ? true : false,
      city: propertyData.city == '' ? true : false,
      area: propertyData.area == '' ? true : false,
      price: propertyData.price == '' ? true : false,
      ready: propertyData.ready == '' ? true : false,
      unitsLeft: propertyData.unitsLeft == '' ? true : false,
      amenities: !selectedAmenities.length ? true : false,
      pictures: !propertyData.pictures.length ? true : false,
      description: propertyData.description == '' ? true : false,
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
        !error.location &&
        !error.lat &&
        !error.log &&
        !error.city &&
        !error.area &&
        !error.price &&
        !error.ready &&
        !error.unitsLeft &&
        !error.amenities &&
        !error.description &&
        !error.pictures
      ) {
        setspinn(true);
        handlerValidatedFormSubmit();
      }
    }
  }, [error]);

  // images

  //images

  const addImages = (e) => {
    e.preventDefault()
    let newfield = e.target.value;
    setpropertyData({
      ...propertyData,
      pictures: [...propertyData?.pictures, newfield],
    });
  };


  const removeImage = (index, e) => {
    e.preventDefault();
    let data = [...propertyData?.pictures];
    data.splice(index, 1);
    setpropertyData({ ...propertyData, pictures: data });
  };

  const handleImage = (index, e) => {
    e.preventDefault()
    let data = [...propertyData?.pictures];

    let image = e.target.files[0]
    if (!image) return;
    const storageRef = ref(storage, `/Images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snap) => {
        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        //       setImagePercent( percentUploaded ); 

      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((imgurl) => {
          data[index] = imgurl;
          setpropertyData({ ...propertyData, pictures: data });
        });
      })
  };

  
  const handleBroucher = ( e) => {
    e.preventDefault()
    let image = e.target.files[0]
    if (!image) return;
    const storageRef = ref(storage, `/Images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snap) => {
        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        //       setImagePercent( percentUploaded ); 

      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((imgurl) => {
          setpropertyData({ ...propertyData, broucher: imgurl });
        });
      })
  };

  
  return (

    <form>
      <div className="addproperty-container">
        <div className="addproperty-personalDetails">
          {/* 1st row */}
          <div className="addproperty-alignRow">
            {/* Property Name */}
            <div className="addproperty-inputFieldDiv form-group">
              <label className="addproperty-inputLabel ">
                Property Name{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                name="Property Name"
                placeholder="Property Name"
                className="addproperty-inputField"
                id={error.name ? 'red-border' : ''}
                onChange={handleInputchange('name')}
              />
            </div>
            {/* Location */}
            <div className="addproperty-inputFieldDiv form-group">
              <label className="addproperty-inputLabel">
                Property Location{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                id={error.location ? 'red-border' : ''}
                name="Property Location"
                placeholder="Property Location"
                className="addproperty-inputField"
                onChange={handleInputchange('location')}
              />
            </div>
          </div>

          {/* 2nd row */}
          <div className="addproperty-alignRow">
            {/* Location Latitude */}
            <div className="addproperty-inputFieldDiv form-group">
              <label className="addproperty-inputLabel">
                Location Latitude{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                name="Location Latitude"
                id={error.lat ? 'red-border' : ''}
                placeholder="Location Latitude"
                className="addproperty-inputField"
                onChange={handleInputchange('lat')}
              />
            </div>
            {/* Location Longitude */}
            <div className="addproperty-inputFieldDiv">
              <label className="addproperty-inputLabel">
                Location Longitude{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                name="Location Longitude"
                id={error.lng ? 'red-border' : ''}
                onChange={handleInputchange('lng')}
                placeholder="Location Longitude"
                className="addproperty-inputField"
                type="text"
              />
            </div>
          </div>
          {/* 3rd row */}

          <div className="addproperty-alignRow">
            {/* City */}
            <div className="addproperty-inputFieldDiv">
              <label className="addproperty-inputLabel">
                City <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                name="City"
                placeholder="City"
                className="addproperty-inputField"
                onChange={handleInputchange('city')}
                id={error.city ? 'red-border' : ''}
              />
            </div>
            {/* Area */}
            <div className="addproperty-inputFieldDiv">
              <label className="addproperty-inputLabel">
                Area <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                name="Area"
                placeholder="Area"
                className="addproperty-inputField"
                onChange={handleInputchange('area')}
                id={error.area ? 'red-border' : ''}
              />
            </div>
          </div>

          {/* 4th row */}
          <div className="addproperty-alignRow">
            {/* Units Left */}
            <div className="addproperty-inputFieldDiv">
              <label className="addproperty-inputLabel">
                Total Units {' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="number"
                name="Units Left"
                placeholder="Units Left"
                className="addproperty-inputField"
                onChange={handleInputchange('unitsLeft')}
                id={error.area ? 'red-border' : ''}
              />
            </div>
            {/* Price */}
            <div className="addproperty-inputFieldDiv">
              <label className="addproperty-inputLabel">
                Price{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="text"
                name="Price"
                placeholder="(xx L-yy L)"
                className="addproperty-inputField"
                onChange={handleInputchange('price')}
                id={error.price ? 'red-border' : ''}
              />
            </div>
          </div>
          {/* 5th row */}
          <div className="addproperty-alignRow">
            {/* Property Ready To Move In*/}
            <div className="addproperty-inputFieldDiv">
              <label className="addproperty-inputLabel">
                Ready To Move In{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <div onChange={handleInputchange('ready')}>
                <input type="radio" value="YES" name="city" /> YES
                &nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" value="NO" name="city" /> NO
              </div>
            </div>
            {/* Property  Pictures */}
            {/* <div className="addproperty-inputFieldDiv">
              <label className="addproperty-inputLabel">
                Property Pictures{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <input
                type="file"
                name="thumbnail"
                placeholder="Thumbnail"
                className="addproperty-inputField"
                onChange={(e) => handleFileInputchange(e)}
                id={error.pictures ? 'red-border' : ''}
                multiple
              />
            </div> */}
          </div>
          <Form.Group className="mb-5" controlId="formBasicEmail">
            <Form.Group
              className="mb-3 mt-4  d-flex justify-content-between align-items-center"
              controlId="formBasicPassword"
            >
              <h4>Add Images</h4>
              <button
                className="btn btn-sm btn-primary"
                onClick={addImages}
              >
                Add Images
              </button>
            </Form.Group>
            {propertyData?.pictures?.map((item, index) => {
              return (
                <>
                  <Form.Group key={index} className="mb-3 mt-3 d-flex justify-content-between align-items-center">
                    <h5> Image {index + 1}</h5>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => removeImage(index, e)}
                    >
                      Remove  {index + 1}
                    </button>
                  </Form.Group>
                  <Form.Control type="file" onChange={(e) => handleImage(index, e)} name="" placeholder="Choose Image" />
                </>
              )
            })
            }
          </Form.Group>
          
          <Form.Group>
          <h5>Add Broucher</h5>
          <Form.Control type="file" onChange={handleBroucher } name="" placeholder="Choose Image" />
          </Form.Group>


          {/* 6th row */}
          <div className="addproperty-alignRow">
            {/* Amenities */}
            <div className="addproperty-textFieldDiv">
              <label className="addproperty-inputLabel">
                Amenities{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <Select
                options={amenitiesoptions}
                isMulti
                className="addproperty-inputField"
                id={error.amenities ? 'red-border' : ''}
                onChange={(e) => handleInputAmenitieschange(e)}
              />
            </div>
          </div>

          {/* 7th row */}
          <div className="addproperty-alignRow">
            {/*Description*/}
            <div className="addproperty-textFieldDiv">
              <label className="addproperty-inputLabel">
                Description{' '}
                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
              </label>
              <ReactQuill
                className="addblog-textField"
                placeholder="Add Blog Content here"
                id={error.content ? "red-border" : ""}
                modules={AddPropertyForm.modules}
                formats={AddPropertyForm.formats}
                theme="snow"
                onChange={(content, delta, source, editor) => {
                  setpropertyData({ ...propertyData, description: editor.getHTML() });
                }}
              />
            </div>
          </div>

          <div className="addproperty-submitDetailDiv">
            <button
              className="addproperty-submitDetailBtn"
              onClick={handlesubmit}
            >
              Add Property
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
  );
};

export default AddPropertyForm;
