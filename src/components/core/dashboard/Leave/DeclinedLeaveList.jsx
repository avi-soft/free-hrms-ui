import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { declinedLeaveRequestsForEmployee } from '../../../../services/operations/leaveAPI';
import Spinner from '../../../common/Spinner';

const DeclinedLeaveList = () => {
  const [declinedLeaves, setDeclinedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { AccessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { darkMode } = useSelector((state) => state.theme);
  const employeeId = user?.employeeId;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDeclinedLeaves = async () => {
      try {
        const response = await dispatch(declinedLeaveRequestsForEmployee(employeeId, AccessToken));
        console.log(response);
        const data = response.data;

        if (response?.status === 200) {
          setDeclinedLeaves(data?.declinedLeaveRequests);
        }
      } catch (error) {
        console.error('Error fetching declined leave requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeclinedLeaves();
  }, [dispatch, employeeId, AccessToken]);

  return (
    <div className={`${darkMode ? ' text-white' : 'bg-slate-100 text-black'}`}>
      {loading ? (
        <div className='flex flex-col items-center justify-center mt-56'>
          <Spinner />
        </div>
      ) : (
        <div className={`pb-9 rounded-md mb-5 mt-10 ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
          <div className='p-5 flex items-center justify-between'>
            <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-600'}`}>
              Declined Leave Applications
            </div>
            <div>
              <p className={`text-xl left-6 font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                Home / Dashboard /
                <span className='text-yellow-700'> Declined Leave Applications</span>
              </p>
            </div>
          </div>
          <div className='p-10'>
            {declinedLeaves.length > 0 ? (
              <table className="min-w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-slate-200'}>
                  <tr>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Employee ID</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Leave Type</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Start Date</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>End Date</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Number of Days</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {declinedLeaves.map((leave, index) => (
                    <tr key={index} className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-white') : (darkMode ? 'bg-gray-600' : 'bg-gray-100')}>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>
                        <Link to={`/leave-info/${leave.employeeId}`}>
                          {leave.employeeId}
                        </Link>
                      </td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'} ${leave.leaveType === 'PLANNED' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {leave.leaveType}
                      </td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>{leave.startDate}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>{leave.endDate}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>{leave.numberOfDays}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-red-600' : 'border-slate-200 text-red-600'}`}>Declined</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='flex items-center justify-center'>
                <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>No declined leave requests found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeclinedLeaveList;
