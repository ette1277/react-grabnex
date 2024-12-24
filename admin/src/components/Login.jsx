import axios from 'axios'
import React, { useState } from 'react'
    
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Login = ({setToken}) => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    console.log(email,  password);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault(); // Prevent default form submission behavior
    
            // Make POST request with the required data
            const response = await axios.post(
                backendUrl + '/api/user/admin',
                { email, password }, // Correctly pass the request body
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure correct headers
                    },
                }
            );
    
          
    
            // Handle success response
            if (response.data.success) {
                setToken(response.data.token); // Save token using the setToken function
                toast.success('Login successful!');
            } else {
                toast.error(response.data.message); // Show error message from server
            }
        } catch (error) {
            console.error('API Error:', error.response || error);
            const errMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errMessage);
        }
    };
   



  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
            <form onSubmit={onSubmitHandler}>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" id='email' placeholder='your@email.com' required />
                </div>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" id='password' placeholder='Enter your password' required />
                </div>
                <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type="submit"> Login </button>
            </form>
        </div>
    </div>
  )
}

export default Login