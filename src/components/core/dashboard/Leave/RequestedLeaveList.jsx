import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { AllLeaveRequests, approveLeaveRequests, declineLeaveRequests } from '../../../../services/operations/leaveAPI';
import ConfirmationModal from '../../../common/ConfirmationModal';

const RequestedLeaveList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { AccessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { darkMode } = useSelector((state) => state.theme);
  const employeeId = user?.userId;
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await dispatch(AllLeaveRequests(AccessToken));
        console.log(response);
        const data = response.data;

        if (data.Success) {
          setLeaveRequests(data.leaveRequests);
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [dispatch, employeeId, AccessToken]);

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div className={`h-MAX ${darkMode ? 'text-white' : 'bg-slate-100 text-black'}`}>
      {loading ? (
        <div className='flex flex-col items-center justify-center mt-56'>
          <Spinner />
        </div>
      ) : (
        <div className={`pb-9 rounded-md mb-5 mt-10 ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
          <div className='p-5 flex items-center justify-between'>
            <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-600'}`}>
              Requested Leave Applications
            </div>
            <div>
              <p className={`text-xl left-6 font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                Home / Dashboard /
                <span className='text-yellow-700'> Requested Leave Applications</span>
              </p>
            </div>
          </div>
          <div className='p-10'>
            {leaveRequests.length > 0 ? (
              <table className="min-w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-slate-200'}>
                  <tr>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Employee Name</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Leave Type</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Start Date</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>End Date</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Number of Days</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Reason</th>
                    <th className={`py-2 px-4 border-b-2 border-slate-600 text-left text-sm leading-4 ${darkMode ? 'text-white' : 'text-black'} font-semibold uppercase tracking-wider`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((leave, index) => (
                    <tr key={index} className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-white') : (darkMode ? 'bg-gray-600' : 'bg-gray-100')}>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'} text-center`}>
                        <Link to={`/leave-info/${leave.employeeId}`}>
                          {leave.employeeFirstName} {leave.employeeLastName}
                        </Link>
                      </td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'} ${leave.leaveType === 'PLANNED' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {leave.leaveType}
                      </td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>{leave.startDate}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>{leave.endDate}</td>
                      <td className={`py-2 px-4 border-b text-center ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>{leave.numberOfDays}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>{leave.reason}</td>
                      <td className={`py-2 px-4 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-slate-200'}`}>
                        <button 
                          onClick={() => setConfirmationModal({
                            text1: "Are you sure?",
                            text2: "You want to Approve this Leave Request.",
                            btn1Text: "Approve",
                            btn2Text: "Cancel",
                            btn1Handler: async () => { await dispatch(approveLeaveRequests(leave.id, AccessToken)); refreshPage(); },
                            btn2Handler: () => setConfirmationModal(null),
                          })}   
                          className={`px-3 py-1 rounded-md mr-2 ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-400 text-white'}`}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => setConfirmationModal({
                            text1: "Are you sure?",
                            text2: "You want to Reject this Leave Request.",
                            btn1Text: "Reject",
                            btn2Text: "Cancel",
                            btn1Handler: async () => { await dispatch(declineLeaveRequests(leave.id, AccessToken)); refreshPage(); },
                            btn2Handler: () => setConfirmationModal(null),
                          })}                         
                          className={`px-3 py-1 rounded-md ${darkMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-400 text-white'}`}
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='flex items-center justify-center'>
                <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>No leave requests found.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default RequestedLeaveList;
