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
import ConfirmationModal from "../../../../common/ConfirmationModal";

const DepartmentAttributes = ({ NextHandler }) => {
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { darkMode } = useSelector((state) => state.theme);
  const { AccessToken } = useSelector((state) => state.auth);
  const [departmentAttribute, setDepartmentAttributes] = useState([]);
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
    const res = await dispatch(DepartmentAttributeslist(AccessToken));
    setDepartmentAttributes(res?.data);
  }
  useEffect(() => {
    getRes();
  }, [dispatch, AccessToken]);

  const normalizeString = (str) => {
    return str.trim().replace(/\s+/g, " "); // Trim and replace multiple spaces with a single space
  };

  const addAttributes = async () => {
    const normalizedAttributeKey = normalizeString(attribute.attributeKey);

    if (!normalizedAttributeKey) {
      setAttribute({ ...attribute, error: "Attributes field is required" });
    } else {
      setAttribute({
        ...attribute,
        attributeKey: normalizedAttributeKey,
        error: "",
      });
      try {
        await dispatch(
          addDepartmentAttributes(
            { ...attribute, attributeKey: normalizedAttributeKey },
            AccessToken
          )
        );
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
    const normalizedEditAttributeKey = normalizeString(
      editAttribute.attributeKey
    );

    if (!normalizedEditAttributeKey) {
      setEditAttribute({
        ...editAttribute,
        error: "Attributes field is required",
      });
    } else {
      setEditAttribute({
        ...editAttribute,
        attributeKey: normalizedEditAttributeKey,
        error: "",
      });
      try {
        await dispatch(
          updateDepartmentAttributes(
            AccessToken,
            { ...editAttribute, attributeKey: normalizedEditAttributeKey },
            attributeId
          )
        );
        getRes();
        setEdit(false);
      } catch (error) {
        setEditAttribute({
          ...editAttribute,
          error: "Failed to update attribute",
        });
      }
    }
  };

  const handleDelete = async (attributeId) => {
    await dispatch(deleteDepartmentAttributes(AccessToken, attributeId));
    getRes();
  };
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
        {attribute.error && (
          <p className="text-red-500 mt-1">{attribute.error}</p>
        )}
      </div>

      <div className="mb-4">
        {
        departmentAttribute.length>0 ? (
          departmentAttribute.map((item) => (
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
                <MdDelete onClick={() =>
                                                    setConfirmationModal({
                                                      text1: "Are You Sure?",
                                                      text2:
                                                        "You want to Delete this Department Attribute. This Department Attribute may contain important Information. Deleting this department attribute will remove all the details associated with it.",
                                                      btn1Text: "Delete Department",
                                                      btn2Text: "Cancel",
                                                      btn1Handler: async () => {
                                                        await dispatch(deleteDepartmentAttributes(AccessToken, item.attributeId));
                                                        setConfirmationModal(null);
                                                        getRes();

                                                      },
                                                      btn2Handler: () =>
                                                        setConfirmationModal(null),
                                                    })
                  } />
              </div>
            </div>
          ))
        ) : (
          <p className={`text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>
            No attributes available
          </p>
        )}
      </div>
      <button
        className={`text-center w-full text-sm md:text-base font-medium rounded-md py-2 px-5 bg-blue-700
             text-white hover:scale-95 transition-all duration-200`}
        onClick={() => NextHandler()}
      >
        Next
      </button>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

    </div>
  );
};

export default DepartmentAttributes;
