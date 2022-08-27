import React, { useEffect, useState, useContext, Fragment } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import dataContext from "../context/data/DataContext";

function Stockcount() {
  const router = useRouter();
  const dataCtx = useContext(dataContext);
  const [data, setData] = useState({ count: 0, value: 0 });
  const [loading, setLoading] = useState(false);
  const loadData = async (req, res) => {
    try {
      setLoading(true);
      const res = await axios.get("/api/fetchStock");
      if (res.data.data) {
        setData(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getLoggedUser = async (req, res) => {
    try {
      const res = await axios.get("/api/getLoggedUser");
      if (res.data.data) {
        dataCtx.getLoggedUser(res.data.data);
      } else {
        return router.replace("/login");
      }
    } catch (err) {
      return router.replace("/login");
    }
  };
  useEffect(() => {
    getLoggedUser();
    //eslint-disable-next-line
  }, [dataCtx.user]);

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div className={styles.p_order_main}>
      <div className={styles.cover}>
        {loading ? (
          "Fetching Data"
        ) : (
          <Fragment>
            <h1> Stock Count: {data.count} </h1>
            <h1> Stock Value: {data.value} </h1>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default Stockcount;
