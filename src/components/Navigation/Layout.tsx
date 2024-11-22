import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// This will be implemeted later when figured out route management
const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Renders the current route's component */}
      </main>
    </>
  );
};

export default Layout;
