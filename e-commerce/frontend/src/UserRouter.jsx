import React from "react";
import { Route, Routes } from "react-router-dom";
import Userpage from "./pages/User/Userpage"; // Sesuaikan dengan struktur proyek Anda

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" component={Userpage} />
      {/* Tambahkan rute pengguna lainnya di sini */}
    </Routes>
  );
};

export default UserRouter;
