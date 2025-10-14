import storage from "redux-persist/lib/storage";

const persistConfig = (key: string) => ({
  key,
  storage,
});

export default persistConfig;
