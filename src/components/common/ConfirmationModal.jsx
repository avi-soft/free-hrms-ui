import React from 'react';
import { useSelector } from 'react-redux';
import IconBtn from './IconBtn';

function ConfirmationModal({ modalData }) {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={`fixed inset-0 z-[1000] grid place-items-center overflow-auto ${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-slate-300 bg-opacity-10'} backdrop-blur-sm`}>
      <div className={`w-fit max-w-[600px] p-7 ${darkMode ? 'text-white border-gray-600 bg-gray-700' : 'text-black border-black bg-gray-300'} rounded-lg`}>
        <div className='flex flex-col gap-3'>
          <p className={`text-2xl font-semibold text-center ${darkMode ? 'text-gray-200' : 'text-slate-950'}`}>
            {modalData.text1}
          </p>
          <p className={`leading-6 mb-3 text-center ${darkMode ? 'text-gray-400' : 'text-zinc-600'}`}>
            {modalData.text2}
          </p>
              <div className=' flex gap-2 items-center justify-center'>
                  <IconBtn onclick={modalData?.btn1Handler} text={modalData?.btn1Text} />
                  <IconBtn onclick={modalData?.btn2Handler} color={0} text={modalData?.btn2Text}/>
              </div>
          </div>
      </div>
    </div>
  )
}

export default ConfirmationModal