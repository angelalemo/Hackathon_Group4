import { createAction } from '@reduxjs/toolkit';

export const fetchproduct = createAction('FETCH_PRODUCT');
export const addproduct = createAction('ADD_PRODUCT');
export const updateproduct = createAction('UPDATE_PRODUCT');
export const deleteproduct = createAction('DELETE_PRODUCT');
