import React, { useContext, useEffect, useState } from "react";
import dataContext from "../context/data/DataContext";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import Datetime from "react-datetime";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Purchaseorder() {
  const router = useRouter();
  const dataCtx = useContext(dataContext);
  const [date, setDate] = useState(new Date());
  const [num_tyres, setNumTyres] = useState(0);
  const [location, setLocation] = useState("");
  const [err, setErr] = useState("");
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
  const locations = [
    { location: "JAIPUR", id: "V" },
    { location: "ALWAR", id: "A" },
    { location: "MEDTA", id: "M" },
    { location: "BHILWARA", id: "L" },
    { location: "INDORE", id: "I" },
    { location: "DELHI", id: "D" },
  ];

  const addPrice = async (e) => {
    try {
      e.preventDefault();
      if (location.trim() === "") {
        setErr("All fields are needed");
        return;
      }
      let temp = locations.find((i) => {
        return i.id === location;
      }).location;
      const res = await axios.get(`/api/getTyreAtLocation/${temp}`);
      const tyre_at_location = res.data.data;
      let result = [];
      for (let i = 0; i < num_tyres; i++) {
        result.push({
          id: location + (tyre_at_location + i + 1),
          buy_price: 0,
          cost_price: 0,
        });
      }
      setTyreData(result);
    } catch (err) {
      console.log(err);
      setTyreData([]);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    dataCtx.purchaseOrder(
      locations.find((i) => {
        return i.id === location;
      }).location,
      tyre_data,
      date,
      () => {
        setLocation("");
        setTyreData([]);
        setNumTyres(0);
        router.replace("/");
      }
    );
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
        <label> Date of Purchase: </label>
        <DatePicker
          // className="datePicker"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => setDate(date)}
          style={{ margin: "auto", width: "70%" }}
        />

        <label> Location: </label>
        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            console.log(e.target.value);
          }}
        >
          <option value=""> None </option>
          {locations.map((d, x) => {
            return (
              <option key={x} value={d.id}>
                {" "}
                {d.location}{" "}
              </option>
            );
          })}
        </select>
        {tyre_data.length === 0 && (
          <button onClick={addPrice}> Add Prices </button>
        )}
        <br />
        <br />
        <br />
        <div className={styles.data_row}>
          {tyre_data.map((item, idx) => {
            return (
              <div key={idx} className={styles.data_box}>
                <p>
                  {" "}
                  {idx + 1} of {num_tyres}{" "}
                </p>
                <input disabled={true} value={item.id} />
                <label> Buy Price </label>
                <input
                  min={0}
                  type="number"
                  onChange={(e) => {
                    setTyreData(
                      tyre_data.map((i) => {
                        if (i.id === item.id) {
                          return { ...i, buy_price: e.target.value };
                        }
                        return i;
                      })
                    );
                  }}
                />
                <label> Cost Price </label>
                <input
                  type="number"
                  min={0}
                  onChange={(e) => {
                    setTyreData(
                      tyre_data.map((i) => {
                        if (i.id === item.id) {
                          return { ...i, cost_price: e.target.value };
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

export default Purchaseorder;
