import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../../../services/operations/employeeAPI';
import { FaPlus } from 'react-icons/fa';

const PrimaryEmployeeDetails = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { AccessToken } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;


  const onSubmit = async (data) => {
    data.navigate = navigate;
    data.AccessToken = AccessToken;
    dispatch(addEmployee(data));
  };

  return (
    <div className={`flex flex-col items-center h-[420px] ${darkMode ? 'text-white' : 'text-black'}`}>
      <form data-testid="create-employee-form" className={`p-5 w-[60%]  mt-5 ${darkMode ? ' bg-slate-600' : ' bg-slate-200'} shadow-lg rounded`} onSubmit={handleSubmit(onSubmit)}>

        <div className="mt-4">
          <label htmlFor="email" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Email Address<sup className="text-red-900">*</sup>
          </label>
          <input
            id="email"
            required
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            className={`border ${
              darkMode ? "bg-gray-500 text-white" : ""
            } rounded px-3 py-2 mt-2 w-full`}
            placeholder="Enter Your Email Address"
            data-testid="email-input"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Password<sup className="text-red-900">*</sup>
          </label>
          <input
            id="password"
            required
            {...register("password", { required: true, minLength: 6 })}
            type="password"
            className={`border  ${
              darkMode ? "bg-gray-500 text-white" : ""
            } rounded px-3 py-2 mt-2 w-full`}
            placeholder="Enter Your Password"
            data-testid="password-input"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="role" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Role<sup className="text-red-900">*</sup></label>
          <select id="role" {...register("role")} className={`border  ${
                darkMode ? "bg-gray-500 text-white" : ""
              } rounded px-3 py-2 mt-2 w-full`} data-testid="role-select">
            <option value="EMPLOYEE">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className='flex items-center gap-x-3 mt-5'>
                            <button type="submit" data-testid="submit-button" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                'bg-yellow-500 text-black'
                            } py-1 px-5 flex items-center`}>
                                 <FaPlus className="mr-2"/>Add
                            </button>
                    </div>  

      </form>
    </div>
  );
};

export default PrimaryEmployeeDetails;
