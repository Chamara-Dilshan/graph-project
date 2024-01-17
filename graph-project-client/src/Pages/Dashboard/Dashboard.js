import React from 'react';
import './Dashboard.css';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';


function Dashboard() {
    
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
            const workbook = XLSX.read(excelFile,{type: 'buffer'});
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data.slice(0,10));
        }
    };
    


    // Render PieChart only if excelData is available
    const renderPieChart = () => {
        if (excelData) {
        const individualExcelData = excelData[0];
        const chartData = Object.keys(individualExcelData).map((key) => ({
            name: key,
            value: individualExcelData[key],
        }));

      return (
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }
    return null;
  };




  return (
    <div className='wrapper'>
        <h3>Upload & View Excel Sheets</h3>
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
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                {Object.keys(excelData[0]).map((key) => (
                                    <th key={key}> {key} </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.map((individualExcelData, index) => (
                                <tr key={index}>
                                    {Object.keys(individualExcelData).map((key) => 
                                        <td key={key}>{individualExcelData[key]}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Call the renderPieChart function here */}
                    {renderPieChart()}
                
                </div>
            ):(
                <div>No File is uploaded yet! </div>
            )}
        </div>

    
    </div>
    
  );
}

export default Dashboard;
