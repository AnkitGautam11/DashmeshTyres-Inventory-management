import { LOGIN, LOGOUT, LOADING, GET_LOGGED_USER } from "../types";

let dataReducer = (state, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    }
    case LOGOUT: {
      return { ...state, user: null, loading: false };
    }
    case LOADING: {
      return { ...state, loading: action.payload };
    }
    case GET_LOGGED_USER: {
      return { ...state, user: action.payload, loading: false };
    }
    default: {
      return state;
    }
  }
};

export default dataReducer;
