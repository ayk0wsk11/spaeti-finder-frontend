import React, { useState } from "react";
import { Slider, InputNumber, Button, Select } from "antd";
import "./FilterComponent.css";

const FilterComponent = ({ applyFilter }) => {
  const [sterniMax, setSterniMax] = useState(2);
  const [wc, setWc] = useState("any");
  const [seats, setSeats] = useState("any");
  const [starsMin, setStarsMin] = useState(0);
  const [sortOrder, setSortOrder] = useState("none");
  const [ratingSortOrder, setRatingSortOrder] = useState("none");

  const handleFilter = () => applyFilter({ sterniMax, wc, seats, starsMin, sortOrder, ratingSortOrder });
  const handleReset = () => {
    setSterniMax(2);
    setWc("any");
    setSeats("any");
    setStarsMin(0);
    setSortOrder("none");
    setRatingSortOrder("none");
  };

  return (
    <div id="filter-container">
      <label>Sort by Sterni-Index</label>
      <Select value={sortOrder} onChange={setSortOrder}>
        <Select.Option value="none">None</Select.Option>
        <Select.Option value="asc">Asc</Select.Option>
        <Select.Option value="desc">Desc</Select.Option>
      </Select>

      <label>Sort by Rating</label>
      <Select value={ratingSortOrder} onChange={setRatingSortOrder}>
        <Select.Option value="none">None</Select.Option>
        <Select.Option value="asc">Asc</Select.Option>
        <Select.Option value="desc">Desc</Select.Option>
      </Select>

      <label>Sterni-Index Max</label>
      <Slider min={0} max={5} step={0.1} value={sterniMax} onChange={setSterniMax} />
      <InputNumber min={0} max={5} step={0.1} value={sterniMax} onChange={setSterniMax} />

      <label>Min Rating</label>
      <Slider min={0} max={5} step={0.1} value={starsMin} onChange={setStarsMin} />
      <InputNumber min={0} max={5} step={0.1} value={starsMin} onChange={setStarsMin} />

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

      <div id="flt-btn-container">
        <button id="apply-btn" onClick={handleFilter}>Apply</button>
        <button id="reset-btn" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default FilterComponent;
