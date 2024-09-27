import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  addSubOrganisationAttributes,
  deleteSubOrganisationAttributes,
  getSubOrganisationAttributes,
  updateSubOrganisationAttributes,
} from "../../../../../services/operations/subOrganisationAPI";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import {
  hasCreateBranchAttributePrivilege,
  hasDeleteBranchAttributePrivilege,
  hasGetBranchAttributePrivilege,
  hasUpdateBranchAttributePrivilege,
} from "../../../../../utils/privileges";

const SubOrganizationAttribute = ({ NextHandler }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { AccessToken } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [branchAttribute, setBranchAttributes] = useState([]);
  const [attribute, setAttribute] = useState({
    attributeId: "",
    attributeKey: "",
  });
  const [editAttribute, setEditAttribute] = useState({
    attributeId: "",
    attributeKey: "",
  });

  const normalizeString = (str) => {
    return str.trim().replace(/\s+/g, " ");
  };
  const [edit, setEdit] = useState(false);
  async function getSubOrganizationAttributes() {
    if (hasGetBranchAttributePrivilege) {
      const res = await dispatch(getSubOrganisationAttributes(AccessToken));
      setBranchAttributes(res?.data.branchAttributes);
    }
  }
  useEffect(() => {
    getSubOrganizationAttributes();
  }, [dispatch, AccessToken]);

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
          addSubOrganisationAttributes(
            { ...attribute, attributeKey: normalizedAttributeKey },
            AccessToken
          )
        );
        getSubOrganizationAttributes();
        setAttribute({ attributeId: "", attributeKey: "", error: "" });
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
          updateSubOrganisationAttributes(
            AccessToken,
            { ...editAttribute, attributeKey: normalizedEditAttributeKey },
            attributeId
          )
        );
        getSubOrganizationAttributes();
        setEdit(false);
      } catch (error) {
        setEditAttribute({
          ...editAttribute,
          error: "Failed to update attribute",
        });
      }
    }
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

      <div className="mt-4">
        {branchAttribute?.length > 0 ? (
          branchAttribute?.map((item) => (
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
                {
                  hasUpdateBranchAttributePrivilege  &&                  <FaEdit onClick={() => handleEdit(item)} />

                }
                {hasDeleteBranchAttributePrivilege && (
                  <MdDelete
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Are You Sure?",
                        text2:
                          "You want to Delete this SubOrganization Attribute. This SubOrganization attribute may contain important Information. Deleting this SubOrganization attribute will remove all the details associated with it.",
                        btn1Text: "Delete Attribute",
                        btn2Text: "Cancel",
                        btn1Handler: async () => {
                          await dispatch(
                            deleteSubOrganisationAttributes(
                              AccessToken,
                              item.attributeId
                            )
                          );
                          setConfirmationModal(null);
                          getSubOrganizationAttributes();
                        },
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p
            className={` mb-2 text-sm ${
              darkMode ? "text-white" : "text-gray-700"
            }`}
          >
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

export default SubOrganizationAttribute;
