import React, { useEffect, useContext, useState } from "react";
import dataContext from "../context/data/DataContext";
import styles from "../styles/login.module.css";
import { useRouter } from "next/router";

function Login() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const router = useRouter();
  const dataCtx = useContext(dataContext);
  useEffect(() => {
    if (dataCtx.user) {
      router.replace("/");
    }
    //eslint-disable-next-line
  }, [dataCtx.user]);

  const login = () => {
    dataCtx.login(creds, () => {});
  };
  return (
    <div className={styles.main_page}>
      <div className={styles.cover}>
        <h2>Login</h2>
        <input
          placeholder="Username"
          value={creds.username}
          onChange={(e) => {
            setCreds({ ...creds, username: e.target.value });
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={creds.password}
          onChange={(e) => {
            setCreds({ ...creds, password: e.target.value });
          }}
        />
        <button onClick={login} disabled={dataCtx.loading}>
          {dataCtx.loading ? "Logging..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
