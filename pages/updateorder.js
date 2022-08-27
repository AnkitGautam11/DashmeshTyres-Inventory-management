import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import dataContext from "../context/data/DataContext";
import { useRouter } from "next/router";

function Updateorder() {
  const router = useRouter();
  const dataCtx = useContext(dataContext);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tyre_data, setTyreData] = useState({
    id: "",
    cost_price: 0,
    buy_price: 0,
    sell_price: 0,
    sell_date: 0,
    purchase_date: 0,
    status: "",
  });
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
  const submit = async () => {
    try {
      if (
        tyre_data.cost_price < 1 ||
        tyre_data.buy_price < 1 ||
        (tyre_data.status === "SOLD" && tyre_data.sell_price < 1)
      ) {
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post("/api/update", { tyre_data }, config);
      if (res.data.data) {
        return router.replace("/");
      }
    } catch (err) {
      setErr(err.toString());
    }
  };
  return (
    <div className={styles.p_order_main}>
      <div className={styles.data_box}>
        <label> ID: </label>
        <input
          onChange={(e) => {
            setTyreData({ ...tyre_data, id: e.target.value });
          }}
          value={tyre_data.id}
        />
        <button
          onClick={async (e) => {
            try {
              setLoading(true);
              const res = await axios.get(
                `/api/findUpdateTyre/${tyre_data.id}`
              );

              if (res.data.data) {
                setTyreData({
                  ...tyre_data,
                  cost_price: res.data.data.cost_price,
                  sell_price: res.data.data.sell_price,
                  buy_price: res.data.data.buy_price,
                  purchase_date: res.data.data.purchase_date,
                  sell_date: res.data.data.sell_date,
                  status: res.data.data.status,
                  t_id: res.data.data.t_id,
                });
                setErr("");
              } else {
                setTyreData({
                  id: "",
                  cost_price: 0,
                  buy_price: 0,
                  sell_price: 0,
                  sell_date: 0,
                  purchase_date: 0,
                  status: "",
                });
              }
              setLoading(false);
            } catch (err) {
              setTyreData({
                id: "",
                cost_price: 0,
                buy_price: 0,
                sell_price: 0,
                sell_date: 0,
                purchase_date: 0,
                status: "",
              });
              console.log(err);
              setErr(err.response.data.msg);
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {" "}
          Find{" "}
        </button>
        {err !== "" && <p style={{ color: "red" }}> {err} </p>}
        <label> Purchase Date </label>
        {tyre_data.purchase_date > 0 && (
          <DatePicker
            selected={new Date(tyre_data.purchase_date)}
            onChange={(date) =>
              setTyreData({ ...tyre_data, purchase_date: date.getTime() })
            }
            dateFormat="dd/MM/yyyy"
            style={{ margin: "auto", width: "fit-content" }}
          />
        )}
        <label> Sell Date </label>
        {tyre_data.sell_date > 0 && (
          <DatePicker
            selected={new Date(tyre_data.sell_date)}
            onChange={(date) =>
              setTyreData({ ...tyre_data, sell_date: date.getTime() })
            }
            dateFormat="dd/MM/yyyy"
            style={{ margin: "auto", width: "fit-content" }}
          />
        )}
        <label> Cost Price </label>
        <input
          type="number"
          value={tyre_data.cost_price}
          min={0}
          onChange={(e) => {
            setTyreData({ ...tyre_data, cost_price: e.target.value });
          }}
        />
        <label> Buy Price </label>
        <input
          type="number"
          value={tyre_data.buy_price}
          min={0}
          onChange={(e) => {
            setTyreData({ ...tyre_data, buy_price: e.target.value });
          }}
        />
        <label> Sell Price </label>
        {tyre_data.status === "SOLD" && (
          <input
            type="number"
            min={0}
            value={tyre_data.sell_price}
            onChange={(e) => {
              setTyreData({ ...tyre_data, sell_price: e.target.value });
            }}
          />
        )}
        <label> Status </label>
        <input value={tyre_data.status} disabled={true} />
        {tyre_data.status === "SOLD" && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setTyreData({
                ...tyre_data,
                status: tyre_data.status === "SOLD" ? "IN STOCK" : "SOLD",
                sell_price: 0,
                sell_date: 0,
              });
            }}
          >
            {" "}
            Change Status{" "}
          </button>
        )}
      </div>
      <button onClick={submit}> Update </button>
    </div>
  );
}

export default Updateorder;
