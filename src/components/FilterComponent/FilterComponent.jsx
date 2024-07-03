import React, { useState } from "react";
import { Col, InputNumber, Row, Slider } from 'antd';

const FilterComponent = ({ applyFilter }) => {
  const [sterniMin, setSterniMin] = useState(0);
  const [sterniMax, setSterniMax] = useState(1);
  const [wc, setWc] = useState("any");
  const [seats, setSeats] = useState("any");
  const [sortOrder, setSortOrder] = useState("none");

  const handleFilter = () => {
    applyFilter({ sterniMin, sterniMax, wc, seats, sortOrder });
  };

  return (
    <div>
      <h3>Filter Spätis</h3>
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
                margin: '0 16px',
              }}
              step={0.1}
              value={sterniMax}
              onChange={setSterniMax}
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
      <button onClick={handleFilter}>Apply Filter</button>
    </div>
  );
};

export default FilterComponent;
