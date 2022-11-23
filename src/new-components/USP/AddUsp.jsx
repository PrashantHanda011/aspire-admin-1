import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addUnitDetailForm.css';
import { useParams, useHistory } from 'react-router-dom';
import { addUnitDetail, addUSP } from '../../redux/api';
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { Button } from 'react-bootstrap';

const AddUsp = () => {
    const isFirstRender = useRef(true);
    const [spinn, setspinn] = useState(false);
    const history = useHistory();
    const { id } = useParams();
    const [bhk, setbhk] = useState();
    const [detailData, setdetailData] = useState({
       icon:"",
       detail:""
    });

    const [error, setError] = useState({
        range: false,
        floorPlan: false,
        size: false,
        price: false,
    });
    console.log(detailData)

    const handleInputchange = (e) => {
        let {name,value}=e.target
        setdetailData({ ...detailData, [name]: value });
    };
    const handleBhkInputchange = (event) => {
        setbhk(event.target.value);
    };

    const handlerValidatedFormSubmit = async (e) => {
        setspinn(true)
        e.preventDefault()
        try {
            const payloaddata = {
                id: id,
                ...detailData
            };
            const res = await addUSP(payloaddata);
            console.log(res)
            history.push(`/property/usp/${id}`);
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
            (snapshot) => { },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setdetailData({ ...detailData, icon: url });
                });
            }
        );
    };

    return (
        <form>
            <div className="unitdetail-container">
                <div className="unitdetail-personalDetails">

                    <div className="unitdetail-alignRow">
                        <div className="unitdetail-alignRow">
                            <div className="unitdetail-textFieldDiv form-group">
                                <label className="unitdetail-inputLabel ">
                                    Icon{' '}
                                    <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                                </label>
                                <input
                                    type="file"
                                    name="icon"
                                    placeholder="Icon"
                                    className="unitdetail-inputField"
                                    id={error.floorPlan ? 'red-border' : ''}
                                    onChange={handleFileInputchange('floorplan')}
                                />
                            </div>
                        </div>

                    </div>
                        <div className="unitdetail-textFieldDiv form-group">
                            <label className="unitdetail-inputLabel">
                                Detail {' '}
                                <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                            </label>
                            <input
                                type="text"
                                id={error.price ? 'red-border' : ''}
                                name="detail"
                                placeholder="Detail"
                                className="unitdetail-inputField"
                                onChange={handleInputchange}
                            />
                        </div>
                    {/* 3rd Row  */}
                    {/* Submit */}
                    <div className="unitdetail-submitDetailDiv">
                        <button
                            className="unitdetail-submitDetailBtn"
                            onClick={handlerValidatedFormSubmit}
                        >
                            Add USP
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

export default AddUsp;
