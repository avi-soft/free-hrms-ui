import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EmployeeAdditionalDetails from './EmployeeAdditionalDetails';
import EmployeePersonalInfo from './EmployeePersonalInfo';
import PrimaryEmployeeDetails from './PrimaryEmployeeDetails';

function RenderSteps() {
  const { step } = useSelector((state) => state.employee);
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;

  const steps = [
    {
      id: 1,
      title: "Primary Details"
    },
    {
      id: 2,
      title: "Personal Details"
    },
    {
      id: 3,
      title: "Additional Details"
    }
  ];

  return (
    <div>
      <div className='flex justify-center items-center'>
        {
          steps.map((item) => (
            <div key={item.id} className={`flex flex-col gap-2 ${item.id !== 3 ? "w-[200px]" : ""} relative`}>

              <div className={`flex items-center ${item.id !== 1 ? "justify-start" : "justify-end"}`}>
                <div className={``}>
                  <div className={`${step >= item.id ? step > item.id ? "bg-gray-900 border-white text-white" : "bg-gray-900 border-white text-white" : "border-white border-[2px] bg-gray-500 text-white"} flex place-items-center place-content-center w-10 aspect-square p-2 rounded-full border-[1px]`}>
                    {
                      step > item.id ? (<FaCheck className='h-5 w-5' />) : (item.id)
                    }
                  </div>
                </div>
                {
                  item.id !== 3 && <div className='w-[100%] h-[2px]'><div className="flex items-center"><div className={`border-t-2 border-dashed ${step > item.id ? "border-black" : "border-black"}  flex w-full`}></div></div></div>
                }
              </div>
              <div className={`flex items-center justify-start ${item.id === 1 ? "-ml-[25%]" : item.id === 2 ? "-ml-[15%]" : "-ml-[10%]"}`}>
                <p className={`${step > item.id ? "text-black font-semibold" : "font-semibold text-red-800"} ${darkMode ? "text-white" : ""}`}>{item.title}</p>
              </div>
            </div>
          ))
        }
      </div>
      <div className='relative'>
        {step === 1 && (<PrimaryEmployeeDetails />)}
        <div data-testid='employee-personal-info'>
          {step === 2 && (<EmployeePersonalInfo />)}
        </div>
        <div data-testid='employee-additional-details'>
          {step === 3 && (<EmployeeAdditionalDetails />)}
        </div>
      </div>
    </div>
  );
}

export default RenderSteps;
