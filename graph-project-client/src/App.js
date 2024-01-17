import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Home from './Pages/Home/Home';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route className='' path='/login' element={<Login/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          
          
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
