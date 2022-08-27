import React, { useContext, useEffect, useState } from "react";
import dataContext from "../context/data/DataContext";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Sellorder() {
  const router = useRouter();
  const dataCtx = useContext(dataContext);
  const [date, setDate] = useState(new Date());
  const [num_tyres, setNumTyres] = useState(0);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tyre_data, setTyreData] = useState([]);
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
  const addPrice = async (e) => {
    try {
      e.preventDefault();

      let result = [];
      for (let i = 0; i < num_tyres; i++) {
        result.push({
          id: "",
          cost_price: 0,
          purchase_date: 0,
          sell_price: 0,
          t_id: i,
        });
      }
      setTyreData(result);
    } catch (err) {
      console.log(err);
    }
  };
  const submit = (e) => {
    for (let i = 0; i < tyre_data.length; i++) {
      if (tyre_data.sell_price < 1) {
        return;
      }
    }
    dataCtx.sellOrder(tyre_data, date, () => {
      setNumTyres(0);
      setTyreData([]);
      router.replace("/");
    });
  };
  return (
    <div className={styles.p_order_main}>
      <div className={styles.cover}>
      <label> Number of Tyres: </label>
      <input
        type="number"
        value={num_tyres}
        min={0}
        onChange={(e) => {
          setNumTyres(e.target.value);
        }}
      />
      <label> Date of Sell: </label>
      <DatePicker
        selected={date}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => setDate(date)}
        style={{ margin: "auto", width: "fit-content" }}
      />
      {tyre_data.length === 0 && (
        <button onClick={addPrice}> Add Prices </button>
      )}
      <br />
      <br />
      <br />
      <div className={styles.data_row}>
        {tyre_data.map((item, idx) => {
          const date_string = new Date(item.purchase_date);
          return (
            <div key={idx} className={styles.data_box}>
              <p>
                {" "}
                {idx + 1} of {num_tyres}{" "}
              </p>
              <label> ID: </label>
              <input
                onChange={(e) => {
                  setTyreData(
                    tyre_data.map((i) => {
                      if (i.t_id === item.t_id) {
                        return { ...i, id: e.target.value };
                      }
                      return i;
                    })
                  );
                }}
                value={item.id}
              />
              <button
                onClick={async (e) => {
                  try {
                    setLoading(true);
                    const res = await axios.get(`/api/findTyre/${item.id}`);

                    if (res.data.data) {
                      setTyreData(
                        tyre_data.map((i) => {
                          if (i.t_id === item.t_id) {
                            return {
                              ...i,
                              cost_price: res.data.data.cost_price,
                              purchase_date: res.data.data.purchase_date,
                            };
                          }
                          return i;
                        })
                      );
                      setErr("");
                    } else {
                      setTyreData(
                        tyre_data.map((i) => {
                          if (i.t_id === item.t_id) {
                            return {
                              id: "",
                              cost_price: 0,
                              purchase_date: 0,
                              sell_price: 0,
                              t_id: item.t_id,
                            };
                          }
                          return i;
                        })
                      );
                    }
                    setLoading(false);
                  } catch (err) {
                    setTyreData(
                      tyre_data.map((i) => {
                        if (i.t_id === item.t_id) {
                          return {
                            id: "",
                            cost_price: 0,
                            purchase_date: 0,
                            sell_price: 0,
                            t_id: item.t_id,
                          };
                        }
                        return i;
                      })
                    );
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
              <input
                value={
                  item.purchase_date === 0
                    ? ""
                    : date_string.toLocaleDateString("en-GB")
                }
                disabled={true}
              />
              <label> Cost Price </label>
              <input type="number" value={item.cost_price} disabled={true} />
              <label> Sell Price </label>
              <input
                type="number"
                min={0}
                value={item.sell_price}
                onChange={(e) => {
                  setTyreData(
                    tyre_data.map((i) => {
                      if (i.id === item.id) {
                        return { ...i, sell_price: e.target.value };
                      }
                      return i;
                    })
                  );
                }}
              />
            </div>
          );
        })}
      </div>
      {tyre_data.length > 0 && (
        <button onClick={submit} disabled={dataCtx.loading}>
          {" "}
          {!dataCtx.loading ? "Submit" : "Submitting"}{" "}
        </button>
      )}
      </div>
    </div>
  );
}

export default Sellorder;
