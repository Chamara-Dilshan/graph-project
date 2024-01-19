import React from 'react';
import './Test.css';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Tooltip, Cell, BarChart, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';


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

          const lineChartData = excelData.map((value, index) => ({
            name: `${index + 1}`,
            value: value,
          }));

          const composedChartData = excelData.map((value, index) => ({
            name: `${index + 1}`,
            lineValue: value , // Example: Using a line value twice the bar value
            barValue: value,
          }));


          // const jsonData = excelData.map((value, index) => ({
          //   name: `${index + 1}`,
          //   value: value,
          // }));
          // const firstColumnData = jsonData.map(row => row['Column1']);

          // const XAxisLabel = Object.keys(excelData[0])[0];

          

      return (
        <div>

          <div className='chart'>
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

          <div className='chart'>
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
          
          <div className="chart">
            <h2>Line Chart</h2>
            <LineChart 
              width={500} 
              height={400} 
              data={lineChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </div>

          <div className='chart'>
            <h2>Composed Chart</h2>
            <ComposedChart 
              width={500} 
              height={400} 
              data={composedChartData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis  />
            <Tooltip />
            <Bar dataKey="barValue" barSize={30} fill="#413ea0" />
            <Line type="monotone" dataKey="lineValue" stroke="#82ca9d" />
            </ComposedChart>
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
