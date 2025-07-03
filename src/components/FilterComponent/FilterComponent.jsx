// src/components/FilterComponent/FilterComponent.jsx
import React, { useState, useContext } from "react";
import { Slider, InputNumber, Button, Select, Input } from "antd";
import { AuthContext } from "../../context/auth.context";
import "./FilterComponent.css";

const FilterComponent = ({ applyFilter }) => {
  const { currentUser } = useContext(AuthContext);

  const [sterniMax, setSterniMax] = useState(2);
  const [wc, setWc] = useState("any");
  const [seats, setSeats] = useState("any");
  const [starsMin, setStarsMin] = useState(0);
  const [sortOrder, setSortOrder] = useState("none");
  const [ratingSortOrder, setRatingSortOrder] = useState("none");
  const [distanceSortOrder, setDistanceSortOrder] = useState("none");
  const [zipCode, setZipCode] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const handleFilter = () =>
    applyFilter({
      sterniMax,
      wc,
      seats,
      starsMin,
      sortOrder,
      ratingSortOrder,
      distanceSortOrder,
      zipCode,
      showFavorites,
    });

  const handleReset = () => {
    setSterniMax(2);
    setWc("any");
    setSeats("any");
    setStarsMin(0);
    setSortOrder("none");
    setRatingSortOrder("none");
    setDistanceSortOrder("none");
    setZipCode("");
    setShowFavorites(false);
    applyFilter({
      sterniMax: 2,
      wc: "any",
      seats: "any",
      starsMin: 0,
      sortOrder: "none",
      ratingSortOrder: "none",
      distanceSortOrder: "none",
      zipCode: "",
      showFavorites: false,
    });
  };

  return (
    <div id="filter-container">
      {/* Favoriten Toggle */}
      {currentUser && (
        <Button
          type={showFavorites ? "primary" : "default"}
          block
          style={{ marginBottom: 12 }}
          onClick={() => {
            const next = !showFavorites;
            setShowFavorites(next);
            applyFilter({
              sterniMax,
              wc,
              seats,
              starsMin,
              sortOrder,
              ratingSortOrder,
              distanceSortOrder,
              zipCode,
              showFavorites: next,
            });
          }}
        >
          {showFavorites ? "Alle Spätis anzeigen" : "Favoriten anzeigen"}
        </Button>
      )}

      {/* ZIP Filter */}
      <label>PLZ (5-stellig)</label>
      <Input
        value={zipCode}
        maxLength={5}
        placeholder="z.B. 10115"
        onChange={(e) =>
          setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
        }
      />

      {/* Sterni-Index Sort */}
      <label>Sort by Sterni-Index</label>
      <Select
        value={sortOrder}
        onChange={(v) => {
          setSortOrder(v);
          setRatingSortOrder("none");
          setDistanceSortOrder("none");
        }}
      >
        <Select.Option value="none">None</Select.Option>
        <Select.Option value="asc">Asc</Select.Option>
        <Select.Option value="desc">Desc</Select.Option>
      </Select>

      {/* Rating Sort */}
      <label>Sort by Rating</label>
      <Select
        value={ratingSortOrder}
        onChange={(v) => {
          setRatingSortOrder(v);
          setSortOrder("none");
          setDistanceSortOrder("none");
        }}
      >
        <Select.Option value="none">None</Select.Option>
        <Select.Option value="asc">Asc</Select.Option>
        <Select.Option value="desc">Desc</Select.Option>
      </Select>

      {/* Distance Sort */}
      <label>Sort by Distance</label>
      <Select
        value={distanceSortOrder}
        onChange={(v) => {
          setDistanceSortOrder(v);
          setSortOrder("none");
          setRatingSortOrder("none");
        }}
      >
        <Select.Option value="none">None</Select.Option>
        <Select.Option value="asc">Closest first</Select.Option>
        <Select.Option value="desc">Farthest first</Select.Option>
      </Select>

      {/* Sterni-Index Max */}
      <label>Sterni-Index Max</label>
      <Slider
        min={0}
        max={5}
        step={0.1}
        value={sterniMax}
        onChange={setSterniMax}
      />
      <InputNumber
        min={0}
        max={5}
        step={0.1}
        value={sterniMax}
        onChange={setSterniMax}
      />

      {/* Min Rating */}
      <label>Min Rating</label>
      <Slider
        min={0}
        max={5}
        step={0.1}
        value={starsMin}
        onChange={setStarsMin}
      />
      <InputNumber
        min={0}
        max={5}
        step={0.1}
        value={starsMin}
        onChange={setStarsMin}
      />

      {/* WC & Seats */}
      <label>WC</label>
      <Select value={wc} onChange={setWc}>
        <Select.Option value="any">Any</Select.Option>
        <Select.Option value="yes">Yes</Select.Option>
        <Select.Option value="no">No</Select.Option>
      </Select>

      <label>Seats</label>
      <Select value={seats} onChange={setSeats}>
        <Select.Option value="any">Any</Select.Option>
        <Select.Option value="yes">Yes</Select.Option>
        <Select.Option value="no">No</Select.Option>
      </Select>

      {/* Buttons */}
      <div id="flt-btn-container">
        <button id="apply-btn" onClick={handleFilter}>
          Apply
        </button>
        <button id="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
