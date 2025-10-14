import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchPatientCompaniesForDropdown,
  fetchAssociateCompaniesForDropdown,
  addPatientCompanyToTable,
  updatePatientCompanyInTable,
  removePatientCompaniesFromTable,
  togglePatientCompanyRowSelection,
  selectAllPatientCompanyRows,
  clearAllPatientCompanySelections,
  savePatientCompanyData,
  resetPatientCompanyMultiplayerState,
} from "./thunks";
import {
  PatientCompanyMultiplayerState,
  PatientCompanyDropdownState,
  PatientCompanyTableState,
  PatientCompanyData,
} from "./types";

const initialDropdownState: PatientCompanyDropdownState = {
  companies: [],
  associateCompanies: [],
  loading: false,
  error: null,
};

const initialTableState: PatientCompanyTableState = {
  data: [],
  selectedRows: [],
  loading: false,
  error: null,
};

const initialState: PatientCompanyMultiplayerState = {
  dropdown: initialDropdownState,
  table: initialTableState,
};

const patientCompanyMultiplayerSlice = createSlice({
  name: "patientCompanyMultiplayer",
  initialState,
  reducers: {
    // Dropdown actions
    resetDropdownState: (state) => {
      state.dropdown = initialDropdownState;
    },
    
    // Table actions
    setTableData: (state, action: PayloadAction<PatientCompanyData[]>) => {
      state.table.data = action.payload;
    },
    
    clearTableData: (state) => {
      state.table.data = [];
    },
    
    // Row selection actions
    setSelectedRows: (state, action: PayloadAction<string[]>) => {
      state.table.selectedRows = action.payload;
    },
    
    clearSelectedRows: (state) => {
      state.table.selectedRows = [];
    },
    
    // Error handling
    clearErrors: (state) => {
      state.dropdown.error = null;
      state.table.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patient Companies for Dropdown
      .addCase(fetchPatientCompaniesForDropdown.pending, (state) => {
        state.dropdown.loading = true;
        state.dropdown.error = null;
      })
      .addCase(fetchPatientCompaniesForDropdown.fulfilled, (state, action) => {
        state.dropdown.loading = false;
        state.dropdown.companies = action.payload;
      })
      .addCase(fetchPatientCompaniesForDropdown.rejected, (state, action) => {
        state.dropdown.loading = false;
        state.dropdown.error = action.payload || "Failed to fetch patient companies";
      })
      
      // Fetch Associate Companies for Dropdown
      .addCase(fetchAssociateCompaniesForDropdown.pending, (state) => {
        state.dropdown.loading = true;
        state.dropdown.error = null;
      })
      .addCase(fetchAssociateCompaniesForDropdown.fulfilled, (state, action) => {
        state.dropdown.loading = false;
        state.dropdown.associateCompanies = action.payload;
      })
      .addCase(fetchAssociateCompaniesForDropdown.rejected, (state, action) => {
        state.dropdown.loading = false;
        state.dropdown.error = action.payload || "Failed to fetch associate companies";
      })
      
      // Add Patient Company to Table
      .addCase(addPatientCompanyToTable.pending, (state) => {
        state.table.loading = true;
        state.table.error = null;
      })
      .addCase(addPatientCompanyToTable.fulfilled, (state, action) => {
        state.table.loading = false;
        state.table.data.push(action.payload);
      })
      .addCase(addPatientCompanyToTable.rejected, (state, action) => {
        state.table.loading = false;
        state.table.error = action.payload || "Failed to add patient company";
      })
      
      // Update Patient Company in Table
      .addCase(updatePatientCompanyInTable.pending, (state) => {
        state.table.loading = true;
        state.table.error = null;
      })
      .addCase(updatePatientCompanyInTable.fulfilled, (state, action) => {
        state.table.loading = false;
        const { id, updates } = action.payload;
        const index = state.table.data.findIndex(item => item.id === id);
        if (index !== -1) {
          // Merge the updates with the existing data
          state.table.data[index] = {
            ...state.table.data[index],
            ...updates,
            modifiedOn: new Date().toISOString(),
          };
        }
      })
      .addCase(updatePatientCompanyInTable.rejected, (state, action) => {
        state.table.loading = false;
        state.table.error = action.payload || "Failed to update patient company";
      })
      
      // Remove Patient Companies from Table
      .addCase(removePatientCompaniesFromTable.pending, (state) => {
        state.table.loading = true;
        state.table.error = null;
      })
      .addCase(removePatientCompaniesFromTable.fulfilled, (state, action) => {
        state.table.loading = false;
        state.table.data = state.table.data.filter(item => !action.payload.includes(item.id));
        // Remove from selected rows as well
        state.table.selectedRows = state.table.selectedRows.filter(id => !action.payload.includes(id));
      })
      .addCase(removePatientCompaniesFromTable.rejected, (state, action) => {
        state.table.loading = false;
        state.table.error = action.payload || "Failed to remove patient companies";
      })
      
      // Toggle Patient Company Row Selection
      .addCase(togglePatientCompanyRowSelection.fulfilled, (state, action) => {
        const { id, selected } = action.payload;
        if (selected) {
          if (!state.table.selectedRows.includes(id)) {
            state.table.selectedRows.push(id);
          }
        } else {
          state.table.selectedRows = state.table.selectedRows.filter(rowId => rowId !== id);
        }
      })
      
      // Select All Patient Company Rows
      .addCase(selectAllPatientCompanyRows.fulfilled, (state, action) => {
        const { selected, allIds } = action.payload;
        if (selected) {
          state.table.selectedRows = [...new Set([...state.table.selectedRows, ...allIds])];
        } else {
          state.table.selectedRows = state.table.selectedRows.filter(id => !allIds.includes(id));
        }
      })
      
      // Clear All Patient Company Selections
      .addCase(clearAllPatientCompanySelections.fulfilled, (state) => {
        state.table.selectedRows = [];
      })
      
      // Save Patient Company Data
      .addCase(savePatientCompanyData.pending, (state) => {
        state.table.loading = true;
        state.table.error = null;
      })
      .addCase(savePatientCompanyData.fulfilled, (state) => {
        state.table.loading = false;
        // Clear the table data after successful save
        state.table.data = [];
        state.table.selectedRows = [];
      })
      .addCase(savePatientCompanyData.rejected, (state, action) => {
        state.table.loading = false;
        state.table.error = action.payload || "Failed to save patient company data";
      })
      
      // Reset Patient Company Multiplayer State
      .addCase(resetPatientCompanyMultiplayerState.fulfilled, (_state) => {
        return initialState;
      });
  },
});

export const {
  resetDropdownState,
  setTableData,
  clearTableData,
  setSelectedRows,
  clearSelectedRows,
  clearErrors,
} = patientCompanyMultiplayerSlice.actions;

export default patientCompanyMultiplayerSlice.reducer;
