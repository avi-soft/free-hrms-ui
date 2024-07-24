import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizations: [],
  loading: false,
  AllOrganizations: [],
  selectedImage: null,
  existingImage: null,
  showOption:
    localStorage.getItem("showOption")  ? localStorage.getItem("showOption") : "false",
};

const organizationSlice = createSlice({
  name: "organization",
  initialState: initialState,
  reducers: {
    AddOrganization(state, action) {
      state.organizations.push(action.payload); // Corrected from departments to organizations
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
      console.log(action);
      localStorage.setItem("showOption", action.payload.toString());
      state.showOption=action.payload.toString()

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
