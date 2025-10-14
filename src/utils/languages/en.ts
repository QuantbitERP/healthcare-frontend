// English language file for the application
export const en = {
  // Common error messages
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    reset: "Reset",
    apply: "Apply",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    saving: "Saving...",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    add: "Add",
    remove: "Remove",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    clear: "Clear",
    refresh: "Refresh",
    saveAndAddNew: "Save & Add New",
    download: "Download",
    upload: "Upload",
    select: "Select",
    all: "All",
    none: "None",
    yes: "Yes",
    no: "No",
    ok: "OK",
    error: "Error!",
    success: "Success!",
    warning: "Warning",
    info: "Information",
    duplicate: "Duplicate",
    somethingWentWrong: "Oops, Something went wrong!!",
    notFound: "Not found",
    loadingText: "Loading...",
    actionCompleted: "Action completed",
    newPatientCompany: "New Patient Company",
    editPatientCompany: "Edit Patient Company",
    patientCompany: "Patient Company",
    suggestServices: "Suggest Services",
    patientName: "Patient Name",
    searchRequisitionNo: "Search Requisition No.",
    searchByPatientName: "Search by Patient Name...",
  },

  // Success messages
  success: {
    // Associate Company
    associateCompanyCreated: "Associate Company Created Successfully.",
    associateCompanyUpdated: "Associate Company Updated Successfully.",
    associateCompanyDeleted: "Associate Company Deleted Successfully.",
    
    // Generic CRUD operations
    recordCreated: "Record created successfully!",
    recordUpdated: "Record updated successfully!",
    recordDeleted: "Record deleted successfully!",
    recordSaved: "Record saved successfully!",
    
    // File operations
    fileUploaded: "File uploaded successfully!",
    fileDownloaded: "File downloaded successfully.",
    exportSuccessful: "Data exported successfully.",
    xlsDownloadSuccessful: "XLS file downloaded successfully.",
    pdfDownloadSuccessful: "PDF file downloaded successfully.",
    
    // Form operations
    formSubmitted: "Form submitted successfully.",
    dataSaved: "Data saved successfully!",
    settingsSaved: "Settings saved successfully",
    
    // Bill operations
    billSaved: "Bill saved successfully",
    billCancelled: "Bill cancelled and duplicated successfully",
    
    // Deposit operations
    depositCreated: "Deposit Created Successfully.",
    depositUpdated: "Deposit Updated Successfully.",
    depositDeleted: "Deposit Deleted Successfully.",
    
    // Deposit Conversion operations
    depositConversionCreated: "New Deposit Conversion created successfully.",
    depositConversionUpdated: "Deposit Conversion updated successfully.",
    depositConversionDeleted: "Deposit Conversion deleted successfully.",
    
    // Invoicing operations
    billCancelledSuccess: "Bill Cancelled",
    billSubmitted: "Bill Submitted Successfully.",
    billingItemsDeleted: "Selected billing items have been deleted successfully.",
    billSubmittedWithNumber: "Bill Submitted Succesfully.",
    assignPatient: "Assign a Patient",
    
    // Service operations
    serviceAdded: "Service added successfully",
    serviceUpdated: "Service updated successfully",
    
    // Report operations
    reportFiltersApplied: "Report filters applied successfully!",
    reportDataLoading: "Loading report data...",
    reportDateRangeRequired: "Date range is required",
    reportFilterDataError: "Error fetching filter data:",
    
    // Service Head Code operations
    serviceHeadCodeUpdated: "Service Head Code Settings updated successfully",
    serviceHeadCodeItemsCopied: "{count} items copied successfully to selected companies",
    
    // Doctor operations
    doctorCreated: "Doctor created successfully",
    doctorUpdated: "Doctor updated successfully",
    doctorSaved: "Doctor saved successfully",
    doctorSaveFailed: "Failed to save doctor. Please try again.",
    doctorUpdateFailed: "Failed to update doctor. Please try again.",
    doctorCannotDeleteNew: "Cannot delete a new doctor record.",
    hospitalAffiliationRequired: "Hospital Affiliation & Roles: At least one row is required!",
    serviceDeleted: "Service deleted successfully",
    
    // Doctor Professional Fees Settings
    professionalFeesBasicSettingsSaved: "Professional Fees Basic Settings",
    professionalFeesBasicSettingsUpdated: "Professional Fees Basic Settings",
    doctorBasicAmountSettingsCreated: "Doctor Basic Amount Settings",
    doctorBasicAmountSettingsUpdated: "Doctor Basic Amount Settings",
    doctorBasicAmountSettingsDeleted: "Doctor Basic Amount Settings",
    payoutAdjustmentMasterCreated: "Payout Adjustment Master",
    payoutAdjustmentMasterUpdated: "Payout Adjustment Master",
    payoutAdjustmentMasterDeleted: "Payout Adjustment Master",
    doctorWiseSettingsCreated: "Doctor Wise Settings",
    doctorWiseSettingsUpdated: "Doctor Wise Settings",
    doctorWiseSettingsDeleted: "Doctor Wise Settings",
    exclusionSettingsCreated: "Exclusion Settings",
    exclusionSettingsUpdated: "Exclusion Settings",
    exclusionSettingsDeleted: "Exclusion Settings",
    
    // Room operations
    roomCategoryCreated: "Room Category Created successfully.",
    roomCategoryUpdated: "Room Category updated successfully.",
    roomCategoryDeleted: "Room Category deleted successfully.",
    
    // Patient operations
    patientCategoryCreated: "Patient Category Type created successfully.",
    patientCategoryUpdated: "Patient Category type updated successfully.",
    patientCategoryDeleted: "Patient Category type deleted successfully.",
    
    // Patient Company operations
    patientCompanyCreated: "Patient Company Created Successfully!",
    patientCompanyUpdated: "Patient Company Updated Successfully!",
    patientCompanyDeleted: "Patient Company Deleted Successfully!",
    
    // Patient Company Multiplayer operations
    patientCompanyDataSaved: "Data saved successfully!",
    patientCompanyDataSaveFailed: "Failed to save data. Please try again.",
    patientCompanyVisitIdRequired: "Visit ID is required",
    
    // IPD Print Package operations
    ipdPrintPackageSuccess: "Package document generated successfully!",
    
    // IPD Print Company Bill operations
    ipdPrintCompanyBillSuccess: "Company bill document generated successfully!",
    
    // IPD Print Gate Pass operations
    ipdPrintGatePassSuccess: "Gate pass document generated successfully!",
    
    // IPD Preview and Print operations
    ipdPreviewAndPrintSuccess: "Patient bill document generated successfully!",
    
    // Tax operations
    taxSaved: "Tax saved successfully",
    taxUpdated: "Tax updated successfully",
    taxDeleted: "Tax deleted successfully",
    taxDeleteFailed: "Failed to delete Tax.",
    taxSaveFailed: "Failed to save tax. Please try again.",
    taxUpdateFailed: "Failed to update tax. Please try again.",
    taxDeleteFailedRetry: "Failed to delete tax. Please try again.",
    taxCannotDeleteNew: "Cannot delete a new tax. Please save it first.",
    taxFieldRequired: "Field cannot be empty.",
    
    // Prior Authorization operations
    priorAuthCreated: "Prior authorization request created successfully",
    priorAuthUpdated: "Prior authorization request updated successfully",
    priorAuthCreateFailed: "Failed to create prior authorization request",
    priorAuthUpdateFailed: "Failed to update prior authorization request",
    priorAuthNoPatientSelected: "No patient selected",
    priorAuthNoCompanyId: "No company ID available for this patient",
    priorAuthError: "Error",
    priorAuthSuccess: "Success",
    
    // Employee Transfer operations
    employeeTransferUpdated: "Employee transfer limit updated successfully!",
    employeeTransferUpdatedSuccess: "Employee transfer updated successfully!",
    employeeTransferDeleted: "Employee Transfer Deleted Successfully.",
    employeeTransferSubmitted: "Employee Transfer Submitted Succesfully.",
    
    // Employee Transfer UI labels
    employeeTransferringLimits: "Employee Transferring Limits",
    employeeDetails: "Employee Details",
    employeeDetailsDescription: "Gather comprehensive details regarding the staff members.",
    employeeName: "Employee Name",
    employeeCode: "Employee Code",
    employeeCategory: "Employee Category",
    employeeDesignation: "Employee Designation",
    dateAndTimeOfTransfer: "Date and Time of Transfer",
    changeEmployeeBalance: "Change Employee Balance",
    transferDataLog: "Transfer Data Log",
    employeeCategoryChangeLog: "Employee Category Change Log",
    
    // Employee Policy operations
    employeePolicyCreated: "Employee policy created successfully",
    employeePolicyUpdated: "Employee policy updated successfully",
    employeePolicyDeleted: "Employee Policy Deleted Successfully.",
    
    // Employee Policy validation messages
    employeePolicyValidTillGreaterThanFrom: "Valid Till Date must be greater than Valid From Date",
    employeePolicyAtLeastOneLimit: "At least one of IPD, OPD, or All must have a value greater than zero",
    employeePolicyGenericError: "An error occurred while processing your request",
    
    // Rate operations
    rateSettingsCreated: "Rate Settings Created Successfully",
    rateSettingsUpdated: "Rate Settings Updated Successfully",
    rateSettingsExported: "Rate settings have been exported to Excel successfully.",
    rateSettingsDiscountHikeApplied: "Discount/Hike applied successfully",
    
    // OT Service Percentage operations
    otServicePercentageExported: "OT Service Percentage has been exported to Excel successfully.",
    
    // Concession operations
    concessionCategoryCreated: "Concession Category Created Successfully.",
    concessionCategoryUpdated: "Concession Category Updated Successfully.",
    concessionCategoryDeleted: "Concession Category Deleted Successfully.",
    
    // Finance Authority operations
    financeAuthorityCreated: "Finance Authority Created Successfully.",
    financeAuthorityUpdated: "Finance Authority Updated Successfully.",
    financeAuthorityDeleted: "Finance Authority Deleted Successfully.",
    
    // Operation Category operations
    operationCategoryCreated: "Operation Category Created Successfully.",
    operationCategoryUpdated: "Operation Category Updated Successfully.",
    operationCategoryDeleted: "Operation Category Deleted Successfully.",
    
    // Deposit Type operations
    depositTypeCreated: "Deposit Type Created Successfully.",
    depositTypeUpdated: "Deposit Type Updated Successfully.",
    depositTypeDeleted: "Deposit Type Deleted Successfully.",
    
    // Emergency Charge Settings operations
    emergencyChargeSettingCreated: "Emergency Charge Setting Created Successfully.",
    emergencyChargeSettingUpdated: "Emergency Charge Setting Updated Successfully.",
    emergencyChargeSettingDeleted: "Emergency Charge Setting Deleted Successfully.",
    // Company-wise Checklist operations
    companyWiseChecklistCreated: "Company-wise Checklist Created Successfully.",
    companyWiseChecklistUpdated: "Company-wise Checklist Updated Successfully.",
    companyWiseChecklistDeleted: "Company-wise Checklist Deleted Successfully.",
    companyWiseChecklistDataSaved: "Data saved successfully!",
    companyWiseChecklistDataDeleted: "Data deleted successfully!",
    
    // Claim Checklist operations
    claimChecklistCreated: "Claim Checklist Created Successfully.",
    claimChecklistUpdated: "Claim Checklist Updated Successfully.",
    claimChecklistDeleted: "Claim Checklist Deleted Successfully.",
    
    // Emergency operations
    emergencySettingDeleted: "Emergency Setting Deleted Successfully.",
    
    // Department operations
    departmentClearanceCreated: "Department Clearance Created Successfully.",
    departmentClearanceUpdated: "Department Clearance Updated Successfully.",
    departmentClearanceDeleted: "Department Clearance Deleted Successfully.",
    
    // Refund operations
    refundSaved: "Refund saved successfully!",
    refundDeleted: "Refund deleted successfully!",
    refundRejected: "Refund of #{refundNo} rejected.",
    
    // Package operations
    recordsAdded: "10 Records Created Successfully.",
    packageCreated: "Package Created Successfully.",
    packageUpdated: "Package Updated Successfully .",
    packageDeleted: "Package Deleted Successfully.",
    packageDeleteFailed: "Failed to delete Package.",
    packageDuplicated: "Package Duplicated Successfully.",
    
    // Rate Name operations
    rateNameCreated: "Rate Name Created Successfully.",
    rateNameUpdated: "Rate Name Updated Successfully.",
    rateNameDeleted: "Rate Name Deleted Successfully.",
    
    // Rate List operations
    rateListCreated: "Rate List Created Successfully.",
    rateListUpdated: "Rate List Updated Successfully.",
    rateListDeleted: "Rate List Deleted Successfully.",
    rateListExported: "Rate List exported successfully.",
    
    // Service operations
    serviceCreated: "Service Created Successfully.",
    serviceMasterCreated: "Service Master Created Successfully.",
    serviceMasterUpdated: "Service Master Updated Successfully.",
    serviceMasterDeleted: "Service Master Deleted Successfully.",
    
    // Service Group operations
    serviceGroupCreated: "Service Group Created.",
    serviceGroupUpdated: "Service Group Updated.",
    serviceGroupDeleted: "Service Group Deleted Successfully.",
    
    // Mode of Payment operations
    modeOfPaymentCreated: "Mode of Payment Created Successfully.",
    modeOfPaymentUpdated: "Mode of Payment Updated Successfully.",
    modeOfPaymentDeleted: "Mode of Payment Deleted Successfully.",
    modeOfPaymentDownloading: "Downloading",
    modeOfPaymentDownload: "Download",
    
    // Cover Letter operations
    coverLetterCreated: "Cover Letter created successfully",
    coverLetterUpdated: "Cover Letter updated successfully",
    coverLetterDeleted: "Cover Letter deleted successfully",
    coverLetterFetchFailed: "Failed to fetch cover letter",
    coverLetterCreateFailed: "Failed to create cover letter",
    coverLetterUpdateFailed: "Failed to update cover letter",
    coverLetterDeleteFailed: "Failed to delete cover letter",
    
    // Cover Letter specific operations
    coverLetterCompaniesFetchFailed: "Failed to fetch companies",
    coverLetterTemplatesFetchFailed: "Failed to fetch templates",
    coverLetterCreatedByFetchFailed: "Failed to fetch created by",
    coverLetterModifiedByFetchFailed: "Failed to fetch modified by",
    
    // Requisition operations
    requisitionCreated: "New service requisition has been created successfully.",
    requisitionUpdated: "Service requisition has been updated successfully.",
    
    // Suggest Services specific
    suggestServicesDeleted: "Suggest Services deleted successfully.",
    suggestServiceRequisitionCreated: "New service requisition has been created successfully.",
    suggestServiceRequisitionUpdated: "Service requisition has been updated successfully.",
    
    // Copy operations
    itemCopied: "Item copied successfully",
    itemsCopied: "Successfully copied {count} items to {companies} companies",
  },

  // Error messages
  error: {
    // Confirmation messages
    deleteConfirmation: "This action will delete the {item}. This action cannot be undone.",
    
    // Generic errors
    genericError: "An error occurred. Please try again.",
    networkError: "Network error. Please check your connection.",
    serverError: "Server error. Please try again later.",
    validationError: "Please fix the validation errors before submitting.",
    permissionError: "You don't have permission to perform this action.",
    
    // CRUD operations
    createFailed: "Failed to create record.",
    updateFailed: "Failed to update record.",
    deleteFailed: "Failed to delete record.",
    fetchFailed: "Failed to fetch data.",
    saveFailed: "Failed to save record.",
    
    // Associate Company specific
    associateCompanyCreateFailed: "Failed to save Associate Company.",
    associateCompanyUpdateFailed: "Failed to update Associate Company.",
    associateCompanyDeleteFailed: "Failed to delete Associate Company.",
    associateCompanyFetchFailed: "Failed to fetch Associate Company.",
    
    // Patient Category Type specific
    patientCategoryTypeCreateFailed: "Failed to save Patient Category Type.",
    patientCategoryTypeUpdateFailed: "Failed to update Patient Category Type.",
    patientCategoryTypeDeleteFailed: "Failed to delete Patient Category Type.",
    patientCategoryTypeFetchFailed: "Failed to fetch Patient Category Type.",
    
    // Deposit Conversion specific
    depositConversionCreateFailed: "Failed to create Deposit Conversion.",
    depositConversionUpdateFailed: "Failed to update Deposit Conversion.",
    depositConversionDeleteFailed: "Failed to delete Deposit Conversion.",
    depositConversionFetchFailed: "Failed to fetch Deposit Conversion.",
    noReceiptIdAvailable: "No receipt ID available. Please select a patient with receipt data.",
    transferToRequired: "Please select Transfer To option",
    depositTypeRequired: "Please select Deposit Type",
    
    // Invoicing specific
    invoicingFetchFailed: "Failed to fetch invoicing data.",
    invoicingDeleteFailed: "Failed to delete billing items.",
    invoicingSubmitFailed: "Failed to submit bill.",
    invoicingCancelFailed: "Failed to cancel bill.",
    patientCategoryTypeRequired: "Patient Type is required.",
    
    // Patient Company specific
    patientCompanyCreateFailed: "Failed to save Patient Company.",
    patientCompanyUpdateFailed: "Failed to update Patient Company.",
    patientCompanyDeleteFailed: "Failed to delete Patient Company.",
    patientCompanyFetchFailed: "Failed to fetch Patient Company.",
    
    // Patient Company Multiplayer specific
    patientCompanyMultiplayerSaveFailed: "Failed to save data. Please try again.",
    patientCompanyMultiplayerVisitIdRequired: "Visit ID is required",
    patientCompanyMultiplayerGenericError: "An error occurred while processing your request",
    
    // IPD Print Package specific
    ipdPrintPackageFailed: "Failed to generate package document. Please try again.",
    
    // IPD Print Company Bill specific
    ipdPrintCompanyBillFailed: "Failed to generate company bill document. Please try again.",
    
    // IPD Print Gate Pass specific
    ipdPrintGatePassFailed: "Failed to generate gate pass document. Please try again.",
    
    // IPD Preview and Print specific
    ipdPreviewAndPrintFailed: "Failed to generate patient bill document. Please try again.",
    
    // Room Category specific
    roomCategoryCreateFailed: "Failed to save Room Category.",
    roomCategoryUpdateFailed: "Failed to update Room Category.",
    roomCategoryDeleteFailed: "Failed to delete Room Category.",
    roomCategoryFetchFailed: "Failed to fetch Room Category.",
    
    // Doctor Professional Fees Settings specific
    professionalFeesBasicSettingsSaveFailed: "Failed to save Professional Fees Basic Settings",
    professionalFeesBasicSettingsUpdateFailed: "Failed to update Professional Fees Basic Settings",
    doctorBasicAmountSettingsSaveFailed: "Failed to save Doctor Basic Amount Settings",
    doctorBasicAmountSettingsUpdateFailed: "Failed to update Doctor Basic Amount Settings",
    doctorBasicAmountSettingsDeleteFailed: "Failed to delete Doctor Basic Amount Settings",
    payoutAdjustmentMasterSaveFailed: "Failed to save Payout Adjustment Master",
    payoutAdjustmentMasterUpdateFailed: "Failed to update Payout Adjustment Master",
    payoutAdjustmentMasterDeleteFailed: "Failed to delete Payout Adjustment Master",
    doctorWiseSettingsSaveFailed: "Failed to save Doctor Wise Settings",
    doctorWiseSettingsUpdateFailed: "Failed to update Doctor Wise Settings",
    doctorWiseSettingsDeleteFailed: "Failed to delete Doctor Wise Settings",
    exclusionSettingsSaveFailed: "Failed to save Exclusion Settings",
    exclusionSettingsUpdateFailed: "Failed to update Exclusion Settings",
    exclusionSettingsDeleteFailed: "Failed to delete Exclusion Settings",
    
    // Rate Name specific
    rateNameCreateFailed: "Failed to save Rate Name.",
    rateNameUpdateFailed: "Failed to update Rate Name.",
    rateNameDeleteFailed: "Failed to delete Rate Name.",
    rateNameFetchFailed: "Failed to fetch Rate Name.",
    
    // Rate List specific
    rateListCreateFailed: "Failed to save Rate List.",
    rateListUpdateFailed: "Failed to update Rate List.",
    rateListDeleteFailed: "Failed to delete Rate List.",
    rateListFetchFailed: "Failed to fetch Rate List.",
    rateListExportFailed: "Failed to export Rate List.",
    
    // Service specific
    serviceCreateFailed: "Failed to save Service.",
    serviceUpdateFailed: "Failed to update Service.",
    serviceDeleteFailed: "Failed to delete Service.",
    serviceFetchFailed: "Failed to fetch Service.",
    serviceMasterCreateFailed: "Failed to save Service Master.",
    serviceMasterUpdateFailed: "Failed to update Service Master.",
    serviceMasterDeleteFailed: "Failed to delete Service Master.",
    serviceMasterFetchFailed: "Failed to fetch Service Master.",
    
    // Suggest Services specific
    suggestServiceRequisitionCreateFailed: "Failed to create requisition. Please try again.",
    suggestServiceRequisitionUpdateFailed: "Failed to update requisition. Please try again.",
    suggestServiceRequisitionDetailsFailed: "Failed to load requisition details.",
    suggestServiceDetailsFailed: "Failed to load service details.",
    suggestServicesDeleteFailed: "Failed to delete suggest services. Please try again.",
    
    // Service Head Code specific
    serviceHeadCodeSaveFailed: "Failed to save changes",
    serviceHeadCodeCopyFailed: "Copy failed: Please try again",
    serviceHeadCodeNoCompanySelected: "Please select at least one company",
    serviceHeadCodeNoItemsSelected: "No items selected to copy",
    serviceHeadCodeMissingFields: "Some items are missing required fields (serviceId, companyId, or hospitalId)",
    
    // Service Group specific
    serviceGroupCreateFailed: "Failed to save Service Group.",
    serviceGroupUpdateFailed: "Failed to update Service Group.",
    serviceGroupDeleteFailed: "Failed to delete Service Group.",
    serviceGroupFetchFailed: "Failed to fetch Service Group.",
    serviceGroupNameRequired: "Service Group Name is required.",
    serviceGroupSequenceRequired: "Sequence No is required.",
    serviceGroupSequenceDuplicate: "Sequence No cannot be duplicate.",
    
    // Concession Category specific
    concessionCategoryCreateFailed: "Failed to save Concession Category.",
    concessionCategoryUpdateFailed: "Failed to update Concession Category.",
    concessionCategoryDeleteFailed: "Failed to delete Concession Category.",
    concessionCategoryFetchFailed: "Failed to fetch Concession Category.",
    concessionCategoryNameRequired: "Concession Category Name is required.",
    concessionCategoryTypeRequired: "Concession Category Type is required.",
    concessionCategoryPercentageRequired: "Default Percentage is required.",
    concessionCategoryPercentageInvalid: "Default Percentage must be a valid number.",
    
    // Finance Authority specific
    financeAuthorityCreateFailed: "Failed to save Finance Authority.",
    financeAuthorityUpdateFailed: "Failed to update Finance Authority.",
    financeAuthorityDeleteFailed: "Failed to delete Finance Authority.",
    financeAuthorityFetchFailed: "Failed to fetch Finance Authority.",
    financeAuthorityNameRequired: "Finance Authority Name is required.",
    
    // Operation Category specific
    operationCategoryCreateFailed: "Failed to save Operation Category.",
    operationCategoryUpdateFailed: "Failed to update Operation Category.",
    operationCategoryDeleteFailed: "Failed to delete Operation Category.",
    operationCategoryFetchFailed: "Failed to fetch Operation Category.",
    operationCategoryNameRequired: "Operation Category Name is required.",
    
    // Deposit Type specific
    depositTypeCreateFailed: "Failed to save Deposit Type.",
    depositTypeUpdateFailed: "Failed to update Deposit Type.",
    depositTypeDeleteFailed: "Failed to delete Deposit Type.",
    depositTypeFetchFailed: "Failed to fetch Deposit Type.",
    depositTypeNameRequired: "Deposit Type Name is required.",
    depositTypeApplicableRequired: "Applicable For is required.",
    
    // Emergency Charge Settings specific
    emergencyChargeSettingCreateFailed: "Failed to save Emergency Charge Setting.",
    emergencyChargeSettingUpdateFailed: "Failed to update Emergency Charge Setting.",
    emergencyChargeSettingDeleteFailed: "Failed to delete Emergency Charge Setting.",
    emergencyChargeSettingFetchFailed: "Failed to fetch Emergency Charge Setting.",
    companyWiseChecklistDataSaveFailed: "Error saving data. Please try again.",
    companyWiseChecklistCompanyRequired: "Company is required.",
    
    // Claim Checklist specific
    claimChecklistCreateFailed: "Failed to create Claim Checklist.",
    claimChecklistUpdateFailed: "Failed to update Claim Checklist.",
    claimChecklistDeleteFailed: "Failed to delete Claim Checklist.",
    claimChecklistFetchFailed: "Failed to fetch Claim Checklist.",
    claimChecklistItemNameRequired: "Item Name is required.",
    
    // Department Clearance specific
    departmentClearanceCreateFailed: "Failed to create Department Clearance.",
    departmentClearanceUpdateFailed: "Failed to update Department Clearance.",
    departmentClearanceDeleteFailed: "Failed to delete Department Clearance.",
    departmentClearanceFetchFailed: "Failed to fetch Department Clearance.",
    departmentClearanceSaveFailed: "Error updating department clearance.",
    
    // Mode of Payment specific
    modeOfPaymentCreateFailed: "Failed to save Mode of Payment.",
    modeOfPaymentUpdateFailed: "Failed to update Mode of Payment.",
    modeOfPaymentDeleteFailed: "Failed to delete Mode of Payment.",
    modeOfPaymentFetchFailed: "Failed to fetch Mode of Payment.",
    modeOfPaymentPaymentTypeRequired: "Payment Type is required.",
    modeOfPaymentSaveError: "An error occurred while saving.",
    
    // Package specific
    packageCreateFailed: "Failed to save Package.",
    packageUpdateFailed: "Failed to update Package.",
    packageDeleteFailed: "Failed to delete Package.",
    packageFetchFailed: "Failed to fetch Package.",
    packageNameRequired: "Package Name is required.",
    packageDurationRequired: "Duration is required.",
    packageDurationInvalid: "Days must be a valid number.",
    packageVisitTypeRequired: "Visit Type is required.",
    packageDepartmentRequired: "Department is required.",
    packageTypeRequired: "Package Type is required.",
    packageGenderRequired: "Gender Applicability is required.",
    packageEffectiveFromRequired: "Effective From is required.",
    
    // Refund specific
    refundCreateFailed: "Failed to create refund.",
    refundUpdateFailed: "Failed to update refund.",
    refundDeleteFailed: "Failed to delete refund.",
    refundFetchFailed: "Failed to fetch refund.",
    refundSaveFailed: "Failed to save refund.",
    refundRejectFailed: "Failed to reject refund.",
    refundApproveFailed: "Failed to approve refund.",
    refundNotFound: "Refund not found.",
    refundSomethingWentWrong: "Oops, Something went wrong!!",
    refundBillNotFound: "Bill not found",
    refundPendingRefund: "₹{amount} is recorded as pending refund.",
    refundBillsCancelled: "{count} Bills Cancelled!",
    refundRecordRefund: "Record a Refund",
    
    // Form validation
    requiredField: "{field} is required",
    nameRequired: "Name is required.",
    hospitalRequired: "Hospital/Clinic must be selected.",
    invalidEmail: "Please enter a valid email address.",
    invalidPhone: "Please enter a valid phone number.",
    invalidPincode: "Please enter a valid 6-digit pincode.",
    invalidMobile: "Please enter a valid 10-digit mobile number.",
    invalidUrl: "Please enter a valid website URL.",
    toDateMustBeAfterFromDate: "To Date must be after From Date.",
    invalidName: "Name should only contain letters and spaces.",
    nameTooShort: "Name must be at least 2 characters long.",
    nameTooLong: "Name must be less than 100 characters.",
    
    // Service validation
    serviceCodeRequired: "Service Code is required.",
    serviceCodeTooShort: "Service Code must be at least 3 characters.",
    serviceCodeInvalid: "Service Code must be at least 3 characters.",
    serviceCodeNumericOnly: "Service Code must contain only numeric characters.",
    serviceNameTooShort: "Service Name must be at least 2 characters.",
    serviceNameTooLong: "Service Name must be less than 100 characters.",
    serviceNameInvalidChars: "Service Name can only contain letters, numbers, spaces, hyphens, and underscores.",
    serviceNameNoLeadingTrailingSpaces: "Service Name cannot start or end with spaces.",
    aliasNameTooLong: "Alias Name must be less than 50 characters.",
    aliasNameInvalidChars: "Alias Name can only contain letters, numbers, spaces, hyphens, and underscores.",
    aliasNameNoLeadingTrailingSpaces: "Alias Name cannot start or end with spaces.",
    daysInvalid: "Days must be a valid number.",
    daysRequired: "Days is required.",
    timeInvalid: "Time must be a valid positive number.",
    
    // File operations
    fileUploadFailed: "Failed to upload file.",
    fileDownloadFailed: "Failed to download file.",
    fileNotFound: "File not found.",
    
    // API errors
    apiError: "API error occurred.",
    timeoutError: "Request timed out. Please try again.",
    unauthorizedError: "Unauthorized access.",
    forbiddenError: "Access forbidden.",
    notFoundError: "Resource not found.",
    
    // Rate Settings errors
    rateSettingsFetchFailed: "Failed to fetch rate settings",
    rateSettingsSaveFailed: "Failed to save rate setting",
    rateSettingsUpdateFailed: "Failed to update rate setting",
    rateSettingsExportFailed: "Failed to export rate settings to Excel",
    
    // OT Service Percentage errors
    otServicePercentageExportFailed: "Failed to export OT Service Percentage to Excel",
    
    // Rate Settings validation errors
    rateSettingsSelectService: "Please select a service to add",
    rateSettingsSelectDoctorAndService: "Please select both doctor and service to add",
    rateSettingsServiceNotFound: "Selected service not found",
    rateSettingsCompositeServiceExists: "This composite service has already been added",
    rateSettingsSelectDiscountHike: "Please select either Discount or Hike",
    rateSettingsValidPercentage: "Please enter a valid percentage greater than 0",
    rateSettingsFillRequiredFields: "Please fill in all required fields (Hospital, Rate Name, Department, and Rate Category)",
    rateSettingsAddAtLeastOneService: "Please add at least one service",
    rateSettingsUploadExcelFile: "Please upload an Excel file (.xlsx or .xls)",
    rateSettingsUploadFileFirst: "Please upload a file first",
    rateSettingsSelectSheet: "Please select a sheet",
    
    // Hospital errors
    hospitalsFetchFailed: "Failed to fetch hospitals",
    hospitalDepartmentsFetchFailed: "Failed to fetch hospital departments",
    hospitalRateNamesFetchFailed: "Failed to fetch hospital rate names",
    hospitalDoctorsFetchFailed: "Failed to fetch hospital doctors",
    hospitalServicesFetchFailed: "Failed to fetch hospital services",
    
    // Other errors
    billingClassesFetchFailed: "Failed to fetch billing classes",
    rateTypesFetchFailed: "Failed to fetch rate types",
    rateSettingEnumFetchFailed: "Failed to fetch rate setting enum",
    statusesFetchFailed: "Failed to fetch statuses",
    modifiedByFetchFailed: "Failed to fetch modified by users",
    createdByFetchFailed: "Failed to fetch created by users",
    
    // Deposit errors
    depositCreateFailed: "Failed to create deposit.",
    depositUpdateFailed: "Failed to update deposit.",
    depositDeleteFailed: "Failed to delete deposit.",
    depositFetchFailed: "Failed to fetch deposit.",
    depositNotFound: "Deposit not found.",
    depositDepositTypeRequired: "Please select a Deposit Type.",
    patientRequired: "Please select a patient.",
    patientIdInvalid: "Invalid Patient ID format. Please select a valid patient.",
    totalAmountRequired: "Please enter a valid total amount.",
    depositBankIdInvalid: "Deposit Bank ID must be in valid GUID format. Please select a valid bank.",
    paymentModeIdInvalid: "Payment Mode ID must be in valid GUID format.",
    guidFormatInvalid: "{name} must be in valid GUID format.",
    depositTypeInvalid: "Invalid Deposit Type selected. Please select a valid Deposit Type.",
    depositTypeDropdownRequired: "Please select a valid Deposit Type from the dropdown.",
    recordIdNotFound: "Cannot update record: No valid ID found",
    enterValidNumber: "Enter a valid number",
    
    // Service errors
    serviceNotFound: "Service not found",
    serviceAddFailed: "Failed to add service",
    
    // Requisition errors
    requisitionNotFound: "Requisition not found",
    requisitionCreateFailed: "Failed to create requisition",
    requisitionUpdateFailed: "Failed to update requisition",
  },

  // Validation messages
  validation: {
    required: "This field is required",
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number",
    pincode: "Please enter a valid 6-digit pincode",
    mobile: "Please enter a valid 10-digit mobile number",
    name: "Name should only contain letters and spaces",
    nameLength: "Name must be between 2 and 100 characters",
    password: "Password must be at least 8 characters long",
    confirmPassword: "Passwords do not match",
    url: "Please enter a valid URL",
    number: "Please enter a valid number",
    positiveNumber: "Please enter a positive number",
    integer: "Please enter a whole number",
    decimal: "Please enter a valid decimal number",
    date: "Please enter a valid date",
    futureDate: "Date must be in the future",
    pastDate: "Date must be in the past",
    minLength: "Must be at least {min} characters",
    maxLength: "Must be no more than {max} characters",
    minValue: "Must be at least {min}",
    maxValue: "Must be no more than {max}",
    
    // Doctor Professional Fees Settings validation
    tdsRequired: "TDS is required",
    tdsMustBeValidNumber: "TDS must be a valid number",
    tdsCannotBeNegative: "TDS cannot be negative",
    noDoctorIdProvided: "No doctor ID provided for deletion",
    headNameRequired: "Head Name is required",
    amountMustBeGreaterThanZero: "Applicable Amount must be greater than 0",
    doctorRequired: "Doctor is required",
    applicableDateRequired: "Applicable Date is required",
    atLeastOneRowRequired: "Please add at least one row by clicking the 'Add' button",
    billTypeRequired: "Bill Type is required",
    patientCategoryRequired: "Patient Category is required",
    definitionTypeRequired: "Definition Type is required",
    definitionNameRequired: "Definition Name is required",
    drPercentageRequired: "Dr. Percentage is required and must be greater than 0",
    fixedAmountRequired: "Fixed Amount is required and must be greater than 0",
    pattern: "Please enter a valid format",
  },

  // Form labels
  form: {
    // Associate Company
    primaryDetails: "Primary Details",
    addressDetails: "Address Details",
    contactDetails: "Contact Details",
    hospital: "Hospital",
    name: "Name",
    shortName: "Short Name",
    deactivate: "Deactivate",
    country: "Country",
    state: "State",
    district: "District",
    city: "City",
    area: "Area",
    address: "Address",
    pincode: "Pincode",
    contactPerson: "Contact Person",
    contactMobileNo: "Contact Person Mobile No.",
    
    // Common form fields
    email: "Email",
    phone: "Phone",
    mobile: "Mobile",
    firstName: "First Name",
    lastName: "Last Name",
    fullName: "Full Name",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    notes: "Notes",
    description: "Description",
    status: "Status",
    type: "Type",
    category: "Category",
    amount: "Amount",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    date: "Date",
    time: "Time",
    startDate: "Start Date",
    endDate: "End Date",
    createdBy: "Created By",
    modifiedBy: "Modified By",
    createdOn: "Created On",
    modifiedOn: "Modified On",
  },

  // Page titles
  pageTitles: {
    associateCompany: "Associate Company - Billing System",
    newAssociateCompany: "New Associate Company - Billing System",
    editAssociateCompany: "Edit Associate Company - Billing System",
    rateList: "Rate List - Billing System",
    serviceGroups: "Service Groups - Billing System",
    services: "Services - Billing System",
    newService: "New Service - Billing System",
    editService: "Edit Service - Billing System",
    billingSystem: "Billing System",
    billingConfiguration: "Billing Configuration",
    invoicing: "Invoicing - Billing System",
    recordRefund: "Record Refund",
    suggestServices: "Suggest Services - Billing System",
    individualService: "Service - Billing System",
  },

  // Button labels
  buttons: {
    addNew: "Add New",
    exportToExcel: "Export to Excel",
    importFromExcel: "Import from Excel",
    saveChanges: "Save Changes",
    cancelChanges: "Cancel Changes",
    deleteRecord: "Delete Record",
    editRecord: "Edit Record",
    viewDetails: "View Details",
    closeModal: "Close Modal",
    confirmDelete: "Confirm Delete",
    resetForm: "Reset Form",
    applyFilters: "Apply Filters",
    clearFilters: "Clear Filters",
    downloadFile: "Download File",
    uploadFile: "Upload File",
    selectAll: "Select All",
    deselectAll: "Deselect All",
  },

  // Table headers
  table: {
    companyName: "Company Name",
    hospitalName: "Hospital Name",
    status: "Status",
    modifiedOn: "Modified On",
    modifiedBy: "Modified By",
    createdOn: "Created On",
    createdBy: "Created By",
    actions: "Actions",
    select: "Select",
    name: "Name",
    type: "Type",
    category: "Category",
    amount: "Amount",
    date: "Date",
    description: "Description",
    // Refund specific headers
    refundNo: "Refund No",
    requestedBy: "Requested By",
    requestedOn: "Requested On",
    patient: "Patient",
    uhid: "UHID",
    approvedRejectedOn: "Approved/Rejected On",
    approvedBy: "Approved/Rejected By",
    refundType: "Refund Type",
  },

  // Filter labels
  filters: {
    hospital: "Hospital",
    status: "Status",
    modifiedBy: "Modified By",
    createdBy: "Created By",
    dateRange: "Date Range",
    search: "Search",
    showColumns: "Show Columns",
    meMode: "Me Mode",
    showHideColumns: "Show/Hide Columns",
    billsAndDeposits: "Bills & Deposits",
  },

  // Action labels
  actionLabels: {
    selected: "Selected",
    approve: "Approve",
    reject: "Reject",
    delete: "Delete",
    more: "More",
  },

  // Bill and Deposit labels
  billDeposit: {
    billDetails: "Bill Details",
    selectBillStatus: "Select Bill Status",
    totalAmount: "Total Amount",
    billDate: "Bill Date",
    billNumber: "Bill Number",
    depositNumber: "Deposit Number",
    patientName: "Patient Name",
    gender: "Gender",
    services: "Services",
  },

  // Modal titles
  modals: {
    // Generic modals
    confirmation: "Confirmation",
    deleteConfirmation: "Delete Confirmation",
    editConfirmation: "Edit Confirmation",
    
    // Associate Company modals
    deleteAssociateCompany: "Delete Associate Company?",
    
    // Room Category modals
    newRoomCategory: "New Room Category",
    editRoomCategory: "Edit Room Category",
    deleteRoomCategory: "Delete Room Category?",
    deleteCoverLetter: "Delete Cover Letter?",
    
    // Package modals
    deletePackage: "Delete Package?",
    duplicatePackage: "Duplicate Package?",
    
    // Rate Name modals
    newRateName: "New Rate Name",
    editRateName: "Edit Rate Name",
    deleteRateName: "Delete Rate Name?",
    
    // Rate List modals
    newRateList: "New Rate List",
    editRateList: "Edit Rate List",
    deleteRateList: "Delete Rate List?",
    
    // Service modals
    newService: "New Service",
    editService: "Edit Service",
    deleteService: "Delete Service?",
    newServiceMaster: "New Service Master",
    editServiceMaster: "Edit Service Master",
    deleteServiceMaster: "Delete Service Master?",
    
    // Generic CRUD modals
    deleteRecord: "Delete Record?",
    editRecord: "Edit Record",
    createRecord: "Create Record",
  },

  // Alert messages
  alerts: {
    // Generic alerts
    deleteConfirmation: "Are you sure you want to delete this item? This action cannot be undone.",
    unsavedChanges: "You have unsaved changes. Are you sure you want to leave?",
    
    // Associate Company alerts
    deleteAssociateCompanyConfirmation: "You're deleting an associate company. This action cannot be undone.",
    
    // Room Category alerts
    deleteRoomCategoryConfirmation: "You're deleting a room category. This action cannot be undone.",
    deleteCoverLetterConfirmation: "You're deleting a cover letter. This action cannot be undone.",
    
    // Package alerts
    deletePackageConfirmation: "You're deleting a package. This action cannot be undone.",
    duplicatePackageConfirmation: "You're creating a duplicate of this package. This will create a new package with the same settings.",
    
    // Rate Name alerts
    deleteRateNameConfirmation: "This action will delete the Rate Name permanently. This action cannot be undone.",
    
    // Rate List alerts
    deleteRateListConfirmation: "This action will delete the Rate List permanently. This action cannot be undone.",
    
    // Service alerts
    deleteServiceConfirmation: "This action will delete the Service permanently. This action cannot be undone.",
    deleteServiceMasterConfirmation: "This action will delete the Service Master permanently. This action cannot be undone.",
    
    // Generic CRUD alerts
    deleteRecordConfirmation: "This action cannot be undone.",
    saveConfirmation: "Your changes have been saved successfully.",
  },
} as const;

export type LanguageKeys = typeof en;
