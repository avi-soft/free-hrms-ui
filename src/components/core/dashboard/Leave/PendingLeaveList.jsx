import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { pendingLeaveRequestsForEmployee } from '../../../../services/operations/leaveAPI';
import Spinner from '../../../common/Spinner';

const PendingLeaveList = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { AccessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { darkMode } = useSelector((state) => state.theme);
  const employeeId = user?.employeeId;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      try {
        const response = await dispatch(pendingLeaveRequestsForEmployee(employeeId, AccessToken));
        console.log(response);
        const data = response.data;

        if (data.success) {
          setPendingLeaves(data?.pendingLeaveRequests);
        }
      } catch (error) {
        console.error('Error fetching pending leave requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLeaves();
  }, [dispatch, employeeId, AccessToken]);

  return (
    <div className={`h-max ${darkMode ? ' text-white' : 'bg-white text-black'}`}>
      {loading ? (
        <div className='flex flex-col items-center justify-center mt-56'>
          <Spinner />
        </div>
      ) : (
        <div className={`pb-9 rounded-md mb-5 mt-10 ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
          <div className='p-5 flex items-center justify-between'>
            <div className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Pending Leave Applications
            </div>
            <div>
              <p className={`text-xl left-6 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-950'}`}>
                Home / Dashboard /
                <span className='text-yellow-700'> Pending Leave Applications</span>
              </p>
            </div>
          </div>
          <div className='p-10'>
            {pendingLeaves.length > 0 ? (
              <table className="min-w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded-md`}>
                  <tr>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Employee ID
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Leave Type
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Start Date
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      End Date
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Number of Days
                    </th>
                    <th className={`py-2 px-4 border-b-2 text-left text-sm leading-4 font-semibold uppercase tracking-wider ${darkMode ? 'border-gray-600 text-gray-300' : 'border-slate-600 text-black'}`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((leave, index) => (
                    <tr key={index} 
                      className={
                        index % 2 === 0
                          ? `${darkMode ? "bg-gray-400 text-white" : "bg-white text-black"}`
                          : `${darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-black"}`
                      }
                    >
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>
                        <Link to={`/leave-info/${leave.employeeId}`}>
                          {leave.employeeId}
                        </Link>
                      </td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>
                        <span className={leave.leaveType === 'PLANNED' ? 'text-blue-600' : 'text-purple-600'}>
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>{leave.startDate}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>{leave.endDate}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'}`}>{leave.numberOfDays}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-black' : 'border-slate-200'} text-yellow-600`}>Pending</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='flex items-center justify-center'>
                <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>No pending leave requests.....</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingLeaveList;
