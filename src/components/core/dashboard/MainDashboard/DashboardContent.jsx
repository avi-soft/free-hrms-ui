import React from 'react'
import AttendenceSection from './AttendenceSection'
import { useSelector } from 'react-redux';

const DashboardContent = () => {
  const { user } = useSelector((state) => state.profile);
  const UserRole=user?.roles[0]?.role




  return (
    <div>
        <div   className='flex flex-row justify-between gap-x-2'>
           {
            UserRole !="SuperAdmin"  &&               <AttendenceSection />

           }
            <div  className='w-1/2'>
            </div>
        </div>
    </div>
  )
}

export default DashboardContent