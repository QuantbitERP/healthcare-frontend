import { createSlice } from '@reduxjs/toolkit';
import { HospitalClearanceState } from './type';
import { fetchDepartmentClearanceList, fetchHospitalList } from './thunk';

const initialState: HospitalClearanceState = {
  departmentClearance: [],
  metadata: {
    page: {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1
    }
  },
  loading: false,
  error: null,
  hospital: {
    data:{
      items:[]
    },
    isError:false,
    errorMessage:null,
    validationErrors:null,
    errorCode:null,
  }
};

const hospitalClearanceSlice = createSlice({
  name: 'hospitalClearance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentClearanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentClearanceList.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentClearance = action.payload.data?.items||[];
        state.metadata=action.payload.data?.metadata|| {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          
        }
      })
      .addCase(fetchDepartmentClearanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  .addCase(fetchHospitalList.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchHospitalList.fulfilled, (state, action) => {
    state.loading = false;
    state.hospital = action.payload;
  })
  .addCase(fetchHospitalList.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  })
}
});


export default hospitalClearanceSlice.reducer;
