import { createReducer } from '@reduxjs/toolkit';
import {
  fetchproduct,
  addproduct,
  updateproduct,
  deleteproduct,
} from './actions';


export default createReducer([], (builder) => {
  builder
    .addCase(fetchproduct, (state, action) => {
      return action.payload;
    })
    .addCase(addproduct, (state, action) => {
      const maxId = state.length > 0 ? Math.max(...state.map((c) => c.id)) : 0;
      const newId = maxId + 1;
      state.push({ id: newId, ...action.payload });
    })
    .addCase(updateproduct, (state, action) => {
      const concertIndex = state.findIndex(
        (concert) => concert.id === action.payload.id
      );
      state[concertIndex] = action.payload;
    })
    .addCase(deleteproduct, (state, action) => {
      const concertIndex = state.findIndex(
        (concert) => concert.id === action.payload.id
      );
      state.splice(concertIndex, 1);
    });
});
