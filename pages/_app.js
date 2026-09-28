import Navbar from "../components/Navbar";
import "../styles/globals.css";
import ActiveSectionContextProvider from "../context/active-section-context";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <ActiveSectionContextProvider>
        <Navbar />
        <Component {...pageProps} />
      </ActiveSectionContextProvider>
    </>
  );
}

export default MyApp;
