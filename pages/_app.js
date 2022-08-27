import "../styles/globals.css";
import DataState from "../context/data/DataState";

function MyApp({ Component, pageProps }) {
  return (
    <DataState>
      {" "}
      <Component {...pageProps} />
    </DataState>
  );
}

export default MyApp;
