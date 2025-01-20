import React from 'react'
import { Link } from 'react-router-dom'

const HomeNav = () => {
  return (
    <div className='flex justify-around items-center h-16 bg-white text-black relative shadow-sm font-mono'>
      <ul className='flex items-center justify-center gap-5' >
        <li><Link to='/personal'>Personal use</Link></li>
        <li>Farmily</li>
        <li>Team</li>
      </ul>
    </div>
  )
}

export default HomeNav
