import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus } from "react-icons/fa";
import { setStep } from '../../../slices/employeeSlice';
import { 
    addEmployeeAddressDetails, 
    addEmployeeBankDetails, 
    addEmployeeEmergencyContactDetails, 
    EditEmployeeBankDetails, 
    EditEmployeeEmergencyContactDetails, 
    UpdateEmployeeAddressDetails 
} from '../../../services/operations/employeeAPI';

const EmployeeAdditionalDetails = () => {
    const { register: registerEmergency, handleSubmit: handleSubmitEmergency, formState: { errors: errorsEmergency }, setValue: setEmergencyValue } = useForm();
    const { register: registerAddress, handleSubmit: handleSubmitAddress, formState: { errors: errorsAddress }, setValue: setAddressValue } = useForm();
    const { register: registerBank, handleSubmit: handleSubmitBank, formState: { errors: errorsBank }, setValue: setBankValue } = useForm();

    const { AccessToken } = useSelector((state) => state.auth);
    const { employees } = useSelector((state) => state.employee);
    const darkMode = useSelector((state) => state.theme?.darkMode) || false;
    const isEditing = useSelector((state) => state.editing.isEditing);
    const preEditedEmployeeDetails = useSelector((state) => state.editing.preEditedEmployeeDetails);
    const editedEmployeeId = preEditedEmployeeDetails?.employeeId;

    const [addressFields, setAddressFields] = useState([]);
    const [editingAddressIndex, setEditingAddressIndex] = useState(null);
    const [emergencyFields, setEmergencyFields] = useState([]);
    const [editingEmergencyIndex, setEditingEmergencyIndex] = useState(null);
    const [bankDetails, setBankDetails] = useState(null);

    useEffect(() => {
        if (isEditing && preEditedEmployeeDetails) {
            const { emergencyContacts, addresses, account } = preEditedEmployeeDetails;

            if (emergencyContacts && emergencyContacts.length > 0) {
                setEmergencyFields(emergencyContacts);
                emergencyContacts.forEach((contact, index) => {
                    setEmergencyValue(`contacts[${index}].contactId`, contact?.emergencyContactId); 
                    setEmergencyValue(`contacts[${index}].contact`, contact.contact);
                    setEmergencyValue(`contacts[${index}].relationship`, contact.relationship);
                });
            }

            if (addresses && addresses.length > 0) {
                setAddressFields(addresses);
                addresses.forEach((address, index) => {
                    setAddressValue(`addresses[${index}].addressId`, address.addressId); 
                    setAddressValue(`addresses[${index}].addressType`, address.addressType);
                    setAddressValue(`addresses[${index}].propertyNumber`, address.propertyNumber);
                    setAddressValue(`addresses[${index}].city`, address.zipCode.city);
                    setAddressValue(`addresses[${index}].zipCode`, address.zipCode.zipCode);
                    setAddressValue(`addresses[${index}].state`, address.zipCode.state);
                    setAddressValue(`addresses[${index}].country`, address.country);
                });
            }

            if (account) {
                setBankDetails(account);
                const { bankName, accountNumber, ifsc, branch } = account;
                setBankValue('bankName', bankName);
                setBankValue('accountNumber', accountNumber);
                setBankValue('ifsc', ifsc);
                setBankValue('branch', branch);
            }
        }
    }, [isEditing, preEditedEmployeeDetails, setEmergencyValue, setAddressValue, setBankValue]);

    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const EditEmergencyContactDetailsSubmit = (data, index = null) => {
        const employeeId = employees[0];
            const contact = data.contacts[index];
            const { contactId, ...contactData } = contact;
            dispatch(EditEmployeeEmergencyContactDetails(contactId, contactData, AccessToken));
            setEditingEmergencyIndex(null);
    };

    const AddEmergencyContactDetailsSubmit=(data)=>{
        const employeeId = employees[0];
        if(editedEmployeeId) {
            dispatch(addEmployeeEmergencyContactDetails(editedEmployeeId, data, AccessToken));
        }
        else{
            dispatch(addEmployeeEmergencyContactDetails(employeeId, data, AccessToken));
        }
    } 

    const EditSubmitAddress = (data, index = null) => {
            const address = data.addresses[index];
            const { addressId, ...addressData } = address;
            dispatch(UpdateEmployeeAddressDetails(editedEmployeeId, addressId, addressData, AccessToken));
        setEditingAddressIndex(null);
    };
    const AddSubmitAddress = (data) => {
        const employeeId = employees[0];
        if(editedEmployeeId) {
            dispatch(addEmployeeAddressDetails(editedEmployeeId, data, AccessToken));
        }
        else{
            dispatch(addEmployeeAddressDetails(employeeId, data, AccessToken));
        }
    setEditingAddressIndex(null);
};
    

    const EditSubmitBank = (data) => {
            dispatch(EditEmployeeBankDetails(editedEmployeeId, data, AccessToken));
    };
    const AddSubmitBank = (data) => {
        const employeeId = employees[0];
        if(editedEmployeeId){
        dispatch(addEmployeeBankDetails(editedEmployeeId, data, AccessToken));
        }
        else {
            dispatch(addEmployeeBankDetails(employeeId, data, AccessToken));
        }
    };

    const handleEditAddress = (index) => {
        setEditingAddressIndex(index);
    };

    const handleEditEmergency = (index) => {
        setEditingEmergencyIndex(index);
    };
    const bankNames = ["Jammu and Kashmir Bank", "State Bank of India", "Axis Bank", "HDFC Bank"];
    const addressTypes = ["TEMPORARY", "PERMANENT"];

    return (
        <div>
            {/* Emergency Contact Details Div */}
            {isEditing && emergencyFields.length > 0 ? (
            <div className={`emergency-contact-details ${darkMode ? 'dark' : ''}`}>
                <h2 className={`text-lg text-center ${darkMode ? 'text-white' : 'text-slate-600'} font-semibold mt-8`}>Edit Emergency Contact Details<sup className="text-red-900 font-extrabold">*</sup></h2>
                {emergencyFields.map((contact, index) => (
                    <form key={index} className="p-5" onSubmit={handleSubmitEmergency((data) => EditEmergencyContactDetailsSubmit(data, index))}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mt-2">
                                <label htmlFor={`contacts[${index}].contact`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Contact<sup className="text-red-900">*</sup></label>
                                <input required id={`contacts[${index}].contact`} {...registerEmergency(`contacts[${index}].contact`, { required: true })} type="number" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={contact.contact} />
                            </div>
                            <div className="mt-2">
                                <label htmlFor={`contacts[${index}].relationship`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Relationship<sup className="text-red-900">*</sup></label>
                                <input required id={`contacts[${index}].relationship`} {...registerEmergency(`contacts[${index}].relationship`, { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={contact.relationship} />
                            </div>
                        </div>
                        <div className='flex items-center gap-x-3 mt-4'>
                                <button type="submit" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                    loading ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black'
                                } py-1 px-5 flex items-center gap-3`}>
                                    <FaEdit className="ml-2" /> Update Contact
                                </button>
                        </div>
                    </form>
                ))}
            </div>
            ) : (
                <div className={`emergency-contact-details ${darkMode ? 'dark' : ''}`}>
                    <h2 className={`text-lg text-center ${darkMode ? 'text-white' : 'text-slate-600'} font-semibold mt-8`}>Emergency Contact Details<sup className="text-red-900 font-extrabold">*</sup></h2>
                    <form data-testid="additional-details-form" className="p-5" onSubmit={handleSubmitEmergency(AddEmergencyContactDetailsSubmit)}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mt-2">
                                <label htmlFor="contact" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Contact<sup className="text-red-900">*</sup></label>
                                <input required id="contact" {...registerEmergency("contact", { required: true })} type="number" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Contact Number" data-testid="contact-input" />
                            </div>
                            <div className="mt-2">
                                <label htmlFor="relationship" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Relationship<sup className="text-red-900">*</sup></label>
                                <input required id="relationship" {...registerEmergency("relationship", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Relationship Detail.." data-testid="relationship-input" />
                            </div>
                        </div>
                        <div className='flex  items-center gap-x-3 mt-4'>
                            <button type="submit" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                loading ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black'
                            } py-1 px-5 flex items-center gap-3`} data-testid="add-contact-button">
                                <FaPlus className="ml-2" /> Add Contact
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Address Details Div */}
            <div>
                {isEditing && addressFields.length > 0 ? (
                    <div className={`address-details ${darkMode ? 'dark' : ''}`}>
                        <h2 className={`text-lg text-center ${darkMode ? 'text-white' : 'text-slate-600'} font-semibold mt-8`}>Edit Address Details<sup className="text-red-900 font-extrabold">*</sup></h2>
                        {addressFields.map((address, index) => (
                            <form key={index} className="p-5" onSubmit={handleSubmitAddress((data) => EditSubmitAddress(data, index))}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mt-2">
                                        <label htmlFor={`addresses[${index}].addressType`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Address Type<sup className="text-red-900">*</sup></label>
                                        <select required id={`addresses[${index}].addressType`} {...registerAddress(`addresses[${index}].addressType`, { required: true })} className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={address.addressType}>
                                            <option value="">Select Address Type</option>
                                            {addressTypes.map((type, i) => (
                                                <option key={i} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor={`addresses[${index}].propertyNumber`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Property Number<sup className="text-red-900">*</sup></label>
                                        <input required id={`addresses[${index}].propertyNumber`} {...registerAddress(`addresses[${index}].propertyNumber`, { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={address.propertyNumber} />
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor={`addresses[${index}].city`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>City<sup className="text-red-900">*</sup></label>
                                        <input required id={`addresses[${index}].city`} {...registerAddress(`addresses[${index}].city`, { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={address.zipCode.city} />
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor={`addresses[${index}].zipCode`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Zip Code<sup className="text-red-900">*</sup></label>
                                        <input required id={`addresses[${index}].zipCode`} {...registerAddress(`addresses[${index}].zipCode`, { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={address.zipCode.zipCode} />
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor={`addresses[${index}].state`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>State<sup className="text-red-900">*</sup></label>
                                        <input required id={`addresses[${index}].state`} {...registerAddress(`addresses[${index}].state`, { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={address.zipCode.state} />
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor={`addresses[${index}].country`} className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Country<sup className="text-red-900">*</sup></label>
                                        <input required id={`addresses[${index}].country`} {...registerAddress(`addresses[${index}].country`, { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={address.country} />
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-3 mt-4'>
                                    <button type="submit" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                        loading ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black'
                                    } py-1 px-5 flex items-center gap-3`}>
                                        <FaEdit className="ml-2" /> Update Address
                                    </button>
                                </div>
                            </form>
                        ))}
                    </div>
                ) : (
                    <div className={`address-details ${darkMode ? 'dark' : ''}`}>
                        <h2 className={`text-lg text-center ${darkMode ? 'text-white' : 'text-slate-600'} font-semibold mt-8`}>Address Details<sup className="text-red-900 font-extrabold">*</sup></h2>
                        <form data-testid="additional-details-form" className="p-5" onSubmit={handleSubmitAddress(AddSubmitAddress)}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mt-2">
                                    <label htmlFor="addressType" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Address Type<sup className="text-red-900">*</sup></label>
                                    <select required id="addressType" {...registerAddress("addressType", { required: true })} className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} data-testid="addressType-input">
                                        <option value="">Select Address Type</option>
                                        {addressTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="propertyNumber" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Property Number<sup className="text-red-900">*</sup></label>
                                    <input required id="propertyNumber" {...registerAddress("propertyNumber", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Property Number" data-testid="propertyNumber-input" />
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="city" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>City<sup className="text-red-900">*</sup></label>
                                    <input required id="city" {...registerAddress("city", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter City" data-testid="city-input" />
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="zipCode" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Zip Code<sup className="text-red-900">*</sup></label>
                                    <input required id="zipCode" {...registerAddress("zipCode", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Zip Code" data-testid="zipCode-input" />
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="state" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>State<sup className="text-red-900">*</sup></label>
                                    <input required id="state" {...registerAddress("state", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter State" data-testid="state-input" />
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="country" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Country<sup className="text-red-900">*</sup></label>
                                    <input required id="country" {...registerAddress("country", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Country" data-testid="country-input" />
                                </div>
                            </div>
                            <div className='flex  items-center gap-x-3 mt-4'>
                                <button type="submit" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                    loading ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black'
                                } py-1 px-5 flex items-center gap-3`} data-testid="add-address-button">
                                    <FaPlus className="ml-2" /> Add Address
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
           {/* Bank Details Div */}
           <div className={`bank-details ${darkMode ? 'dark' : ''}`}>
                {isEditing && bankDetails ? (
                    <div>
                        <h2 className={`text-lg text-center ${darkMode ? 'text-white' : 'text-slate-600'} font-semibold mt-8`}>Edit Bank Details<sup className="text-red-900 font-extrabold">*</sup></h2>
                        <form className="p-5" onSubmit={handleSubmitBank(EditSubmitBank)}>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className="mt-2">
                                    <label htmlFor="bankName" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Bank Name<sup className="text-red-900">*</sup></label>
                                    <select required id="bankName" {...registerBank("bankName", { required: true })} className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`}>
                                        <option value="">Select Bank</option>
                                        {bankNames.map((bank, index) => (
                                            <option key={index} value={bank}>{bank}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="accountNumber" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Account Number<sup className="text-red-900">*</sup></label>
                                    <input required id="accountNumber" {...registerBank("accountNumber", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={bankDetails.accountNumber} />
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="ifsc" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>IFSC Code<sup className="text-red-900">*</sup></label>
                                    <input required id="ifsc" {...registerBank("ifsc", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={bankDetails.ifscCode} />
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="branch" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Bank Branch<sup className="text-red-900">*</sup></label>
                                    <input required id="branch" {...registerBank("branch", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} defaultValue={bankDetails.bankBranch} />
                                </div>
                            </div>
                            <div className='flex  items-center gap-x-3 mt-4'>
                                <button type="submit" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                    loading ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black'
                                } py-1 px-5 flex items-center gap-3`}>
                                    <FaEdit className="ml-2" /> Update Bank Details
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2 className={`text-lg text-center ${darkMode ? 'text-white' : 'text-slate-600'} font-semibold mt-8`}>Bank Details<sup className="text-red-900 font-extrabold">*</sup></h2>
                        <div className="p-5">
                            <form data-testid="bank-details-form" onSubmit={handleSubmitBank(AddSubmitBank)}>
                                <div className="mt-2">
                                    <label htmlFor="bankName" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Bank Name<sup className="text-red-900">*</sup></label>
                                    <select required id="bankName" {...registerBank("bankName", { required: true })} className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`}>
                                        <option value="">Select Bank</option>
                                        {bankNames.map((bank, index) => (
                                            <option key={index} value={bank}>{bank}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mt-2">
                                        <label htmlFor="accountNumber" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Account Number<sup className="text-red-900">*</sup></label>
                                        <input required id="accountNumber" {...registerBank("accountNumber", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Account Number" />
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor="ifsc" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>IFSC Code<sup className="text-red-900">*</sup></label>
                                        <input required id="ifsc" {...registerBank("ifsc", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter IFSC Code" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="branch" className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Bank Branch<sup className="text-red-900">*</sup></label>
                                    <input required id="branch" {...registerBank("branch", { required: true })} type="text" className={`border rounded px-3 py-2 mt-2 w-full ${darkMode ? 'border-slate-300 bg-gray-500 text-white' : 'border-slate-300 bg-white text-black'}`} placeholder="Enter Branch" />
                                </div>
                                <div className='flex  items-center gap-x-3 mt-4'>
                                    <button type="submit" className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                                        loading ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black'
                                    } py-1 px-5 flex items-center`}>
                                        Add <FaPlus className="ml-2"/>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeAdditionalDetails;