import React, { useState } from "react";
import { Col, InputNumber, Row, Slider, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import "./FilterComponent.css";

const FilterComponent = ({ applyFilter }) => {
  const [sterniMax, setSterniMax] = useState(2);
  const [wc, setWc] = useState("any");
  const [seats, setSeats] = useState("any");
  const [starsMin, setStarsMin] = useState(0);
  const [sortOrder, setSortOrder] = useState("none");
  const [ratingSortOrder, setRatingSortOrder] = useState("none"); // New state for rating sort order
  const [isMenuVisible, setIsMenuVisible] = useState(false); // State to control menu visibility

  const handleFilter = () => {
    applyFilter({ sterniMax, wc, seats, starsMin, sortOrder, ratingSortOrder });
  };
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
      <Button
        id="toggle-menu-btn"
        onClick={() => setIsMenuVisible(!isMenuVisible)}
        icon={<FilterOutlined />}
      >
        {isMenuVisible ? "Hide Filters" : "Show Filters"}
      </Button>

      {isMenuVisible && (
        <div id="filter-menu">
          <div>
            <label>Sort by Sterni-Index:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">None</option>
              <option value="asc">Lowest to Highest</option>
              <option value="desc">Highest to Lowest</option>
            </select>
          </div>

          <div>
            <label>Sort by Rating:</label>
            <select
              value={ratingSortOrder}
              onChange={(e) => setRatingSortOrder(e.target.value)}
            >
              <option value="none">None</option>
              <option value="asc">Lowest to Highest</option>
              <option value="desc">Highest to Lowest</option>
            </select>
          </div>

          <div>
            <label>Sterni-Index Max:</label>
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5}
                  onChange={setSterniMax}
                  value={sterniMax}
                  step={0.1}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={5}
                  style={{
                    margin: "0 10px",
                    width: "60px"
                  }}
                  step={0.1}
                  value={sterniMax}
                  onChange={setSterniMax}
                />
              </Col>
            </Row>
          </div>

          <div>
            <label>Min Rating:</label>
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5}
                  onChange={setStarsMin}
                  value={starsMin}
                  step={0.1}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={5}
                  style={{
                    margin: "0 10px",
                    width: "60px"
                  }}
                  step={0.1}
                  value={starsMin}
                  onChange={setStarsMin}
                />
              </Col>
            </Row>
          </div>

          <div>
            <label>WC:</label>
            <select value={wc} onChange={(e) => setWc(e.target.value)}>
              <option value="any">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label>Seats:</label>
            <select value={seats} onChange={(e) => setSeats(e.target.value)}>
              <option value="any">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div id="flt-btn-container">
            <Button id="apply-btn" onClick={handleFilter} icon={<SearchOutlined />}>
              Apply filter
            </Button>
            <Button id="reset-btn" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
