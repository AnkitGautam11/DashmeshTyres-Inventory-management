import React, { useEffect, useContext, Fragment } from "react";
import dataContext from "../context/data/DataContext";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";

export default function Home() {
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
  }, []);
  return (
    <Fragment>
      {dataCtx.user && (
        <div className={styles.container}>
          <div className={styles.cover}>
          {dataCtx.user.user_type === "USER" && (
            <Fragment>
              {" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/purchaseorder");
                }}
              >
                {" "}
                Purchase Order{" "}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/sellorder");
                }}
              >
                {" "}
                Sell Order{" "}
              </button>
            </Fragment>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push("/updateorder");
            }}
          >
            {" "}
            Update Order{" "}
          </button>
          {dataCtx.user.user_type === "ADMIN" && (
            <Fragment>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/stockcount");
                }}
              >
                {" "}
                Stock Count Stock Value{" "}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/profitreport");
                }}
              >
                {" "}
                Profit Report{" "}
              </button>
              <button
                onClick={(e) => {
                  router.push("/profittable");
                }}
              >
                Database
              </button>
            </Fragment>
          )}
          <button
            onClick={(e) => {
              dataCtx.logout(() => {
                router.replace("/login");
              });
            }}
          >
            {" "}
            Logout{" "}
          </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
