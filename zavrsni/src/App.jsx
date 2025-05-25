import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import Loading from "./Loading.jsx";
import NotFound from "./NotFound.jsx";

export default function App() {
  // STATE
  const [loading, setLoading] = useState(false);
const [notFound, setNotFound] = useState(false);
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [viewFavorites, setViewFavorites] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [episodes, setEpisodes] = useState([]);
  const [cast, setCast] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  // load initial shows
  useEffect(() => {
    fetch("https://api.tvmaze.com/shows?page=0")
      .then((r) => r.json())
      .then((data) => setShows(data.slice(0, 25)));
  }, []);

  // group favorites
  const favShows = favorites.filter((f) => f.type === "show");
  const favEpisodes = favorites.filter((f) => f.type === "episode");
  const favActors = favorites.filter((f) => f.type === "actor");

  // sort & filter
  const sortedShows = useMemo(() => {
    const arr = [...shows];
    if (sortOption === "rating")
      arr.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    if (sortOption === "date")
      arr.sort((a, b) => new Date(b.premiered) - new Date(a.premiered));
    if (sortOption === "alpha")
      arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [shows, sortOption]);

  const filteredShows = useMemo(
    () =>
      sortedShows.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sortedShows, searchTerm]
  );

  // toggle favorite
  const toggleFavorite = (item) => {
    const exists = favorites.some((f) => f.id === item.id && f.type === item.type);
    const updated = exists
      ? favorites.filter((f) => !(f.id === item.id && f.type === item.type))
      : [...favorites, item];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // load detail
  const loadShowDetails = (id) => {
    fetch(`https://api.tvmaze.com/shows/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSelectedShow(data);
        setActiveTab("info");
        setSelectedEpisode(null);
      });
    fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
      .then((r) => r.json())
      .then(setEpisodes);
    fetch(`https://api.tvmaze.com/shows/${id}/cast`)
      .then((r) => r.json())
      .then(setCast);
  };

  // reset detail
  const handleBack = () => {
    setSelectedShow(null);
    setEpisodes([]);
    setCast([]);
    setSelectedEpisode(null);
  };

  // favorite item
  const FavItem = ({ fav }) => (
    <div className="favorite-card">
      <img
        src={fav.image || "/placeholder.png"}
        alt={fav.name}
        className="favorite-poster"
      />
      <div className="favorite-info">
        <span className="favorite-name">{fav.name}</span>
        <button
          className="favorite-remove"
          onClick={() => toggleFavorite(fav)}
        >
          Ukloni iz favorita
        </button>
      </div>
    </div>
  );

  // DETAIL VIEW
  if (selectedShow) {
    const isFavShow = favShows.some((f) => f.id === selectedShow.id);
    return (
      <div className="detail-container">
        <button className="back-button" onClick={handleBack}>
          ← Nazad
        </button>
        <div className="detail-header">
          <h1 className="detail-title">{selectedShow.name}</h1>
          <button
            className={`fav-button ${isFavShow ? "unfav" : "fav"}`}
            onClick={() =>
              toggleFavorite({
                type: "show",
                id: selectedShow.id,
                name: selectedShow.name,
                image: selectedShow.image?.medium,
              })
            }
          >
            {isFavShow ? "★ Ukloni seriju" : "☆ Dodaj seriju"}
          </button>
        </div>
        <div className="tabs">
          {["info", "episodes", "cast", "favorites"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => {
                setActiveTab(tab);
                setSelectedEpisode(null);
              }}
            >
              {tab === "info"
                ? "Opis"
                : tab === "episodes"
                ? "Epizode"
                : tab === "cast"
                ? "Glumci"
                : "Favoriti"}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === "info" && (
            <div className="detail-info">
              {selectedShow.image?.original && (
                <img
                  src={selectedShow.image.original}
                  alt={selectedShow.name}
                  className="detail-image"
                />
              )}
              <p>
                <strong>Ocjena:</strong> ⭐{" "}
                {selectedShow.rating?.average ?? "N/A"}
              </p>
              <p>
                <strong>Premijera:</strong> {selectedShow.premiered}
              </p>
              <p>
                <strong>Žanrovi:</strong> {selectedShow.genres.join(", ")}
              </p>
              {selectedShow.summary && (
                <div
                  className="detail-summary"
                  dangerouslySetInnerHTML={{ __html: selectedShow.summary }}
                />
              )}
            </div>
          )}

          {activeTab === "episodes" &&
            (selectedEpisode ? (
              <div className="episode-detail">
                <button
                  className="episode-back-button"
                  onClick={() => setSelectedEpisode(null)}
                >
                  ← Nazad na epizode
                </button>
                <h2 className="episode-title">{selectedEpisode.name}</h2>
                <p>
                  <strong>Sezona:</strong> {selectedEpisode.season}
                </p>
                <p>
                  <strong>Epizoda:</strong> {selectedEpisode.number}
                </p>
                <p>
                  <strong>Airdate:</strong> {selectedEpisode.airdate}
                </p>
                <p>
                  <strong>Trajanje:</strong> {selectedEpisode.runtime} min
                </p>
                {selectedEpisode.summary && (
                  <div
                    className="detail-summary"
                    dangerouslySetInnerHTML={{
                      __html: selectedEpisode.summary,
                    }}
                  />
                )}
                <button
                  className="fav-button"
                  onClick={() =>
                    toggleFavorite({
                      type: "episode",
                      id: selectedEpisode.id,
                      name: `S${String(selectedEpisode.season).padStart(
                        2,
                        "0"
                      )}E${String(selectedEpisode.number).padStart(
                        2,
                        "0"
                      )} – ${selectedEpisode.name}`,
                      image: selectedEpisode.image?.medium,
                      showId: selectedShow.id,
                    })
                  }
                >
                  {favEpisodes.some((f) => f.id === selectedEpisode.id)
                    ? "★ Ukloni epizodu"
                    : "☆ Dodaj epizodu"}
                </button>
              </div>
            ) : (
              <ul className="episode-list">
                {episodes.map((ep) => {
                  const season = String(ep.season).padStart(2, "0");
                  const num = String(ep.number).padStart(2, "0");
                  const isFavE = favEpisodes.some((f) => f.id === ep.id);
                  return (
                    <li key={ep.id} className="episode-item">
                      <span onClick={() => setSelectedEpisode(ep)}>
                        S{season}E{num} – {ep.name} ({ep.airdate})
                      </span>
                      <button
                        className="fav-button small"
                        onClick={() =>
                          toggleFavorite({
                            type: "episode",
                            id: ep.id,
                            name: `S${season}E${num} – ${ep.name}`,
                            image: ep.image?.medium,
                            showId: selectedShow.id,
                          })
                        }
                      >
                        {isFavE ? "★" : "☆"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ))}

          {activeTab === "cast" && (
            <div className="cast-grid">
              {cast.map(({ person, character }) => {
                const isFavA = favActors.some((f) => f.id === person.id);
                return (
                  <div key={person.id} className="cast-card">
                    {person.image?.medium ? (
                      <img
                        src={person.image.medium}
                        alt={person.name}
                        className="cast-image"
                      />
                    ) : (
                      <div className="cast-placeholder">Nema slike</div>
                    )}
                    <p className="cast-name">{person.name}</p>
                    <p className="cast-character">kao {character.name}</p>
                    <button
                      className="fav-button small"
                      onClick={() =>
                        toggleFavorite({
                          type: "actor",
                          id: person.id,
                          name: person.name,
                          image: person.image?.medium,
                          showId: selectedShow.id,
                        })
                      }
                    >
                      {isFavA ? "★" : "☆"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="favorites-grid">
              {[...favShows, ...favEpisodes, ...favActors].map((f) => (
                <FavItem key={`${f.type}-${f.id}`} fav={f} />
              ))}
              {favorites.length === 0 && <p>Nemate favorita.</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // HOME VIEW
  return (
    <div className="container">
      <div
        className="header"
        onClick={() => {
          handleBack();
          setViewFavorites(false);
        }}
      >
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
          Sortiraj:
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select"
          >
            <option value="">bez sortiranja</option>
            <option value="rating">ocjenom ↓</option>
            <option value="date">premijerom ↓</option>
            <option value="alpha">abecedom ↑</option>
          </select>
        </label>
        <button
          className="fav-toggle"
          onClick={() => {
            handleBack();
            setViewFavorites(!viewFavorites);
          }}
        >
          {viewFavorites ? "Prikaži sve serije" : "Prikaži favorite"}
        </button>
      </div>

      {viewFavorites ? (
        <div className="favorites-grid">
          {[...favShows, ...favEpisodes, ...favActors].map((f) => (
            <FavItem key={`${f.type}-${f.id}`} fav={f} />
          ))}
          {favorites.length === 0 && <p>Nemate favorita.</p>}
        </div>
      ) : (
        <div className="grid">
          {filteredShows.map((show) => {
            const isFavS = favShows.some((f) => f.id === show.id);
            return (
              <div
                key={show.id}
                className="card"
                onClick={() => loadShowDetails(show.id)}
              >
                {show.image?.medium && (
                  <img
                    src={show.image.medium}
                    alt={show.name}
                    className="card-image"
                  />
                )}
                <div className="card-info">
                  <h2 className="card-title">{show.name}</h2>
                  <p className="card-rating">
                    ⭐ {show.rating?.average ?? "N/A"}
                  </p>
                  <p className="card-premiere">
                    Premijera: {show.premiered}
                  </p>
                  <button
                    className={`card-fav ${isFavS ? "unfav" : "fav"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({
                        type: "show",
                        id: show.id,
                        name: show.name,
                        image: show.image?.medium,
                      });
                    }}
                  >
                    {isFavS ? "★" : "☆"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
