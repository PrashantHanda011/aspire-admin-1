import React, { useEffect, useRef, useState } from "react";
import "../../styles/newstyles/addBlogForm.css";
import { useHistory } from "react-router-dom";
import { addBlog } from "../../redux/api";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import ReactQuill from "react-quill";
import Form from "react-bootstrap/Form";
import "react-quill/dist/quill.snow.css";

const AddBlogForm = () => {
  const isFirstRender = useRef(true);
  const [spinn, setspinn] = useState(false);
  const history = useHistory();

  const [blogData, setblogData] = useState({
    title: "",
    picture: "",
    authorName: "",
    category: "",
    timeToRead: "",
    content: "",
  });

  const [error, setError] = useState({
    title: false,
    picture: false,
    authorName: false,
    category: false,
    timeToRead: false,
    content: false,
  });
  const handleInputContentchange = (value) => {
    setblogData({ ...blogData, content: value });
  };
  const handleInputchange = (name) => (event) => {
    setblogData({ ...blogData, [name]: event.target.value });
  };
  const handleTimeInputChange = (event) => {
    setblogData({ ...blogData, timeToRead: event.target.value + "min" });
  };
  AddBlogForm.formats = [
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
  AddBlogForm.modules = {
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
  const handleFileInputchange = (name) => async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `${name}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
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
      await addBlog(blogData);
      history.push("/blogs");
      setspinn(false);
    } catch (error) {
      console.log(error);
      setspinn(false);
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const updatedError = {
      title: blogData.title === "" ? true : false,
      picture: blogData.picture === "" ? true : false,
      authorName: blogData.authorName === "" ? true : false,
      category: blogData.category === "" ? true : false,
      timeToRead: blogData.timeToRead === "" ? true : false,
      content: blogData.content === "" ? true : false,
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
        <div className="addblog-personalDetails">
          {/* 1st row */}
          <div className="addblog-alignRow">
            {/* aUthor Name */}
            <div className="addblog-inputFieldDiv form-group">
              <label className="addblog-inputLabel ">
                Author Name{" "}
                <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
              </label>
              <input
                type="text"
                name="Author Name"
                placeholder="Full Name"
                className="addblog-inputField"
                id={error.authorName ? "red-border" : ""}
                onChange={handleInputchange("authorName")}
              />
            </div>
            {/* Title */}
            <div className="addblog-inputFieldDiv form-group">
              <label className="addblog-inputLabel">
                Blog Title{" "}
                <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
              </label>
              <input
                type="text"
                id={error.title ? "red-border" : ""}
                name="Title"
                placeholder="Blog Title"
                className="addblog-inputField"
                onChange={handleInputchange("title")}
              />
            </div>
          </div>

          {/* 2nd row */}
          <div className="addblog-alignRow">
            {/* Category */}
            <div className="addblog-inputFieldDiv form-group">
              <label className="addblog-inputLabel">
                Category{" "}
                <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
              </label>
              <Form.Select
                aria-label="Select Category"
                id={error.category ? "red-border" : ""}
                placeholder="Title Tagling"
                className="addblog-inputField"
                onChange={handleInputchange("category")}
              >
                <option>Select Category</option>
                <option value="Knowledge Seriess">Knowledge Series</option>
                <option value="News & Updates">News & Updates</option>
                <option value="Locality Bytes">Locality Bytes</option>
                <option value="Others">Others</option>
              </Form.Select>
            </div>
            {/* TimetoRead */}
            <div className="addblog-inputFieldDiv">
              <label className="addblog-inputLabel">
                Time To Read (Minutes){" "}
                <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
              </label>
              <input
                name="minutes"
                id={error.timeToRead ? "red-border" : ""}
                onChange={handleTimeInputChange}
                className="addblog-inputField"
                type="number"
              />
            </div>
          </div>
          {/* 3rd row */}

          <div className="addblog-alignRow">
            {/* Blog Picture */}
            <div className="addblog-inputFieldDiv">
              <label className="addblog-inputLabel">
                Blog Picture{" "}
                <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
              </label>
              <input
                type="file"
                name="thumbnail"
                placeholder="Thumbnail"
                className="addblog-inputField"
                onChange={handleFileInputchange("picture")}
                id={error.picture ? "red-border" : ""}
              />
            </div>
          </div>

          {/* 5th row */}
          <div className="addblog-alignRow">
            {/*content*/}
            <div className="addblog-textFieldDiv">
              <label className="addblog-inputLabel">
                Content{" "}
                <span style={{ color: "red", fontSize: "1.2rem" }}>*</span>{" "}
              </label>
              <ReactQuill
                className="addblog-textField"
                placeholder="Add Blog Content here"
                id={error.content ? "red-border" : ""}
                modules={AddBlogForm.modules}
                formats={AddBlogForm.formats}
                theme="snow"
                onChange={(content, delta, source, editor) => {
                  setblogData({ ...blogData, content: editor.getHTML() });
                }}
              />
            </div>
          </div>

          <div className="addblog-submitDetailDiv">
            <button className="addblog-submitDetailBtn" onClick={handlesubmit}>
              Add Blog
              {spinn ? (
                <div
                  class="spinner-border spinner-border-sm text-white mx-2"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                ""
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddBlogForm;
