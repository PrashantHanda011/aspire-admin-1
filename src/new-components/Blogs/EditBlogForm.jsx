import React, { useEffect, useRef, useState } from 'react';
import '../../styles/newstyles/addBlogForm.css';
import { useParams, useHistory } from 'react-router-dom';
import { getBlogById, updateBlog } from '../../redux/api';
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import LoadingPage from '../../new-components/utils/LoadingPage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Form from 'react-bootstrap/Form';

const EditBlogForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const [blogData, setblogData] = useState({});

  const [error, setError] = useState({
    title: false,
    picture: false,
    authorName: false,
    category: false,
    timeToRead: false,
    content: false,
  });
  const getBlogData = async () => {
    setLoading(true);
    try {
      const res = await getBlogById(id);
      const bdata = res.data.data;
      setblogData({
        ...bdata,
        tags: bdata.tags.join(' '), //later change to tags array,
        timeToRead: bdata.timeToRead.slice(0, -3),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBlogData(id);
  }, []);
  const handleInputContentchange = (value) => {
    setblogData({ ...blogData, content: value });
  };
  const handleInputchange = (name) => (event) => {
    setblogData({ ...blogData, [name]: event.target.value });
  };
  EditBlogForm.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];
  EditBlogForm.modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
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
          setblogData({ ...blogData, [name]: url });
        });
      }
    );
  };

  const handlerValidatedFormSubmit = async () => {
    try {
      const payloaddata = {
        ...blogData,
        tags: blogData.tags.split(' ').filter((t) => t.length), //later change to tags array
        timeToRead: blogData.timeToRead + 'min',
        id: blogData._id,
      };
      await updateBlog(payloaddata);
      history.push('/blogs');
      console.log('update complete');
      setspinn(false);
    } catch (error) {
      console.log(error);
      setspinn(false);
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      title: blogData.title === '' ? true : false,
      picture: blogData.picture === '' ? true : false,
      authorName: blogData.authorName === '' ? true : false,
      category: blogData.category === '' ? true : false,
      timeToRead: blogData.timeToRead === '' ? true : false,
      content: blogData.content === '' ? true : false,
    };
    setError(updatedError);
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } else {
      if (
        !error.title &&
        !error.picture &&
        !error.authorName &&
        !error.category &&
        !error.timeToRead &&
        !error.content
      ) {
        setspinn(true);
        handlerValidatedFormSubmit();
      }
    }
  }, [error]);

  return (
    <form>
      <div className="addblog-container">
        {loading ? (
          <LoadingPage />
        ) : (
          <div className="addblog-personalDetails">
            {/* 1st row */}
            <div className="addblog-alignRow">
              {/* aUthor Name */}
              <div className="addblog-inputFieldDiv form-group">
                <label className="addblog-inputLabel ">
                  Author Name{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  value={blogData.authorName}
                  type="text"
                  name="Author Name"
                  placeholder="Full Name"
                  className="addblog-inputField"
                  id={error.authorName ? 'red-border' : ''}
                  onChange={handleInputchange('authorName')}
                />
              </div>
              {/* Title */}
              <div className="addblog-inputFieldDiv form-group">
                <label className="addblog-inputLabel">
                  Blog Title{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="text"
                  value={blogData.title}
                  id={error.title ? 'red-border' : ''}
                  name="Title"
                  placeholder="Blog Title"
                  className="addblog-inputField"
                  onChange={handleInputchange('title')}
                />
              </div>
            </div>

            {/* 2nd row */}
            <div className="addblog-alignRow">
              {/* Category */}
              <div className="addblog-inputFieldDiv form-group">
                <label className="addblog-inputLabel">
                  Category{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <Form.Select
                  aria-label="Select Category"
                  id={error.category ? 'red-border' : ''}
                  placeholder="Title Tagling"
                  className="addblog-inputField"
                  onChange={handleInputchange('category')}
                >
                  <option>~ {blogData.category} ~ </option>
                  <option value="Knowledge Seriess">Knowledge Series</option>
                  <option value="News & Updates">News & Updates</option>
                  <option value="Locality Bytes">Locality Bytes</option>
                  <option value="Others">Others</option>
                </Form.Select>
              </div>
              {/* TimetoRead */}
              <div className="addblog-inputFieldDiv">
                <label className="addblog-inputLabel">
                  Time To Read (Minutes){' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  name="minutes"
                  value={blogData.timeToRead}
                  id={error.timeToRead ? 'red-border' : ''}
                  onChange={handleInputchange('timeToRead')}
                  className="addblog-inputField"
                  type="number"
                />
              </div>
            </div>

            {/* 3rd row */}
            <div className="addblog-alignRow">
              {/* Author PIctue */}
              {/* <div className="addblog-inputFieldDiv">
                <label className="addblog-inputLabel">
                  Author Profile{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="file"
                  name="profilePic"
                  placeholder="Author Profile"
                  className="addblog-inputField"
                  onChange={handleFileInputchange('authorPicture')}
                  id={error.authorPicture ? 'red-border' : ''}
                />
                <div className="addblog-inputFieldDiv-image">
                  <img
                    src={blogData.authorPicture}
                    height="100px"
                    width="100px"
                    alt="product image"
                  />
                </div>
              </div> */}
              {/* Blog Picture */}
              <div className="addblog-inputFieldDiv">
                <label className="addblog-inputLabel">
                  Blog Picture{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  placeholder="Thumbnail"
                  className="addblog-inputField"
                  onChange={handleFileInputchange('picture')}
                  id={error.picture ? 'red-border' : ''}
                />
                <div className="addblog-inputFieldDiv-image">
                  <img
                    src={blogData.picture}
                    height="100px"
                    width="100px"
                    alt="product image"
                  />
                </div>
              </div>
            </div>

            {/* 4th row */}
            
            {/* 5th row */}
            <div className="addblog-alignRow">
              {/*content*/}
              <div className="addblog-textFieldDiv">
                <label className="addblog-inputLabel">
                  Content{' '}
                  <span style={{ color: 'red', fontSize: '1.2rem' }}>*</span>{' '}
                </label>
                <ReactQuill
                  className="addblog-textField"
                  placeholder="Add Blog Content here"
                  id={error.content ? 'red-border' : ''}
                  modules={EditBlogForm.modules}
                  formats={EditBlogForm.formats}
                  theme="snow"
                  onChange={(content, delta, source, editor) => {
                    setblogData({ ...blogData, content: editor.getHTML() });
                  }}
                  value={blogData.content}
                />
              </div>
            </div>

            <div className="addblog-submitDetailDiv">
              <button
                className="addblog-submitDetailBtn"
                onClick={handlesubmit}
              >
                Update Blog
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

export default EditBlogForm;
