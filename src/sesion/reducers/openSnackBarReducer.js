const initialState = {
  open: false,
  mensaje: "",
};

const openSnackBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_SANCKBAR":
      return {
        ...state,
        open: action.openMensaje.open,
        mensaje: action.openMensaje.mensaje,
      };
    default:
      return false;
  }
};

export default openSnackBarReducer;
