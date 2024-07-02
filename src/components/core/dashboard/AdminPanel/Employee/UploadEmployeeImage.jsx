import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUpload } from 'react-icons/fi';
import defaultImage from '../../../../../assets/Images/placeholder.jpg';
import { uploadEmployeeImage } from '../../../../../services/operations/employeeAPI';
import toast from 'react-hot-toast';

const UploadEmployeeImage = () => {
    const { user } = useSelector((state) => state.profile);
    const { AccessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const inputRef = useRef(null);
    const darkMode = useSelector((state) => state.theme?.darkMode) || false;
    const { employees } = useSelector((state) => state.employee);
    const preEditedEmployeeDetails = useSelector((state) => state.editing.preEditedEmployeeDetails);
    const isEditing = useSelector((state) => state.editing.isEditing);

    useEffect(() => {
        if (isEditing && preEditedEmployeeDetails && preEditedEmployeeDetails?.profileImage) {
            setExistingImage(preEditedEmployeeDetails?.profileImage);
        }
    }, [isEditing, preEditedEmployeeDetails]);

    const handleFileChange = (e) => {
        e.preventDefault();
        if (!e.target.files[0]) return;
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedImage) {
            toast.error(<>Please Select an Image</>);
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', selectedImage);
            const employeeId = isEditing ? preEditedEmployeeDetails?.employeeId : employees[0];
            await dispatch(uploadEmployeeImage(employeeId, AccessToken, formData));
            setLoading(false);
        } catch (err) {
            console.log("Error:", err.message);
            setLoading(false);
        }
    };

    return (
        <div className={`p-5 `}>
            <div className='flex gap-5 w-full items-center justify-start rounded-lg'>
                <img
                    src={selectedImage ? URL.createObjectURL(selectedImage) : existingImage || defaultImage}
                    alt={`profile-${user?.firstName}`}
                    className='aspect-square rounded-full object-cover h-20'
                />
                <div className='w-[80%] flex gap-4 flex-col'>
                    <p className={`font-normal text-lg ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
                        {isEditing ? 'Update Employee Profile Picture' : 'Upload Employee Profile Picture'}
                    </p>
                    <div className='flex gap-4'>
                        {!loading && (
                            <div>
                                <input
                                    data-testid='file-input'
                                    className='hidden'
                                    ref={inputRef}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                />
                                <button
                                    onClick={() => inputRef.current.click()}
                                    className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                        darkMode ? ' bg-slate-400 text-black' : 'bg-gray-900 text-white'
                                    } py-1 px-5`}
                                    disabled={loading}
                                >
                                    Select
                                </button>
                            </div>
                        )}
                        <div
                            className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                darkMode ? 'bg-yellow-400 text-black' : 'bg-yellow-500 text-black'
                            } py-1 px-5`}
                            onClick={handleSubmit}
                            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            <button type='submit' className='flex place-items-center gap-2' disabled={loading}>
                                {loading ? (
                                    <>Uploading...</>
                                ) : (
                                    <>
                                        <FiUpload className='mr-2' />
                                        {isEditing ? 'Update' : 'Upload'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadEmployeeImage;
