import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizations: [
    {
      organizationId: 1,
      organizationLogo: "https://via.placeholder.com/50",
      organizationName: "Org One",
      organizationDetails: "Details about Org One",
    },
    {
      organizationId: 2,
      organizationLogo: "https://via.placeholder.com/50",
      organizationName: "Org Two",
      organizationDetails: "Details about Org Two",
    },
    {
      organizationId: 3,
      organizationLogo: "https://via.placeholder.com/50",
      organizationName: "Org Three",
      organizationDetails: "Details about Org Three",
    },
  ],
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
