import React from 'react'
import AttendenceSection from './AttendenceSection'

const DashboardContent = () => {
  return (
    <div>
        <div   className='flex flex-row justify-between gap-x-2'>
            <AttendenceSection />
            <div  className='w-1/2'>
                2nd iv
            </div>
        </div>
    </div>
  )
}

export default DashboardContent