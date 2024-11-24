import React from 'react'
import accessDenied from '../../../assets/images/access_denied.svg'

const Unauthorized: React.FC = () =>  {
  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-center text-8xl mb-0'>401</h1>
      <p className='text-center mb-5'>You are not authorized to view this page.</p>
      <img className='w-full' src={accessDenied}></img>
    </div>
  )
}

export default Unauthorized