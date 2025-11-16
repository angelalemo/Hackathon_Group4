import { configureStore } from '@reduxjs/toolkit';
import productReducers from './frontend/reducers';

export default configureStore({
  reducer: {
    product: productReducers
  }
});
