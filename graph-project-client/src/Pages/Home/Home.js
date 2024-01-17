// import React, { Component } from 'react';
// import {ExcelRenderer, OutTable} from 'react-excel-renderer';

// class Home extends Component {
//   constructor (props) {
//     super (props);
//     this.state = {
//       cols: [],
//       rows: []
//     };
//     this.fileHandler = this.fileHandler.bind (this);
//   }

//   fileHandler (event) {
//     let fileObj = event.target.files [0];
//     //just pass the fileObj as parameter
//     ExcelRenderer (fileObj, (err, resp) => {
//       if (err) {
//         console.log (err);
//       }
//       else {
//         this.setState ({
//           cols: resp.cols,
//           rows: resp.rows
//         });
//       }
//     });
//   }

//   render () {
//     return (
//       <div>
//         <h1>Import Excel File</h1>
//         <input type="file" onChange={this.fileHandler} style={{"padding":"10px"}} />
//         <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
//       </div>
//     );
//   }
// }

// export default Home;



import React, { useState } from 'react';
import {ExcelRenderer} from 'react-excel-renderer';
import {Bar, Line, Pie} from 'react-chartjs-2';

function Home() {
  const [file, setFile] = useState(null); // state for storing the file
  const [data, setData] = useState(null); // state for storing the data from the file
  const [error, setError] = useState(null); // state for storing any error message

  // function to handle the file change event
  const handleFileChange = (e) => {
    // get the file from the input
    const file = e.target.files[0];
    // check the file type
    if (file && file.type === "application/vnd.ms-excel") {
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

  return (
    <div>
      <h1>Import Excel File</h1>
      <input type="file" onChange={handleFileChange} />
      <div>{file && `${file.name}`}</div>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {chartData && (
        <div>
          <h2>Bar Chart</h2>
          <Bar data={chartData} />
          <h2>Line Chart</h2>
          <Line data={chartData} />
          <h2>Pie Chart</h2>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
}

export default Home;
