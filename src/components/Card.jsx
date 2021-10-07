import React from "react";
import { Card, Space } from "antd";
import "antd/dist/antd.css";

const DataCard = () => {
  return(
    <div>
      <Space direction="horizontal">
        <Card
          title="Card title"
          bordered={true}
          style={{ width: 400, margin: "8px 10px 8px 10px" }}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </Space>
    </div>
  )};
  
  export default DataCard;