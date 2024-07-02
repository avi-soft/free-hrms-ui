import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import UploadEmployeeImage from '../dashboard/AdminPanel/Employee/UploadEmployeeImage';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '../../../slices/employeeSlice';
import { addEmployeePersonalDetails, UpdateEmployeePersonalDetails } from '../../../services/operations/employeeAPI';
import { FaPlus, FaEdit, FaArrowRight } from 'react-icons/fa';
import { Departmentlist } from '../../../services/operations/departmentAPI';
import axios from 'axios';

const EmployeePersonalInfo = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { loading } = useSelector((state) => state.auth);
    const { AccessToken } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
    const dispatch = useDispatch();
    const [departments, setDepartments] = useState([]);
    const { employees } = useSelector((state) => state.employee);
    const isEditing = useSelector((state) => state.editing.isEditing);
    const preEditedEmployeeDetails = useSelector((state) => state.editing.preEditedEmployeeDetails);

    const onSubmit = (data) => {
        console.log(data);
        const employeeId = employees[0];
        if (isEditing) {
            dispatch(UpdateEmployeePersonalDetails(preEditedEmployeeDetails.employeeId, data, AccessToken));
        } else {
            dispatch(addEmployeePersonalDetails(employeeId, data, AccessToken));
        }
    };


    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await dispatch(Departmentlist(AccessToken));
                setDepartments(response?.data);
            } catch (error) {
            }
        };
        fetchDepartments();
    }, [dispatch, AccessToken]);

    useEffect(() => {
        if (isEditing && preEditedEmployeeDetails) {
            for (const [key, value] of Object.entries(preEditedEmployeeDetails)) {
                if (key === 'department') {
                    setValue('departmentId', value?.departmentId);
                } else {
                    setValue(key, value);
                }
            }
        }
    }, [isEditing, preEditedEmployeeDetails, setValue]);

    return (
        <div className=' h-fit'>
            {/* UPLOAD IMAGE DIV */}
            <div>
                <UploadEmployeeImage />
            </div>
            {/* PERSONAL DETAILS DIV */}
            <div>
                <h2 className={`text-lg text-center font-semibold ${darkMode ? " text-slate-50" : 'text-slate-600 ' }`}>
                    {isEditing ? 'Edit Personal Info' : 'Personal Info'}
                </h2>

                <form data-testid="create-employee-form" className="p-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        <label>
                            <p className={`text-[0.875rem] ${darkMode ? 'text-white' : 'text-slate-900'} mb-1 leading-[1.375rem] font-semibold`}>First Name<sup className="text-red-900">*</sup></p>
                            <input className={`rounded-[0.5rem] w-full p-[12px] border-b-[1px] ${darkMode ? 'bg-gray-500 border-slate-800 text-white' : 'bg-white border-slate-300 text-black'}`} required type="text" name="firstName" {...register("firstName")} placeholder="Enter Your First Name" data-testid="first-name-input" />
                        </label>
                        <div className="h-4 sm:hidden"></div>
                        <label>
                            <p className={`text-[0.875rem] ${darkMode ? 'text-white' : 'text-slate-900'} mb-1 leading-[1.375rem] font-semibold`}>Last Name<sup className="text-red-900">*</sup></p>
                            <input className={`rounded-[0.5rem] w-full p-[12px] border-b-[1px] ${darkMode ? 'bg-gray-500 border-slate-800 text-white' : 'bg-white border-slate-300 text-black'}`} required type="text" name="lastName" {...register("lastName")} placeholder="Enter Your Last Name" data-testid="last-name-input" />
                        </label>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="mt-4">
                            <label htmlFor="departmentId" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Department<sup className="text-red-900">*</sup></label>
                            <select required id="departmentId" {...register("departmentId")} className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} data-testid="department-select">
                                {departments.map((department) => (
                                    <option key={department?.departmentId} value={department?.departmentId}>{department?.department}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="position" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Position<sup className="text-red-900">*</sup></label>
                            <select required id="position" {...register("position")} className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} data-testid="position-select">
                                <option value="DEVELOPER">Developer</option>
                                <option value="TESTER">Tester</option>
                                <option value="HR">HR</option>
                            </select>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                    <div className="mt-4">
                        <label htmlFor="joinDate" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Join Date<sup className="text-red-900">*</sup></label>
                        <input id="joinDate" required {...register("joinDate")} type="date" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} data-testid="join-date-input" />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="gender" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Gender<sup className="text-red-900">*</sup></label>
                        <select id="gender" {...register("gender")} className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} data-testid="gender-select">
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="mt-4">
                            <label htmlFor="dateOfBirth" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Date of Birth<sup className="text-red-900">*</sup></label>
                            <input id="dob" {...register("dateOfBirth")} type="date" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} data-testid="date-of-birth-input" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="contact" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Mobile Number<sup className="text-red-900">*</sup></label>
                            <input required id="contact" {...register("contact")} type="tel" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Your Mobile Number" data-testid="mobile-input" />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="mt-4">
                            <label htmlFor="panNumber" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>PAN Number<sup className="text-red-900">*</sup></label>
                            <input required id="panNumber" {...register("panNumber")} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Your PAN Number" data-testid="pan-input" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="adhaarNumber" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Aadhar Number<sup className="text-red-900">*</sup></label>
                            <input required id="adhaarNumber" {...register("adhaarNumber")} type="number" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Your Aadhar Number" data-testid="aadhar-input" />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                    <div className="mt-4">
                        <label htmlFor="uanNumber" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>UAN Number<sup className="text-red-900">*</sup></label>
                        <input required id="uanNumber" {...register("uanNumber")} type="number" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Your UAN Number" data-testid="uan-input" />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="salary" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Salary<sup className="text-red-900">*</sup></label>
                        <input required id="salary" {...register("salary")} type="number" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter The Salary" data-testid="salary-input" />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mt-4">
                            <label htmlFor="employeeCode" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Employee Code<sup className="text-red-900">*</sup></label>
                            <input required id="employeeCode" {...register("employeeCode")} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Employee Code" data-testid="employee-code-input" />
                        </div>
                    </div>
                    <div className='flex items-center gap-x-3 mt-5'>
                            <button data-testid="edit-button" type="submit" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                'bg-yellow-500 text-black'
                            } py-1 px-5 flex items-center`}>
                                {isEditing ? <><FaEdit  className="mr-2"/>Update</> : <><FaPlus className="mr-2"/>Add</>}
                            </button>
                    </div>  
                </form>
            </div>
            <div className='flex flex-col items-center justify-center  px-72 w-full'>
                <button onClick={() => dispatch(setStep(3))} className={`text-center w-full text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                    loading ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black'
                } py-1 px-5 flex items-center justify-center`}>
                    {isEditing ? 'Update Additional Details' : 'Next Step'}
                    <FaArrowRight className="ml-2"/>
                </button>
            </div>
        </div>
    );
};

export default EmployeePersonalInfo;
