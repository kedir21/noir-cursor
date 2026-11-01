import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchModal from "./components/SearchModal";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Discover from "./pages/Discover";
import Title from "./pages/Title";
import Watch from "./pages/Watch";
import Settings from "./pages/Settings";

export default function App() {
  const [search, setSearch] = useState(false);

  return (
    <>
      <Navbar onSearch={() => setSearch(true)} />
      <SearchModal open={search} onClose={() => setSearch(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Catalog media="movie" />} />
        <Route path="/tv" element={<Catalog media="tv" />} />
        <Route path="/anime" element={<Catalog media="tv" variant="anime" />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/movie/:id" element={<Title />} />
        <Route path="/tv/:id" element={<Title />} />
        <Route path="/watch/:type/:id" element={<Watch />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
