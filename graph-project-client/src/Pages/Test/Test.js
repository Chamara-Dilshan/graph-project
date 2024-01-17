import React, { useState } from 'react';
import {ExcelRenderer, OutTable} from 'react-excel-renderer';
import {PieChart, Pie, Tooltip, Cell} from 'recharts';
import {useDropzone} from 'react-dropzone';

function Test() {
  const [file, setFile] = useState(null); // state for storing the file
  const [data, setData] = useState(null); // state for storing the data from the file
  const [error, setError] = useState(null); // state for storing any error message

  // function to handle the file drop event
  const handleFileDrop = (acceptedFiles) => {
    // get the first file from the array
    const file = acceptedFiles[0];
    // get the file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    // check the file type
    if (file && (fileExtension === 'csv' || fileExtension === 'xls' || fileExtension === 'xlsx')) {
      // set the file state
      setFile(file);
      // clear any previous error message
      setError(null);
      // use the ExcelRenderer to convert the file to JSON data
      ExcelRenderer(file, (err, resp) => {
        if (err) {
          // handle the error
          setError(err);
        }
        else {
          // set the data state with the first sheet of the excel file
          setData(resp.rows);
        }
      });
    }
    else {
      // invalid file type
      setError("Please upload a valid Excel file");
    }
  };

  // function to get the chart data from the excel data
  const getChartData = () => {
    // check if the data is available
    if (data && data.length > 0) {
      // get the labels from the first row of the data
      const labels = data[0];
      // get the datasets from the rest of the rows
      const datasets = data.slice(1).map((row, index) => {
        return {
          label: row[0], // use the first column as the label
          data: row.slice(1), // use the rest of the columns as the data
          backgroundColor: index % 2 === 0 ? '#FB8833' : '#17A8F5' // use different colors for odd and even rows
        };
      });
      // return the chart data object
      return {
        labels,
        datasets
      };
    }
    else {
      // no data available
      return null;
    }
  };

  // get the chart data
  const chartData = getChartData();

  // use the react-dropzone hook to create a dropzone
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: handleFileDrop});

  return (
    <div>
      <h1>Import Excel File</h1>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        {isDragActive ?
          <p>Drop the file here ...</p> :
          <p>Drag and drop a file here, or click to select a file</p>
        }
      </div>
      <div>{file && `${file.name}`}</div>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {chartData && (
        <div>
          <h2>Pie Chart</h2>
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
          <h2>Table</h2>
          <OutTable data={data} columns={chartData.labels} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
        </div>
      )}
    </div>
  );
}

export default Test;
