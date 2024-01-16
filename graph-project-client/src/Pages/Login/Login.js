import React, {useState} from 'react'
import axios from 'axios';
import './Login.css';

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')    
    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8081/login', {email, password})
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    return (
    <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
      <div className='p-3 bg-white w-25' p-lg-5 >
        <form onSubmit={handleSubmit}>
            <div className='mb-3' p-lg-5 >
                <label htmlFor='email'>Email</label>
                <input type='email' placeholder='Enter Email' className='form-control'
                onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='password'>Password</label>
                <input type='password' placeholder='Enter Password' className='form-control'
                onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button className='btn btn-success'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
