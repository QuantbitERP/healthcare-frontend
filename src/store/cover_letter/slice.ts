import { combineReducers, createSlice } from "@reduxjs/toolkit";
import { fetchCoverLetterList, CoverLetterCompanies, fetchCoverLetterById, CoverLetterFields, CoverLetterCreatedBy, CoverLetterModifiedBy } from "./thunk";
import { CoverLetterListDtoResponse } from "@/services/api-client/models/CoverLetterListDto";
import { CoverLetterGetByIdDtoResultModel } from "@/services/api-client/models/CoverLetterGetByIdDtoResultModel";

export type initialState={
    list:CoverLetterListDtoResponse,
    loading:boolean,
    error:string,
    validationErrors:{field:string,message:string}[],
    errorCode:string
}
export type KVPair = {
    key?: string|null;
    value?: string|null;
};

export type FilterState={
    companies:KVPair[],
    createdBy:KVPair[],
    modifiedBy:KVPair[],
    fields:KVPair[],
    loading:boolean
}
export type CoverLetterGetByIdResultModel={
    model:CoverLetterGetByIdDtoResultModel
    loading:boolean;
}

export const initialCoverLetterById:CoverLetterGetByIdResultModel={
    model:{
        data:{
            coverletterId:"",

        }
    },
    loading:false
}
export const initialFilterState:FilterState={
    companies:[],
    createdBy:[],
    modifiedBy:[],
    fields:[],
    loading:false
}
const initialState:initialState= {

   list:{ 
    data:{
    items:[],
    metadata:{
        page:{
            currentPage:0,
            pageSize:0,
            totalPages:0
        }
    },
   },
   isError:true,
   errorMessage:"",
   validationErrors:[{field:"",message:""}],
   errorCode:""


},
loading:false,
error:"",
validationErrors:[{field:"",message:""}],
errorCode:""

}

const coverLetterSliceList = createSlice({
    name:"coverLetter",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchCoverLetterList.fulfilled,(state,action)=>{
            state.list.data = action.payload.data;
            state.list.isError = action.payload.isError;
            state.list.errorMessage = action.payload.errorMessage;
            state.validationErrors = action.payload.validationErrors;
            state.errorCode = action.payload.errorCode;
            state.loading = false;
        })
        .addCase(fetchCoverLetterList.rejected,(state,action)=>{
            state.list.isError = true;
            state.list.errorMessage = action.payload as string;
            state.loading = false;
        })
        .addCase(fetchCoverLetterList.pending,(state)=>{
            state.list.isError = false;
            state.list.errorMessage = "";
            state.list.validationErrors = [{field:"",message:""}];
            state.list.errorCode = "";
            state.loading = true;
        })
    }
})

const coverLetterSliceFilter = createSlice({
    name:"coverLetterFilter",
    initialState:initialFilterState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(CoverLetterCompanies.fulfilled,(state,action)=>{
            state.companies = action.payload.data?.items || [];
            state.loading = false;
        })
        .addCase(CoverLetterCompanies.rejected,(state)=>{
            state.companies = [];
            state.loading = false;
        })
        .addCase(CoverLetterCompanies.pending,(state)=>{
            state.loading = true;
        })
        .addCase(CoverLetterFields.fulfilled,(state,action)=>{
            state.fields = action.payload.data?.items || [];
            state.loading = false;
        })
        .addCase(CoverLetterFields.rejected,(state)=>{
            state.fields = [];
            state.loading = false;
        })
        .addCase(CoverLetterFields.pending,(state)=>{
            state.loading = true;
        })
        .addCase(CoverLetterCreatedBy.fulfilled,(state,action)=>{
            state.createdBy = action.payload.data?.items || [];
            state.loading = false;
        })
        .addCase(CoverLetterCreatedBy.rejected,(state)=>{
            state.createdBy = [];
            state.loading = false;
        })
        .addCase(CoverLetterCreatedBy.pending,(state)=>{
            state.loading = true;
        })
        .addCase(CoverLetterModifiedBy.fulfilled,(state,action)=>{
            state.modifiedBy = action.payload.data?.items || [];
            state.loading = false;
        })
        .addCase(CoverLetterModifiedBy.rejected,(state)=>{
            state.modifiedBy = [];
            state.loading = false;
        })
        .addCase(CoverLetterModifiedBy.pending,(state)=>{
            state.loading = true;
        })
    }   
})

export const coverLetterSliceById = createSlice({
    name:"coverLetterById",
    initialState:initialCoverLetterById,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchCoverLetterById.fulfilled,(state,action)=>{
            state.model.data = action.payload.data;
            state.model.isError = action.payload.isError || false;
            state.model.errorMessage = action.payload.errorMessage || "";
            state.model.validationErrors = action.payload.validationErrors || [];
            state.model.errorCode = action.payload.errorCode || "";
            state.loading=false;
        })
        .addCase(fetchCoverLetterById.rejected,(state,action)=>{  
            state.model.isError = true;
            state.model.errorMessage = action.payload as string;
            state.loading=false;
        })
        .addCase(fetchCoverLetterById.pending,(state)=>{
            state.model.isError = false;
            state.model.errorMessage = "";
            state.model.validationErrors = [{field:"",message:""}];
            state.model.errorCode = "";
            state.loading=true;
        })
    }
})

export const coverLetterSliceFilterReducer = coverLetterSliceFilter.reducer;
export const coverLetterSliceListReducer = coverLetterSliceList.reducer;
export const coverLetterByIdReducer=coverLetterSliceById.reducer;

export const coverLetterSlice = combineReducers({
    list:coverLetterSliceListReducer,
    filter:coverLetterSliceFilterReducer,
    coverLetterById:coverLetterByIdReducer

})



