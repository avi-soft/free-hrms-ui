import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { employeeLeavesList } from '../../../../services/operations/leaveAPI';
import toast from 'react-hot-toast';
import Spinner from '../../../common/Spinner';

const LeaveList = () => {
  const [leaveData, setLeaveData] = useState([]);
  const { user } = useSelector((state) => state.profile);
  const employeeId = user?.employeeId;
  const { AccessToken } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(employeeLeavesList(employeeId, AccessToken));
        console.log(res);
        if (res?.status === 200) {
          setLeaveData(res?.data?.leaveRequests);
          toast.success("Leaves fetched Successfully");
        } else {
          toast.error('Failed to fetch leave requests');
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        toast.error('Error fetching leave requests');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, employeeId, AccessToken]);

  return (
    <div className={`h-max ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {loading ? (
        <div className='flex flex-col items-center justify-center mt-56'>
          <Spinner />
        </div>
      ) : (
        <div className={`pb-9 h-full rounded-md mb-5 ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
          <div className='p-5 flex items-center justify-between'>
            <div className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Leave Applications
            </div>
            <div>
              <p className={`text-xl left-6 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-950'}`}>
                Home / Dashboard /
                <span className='text-yellow-700'> Leave Applications</span>
              </p>
            </div>
          </div>
          <div className='p-10'>
            {leaveData.length > 0 ? (
              <table className="min-w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded-md`}>
                  <tr>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Employee
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Leave Type
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Total Days
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveData.map((leave, index) => (
                    <tr key={index} 
                    className={
                      index % 2 === 0
                        ? `${
                            darkMode
                              ? "bg-gray-400 text-white"
                              : "bg-white text-black"
                          }`
                        : `${
                            darkMode
                              ? "bg-gray-500 text-white"
                              : "bg-gray-100 text-black"
                          }`
                    }
                    >
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>
                        <Link to={`/leave-info/${leave.employeeId}`}>
                          {leave.employeeFirstName} {leave.employeeLastName}
                        </Link>
                      </td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>{leave.leaveType}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>{leave.numberOfDays}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>{leave.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='text-center mt-[15%] text-gray-500'>
                No leave requests available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveList;
