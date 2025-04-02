import { ADD_PARAM, DELETE_PARAM } from "../actionTypes";

const initialState = {
  listOfParams: [],
};

//   const initialState = {
//     listOfParams: [
//       {
//         id: Date.now(),
//         name: "",
//         longName: "",
//         paramType: "query",
//       },
//     ],
//   };

export const paramReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PARAM: {
      const existingQueryIndex = state.listOfParams.findIndex(
        (param) => param.paramType === action.payload.paramType
      );

      if (existingQueryIndex !== -1) {
        // Replace existing param
        const updatedParams = [...state.listOfParams];
        updatedParams[existingQueryIndex] = action.payload;
        return {
          ...state,
          listOfParams: updatedParams,
        };
      }

      return {
        ...state,
        listOfParams: [...state.listOfParams, action.payload],
      };
    }
    case DELETE_PARAM:
      return {
        ...state,
        listOfParams: state.listOfParams.filter(
          (param) => param.id !== action.payload
        ),
      };
    default:
      return state;
  }
};
