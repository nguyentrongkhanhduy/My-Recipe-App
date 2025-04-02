import { ADD_PARAM, DELETE_PARAM } from "./actionTypes";

export const addParam = (param) => ({
  type: ADD_PARAM,
  payload: param,
});

export const deleteParam = (id) => ({
  type: DELETE_PARAM,
  payload: id,
});
