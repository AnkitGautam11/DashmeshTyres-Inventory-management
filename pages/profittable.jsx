import React, { useEffect, useContext, Fragment, useState } from "react";
import dataContext from "../context/data/DataContext";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";

function Profittable() {
  const router = useRouter();
  const dataCtx = useContext(dataContext);
  const [loading, setLoading] = useState(false);
  const getLoggedUser = async () => {
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
  const getData = async () => {
    try {
      console.log("Fetching");
      setLoading(true);
      const res = await axios.get("/api/tyreData");
      if (res.data.data) {
        setData(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      setData([]);
      setLoading(false);
    }
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    getLoggedUser();
    //eslint-disable-next-line
  }, [dataCtx.user]);
  useEffect(() => {
    getData();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <button
        onClick={(e) => {
          console.log("clicked");
          e.preventDefault();
          router.push("/profitreport");
        }}
        style={{ margin: "auto", width: "50%", fontSize: "20px", fontWeight: "bold", backgroundColor: "#2578c5", color: "white", borderRadius: "5px"}}
      >
        {" "}
        Home{" "}
      </button>
      <br />
      <CSVLink
        style={{
          border: "1px solid black",
          padding: "0.5rem",
          margin: "1rem",
          borderRadius: "5px",
          fontSize: "20px",
          fontWeight: "bold",
          backgroundColor: "#1bb043",
          color: "white"
        }}
        data={data.map((item, idx) => {
          const p_date = new Date(item.purchase_date);
          const s_date = new Date(item.sell_date);
          if (item.sell_date !== 0) {
            return {
              ...item,
              purchase_date: p_date.toLocaleDateString(),
              sell_date: s_date.toLocaleDateString(),
              _id: idx + 1,
            };
          }
          return {
            ...item,
            purchase_date: p_date.toLocaleDateString(),
            sell_date: "-",
            _id: idx + 1,
          };
        })}
      >
        Download me
      </CSVLink>
      {loading ? (
        <p>Fetching</p>
      ) : (
        <table className={styles.table}>
          <tbody>
            <tr>
              <th> # </th>
              <th> ID </th>
              <th> Location </th>
              <th> Purchase Date </th>
              <th> Buy Price </th>
              <th> Cost Price </th>
              <th> Buy Profit </th>
              <th> Sell Price </th>
              <th> Sell Profit </th>
              <th> Sell Date </th>
              <th> Status </th>
            </tr>
            {data.map((item, idx) => {
              const p_date = new Date(item.purchase_date);
              const s_date = new Date(item.sell_date);
              return (
                <tr key={idx}>
                  <td> {idx + 1} </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.t_id}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.location}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {p_date.toLocaleDateString("en-GB")}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.buy_price}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.cost_price}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.buy_profit}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.sell_price}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.sell_profit}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.sell_date === 0
                      ? "-"
                      : s_date.toLocaleDateString("en-GB")}{" "}
                  </td>
                  <td
                    style={{ textAlign: "center", horizontalAlign: "center" }}
                  >
                    {" "}
                    {item.status}{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Profittable;
