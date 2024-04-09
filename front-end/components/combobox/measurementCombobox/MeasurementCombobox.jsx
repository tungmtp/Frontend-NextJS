// import React, { useEffect } from 'react'
// import Autocomplete from "@mui/material/Autocomplete";
// export default function MeasurementCombobox(parentProp) {
//     const [measurementData, setMeasurementData] = useState([]);
//     useEffect(() => {
//         const getMeasurementData = async () => {
//           try {

//             const result = await getData("/product-service/Measurement");
//             const changeFieldName = result.map((item) => {
//               return {
//                 ...item,
//                 label: item.measName, // Tạo trường label từ trường measName
//               };
//             });

//             setMeasurementData(changeFieldName);

//           } catch (err) {
//             console.error("Error fetching data:", err);
//           }
//         };
//         getMeasurementData();

//         console.log("rendering again");
//       }, []);
//   return (
//     <Autocomplete
//     id=""
//     options={measurementData}
//     sx={{ marginTop: 2, marginX: 5, width: "91%" }}
//     renderInput={(params) => (
//       <TextField {...params} label="Đơn vị quy chuẩn" />
//     )}
//     value={
//       measurementData.length > 0
//         ? measurementData.find(
//             (measurement) => measurement.id === selectedDataGrid.measID
//           )
//         : ""
//     }
//     onChange={(event, value) => {
//       if (value) {
//         const updatedSelectedDataGrid = { ...selectedDataGrid };
//         updatedSelectedDataGrid.measID = value.id;
//         console.log(value);
//         setSelectedDataGrid(updatedSelectedDataGrid);
//       }
//     }}
//     //   onChange={handleOnChange}
//   />
//   )
// }
