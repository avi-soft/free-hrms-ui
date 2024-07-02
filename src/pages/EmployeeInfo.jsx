import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import EmployeePersonalInfo from '../components/core/EmployeeInfo/EmployeePersonalInfo';
import EmployeeAdditionalInfo from '../components/core/EmployeeInfo/EmployeeAdditionalInfo';
import EmployeeBankInfo from '../components/core/EmployeeInfo/EmployeeBankInfo';
import EmployeeAddressInfo from '../components/core/EmployeeInfo/EmployeeAddressInfo';
import { useDispatch, useSelector } from 'react-redux';
import { EmployeeSearch } from '../services/operations/employeeAPI';

const EmployeeInfo = () => {
const {employeeName}=useParams();
const [userData, setUserData] = useState(null);
const [loading,setLoading]=useState(false);
const dispatch=useDispatch();
const {AccessToken}=useSelector((state)=>state.auth);

console.log(employeeName);

useEffect(()=> {
  const fetchEmployee= async () => {
    try {
        setLoading(true);
        const res = await dispatch(EmployeeSearch(AccessToken,employeeName));
        console.log(res)
        if(res?.data?.length==0) {
           toast.error("No employee with this name")
        }
        else{
        toast.success("Employee details retrieved Successfully")
        console.log(res)
        setUserData(res?.data[0]);
        setLoading(false);
        }
    } catch (error) {
       toast.error(error?.response?.data?.message)
    }
};

fetchEmployee();
},[employeeName])

console.log(userData)

  return (
    <div className=' h-full'>
      {
               loading &&   <div className=' absolute grid place-content-center h-screen w-screen'><Spinner/></div>
      }
      {  
      !userData  ? <div data-testid="spinner"><Spinner /></div>
      :
      (
    <div className=''>
          <div className='p-10 flex items-center justify-between mt-20'>
            <div className='text-xl text-slate-600 font-semibold'>
              Employee Info
            </div>
            <div>
              <p className='text-slate-950 text-xl left-6 font-semibold'>Home / Dashboard /  
                <span className='text-yellow-700'>
                   Employee Info
              </span>
              </p>
            </div> 
         </div>
         <div className='flex flex-col items-center'>
            <div className=' border-[1px]  m-5 bg-slate-100  shadow-lg rounded-md w-[900px] border-white flex flex-col'>
              <div>
                 <EmployeePersonalInfo user={userData} />
                 <EmployeeAdditionalInfo user={userData} />
                 <EmployeeAddressInfo user={userData} />
                 <EmployeeBankInfo user={userData} />
              </div>  
                {/* <div className='mt-5 p-5'>
                  <img
                    src={userData.profileImage}
                    alt={userData.firstName}
                    className='aspect-square rounded-full  object-cover h-20'
                    />       
                </div> */}
            </div>
        </div>
    </div> 
      )}   
    </div>
  );
};

export default EmployeeInfo;
