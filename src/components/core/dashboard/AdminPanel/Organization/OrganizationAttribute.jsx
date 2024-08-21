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

const OrganizationAttributes = ({ NextHandler }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { AccessToken } = useSelector((state) => state.auth);
  const [organizationAttribute, setOrganizationAttributes] = useState([]);
  const [attribute, setAttribute] = useState({
    attributeId: "",
    attributeKey: "",
  });
  const [editAttribute, setEditAttribute] = useState({
    attributeId: "",
    attributeKey: "",
  });
  const [edit, setEdit] = useState(false);
  async function getRes() {
    const res = await dispatch(getOrganisationAttributes(AccessToken));
    setOrganizationAttributes(res?.data);
  }
  useEffect(() => {
    getRes();
  }, [dispatch, AccessToken]);

  const addAttributes = async () => {
    await dispatch(addOrganisationAttributes( AccessToken,attribute));
    getRes();
    setAttribute({
      attributeId: "",
      attributeKey: "",
    });
  };

  const handleEdit = (item) => {
    setEdit(item.attributeId);
    setEditAttribute({ ...editAttribute, attributeKey: item.attributeKey });
  };
  const editAttributes = async (attributeId) => {
    await dispatch(
        updateOrganisationAttributes(AccessToken, editAttribute, attributeId)
    );
    getRes();
    setEdit(false);
  };

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
      <div className="mb-4 flex gap-2">
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
              attributeId: 0,
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

      <div className="mt-4">
        {organizationAttribute &&
          organizationAttribute.map((item) => (
            <div
              key={item.attributeId}
              className={`max-w-md mx-auto shadow-md rounded flex items-center justify-between px-4 py-2 mb-4 ${
                darkMode ? "bg-slate-600" : "bg-white"
              }`}
            >
              {edit == item.attributeId ? (
                <div className="flex gap-2">
                  <input
                    id="addAttribute"
                    type="text"
                    data-testid="editAttribute"
                    autoFocus
                    value={editAttribute.attributeKey}
                    className={`shadow appearance-none border rounded w-3/4 py-2 px-3 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onChange={(e) =>
                      setEditAttribute({
                        attributeId: 0,
                        attributeKey: e.target.value,
                      })
                    }
                  />{" "}
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
              ) : (
                <p className="text-lg">{item.attributeKey}</p>
              )}

              <div className="flex gap-4">
                <FaEdit onClick={() => handleEdit(item)} />
                <MdDelete onClick={() => handleDelete(item.attributeId)}/>
              </div>
            </div>
          ))}
      </div>
      <button
        className={`text-center w-full text-sm md:text-base font-medium rounded-md py-2 px-5 bg-blue-700
             text-white hover:scale-95 transition-all duration-200`}
        onClick={() => NextHandler()}
      >
        Next
      </button>
    </div>
  );
};

export default OrganizationAttributes;
