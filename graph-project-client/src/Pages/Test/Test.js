// import React, { useState } from 'react';
// import { ExcelRenderer, OutTable } from 'react-excel-renderer';
// import { PieChart, Pie, Tooltip, Cell } from 'recharts';
// import { useDropzone } from 'react-dropzone';

// function Test() {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   const handleFileDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const fileExtension = file.name.split('.').pop().toLowerCase();

//     if (file && (fileExtension === 'csv' || fileExtension === 'xls' || fileExtension === 'xlsx')) {
//       setFile(file);
//       setError(null);

//       ExcelRenderer(file, (err, resp) => {
//         if (err) {
//           setError(err);
//         } else {
//           setData(resp.rows);
//         }
//       });
//     } else {
//       setError('Please upload a valid Excel file');
//     }
//   };

//   const getChartData = () => {
//     if (data && data.length > 0) {
//       const labels = data[0];
//       const datasets = data.slice(1).map((row, index) => ({
//         label: row[0],
//         data: row.slice(1),
//         backgroundColor: index % 2 === 0 ? '#FB8833' : '#17A8F5',
//       }));

//       return {
//         labels,
//         datasets,
//       };
//     } else {
//       return null;
//     }
//   };

//   const chartData = getChartData();

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileDrop });

//   return (
//     <div>
//       <h1>Import Excel File</h1>
//       <div {...getRootProps()} className="dropzone">
//         <input {...getInputProps()} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
//         {isDragActive ? (
//           <p>Drop the file here ...</p>
//         ) : (
//           <p>Drag and drop a file here, or click to select a file</p>
//         )}
//       </div>
//       <div>{file && `${file.name}`}</div>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {chartData && (
//         <div>
//           <h2>Pie Chart</h2>
//           <PieChart width={400} height={400}>
//             <Pie
//               dataKey="value"
//               data={chartData.datasets}
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               fill="#8884d8"
//               label
//             >
//               {chartData.datasets.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.backgroundColor} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//           <h2>Table</h2>
//           <OutTable data={data} columns={chartData.labels} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Test;

import React from 'react';
import './Test.css';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';


function Test() {
    
    //on change states
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);

    //submit state
    const [excelData, setExcelData] = useState(null);

    //onchange event
    const handleFile = (e) => {
        let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        let selectedFile = e.target.files[0];
        if(selectedFile){
            if(selectedFile && fileTypes.includes(selectedFile.type)){
                setTypeError(null);
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFile(e.target.result);
                }
            }
            else{
                setTypeError('Please select only excel file types');
                setExcelFile(null);
            }
            
        }
        else{
            console.log('Please select your file');
        }
    }

    // submit event
    const handleFileSubmit = (e) => {
        e.preventDefault();
        if(excelFile!==null){
            const workbook = XLSX.read(excelFile, {type: 'buffer'});
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            
          // Check if the data array is not empty
          if (data.length > 0) {
            // Assuming the first column in the sheet
            const columnName = Object.keys(data[0])[1];
            const columnData = data.map(row => row[columnName]);

            setExcelData(columnData.slice(0, 10));
            console.log(excelData);
          } else {
            console.error("No data found in the Excel sheet.");
          }
        }
    };
    
    // Render PieChart only if excelData is available
    const renderCharts = () => {
        if (excelData) {

          const pieChartData = excelData.map((value, index) => ({
            name: `${index + 1}`,
            value: value,

        }));
          const barChartData = excelData.map((value, index) => ({
            name: `${index + 1}`,
            value: value,
        }));

      return (
        <div>

          <div className='Chart'>
            <h2>Pie Chart</h2>
            <PieChart width={500} height={400}>
            <Pie
              dataKey="value"
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
            </PieChart>
          </div>

          <div className='Chart'>
          <h2>Bar Chart</h2>
            <BarChart 
              width={500} 
              height={400} 
              data={barChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={30}
            >
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
          
      </div>
          
      );
    }
    return null;
  };


  return (
    <div className='wrapper'>
        <h3>Upload & View Graphs</h3>
        <form className='form-group custom-form' onSubmit = {handleFileSubmit}>
            <input type='file' className='form-control' required onChange={handleFile}/>
            <button type='submit' className='btn btn-success btn-md'>Upload</button>
            {typeError && (
                <div className='alert alert-danger' role='alert'> {typeError} </div>
            )

            }
        </form>

        <div className='viewer'>
            {excelData?(
                <div className='graph'>
                    {/* Call the renderPieChart function here */}
                    {renderCharts()}     
                
                </div>
            ):(
                <div>
                  No File is uploaded yet!

                </div>
            )}
        </div>

        
    </div>
    
  );
}

export default Test;
