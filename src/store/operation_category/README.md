# Operation Category Module

This module provides complete CRUD operations for Operation Categories using Redux Toolkit.

## Structure

```
src/store/operation_category/
├── index.ts          # Main exports
├── slice.ts          # Redux slices
├── thunk.ts          # Async thunks
├── types.ts          # TypeScript interfaces
└── README.md         # This file
```

## Available APIs

### 1. Fetch Operation Category List
- **Thunk**: `fetchOperationCategoryList`
- **API**: `POST /api/v1/OperationCategory/list`
- **Purpose**: Get paginated list with filters

### 2. Fetch Operation Category by ID
- **Thunk**: `fetchOperationCategoryById`
- **API**: `GET /api/v1/OperationCategory/{id}`
- **Purpose**: Get single operation category details

### 3. Create Operation Category
- **Thunk**: `createOperationCategory`
- **API**: `POST /api/v1/OperationCategory`
- **Purpose**: Create new operation category

### 4. Update Operation Category
- **Thunk**: `updateOperationCategory`
- **API**: `PUT /api/v1/OperationCategory/{id}`
- **Purpose**: Update existing operation category

### 5. Delete Operation Category
- **Thunk**: `deleteOperationCategory`
- **API**: `DELETE /api/v1/OperationCategory`
- **Purpose**: Delete operation categories by IDs

### 6. Fetch Operation Categories (Dropdown)
- **Thunk**: `fetchOperationCategories`
- **API**: `GET /api/v1/OperationCategory/operationCategories`
- **Purpose**: Get list for dropdowns

## Slices

### 1. `operationCategorySlice`
Main slice for list operations with pagination and filtering.

### 2. `operationCategoryListSlice`
Slice for dropdown list operations.

### 3. `operationCategoryByIdSlice`
Slice for single item operations.

### 4. `operationCategoryCreateSlice`
Slice for create operations with success/error states.

### 5. `operationCategoryUpdateSlice`
Slice for update operations with success/error states.

### 6. `operationCategoryDeleteSlice`
Slice for delete operations with success/error states.

## Usage Example

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOperationCategoryList,
  createOperationCategory,
  updateOperationCategory,
  deleteOperationCategory,
  fetchOperationCategories
} from '@/store/operation_category';

// In your component
const dispatch = useDispatch();

// Fetch list
useEffect(() => {
  dispatch(fetchOperationCategoryList({
    searchTerm: 'search',
    page: {
      currentPage: 1,
      pageSize: 10
    }
  }));
}, [dispatch]);

// Create
const handleCreate = (data) => {
  dispatch(createOperationCategory(data));
};

// Update
const handleUpdate = (id, data) => {
  dispatch(updateOperationCategory({ id, data }));
};

// Delete
const handleDelete = (ids) => {
  dispatch(deleteOperationCategory(ids));
};

// Fetch for dropdown
useEffect(() => {
  dispatch(fetchOperationCategories());
}, [dispatch]);
```

## State Structure

```typescript
// Main operation category state
{
  list: {
    data: {
      items: OperationCategoryPageListDto[]
    }
  },
  selectedItem: OperationCategoryDto | null,
  loading: boolean,
  error: string | null,
  meta: {
    page: {
      currentPage: number,
      totalPages: number,
      pageSize: number,
      sortId: string,
      sortType: string
    }
  }
}
```

## Available Actions

- `resetOperationCategoryState` - Reset main state
- `clearOperationCategoryError` - Clear error
- `resetOperationCategoryListState` - Reset list state
- `resetOperationCategoryByIdState` - Reset by ID state
- `resetOperationCategoryCreateState` - Reset create state
- `resetOperationCategoryUpdateState` - Reset update state
- `resetOperationCategoryDeleteState` - Reset delete state
