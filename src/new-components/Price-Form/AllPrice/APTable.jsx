import React, { useState, useEffect } from "react";
import "../../../styles/newstyles/table.css";
import { useParams } from "react-router-dom";
import APTableRow from "./APTableRow";
import { DeleteUSP } from "../../../redux/api";

const APTable = ({ unitDetailsData, propid }) => {
const [USPData, setUSPData] = useState([])
const param =useParams()
useEffect(() => {
 setUSPData(unitDetailsData)
}, [unitDetailsData])
console.log(unitDetailsData)

console.log(param   )
const handleDelete = async(id)=>{
    try {
        const newdata = USPData.filter((item)=>item._id!=id)
        const yes = window.confirm("Do you want to delte ?");
        if(yes){
            const payload={
                id:param.id,
                uspId:id
            }
            console.log(payload)
            setUSPData(newdata) 
            const res = await DeleteUSP(payload);
            console.log(res)
        }
        

    } catch (error) {
        console.log(error)
    }

}
  return (
    <>
      {unitDetailsData  ? (
        <div className="table-wrapper" id="#scrollBar">
          <table className="fl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Property</th>
              </tr>
            </thead>
            <tbody>
              {
                USPData.map((item,index)=>{
                    return   <APTableRow
                        id={item._id}
                        key={index}
                        index={index}
                        handleDelete={handleDelete}
                        icon = {item.icon}
                        name={item.name}
                        phone={item.phone}
                        property={item.property}
                        email={item.email}
                        detail= {item.detail}
                        propid={propid}
                      />
                })
                }
            </tbody>
          </table>
        </div>
      ) : (
        <h6 className="text-center">No details available</h6>
      )}
    </>
  );
};

export default APTable;
