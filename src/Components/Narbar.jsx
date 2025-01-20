import React from 'react'
import { Link } from 'react-router-dom'

const Narbar = () => {
  return (
    <div className='flex justify-between items-center h-16 bg-white text-black shadow-sm font-mono fixed w-full top-0 left-0 z-10 xl:px-[12rem]'>
      <div>
        <img src="/images/Preview.png" alt="logo" className='w-20 h-14 rounded-md'/>
      </div>
      <ul className='flex items-center gap-5'>
        <Link to='/'><li>Home</li></Link>
        <Link to='/register'><li>Register</li></Link>
        <Link to='/login'><li>Login</li></Link>
        
      </ul>
    </div>
  )
}

export default Narbar
