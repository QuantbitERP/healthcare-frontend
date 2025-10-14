import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicableHospitalListItemState, CompositeServiceState, newServiceItemListState, ServiceFilterState, ServiceMasterState, ServiceState, ServiceStats, smGetByIdInitialStateType, UpdateServiceMasterState } from './types';
import { compositeServiceList, fetchAllNewServiceList, fetchAllServiceFilters, fetchServiceMasterList, fetchServiceStats, getApplicableHospitalsModalList, getServiceMasterById, postServiceMaster, updateServiceMaster } from './thunks';
import { SaveServiceMasterDto } from '@/services/api-client';



const serviceInitialState: ServiceState = {
  stats: null,
  data: [],
  loading: false,
  error: null,
};
export const serviceSlice = createSlice({
  name: 'service',
  initialState: serviceInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceStats.fulfilled, (state, action: PayloadAction<ServiceStats>) => {
        state.loading = false;
        state.stats = action.payload; 
      })
      .addCase(fetchServiceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching service stats';
      })
      //serviceMaster List
      .addCase(fetchServiceMasterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceMasterList.fulfilled, (state, action: PayloadAction<SaveServiceMasterDto[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchServiceMasterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
});


//all service filters
const initialServiceFilterState: ServiceFilterState = {
  loading: false,
  error: null,

  departments: [],
  subDepartments: [],
  serviceGroups: [],
  activeDeactiveStatus:[],
  applicableHospitals:[],
  operationCategories:[],
  createdByList:[],
  serviceTypes:[],
  modifiedByList:[]
};
export const serviceFiltersSlice = createSlice({
  name: "serviceFilters",
  initialState: initialServiceFilterState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServiceFilters.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchAllServiceFilters.fulfilled, (state, action) => {
  const {
    departments,
    subDepartments,
    serviceGroups,
    activeDeactiveStatus,
    applicableHospitals,
    operationCategories,
    createdByList,
    serviceTypes,
    modifiedByList

  } = action.payload;

  state.departments = departments;
  state.subDepartments = subDepartments;
  state.serviceGroups = serviceGroups;
  state.activeDeactiveStatus = activeDeactiveStatus;
  state.applicableHospitals = applicableHospitals;
  state.operationCategories = operationCategories;
  state.createdByList = createdByList;
  state.serviceTypes = serviceTypes;
  state.modifiedByList = modifiedByList;
  state.loading = false;
})
.addCase(fetchAllServiceFilters.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});
  },
});

//create new service
//new service dropdown list
const initialNewServiceItemListState: newServiceItemListState = {
  loading: false,
  error: null,
    departments: [],
  subDepartments: [],
  serviceGroups: [],
  applicableHospitals:[],
  operationCategories:[],
  serviceTypes:[],
  additionalServiceGroups: [],
  restrictionTypes: [],
  repeatableTypes: [],
  timeDaysList:[],
}

export const createNewServiceItemListSlice = createSlice({
  name: "createNewServiceItemList",
  initialState: initialNewServiceItemListState,
  reducers:{},
 extraReducers: (builder) => {
    builder
      .addCase(fetchAllNewServiceList.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchAllNewServiceList.fulfilled, (state, action) => {
  const {
    departments,
    subDepartments,
    serviceGroups,
    applicableHospitals,
    operationCategories,
    serviceTypes,
    additionalServiceGroups,
    restrictionTypes,
    repeatableTypes,
    timeDaysList

  } = action.payload;

  state.departments = departments;
  state.subDepartments = subDepartments;
  state.serviceGroups = serviceGroups;
  state.applicableHospitals = applicableHospitals;
  state.operationCategories = operationCategories;
  state.serviceTypes = serviceTypes;
  state.additionalServiceGroups = additionalServiceGroups;
  state.restrictionTypes = restrictionTypes;
  state.repeatableTypes = repeatableTypes;
  state.timeDaysList = timeDaysList;

  state.loading = false;
})
.addCase(fetchAllServiceFilters.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});
  },
});

//service master post
const initialPostServiceMasterState: ServiceMasterState = {
  loading: false,
  error: null,
  response: null,
};

export const postServiceMasterSlice = createSlice({
  name: 'postServiceMaster',
  initialState:initialPostServiceMasterState,
    reducers: {
    resetPostServiceMasterState: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postServiceMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postServiceMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(postServiceMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPostServiceMasterState } = postServiceMasterSlice.actions;

//composite services
const initialCompositeServiceState: CompositeServiceState = {
  loading: false,
  error: null,
  compositeService:[],
  hospitals: [],
};

export const compositeServiceListSlice = createSlice({
  name: 'compositeServiceList',
  initialState: initialCompositeServiceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(compositeServiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(compositeServiceList.fulfilled, (state, action) => {
        const { compositeService, hospitals } = action.payload;
        state.compositeService = compositeService;
        state.hospitals = hospitals;
        state.loading = false;
      })
      .addCase(compositeServiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// applicable hospital dropdown list items
const initialApplicableHospitalListState: ApplicableHospitalListItemState = {
  billingClassList: [],
  gstList: null,
  visitTypeList: null,
  loading: false,
  error: null,
};

export const applicableHospitalListItemSlice = createSlice({
  name: 'applicableHospitalListItem',
  initialState:initialApplicableHospitalListState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApplicableHospitalsModalList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicableHospitalsModalList.fulfilled, (state, action) => {
        state.loading = false;
        state.billingClassList = action.payload.billingClassList;
        state.gstList = action.payload.gstList;
        state.visitTypeList = action.payload.visitTypeList;
      })
      .addCase(getApplicableHospitalsModalList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
//get service maste by id


const smGetByIdInitialState: smGetByIdInitialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const getServiceMasterByIdSlice = createSlice({
  name: 'serviceMasterById',
  initialState:smGetByIdInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServiceMasterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceMasterById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getServiceMasterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch service master by ID';
      });
  },
});

//update service master


const updateServiceMasterinitialState: UpdateServiceMasterState = {
  loading: false,
  error: null,
  success: false,
};

export const updateServiceMasterSlice = createSlice({
  name: 'updateServiceMaster',
  initialState:updateServiceMasterinitialState,
  reducers: {
    resetUpdateServiceMasterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateServiceMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateServiceMaster.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateServiceMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update ServiceMaster';
        state.success = false;
      });
  },
});
export const { resetUpdateServiceMasterState } = updateServiceMasterSlice.actions;
