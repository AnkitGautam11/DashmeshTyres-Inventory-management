import React, { useReducer } from "react";
import { GET_LOGGED_USER, LOADING, LOGIN, LOGOUT } from "../types";
import DataContext from "./DataContext";
import dataReducer from "./DataReducer";
import axios from "axios";

function DataState(props) {
  const initialState = {
    user: null,
    loading: false,
  };
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const setLoading = (value) => {
    dispatch({ type: LOADING, payload: value });
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const login = async (creds, errcallback = null) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/login",
        {
          username: creds.username,
          password: creds.password,
        },
        config
      );
      if (res.data.data) {
        dispatch({ type: LOGIN, payload: res.data.data });
      } else {
        if (errcallback) {
          errcallback(res.data.msg);
        }
      }
    } catch (err) {
      console.log(err);
      if (errcallback) {
        errcallback(err.toString());
      }
      setLoading(false);
    }
  };

  const getLoggedUser = (data) => {
    dispatch({ type: GET_LOGGED_USER, payload: data });
  };

  const logout = async (callback = null) => {
    try {
      dispatch({ type: LOGOUT });
      if (callback) {
        callback();
      }
      await axios.get("/api/logout");
    } catch (err) {}
  };

  const purchaseOrder = async (location, tyre_data, date, callback = null) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/purchaseOrder",
        { location, tyre_data, date: date.getTime() },
        config
      );
      if (res.data.data) {
        if (callback) {
          callback();
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const sellOrder = async (tyre_data, date, callback = null) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/sellOrder",
        { tyre_data, date: date.getTime() },
        config
      );
      if (res.data.data) {
        if (callback) {
          callback();
        }
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <DataContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login,
        getLoggedUser,
        logout,
        purchaseOrder,
        sellOrder,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}

export default DataState;
