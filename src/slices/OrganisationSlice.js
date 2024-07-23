import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizations: [
  ],
  loading: false,
  AllOrganizations: [
    {
      organizationId: 1,
      organizationLogo: "https://via.placeholder.com/50",
      organizationName: "Org One",
      organizationDetails: "Details about Org One jflkpwekfp,d,f,f;w,;ew,f;f,wefe;w,;f,m;m vmflwemf;lvmsmggmegw;gmsv s;kg,smga;gmpwevmd,e;'gme'wm",
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
