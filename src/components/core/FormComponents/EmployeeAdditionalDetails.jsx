import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaPlus,
  FaSave,
} from "react-icons/fa";
import { setStep } from "../../../slices/employeeSlice";
import {
  addEmployeeAddressDetails,
  addEmployeeBankDetails,
  addEmployeeEmergencyContactDetails,
  EditEmployeeBankDetails,
  EditEmployeeEmergencyContactDetails,
  UpdateEmployeeAddressDetails,
} from "../../../services/operations/employeeAPI";
import { useNavigate } from "react-router-dom";

const EmployeeAdditionalDetails = () => {
  const {
    register: registerEmergency,
    handleSubmit: handleSubmitEmergency,
    formState: { errors: errorsEmergency },
    setValue: setEmergencyValue,
    reset: resetEmergencyForm, // Add reset for emergency form
  } = useForm();

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
    setValue: setAddressValue,
    reset: resetAddressForm, // Add reset for address form
  } = useForm();

  const {
    register: registerBank,
    handleSubmit: handleSubmitBank,
    formState: { errors: errorsBank },
    setValue: setBankValue,
    reset: resetBankForm, // Add reset for bank form
  } = useForm();

  const { AccessToken } = useSelector((state) => state.auth);
  const { employees } = useSelector((state) => state.employee);
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const [editingFlag,setEditingFlag]=useState(false)
  const isEditing = useSelector((state) => state.editing.isEditing);
  const preEditedEmployeeDetails = useSelector(
    (state) => state.editing.preEditedEmployeeDetails
  );
  const editedEmployeeId = preEditedEmployeeDetails?.employeeId;


  console.log(editedEmployeeId,"edited");
  

  const [addressFields, setAddressFields] = useState([]);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [emergencyFields, setEmergencyFields] = useState([]);
  const [editingEmergencyIndex, setEditingEmergencyIndex] = useState(null);
  const [editingContactId, seteditingContactId] = useState(null);

  const [bankDetails, setBankDetails] = useState(null);
  const [editedAddressId,setEditedAddressId]=useState(null)
  const [bankAccountId,setBankAccountId]=useState(null);

  const formatString = (str) => {
    if (!str) return "";
    return str.trim().replace(/\s+/g, " ");
  };



  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formatData = (data) => {
    if (data.contacts) {
      data.contacts = data.contacts.map((contact) => ({
        ...contact,
        contact: formatString(contact.contact),
        relationship: formatString(contact.relationship),
      }));
    }
    if (data.addresses) {
      data.addresses = data.addresses.map((address) => ({
        ...address,
        addressType: formatString(address.addressType),
        propertyNumber: formatString(address.propertyNumber),
        city: formatString(address.city),
        state: formatString(address.state),
        country: formatString(address.country),
      }));
    }
    if (data.bankName) {
      data.bankName = formatString(data.bankName);
    }
    if (data.branch) {
      data.branch = formatString(data.branch);
    }
    return data;
  };

  const EditEmergencyContactDetailsSubmit =  async (data, index = null) => {
    console.log(data);
    const employeeId = employees[0];
    const contact = formatData(data.contacts[index]);
    const { contactId, ...contactData } = contact;
    if(contactId) {
      seteditingContactId(contactId)
    }
    console.log(contactData);
    console.log(contactId);


   if(editingContactId) {
    const response= await dispatch(
      EditEmployeeEmergencyContactDetails(editingContactId, contactData, AccessToken)
    );
   }else{
    const response= await dispatch(
      EditEmployeeEmergencyContactDetails(contactId, contactData, AccessToken)
    );
   }
    setEditingEmergencyIndex(null);
    setEditingFlag(true)

  };

  const AddEmergencyContactDetailsSubmit = (data) => {
    const formattedData = formatData(data);
    const employeeId = employees[0];
    if (editedEmployeeId) {
      console.log("here");
      
      dispatch(
        addEmployeeEmergencyContactDetails(
          editedEmployeeId,
          formattedData?.contacts[0],
          AccessToken
        )
      );
    } else {
      console.log("here 2");
      console.log(formattedData?.contacts[0]);
      dispatch(
        addEmployeeEmergencyContactDetails(
          employeeId,
          formattedData?.contacts[0],
          AccessToken
        )
      );
    }
    resetEmergencyForm(); // Reset form after submission
    setEditingFlag(true)
  };

  const EditSubmitAddress = (data, index = null) => {
    const address = formatData(data.addresses[index]);
    const { addressId, ...addressData } = address;

    if(editedAddressId) {
      dispatch(
        UpdateEmployeeAddressDetails(
          editedEmployeeId,
          editedAddressId,
          addressData,
          AccessToken
        )
      );
    }else{
    dispatch(
      UpdateEmployeeAddressDetails(
        editedEmployeeId,
        addressId,
        addressData,
        AccessToken
      )
    );
  }
    if(addressId) {
      setEditedAddressId(addressId)
    }
    setEditingAddressIndex(null);
    setEditingFlag(true)
  };

  const AddSubmitAddress = (data) => {
    const formattedData = formatData(data);
    const employeeId = employees[0];
    if (editedEmployeeId) {
      dispatch(
        addEmployeeAddressDetails(editedEmployeeId, formattedData, AccessToken)
      );
    } else {
      dispatch(
        addEmployeeAddressDetails(employeeId, formattedData, AccessToken)
      );
    }
    resetAddressForm(); // Reset form after submission
    setEditingFlag(true)
    setEditingAddressIndex(null);
  };

  const EditSubmitBank = (data) => {
    const formattedData = formatData(data);
    console.log(formattedData);
    
    dispatch(
      EditEmployeeBankDetails(bankAccountId, formattedData, AccessToken)
    );
  };

  const AddSubmitBank = (data) => {
    const formattedData = formatData(data);
    const employeeId = employees[0];
    if (editedEmployeeId) {
      dispatch(
        addEmployeeBankDetails(editedEmployeeId, formattedData, AccessToken)
      );
    } else {
      dispatch(addEmployeeBankDetails(employeeId, formattedData, AccessToken));
    }
    resetBankForm(); // Reset form after submission
  };

  const handleEditAddress = (index) => {
    setEditingAddressIndex(index);
  };

  const handleEditEmergency = (index) => {
    setEditingEmergencyIndex(index);
  };
  const bankNames = [
    "Jammu and Kashmir Bank",
    "State Bank of India",
    "Axis Bank",
    "HDFC Bank",
  ];
  const addressTypes = ["TEMPORARY", "PERMANENT"];

  //Validators
  const validateContact = (value) => {
    if (!/^\d{10}$/.test(value)) {
      return "Contact must be exactly 10 digits";
    }
    return true;
  };
  const validateRelationship = (value) =>
    /^[A-Za-z\s]+$/.test(value) || "Invalid relationship";
  const validateBankName = (value) => {
    return (value && value.trim() !== "") || "Bank Name is required";
  };

  const validateAccountNumber = (value) => {
    const regex = /^[0-9]{9,18}$/;
    return (
      regex.test(value) || "Account Number must be between 9 and 18 digits"
    );
  };

  const validateIFSC = (value) => {
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(value) || "IFSC Code must be in the format XXXX0YYYYYY";
  };

  const validateBranch = (value) => {
    return (value && value.trim() !== "") || "Bank Branch is required";
  };

    useEffect(() => {
    console.log("Callledd");
    
    if (isEditing && preEditedEmployeeDetails) {
      const { emergencyContacts, addresses, account } =
        preEditedEmployeeDetails;

      if (emergencyContacts && emergencyContacts.length > 0) {
        setEmergencyFields(emergencyContacts);
        emergencyContacts.forEach((contact, index) => {
          setEmergencyValue(
            `contacts[${index}].contactId`,
            contact?.emergencyContactId
          );
          setEmergencyValue(`contacts[${index}].contact`, contact.contact);
          setEmergencyValue(
            `contacts[${index}].relationship`,
            contact.relationship
          );
        });
      }

      if (addresses && addresses.length > 0) {
        setAddressFields(addresses);
        addresses.forEach((address, index) => {
          setAddressValue(`addresses[${index}].addressId`, address.addressId);
          setAddressValue(
            `addresses[${index}].addressType`,
            address.addressType
          );
          setAddressValue(
            `addresses[${index}].propertyNumber`,
            address.propertyNumber
          );
          setAddressValue(`addresses[${index}].city`, address.zipCode.city);
          setAddressValue(
            `addresses[${index}].zipCode`,
            address.zipCode.zipCode
          );
          setAddressValue(`addresses[${index}].state`, address.zipCode.state);
          setAddressValue(`addresses[${index}].country`, address.country);
        });
      }

      if (account) {
        setBankAccountId(account?.accountId)
        setBankDetails(account);
        const { bankName, accountNumber, ifsc, branch } = account;
        setBankValue("bankName", bankName);
        setBankValue("accountNumber", accountNumber);
        setBankValue("ifsc", ifsc);
        setBankValue("branch", branch);
      }
    }
  }, [
    isEditing,
    preEditedEmployeeDetails,
    setEmergencyValue,
    setAddressValue,
    setBankValue,
    editingFlag
  ]);
  return (
    <div>
      <div>
        {/* Emergency Contact Details Div */}
        {isEditing && emergencyFields.length > 0 ? (
          <div
            className={`emergency-contact-details ${darkMode ? "dark" : ""}`}
          >
            <h2
              className={`text-lg text-center ${
                darkMode ? "text-white" : "text-slate-600"
              } font-semibold mt-8`}
            >
              Edit Emergency Contact Details
              <sup className="text-red-900 font-extrabold">*</sup>
            </h2>
            {emergencyFields.map((contact, index) => (
              <form
                key={index}
                className="p-5"
                onSubmit={handleSubmitEmergency((data) =>
                  EditEmergencyContactDetailsSubmit(data, index)
                )}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="mt-2">
                    <label
                      htmlFor={`contacts[${index}].contact`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Contact<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id={`contacts[${index}].contact`}
                      {...registerEmergency(`contacts[${index}].contact`, {
                        required: "Contact is required",
                        validate: validateContact,
                      })}
                      type="number"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      defaultValue={contact.contact}
                    />
                    {errorsEmergency?.contacts?.[index]?.contact && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsEmergency.contacts[index].contact.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`contacts[${index}].relationship`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Relationship<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id={`contacts[${index}].relationship`}
                      {...registerEmergency(`contacts[${index}].relationship`, {
                        required: "Relationship is required",
                        validate: validateRelationship,
                      })}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      defaultValue={contact.relationship}
                    />
                    {errorsEmergency?.contacts?.[index]?.relationship && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsEmergency.contacts[index].relationship.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-x-3 mt-2">
                  <button
                    type="submit"
                    className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 py-1 px-5 flex items-center gap-3 ${
                      loading
                        ? "bg-slate-900 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    <FaEdit className="ml-2" /> Update Contact
                  </button>
                </div>
              </form>
            ))}
          </div>
        ) : (
          <div
            className={`emergency-contact-details ${darkMode ? "dark" : ""}`}
          >
            <h2
              className={`text-lg text-center ${
                darkMode ? "text-white" : "text-slate-600"
              } font-semibold mt-8`}
            >
              Emergency Contact Details
              <sup className="text-red-900 font-extrabold">*</sup>
            </h2>
            <form
              data-testid="additional-details-form"
              className="p-5"
              onSubmit={handleSubmitEmergency(AddEmergencyContactDetailsSubmit)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="mt-2">
                  <label
                    htmlFor="contact"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Contact<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="contact"
                    {...registerEmergency("contacts[0].contact", {
                      required: "Contact is required",
                      validate: validateContact,
                    })}
                    type="number"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                  />
                  {errorsEmergency?.contacts?.[0]?.contact && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsEmergency.contacts[0].contact.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="relationship"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Relationship<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="relationship"
                    {...registerEmergency("contacts[0].relationship", {
                      required: "Relationship is required",
                      validate: validateRelationship,
                    })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                  />
                  {errorsEmergency?.contacts?.[0]?.relationship && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsEmergency.contacts[0].relationship.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-3 mt-2">
                <button
                  type="submit"
                  className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                    loading
                      ? "bg-slate-900 text-white"
                      : "bg-yellow-500 text-black"
                  } py-1 px-5 flex items-center gap-3`}
                  data-testid="add-contact-button"
                >
                  <FaPlus className="ml-2" /> Add Contact
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {/* Address Details Div */}
      <div className={`employee-details ${darkMode ? "dark" : ""}`}>
        <div className="address-section">
          <h2
            className={`text-lg text-center ${
              darkMode ? "text-white" : "text-slate-600"
            } font-semibold mt-8`}
          >
            {isEditing ? "Edit Address Details" : "Address Details"}
            <sup className="text-red-900 font-extrabold">*</sup>
          </h2>
          {isEditing && addressFields.length > 0 ? (
            addressFields.map((address, index) => (
              <form
                key={index}
                className="p-5"
                onSubmit={handleSubmitAddress((data) =>
                  EditSubmitAddress(data, index)
                )}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="mt-2">
                    <label
                      htmlFor={`addresses[${index}].addressType`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Address Type<sup className="text-red-900">*</sup>
                    </label>
                    <select
                      id={`addresses[${index}].addressType`}
                      {...registerAddress(`addresses[${index}].addressType`, {
                        required: "Address Type is required",
                      })}
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      data-testid="addressType-input"
                    >
                      <option value="">Select Address Type</option>
                      {addressTypes.map((type, idx) => (
                        <option key={idx} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errorsAddress[`addresses[${index}].addressType`] && (
                      <p className="text-red-500 text-md mt-2">
                        {
                          errorsAddress[`addresses[${index}].addressType`]
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`addresses[${index}].propertyNumber`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Property Number<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id={`addresses[${index}].propertyNumber`}
                      {...registerAddress(
                        `addresses[${index}].propertyNumber`,
                        {
                          required: "Property Number is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s]+$/,
                            message: "Property Number must be alphanumeric",
                          },
                        }
                      )}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      placeholder="Enter Property Number"
                      data-testid="propertyNumber-input"
                    />
                    {errorsAddress[`addresses[${index}].propertyNumber`] && (
                      <p className="text-red-500 text-md mt-2">
                        {
                          errorsAddress[`addresses[${index}].propertyNumber`]
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`addresses[${index}].city`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      City<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id={`addresses[${index}].city`}
                      {...registerAddress(`addresses[${index}].city`, {
                        required: "City is required",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "City must contain only letters",
                        },
                      })}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      placeholder="Enter City"
                      data-testid="city-input"
                    />
                    {errorsAddress[`addresses[${index}].city`] && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsAddress[`addresses[${index}].city`]?.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`addresses[${index}].zipCode`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Zip Code<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id={`addresses[${index}].zipCode`}
                      {...registerAddress(`addresses[${index}].zipCode`, {
                        required: "Zip Code is required",
                        pattern: {
                          value: /^[0-9]{6}(?:-[0-9]{4})?$/,
                          message:
                            "Zip Code must be in the format 123456 or 12345-6789",
                        },
                      })}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      placeholder="Enter Zip Code"
                      data-testid="zipCode-input"
                    />
                    {errorsAddress[`addresses[${index}].zipCode`] && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsAddress[`addresses[${index}].zipCode`]?.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`addresses[${index}].state`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      State<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id={`addresses[${index}].state`}
                      {...registerAddress(`addresses[${index}].state`, {
                        required: "State is required",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "State must contain only letters",
                        },
                      })}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      placeholder="Enter State"
                      data-testid="state-input"
                    />
                    {errorsAddress[`addresses[${index}].state`] && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsAddress[`addresses[${index}].state`]?.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`addresses[${index}].country`}
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Country<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id={`addresses[${index}].country`}
                      {...registerAddress(`addresses[${index}].country`, {
                        required: "Country is required",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Country must contain only letters",
                        },
                      })}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      placeholder="Enter Country"
                      data-testid="country-input"
                    />
                    {errorsAddress[`addresses[${index}].country`] && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsAddress[`addresses[${index}].country`]?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-x-3 mt-4">
                  <button
                    type="submit"
                    className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                      loading
                        ? "bg-slate-900 text-white"
                        : "bg-yellow-500 text-black"
                    } py-1 px-5 flex items-center gap-3`}
                    data-testid="edit-address-button"
                  >
                    <FaSave className="ml-2" /> Update Address
                  </button>
                </div>
              </form>
            ))
          ) : (
            <form
              className="p-5"
              onSubmit={handleSubmitAddress(AddSubmitAddress)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="mt-2">
                  <label
                    htmlFor="addressType"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Address Type<sup className="text-red-900">*</sup>
                  </label>
                  <select
                    id="addressType"
                    {...registerAddress("addressType", {
                      required: "Address Type is required",
                    })}
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    data-testid="addressType-input"
                  >
                    <option value="">Select Address Type</option>
                    {addressTypes.map((type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errorsAddress.addressType && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsAddress.addressType.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="propertyNumber"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Property Number<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="propertyNumber"
                    {...registerAddress("propertyNumber", {
                      required: "Property Number is required",
                      pattern: {
                        value: /^[a-zA-Z0-9\s]+$/,
                        message: "Property Number must be alphanumeric",
                      },
                    })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    placeholder="Enter Property Number"
                    data-testid="propertyNumber-input"
                  />
                  {errorsAddress.propertyNumber && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsAddress.propertyNumber.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="city"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    City<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="city"
                    {...registerAddress("city", {
                      required: "City is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "City must contain only letters",
                      },
                    })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    placeholder="Enter City"
                    data-testid="city-input"
                  />
                  {errorsAddress.city && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsAddress.city.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="zipCode"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Zip Code<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="zipCode"
                    {...registerAddress("zipCode", {
                      required: "Zip Code is required",
                      pattern: {
                        value: /^[0-9]{6}(?:-[0-9]{4})?$/,
                        message:
                          "Zip Code must be in the format 123456 or 12345-6789",
                      },
                    })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    placeholder="Enter Zip Code"
                    data-testid="zipCode-input"
                  />
                  {errorsAddress.zipCode && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsAddress.zipCode.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="state"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    State<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="state"
                    {...registerAddress("state", {
                      required: "State is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "State must contain only letters",
                      },
                    })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    placeholder="Enter State"
                    data-testid="state-input"
                  />
                  {errorsAddress.state && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsAddress.state.message}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="country"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Country<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="country"
                    {...registerAddress("country", {
                      required: "Country is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Country must contain only letters",
                      },
                    })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    placeholder="Enter Country"
                    data-testid="country-input"
                  />
                  {errorsAddress.country && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsAddress.country.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-3 mt-4">
                <button
                  type="submit"
                  className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                    loading
                      ? "bg-slate-900 text-white"
                      : "bg-yellow-500 text-black"
                  } py-1 px-5 flex items-center gap-3`}
                  data-testid="add-address-button"
                >
                  <FaPlus className="ml-2" /> Add Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Bank Details Div */}
      <div className={`bank-details ${darkMode ? "dark" : ""}`}>
        {isEditing && bankDetails ? (
          <div>
            <h2
              className={`text-lg text-center ${
                darkMode ? "text-white" : "text-slate-600"
              } font-semibold mt-8`}
            >
              Edit Bank Details
              <sup className="text-red-900 font-extrabold">*</sup>
            </h2>
            <form className="p-5" onSubmit={handleSubmitBank(EditSubmitBank)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mt-2">
                  <label
                    htmlFor="bankName"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Bank Name<sup className="text-red-900">*</sup>
                  </label>
                  <select
                    id="bankName"
                    {...registerBank("bankName", {
                      validate: validateBankName,
                    })}
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                  >
                    <option value="">Select Bank</option>
                    {bankNames.map((bank, index) => (
                      <option key={index} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  {errorsBank.bankName && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsBank.bankName.message}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="accountNumber"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Account Number<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="accountNumber"
                    {...registerBank("accountNumber", {
                      validate: validateAccountNumber,
                    })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    defaultValue={bankDetails.accountNumber}
                  />
                  {errorsBank.accountNumber && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsBank.accountNumber.message}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="ifsc"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    IFSC Code<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="ifsc"
                    {...registerBank("ifsc", { validate: validateIFSC })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    defaultValue={bankDetails.ifscCode}
                  />
                  {errorsBank.ifsc && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsBank.ifsc.message}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="branch"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Bank Branch<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="branch"
                    {...registerBank("branch", { validate: validateBranch })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    defaultValue={bankDetails.bankBranch}
                  />
                  {errorsBank.branch && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsBank.branch.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-x-3 mt-4">
                <button
                  type="submit"
                  className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 ${
                    loading
                      ? "bg-slate-900 text-white"
                      : "bg-yellow-500 text-black"
                  } py-1 px-5 flex items-center gap-3`}
                >
                  <FaEdit className="" /> Update Bank Details
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2
              className={`text-lg text-center ${
                darkMode ? "text-white" : "text-slate-600"
              } font-semibold mt-8`}
            >
              Bank Details<sup className="text-red-900 font-extrabold">*</sup>
            </h2>
            <div className="p-5">
              <form
                data-testid="bank-details-form"
                onSubmit={handleSubmitBank(AddSubmitBank)}
              >
                <div className="mt-2">
                  <label
                    htmlFor="bankName"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Bank Name<sup className="text-red-900">*</sup>
                  </label>
                  <select
                    id="bankName"
                    {...registerBank("bankName", {
                      validate: validateBankName,
                    })}
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                  >
                    <option value="">Select Bank</option>
                    {bankNames.map((bank, index) => (
                      <option key={index} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  {errorsBank.bankName && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsBank.bankName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mt-2">
                    <label
                      htmlFor="accountNumber"
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Account Number<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id="accountNumber"
                      {...registerBank("accountNumber", {
                        validate: validateAccountNumber,
                      })}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      placeholder="Enter Account Number"
                    />
                    {errorsBank.accountNumber && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsBank.accountNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <label
                      htmlFor="ifsc"
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      IFSC Code<sup className="text-red-900">*</sup>
                    </label>
                    <input
                      id="ifsc"
                      {...registerBank("ifsc", { validate: validateIFSC })}
                      type="text"
                      className={`border rounded px-3 py-2 mt-2 w-full ${
                        darkMode
                          ? "border-slate-300 bg-gray-500 text-white"
                          : "border-slate-300 bg-white text-black"
                      }`}
                      placeholder="Enter IFSC Code"
                    />
                    {errorsBank.ifsc && (
                      <p className="text-red-500 text-md mt-2">
                        {errorsBank.ifsc.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="branch"
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Bank Branch<sup className="text-red-900">*</sup>
                  </label>
                  <input
                    id="branch"
                    {...registerBank("branch", { validate: validateBranch })}
                    type="text"
                    className={`border rounded px-3 py-2 mt-2 w-full ${
                      darkMode
                        ? "border-slate-300 bg-gray-500 text-white"
                        : "border-slate-300 bg-white text-black"
                    }`}
                    placeholder="Enter Branch"
                  />
                  {errorsBank.branch && (
                    <p className="text-red-500 text-md mt-2">
                      {errorsBank.branch.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-x-3 mt-10">
                  <button
                    type="submit"
                    className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200
                     ${
                       loading
                         ? "bg-slate-900 text-white"
                         : "bg-yellow-500 text-black"
                     } py-1 px-5 flex items-center`}
                  >
                    <FaPlus className="mr-2" />
                    Add Bank Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => dispatch(setStep(2))}
            className={`text-center text-sm md:text-base font-medium rounded-md leading-6 hover:scale-95 transition-all duration-200 bg-yellow-500 text-black py-1 px-5 flex items-center justify-center`}
          >
            <FaArrowLeft className="ml-2" /> Previous Step
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/employee/employee-list");
            }}
            className="bg-green-500 text-white py-1 px-4 rounded flex items-center"
          >
            <FaSave className="mr-2" /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdditionalDetails;
