import sesionReducer from "./sesionReducer";
import openSnackBarReducer from "./openSnackBarReducer";

export const mainReducer = ({ sesion, openSnackBar }, action) => {
  return {
    sesion: sesionReducer(sesion, action),
    openSnackBar: openSnackBarReducer(openSnackBar, action),
  };
};
