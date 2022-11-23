import React, { useState, useEffect } from "react";
import "../../../styles/newstyles/table.css";
import { useParams } from "react-router-dom";
import AUTableRow from "./AUTableRow";
import { DeleteUSP } from "../../../redux/api";

const AUTable = ({ unitDetailsData, propid }) => {
const [USPData, setUSPData] = useState([])
const param =useParams()
useEffect(() => {
 setUSPData(unitDetailsData)
}, [unitDetailsData])

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
      {USPData  ? (
        <div className="table-wrapper" id="#scrollBar">
          <table className="fl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Icon</th>
                <th>Detail</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                USPData.map((item,index)=>{
                    return   <AUTableRow
                        id={item._id}
                        key={index}
                        index={index}
                        handleDelete={handleDelete}
                        icon = {item.icon}
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

export default AUTable;
