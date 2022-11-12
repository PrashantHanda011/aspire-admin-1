import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addPropertyForm.css';
import { useParams, useHistory } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../../redux/api';
import { storage } from '../../firebase';
import LoadingPage from '../utils/LoadingPage';
import Select from 'react-select';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { Form } from 'react-bootstrap';
const EditPropertyForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const [selectedAmenities, setselectedAmenities] = useState([]);
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
    lat: '',
    lng: '',
    city: '',
    area: '',
    BHK: '',
    price: '',
    ready: '',
    unitsLeft: '',
    amenities: '',
    pictures: [],
    description: '',
  });

  console.log(propertyData)
  const [error, setError] = useState({
    name: false,
    location: false,
    lat: false,
    lng: false,
    city: false,
    area: false,
    BHK: false,
    price: false,
    ready: false,
    unitsLeft: false,
    amenities: false,
    pictures: false,
    description: false,
  });
  const getPropertyData = async () => {
    setLoading(true);
    try {
      const res = await getPropertyById(id);
      const pdata = res.data.data;
      setpropertyData({
        ...pdata,
        ready: pdata.ready === true ? 'YES' : 'NO',
        area: pdata.area.slice(0, -4),
      });
      console.log(pdata);
      console.log(
        pdata.amenities.map((amen) => ({ value: amen, label: amen }))
      );
      setselectedAmenities(
        pdata.amenities.map((amen) => ({ value: amen, label: amen }))
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getPropertyData(id);
  }, []);
  const handleInputAmenitieschange = (value) => {
    setselectedAmenities(value);
  };
  const handleImageDelete = (event, imgurl) => {
    setpropertyData({
      ...propertyData,
      pictures: propertyData.pictures.filter((img) => {
        return img !== imgurl;
      }),
    });
  };
  const handleInputchange = (name) => (event) => {
    setpropertyData({ ...propertyData, [name]: event.target.value });
  };

  async function uploadImageAsPromise(file) {
    const storageRef = ref(storage, `PropertyPictures/${file.name}`);
    return new Promise(function (resolve, reject) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        function error(err) {
          reject(err);
        },
        async function complete() {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
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
    setpropertyData({
      ...propertyData,
      pictures: [...propertyData.pictures, ...data],
    });
  };

  const handlerValidatedFormSubmit = async () => {
    try {
      await updateProperty({
        id: id,
        ...propertyData,
        ready: propertyData.ready === 'YES' ? true : false,
        amenities: selectedAmenities.map((amen) => amen.value),
        area: propertyData.area + 'sqft',
      });
      // history.push('/property');
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
      BHK: propertyData.BHK == '' ? true : false,
      price: propertyData.price == '' ? true : false,
      ready: propertyData.ready == '' ? true : false,
      unitsLeft: propertyData.unitsLeft == '' ? true : false,
      amenities: !selectedAmenities.length ? true : false,
      pictures: !propertyData.pictures.length ? true : false,
      description: propertyData.description == '' ? true : false,
    };
    console.log(updatedError);
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
        !error.BHK &&
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



  
  //images

  const addImages = (e) => {
    e.preventDefault()
    let newfield = e.target.value;
    setpropertyData({
      ...propertyData,
      pictures: [...propertyData?.pictures, newfield],
    });
  };


  const removeImage = (index,e) => {
    e.preventDefault();
    let data = [...propertyData?.pictures];
    data.splice(index, 1);
    setpropertyData({ ...propertyData, pictures: data });
  };

  const handleImage = (index,e ) => {
   e.preventDefault()
   let data = [...propertyData?.pictures];

    let image=e.target.files[0]
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

console.log(propertyData)


  return (
    <form>
      <div className="addproperty-container">
        {loading ? (
          <LoadingPage />
        ) : (
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
                  value={propertyData.name}
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
                  value={propertyData.location}
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
                  value={propertyData.lat}
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
                  value={propertyData.lng}
                />
              </div>
            </div>
            {/* 3rd row */}
            <div className="addproperty-alignRow">
              {/* City */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  City{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="City"
                  placeholder="City"
                  className="addproperty-inputField"
                  onChange={handleInputchange('city')}
                  id={error.city ? 'red-border' : ''}
                  value={propertyData.city}
                />
              </div>
              {/* Area */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  Area{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  name="Area"
                  placeholder="Area"
                  className="addproperty-inputField"
                  onChange={handleInputchange('area')}
                  id={error.area ? 'red-border' : ''}
                  value={propertyData.area}
                />
              </div>
            </div>

            {/* 4th row */}
            <div className="addproperty-alignRow">
              {/* BHK */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  BHK{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="number"
                  name="BHK"
                  placeholder="BHK"
                  className="addproperty-inputField"
                  onChange={handleInputchange('BHK')}
                  id={error.BHK ? 'red-border' : ''}
                  value={propertyData.BHK}
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
                  value={propertyData.price}
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
                  <input
                    type="radio"
                    value="YES"
                    name="city"
                    checked={propertyData.ready === 'YES'}
                  />{' '}
                  YES &nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type="radio"
                    value="NO"
                    name="city"
                    checked={propertyData.ready === 'NO'}
                  />{' '}
                  NO
                </div>
              </div>
              {/* Units Left */}
              <div className="addproperty-inputFieldDiv">
                <label className="addproperty-inputLabel">
                  Units Left{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="number"
                  name="Units Left"
                  placeholder="Units Left"
                  className="addproperty-inputField"
                  onChange={handleInputchange('unitsLeft')}
                  id={error.area ? 'red-border' : ''}
                  value={propertyData.unitsLeft}
                />
              </div>
            </div>

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
                  value={selectedAmenities}
                />
              </div>
            </div>
            {/*7th row */}
            <div className="addproperty-alignRow">
              {/* Property  Pictures */}
              <div className="addproperty-textFieldDiv">
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
              </div>
            </div>
            {/* 8th row   :- Image Preview */}
            <div className="addproperty-alignRow">
              <div className="addproperty-textFieldDiv d-flex flex-wrap flex-row gap-5">
                
              </div>
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
                        onClick={(e) => removeImage(index,e)}
                      >
                        Remove  {index + 1}
                      </button>
                    </Form.Group>
                    <Form.Control type="file"  onChange={(e) => handleImage(index, e)} name="" placeholder="Choose Image" />

                    <img src={item} alt="Property-img" style={{height:"80px",width:"100px"}} className="my-2" />
                  </>
                )
              })
              }
            </Form.Group>



            {/* 9th row */}
            <div className="addproperty-alignRow">
              {/*Description*/}
              <div className="addproperty-textFieldDiv">
                <label className="addproperty-inputLabel">
                  Description{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <textarea
                  className="addproperty-textField"
                  onChange={handleInputchange('description')}
                  name="Description"
                  placeholder="Property Description"
                  id={error.description ? 'red-border' : ''}
                  value={propertyData.description}
                ></textarea>
              </div>
            </div>

            <div className="addproperty-submitDetailDiv">
              <button
                className="addproperty-submitDetailBtn"
                onClick={handlesubmit}
              >
                Edit Property
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
        )}
      </div>
    </form>
  );
};

export default EditPropertyForm;
