import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  addDepartmentAttributes,
  deleteDepartmentAttributes,
  DepartmentAttributeslist,
  updateDepartmentAttributes,
} from "../../../../../services/operations/departmentAPI";
import { addOrganisationAttributes, deleteOrganisationAttributes, getOrganisationAttributes, updateOrganisationAttributes } from "../../../../../services/operations/OrganisationAPI";
import ConfirmationModal from "../../../../common/ConfirmationModal";

const OrganizationAttributes = ({ NextHandler }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { AccessToken } = useSelector((state) => state.auth);
  const [organizationAttribute, setOrganizationAttributes] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [attribute, setAttribute] = useState({
    attributeId: "",
    attributeKey: "",
    error: "",
  });
  const [editAttribute, setEditAttribute] = useState({
    attributeId: "",
    attributeKey: "",
    error: "",
  });
  const [edit, setEdit] = useState(false);
  async function getRes() {
    const res = await dispatch(getOrganisationAttributes(AccessToken));
    setOrganizationAttributes(res?.data);
  }
  useEffect(() => {
    getRes();
  }, [dispatch, AccessToken]);


  const normalizeString = (str) => {
    return str.trim().replace(/\s+/g, ' '); 
  };

  const validateAttributeKey = (key) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(key);
  };

  const addAttributes = async () => {
    const normalizedAttributeKey = normalizeString(attribute.attributeKey);

    if (!normalizedAttributeKey) {
      setAttribute({ ...attribute, error: "Attribute field is required" });
    } else if (!validateAttributeKey(normalizedAttributeKey)) {
      setAttribute({ ...attribute, error: "Attribute field must contain only letters" });
    } else {
      setAttribute({ ...attribute, attributeKey: normalizedAttributeKey, error: "" });
      try {
        await dispatch(addOrganisationAttributes(AccessToken, { ...attribute, attributeKey: normalizedAttributeKey }));
        getRes();
        setAttribute({
          attributeId: "",
          attributeKey: "",
          error: "",
        });
      } catch (error) {
        setAttribute({ ...attribute, error: "Failed to add attribute" });
      }
    }
  };

  const handleEdit = (item) => {
    setEdit(item.attributeId);
    setEditAttribute({
      attributeId: item.attributeId,
      attributeKey: item.attributeKey,
      error: "",
    });
  };
  const editAttributes = async (attributeId) => {
    const normalizedEditAttributeKey = normalizeString(editAttribute.attributeKey);

    if (!normalizedEditAttributeKey) {
      setEditAttribute({ ...editAttribute, error: "Attribute field is required" });
    } else if (!validateAttributeKey(normalizedEditAttributeKey)) {
      setEditAttribute({ ...editAttribute, error: "Attribute field must contain only letters" });
    } else {
      setEditAttribute({ ...editAttribute, attributeKey: normalizedEditAttributeKey, error: "" });
      try {
        await dispatch(updateOrganisationAttributes(AccessToken, { ...editAttribute, attributeKey: normalizedEditAttributeKey }, attributeId));
        getRes();
        setEdit(false);
      } catch (error) {
        setEditAttribute({ ...editAttribute, error: "Failed to update attribute" });
      }
    }
  }
  const handleDelete=async(attributeId)=>{
    await dispatch(
        deleteOrganisationAttributes(AccessToken,attributeId)
    );
    getRes();
  }
  return (
    <div
      className={`max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 ${
        darkMode ? "bg-slate-600" : "bg-white"
      }`}
    >
      <div className="mb-4 ">
      <div className="flex gap-2">
      <input
            id="addAttribute"
            type="text"
            data-testid="addAttribute"
            placeholder="Add Attributes..."
            value={attribute.attributeKey}
            className={`shadow appearance-none border rounded w-3/4 py-2 px-3 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white text-gray-700"
            }`}
            onChange={(e) =>
              setAttribute({
                ...attribute,
                attributeKey: e.target.value,
              })
            }
          />
          <button
            type="submit"
            className={`text-center w-1/4 text-sm md:text-base font-medium rounded-md py-2 px-5 bg-blue-700
                text-white
                hover:scale-95 transition-all duration-200`}
            onClick={addAttributes}
          >
          Add
        </button>
      </div>
      {attribute.error && <p className="text-red-500 mt-1">{attribute.error}</p>}
      </div>


      <div className="mt-4">
        {organizationAttribute.length>0 ?
          organizationAttribute.map((item) => (
            <div
              key={item.attributeId}
              className={`max-w-md mx-auto shadow-md rounded flex items-center justify-between px-4 py-2 mb-4 ${
                darkMode ? "bg-slate-600" : "bg-white"
              }`}
            >
{edit == item.attributeId ? (
        <div className="flex flex-col ">
            <div className="flex gap-2">
    <input
      type="text"
      placeholder="Edit Attribute..."
      value={editAttribute.attributeKey}
      className={`shadow appearance-none border rounded w-full py-2 px-3 ${
        darkMode
          ? "bg-gray-700 border-gray-600 text-white"
          : "bg-white text-gray-700"
      }`}
      onChange={(e) =>
        setEditAttribute({
          ...editAttribute,
          attributeKey: e.target.value,
        })
      }
    />
    <button
      type="submit"
      className={`text-center w-1/4 text-sm md:text-base font-medium rounded-md py-2 px-5 bg-blue-700
          text-white
          hover:scale-95 transition-all duration-200`}
      onClick={() => editAttributes(item.attributeId)}
    >
      Edit
    </button>
  </div>
  {editAttribute.error && <p className="text-red-500 mt-1">{editAttribute.error}</p>}

   </div>

) : (
  <p className="text-lg">{item.attributeKey}</p>
)}

              <div className="flex gap-4">
                <FaEdit onClick={() => handleEdit(item)} />
                <MdDelete onClick={() => 
                                                setConfirmationModal({
                                                  text1: "Are You Sure?",
                                                  text2:
                                                    "You want to Delete this Organization Attribute. Deleting this Organization organization may affect other functionalities. Are you sure you want to proceed?",
                                                  btn1Text: "Delete Attribute",
                                                  btn2Text: "Cancel",
                                                  btn1Handler: async () => {
                                                    await dispatch(
                                                      deleteOrganisationAttributes(AccessToken,item.attributeId)
                                                  );
                                                  setConfirmationModal(null)
                                                  getRes();
                                                  },
                                                  btn2Handler: () => setConfirmationModal(null),
                                                })  
                                                }/>
              </div>
            </div>
          ))
          :
          (
            <p className={`text-sm  mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
              No attributes available
            </p>
          )
          }
      </div>
      <button
        className={`text-center w-full text-sm md:text-base font-medium rounded-md py-2 px-5 bg-blue-700
             text-white hover:scale-95 transition-all duration-200`}
        onClick={() => NextHandler()}
      >
        Next
      </button>
      {confirmationModal && (
            <ConfirmationModal modalData={confirmationModal} />
          )}
    </div>
  );
};

export default OrganizationAttributes;
