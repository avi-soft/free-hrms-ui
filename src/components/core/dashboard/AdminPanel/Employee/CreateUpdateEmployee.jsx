import React from 'react';
import RenderSteps from '../../../FormComponents/RendersSteps';
import { useSelector } from 'react-redux';

const CreateUpdateEmployee = () => {
  const isEditing = useSelector((state) => state.editing.isEditing);
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={`pb-9 mt-5 mb-5  rounded ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100'} h-[90%]`}>
      <div className='p-5 flex items-center justify-between'>
        <div className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-600'}`}>
          {isEditing ? "Edit Employee" : "Create Employee"}
        </div>
        <div>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>Home / Dashboard /
            <span className='text-yellow-700'>
              {isEditing ? "Edit Employee" : "Create Employee"}
            </span>
          </p>
        </div>
      </div>
      <RenderSteps />
    </div>
  );
};

export default CreateUpdateEmployee;
