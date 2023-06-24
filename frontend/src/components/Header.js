import React from 'react'

function Header() {
    const handleChange = (e) => {
        e.preventDefault()


    }
  return (
      <div className=' bg-gray-700 text-white py-[10%] flex items-center justify-center'>
          <input onChange={handleChange} className='px-5 py-2 text-black rounded-full text-2xl' type="search" />
    </div>
  )
}

export default Header