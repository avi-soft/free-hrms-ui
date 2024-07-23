import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizations: [],
  loading: false,
  AllOrganizations: [],
  selectedImage: null,
  existingImage: null,
  showOption: false,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState: initialState,
  reducers: {
    AddOrganization(state, action) {
      state.departments.push(action.payload);
    },

    setOrganization(state, action) {
      state.AllOrganizations = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setSelectedImage(state, action) {
      state.selectedImage = action.payload;
    },

    setExistingImage(state, action) {
      state.existingImage = action.payload;
    },
    setShowOption(state, action) {
      state.showOption = action.payload;
      localStorage.setItem("showOption", state.showOption.toString());
    },
    toggleShowOption(state) {
      state.showOption = !state.showOption;
      localStorage.setItem("showOption", state.showOption.toString());
    },
  },
});

export const {
  AddOrganization,
  setOrganization,
  setLoading,
  setSelectedImage,
  setExistingImage,
  setShowOption,
  toggleShowOption,
} = organizationSlice.actions;
export default organizationSlice.reducer;
