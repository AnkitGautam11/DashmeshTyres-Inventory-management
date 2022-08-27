import React, { useEffect, useContext, useState } from "react";
import dataContext from "../context/data/DataContext";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Sellprofit() {
  const router = useRouter();
  const dataCtx = useContext(dataContext);
  const [from_date, setFromDate] = useState(new Date());
  const [to_date, setToDate] = useState(new Date());
  const [profit, setProfit] = useState(0);
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
  const submit = async (req, res) => {
    try {
      const res = await axios.post("/api/sellprofit", {
        from_date: from_date.getTime(),
        to_date: to_date.getTime(),
      });
      if (res.data.data) {
        setProfit(res.data.data);
      }
    } catch (err) {}
  };
  return (
    <div className={styles.p_order_main}>
      <div className={styles.cover}>
      <h3> From Date: </h3>
      <DatePicker
        selected={from_date}
        onChange={(date) => setFromDate(date)}
        style={{ margin: "auto", width: "fit-content" }}
        dateFormat="dd/MM/yyyy"
      />
      <br />
      <h3> To Date: </h3>
      <DatePicker
        selected={to_date}
        onChange={(date) => setToDate(date)}
        style={{ margin: "auto", width: "fit-content" }}
        dateFormat="dd/MM/yyyy"
      />
      <br />
      <button onClick={submit}> Submit </button>
      <h2> Sell Profit: {profit} </h2>
      <button
        onClick={(e) => {
          e.preventDefault();
          router.push("/profitreport");
        }}
      >
        {" "}
        Home{" "}
      </button>
      </div>
    </div>
  );
}

export default Sellprofit;
