import { paramReducer } from "./paramReducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({ params: paramReducer });
