import React, { useEffect, useState, useMemo } from "react";
import "./App.css";

function App() {
  const [shows, setShows] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://api.tvmaze.com/shows?page=0")
      .then((res) => res.json())
      .then((data) => {
        setShows(data.slice(0, 25));
      })
      .catch((err) => console.error("Greška u fetchu:", err));
  }, []);

  const sortedShows = useMemo(() => {
    const arr = [...shows];
    switch (sortOption) {
      case "rating":
        return arr.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
      case "date":
        return arr.sort((a, b) => new Date(b.premiered) - new Date(a.premiered));
      case "alpha":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return arr;
    }
  }, [shows, sortOption]);

  const filteredShows = useMemo(() => {
    return sortedShows.filter((show) =>
      show.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedShows, searchTerm]);

  // funkcija za refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="header" onClick={handleRefresh}>
        <img src="/Poopcorn.png" alt="Kokice" className="logo" />
        <h1 className="heading">Vrijeme za kokice</h1>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Pretraži serije..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <label>
          Sortiraj po:
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select"
          >
            <option value="">bez sortiranja</option>
            <option value="rating">ocjeni (najviše → najmanje)</option>
            <option value="date">datumu premijere (najnovije → najstarije)</option>
            <option value="alpha">abecedi (A → Ž)</option>
          </select>
        </label>
      </div>

      <div className="grid">
        {filteredShows.map((show) => (
          <div key={show.id} className="card">
            {show.image?.medium && (
              <img
                src={show.image.medium}
                alt={show.name}
                className="card-image"
              />
            )}
            <div className="card-info">
              <h2 className="card-title">{show.name}</h2>
              <p className="card-rating">⭐ {show.rating?.average ?? "N/A"}</p>
              <p className="card-premiere">Premijera: {show.premiered}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
