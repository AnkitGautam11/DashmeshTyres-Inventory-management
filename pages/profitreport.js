import React, { useEffect, useContext, Fragment } from "react";
import dataContext from "../context/data/DataContext";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";

function Profitreport() {
  const router = useRouter();
  const dataCtx = useContext(dataContext);
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
  return (
    <Fragment>
      {dataCtx.user && (
        <div className={styles.container}>
          <div className={styles.cover}>
            <button
              onClick={(e) => {
                router.push("/buyprofit");
              }}
            >
              Buy Profit
            </button>
            <button
              onClick={(e) => {
                router.push("/sellprofit");
              }}
            >
              Sell Profit
            </button>
            <button
              onClick={(e) => {
                router.push("/totalprofit");
              }}
            >
              Total Profit
            </button>
            
            <button
              onClick={(e) => {
                router.push("/");
              }}
            >
              Home
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Profitreport;
