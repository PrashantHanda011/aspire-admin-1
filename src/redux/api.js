import axios from "axios";
import Cookies from "js-cookie";

// for live server
const API = axios.create({
  baseURL: "https://aspire-kappa.vercel.app/",
});

// Property

export const getAllProperty = () => API.get("/prop/getAllProperty");
export const addProperty = (data) => API.post("/prop/addProperty", data);
export const deleteProperty = (propid) =>
  API.post("/prop/deleteProperty", { id: propid });
export const getPropertyById = (propid) =>
  API.post("/prop/getPropertyById", { id: propid });
export const updateProperty = (data) => API.post("/prop/updateProperty", data);
export const getAllRequirements = () => API.get("/prop/getRequirements");

// UnitDetails
export const addUnitDetail = (data) => API.post("/prop/addUnitDetail", data);
export const getUnitDetailByPropertyId = (propid) =>
  API.post("/prop/getUnitDetail", { id: propid });
export const deleteUnitDetail = (id, bhk, did) =>
  API.post("/prop/deleteUnitDetail", {
    id: id,
    bhk: bhk,
    detailId: did,
  });

//usp
export const getUSP = (data) => API.post("/prop/getUsp", data);
export const addUSP = (data) => API.post("/prop/addUsp", data);
export const DeleteUSP = (data) => API.post("/prop/deleteUsp", data);
export const GetPrice = () => API.get("/cn/getForm");

// Developer

export const getAllDeveloper = () => API.get("/dev/getAllDeveloper");
export const addDeveloper = (data) => API.post("/dev/addDeveloper", data);
export const deleteDeveloper = (devid) =>
  API.post("/dev/deleteDeveloper", { id: devid });
export const getDeveloperById = (devid) =>
  API.post("/dev/getDeveloperById", { id: devid });
export const updateDeveloper = (data) => API.post("/dev/updateDeveloper", data);

// Blogs

export const getAllBlogs = () => API.get("/blog/getAllBlog");
export const addBlog = (data) => API.post("/blog/addBlog", data);
export const deleteBlog = (blogid) =>
  API.post("/blog/deleteBlog", { id: blogid });
export const getBlogById = (blogid) =>
  API.post("/blog/getBlogById", { id: blogid });
export const updateBlog = (data) => API.post("/blog/updateBlog", data);

//Career

export const getAllCareer = () => API.get("/cr/getAllCareer");
export const getAllCareerApplication = () => API.get("/cr/getAllApplications");
export const getCareerById = (blogid) =>
  API.post("/cr/getCareerById", { id: blogid });
export const addCareer = (data) => API.post("/cr/addCareer", data);
export const updateCareer = (data) => API.post("/cr/updateCareer", data);
export const deleteCareer = (blogid) =>
  API.post("/cr/deleteCareer", { id: blogid });

//featured Project

export const getAllProject = () => API.get("/proj/getAllProject");
export const getProjectById = (pid) =>
  API.post("/proj/getProjectById", { id: pid });
export const addProject = (data) => API.post("/proj/addProject", data);
export const updateProject = (data) => API.post("/proj/updateProject", data);
export const deleteProject = (projid) =>
  API.post("/proj/deleteProject", { id: projid });

//Loans

export const getAllLoan = () => API.get("/ln/getAllLoan");
export const getLoanById = (lid) => API.post("/ln/getLoanById", { id: lid });
export const addLoan = (data) => API.post("/ln/addLoan", data);
export const updateLoan = (data) => API.post("/ln/updateLoan", data);
export const deleteLoan = (lid) => API.post("/ln/deleteLoan", { id: lid });

//Contacts

export const getAllContacts = () => API.get("/cn/getAllContacts");
export const getContactsById = (lid) =>
  API.post("/cn/getContactsById", { id: lid });
export const addContacts = (data) => API.post("/cn/addContacts", data);
export const updateContacts = (data) => API.post("/cn/updateContacts", data);
export const deleteContacts = (cid) =>
  API.post("/cn/deleteContacts", { id: cid });

//Experts

export const getAllExperts = () => API.get("/cn/getAllExperts");
