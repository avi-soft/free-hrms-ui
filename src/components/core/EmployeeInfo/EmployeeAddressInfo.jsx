import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { formattedDate } from '../../../utils/dateFormatter';

const EmployeeAddressInfo = ({ user }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const addressDetail = user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;

  const addressDetails = [
    {
      name: 'Address Type',
      value: addressDetail ? addressDetail.addressType : <p className='text-pink-600'>Add Address Type</p>,
    },
    {
      name: 'Country',
      value: addressDetail ? addressDetail.country : <p className='text-pink-600'>Add Country</p>,
    },
    {
      name: 'Property Number',
      value: addressDetail ? addressDetail.propertyNumber : <p className='text-pink-600'>Add Property Number</p>,
    },
    {
      name: 'City',
      value: addressDetail && addressDetail.zipCode ? addressDetail.zipCode.city : <p className='text-pink-600'>Add City</p>,
    },
    {
      name: 'State',
      value: addressDetail && addressDetail.zipCode ? addressDetail.zipCode.state : <p className='text-pink-600'>Add State</p>,
    },
    {
      name: 'Zip Code',
      value: addressDetail && addressDetail.zipCode ? addressDetail.zipCode.zipCode : <p className='text-pink-600'>Add Zip Code</p>,
    },
    // Add more fields as needed
  ];

  return (
    <div className='flex items-center justify-center flex-col gap-5 w-[75%] mx-auto'>
      {/* Address Details Section */}
      <div className='flex gap-6 w-full flex-col p-8 rounded-lg'>
        <div className='flex justify-between items-center'>
          <p className='text-xl text-red-950 font-semibold'>Address Details</p>
        </div>
        <div className='grid grid-cols-2 place-content-between gap-4'>
          {addressDetails.map((element, index) => (
            <div key={index} className='flex flex-col gap-1'>
              <p className='text-xs text-zinc-700 font-bold'>
                {element.name}
                <sup className='text-red-600'>*</sup>
              </p>
              <div className='text-black'>{element.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAddressInfo;
