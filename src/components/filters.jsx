import React from "react";
import { Card, Radio, Space, Select, Button } from "antd";
import {
  OrderedListOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TableOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import DataCardMap from "./CardMapping";
import DataCard from "./Card";


const Filters = () => {
   
  return (
    <div className="container" style={{ margin: "5%", display: "flex" }}>
      <Card title="Filters" style={{ width: "30%" }}>
        <Card
          type="inner"
          bordered={false}
          title="Neighborhood"
          extra={<a href="#">More</a>}
        >
          <Radio.Group >
            <Space direction="vertical">
              <Radio>Boca Grande & Outer Island</Radio>
              <Radio>Bonita Spring & Estero</Radio>
              <Radio>Cape Coral</Radio>
              <Radio>Fort Myers Beach</Radio>
              <Radio>Fort Myres</Radio>
              <Radio>North Fort Myres</Radio>
            </Space>
          </Radio.Group>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          bordered={false}
          type="inner"
          title="Categories"
          extra={<a href="#">More</a>}
        >
          <Radio.Group >
            <Space direction="vertical">
              <Radio>Bed & Breakfast</Radio>
              <Radio>Condo</Radio>
              <Radio>Cottage</Radio>
              <Radio>Hotel</Radio>
              <Radio>Resort</Radio>
            </Space>
          </Radio.Group>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          bordered={false}
          type="inner"
          title="Amenities"
          extra={<a href="#">More</a>}
        >
          <Radio.Group >
            <Space direction="vertical">
              <Radio>Beach Access</Radio>
              <Radio>Island</Radio>
              <Radio>Florida Green Lodging</Radio>
              <Radio>Laundry</Radio>
              <Radio>Washer/Dryer On-Site</Radio>
              <Radio>Radio</Radio>
            </Space>
          </Radio.Group>
        </Card>
      </Card>
      <div
        className="container"
        style={{
          border: "0.5px solid lightGrey",
          marginLeft: "3%",
          padding: "13px",
          width: "80%",
        }}
      >
        <div>
          <Select placeholder="Sort By" style={{ width: "50%" }} />
          <Button type="primary" style={{ marginLeft: "10px" }}>
            <span>
              <SortAscendingOutlined />
            </span>
          </Button>
          <Button type="primary" style={{ marginLeft: "10px" }}>
            <span>
              <SortDescendingOutlined />
            </span>
          </Button>
          <Button type="primary" style={{ marginLeft: "18%" }}>
            <span>
              <TableOutlined />
            </span>
          </Button>
          <Button type="primary" style={{ marginLeft: "10px" }}>
            <span>
              <OrderedListOutlined />
            </span>
          </Button>
          <Button type="primary" style={{ marginLeft: "10px" }}>
            <span>
              <EnvironmentOutlined />
            </span>
          </Button>
        </div>
        <DataCard/>
        <DataCardMap/>
      </div>
    </div>
  );
};

export default Filters;
