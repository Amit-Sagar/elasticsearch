// import React from "react";
// import { Card, Radio, Space } from "antd";

// import "antd/dist/antd.css";
// // import DataCardMap from "./CardMapping";
// import DataCard from "./Card";


// const Filters = () => {
   
//   return (
//     <div className="container" style={{ margin: "5%", display: "flex" }}>
//       <Card title="Filters" style={{ width: "30%" }}>
//         <Card
//           type="inner"
//           bordered={false}
//           title="Neighborhood"
//           extra={<a href="#">More</a>}
//         >
//           <Radio.Group >
//             <Space direction="vertical">
//               <Radio>Boca Grande & Outer Island</Radio>
//               <Radio>Bonita Spring & Estero</Radio>
//               <Radio>Cape Coral</Radio>
//               <Radio>Fort Myers Beach</Radio>
//               <Radio>Fort Myres</Radio>
//               <Radio>North Fort Myres</Radio>
//             </Space>
//           </Radio.Group>
//         </Card>
//         <Card
//           style={{ marginTop: 16 }}
//           bordered={false}
//           type="inner"
//           title="Categories"
//           extra={<a href="#">More</a>}
//         >
//           <Radio.Group >
//             <Space direction="vertical">
//               <Radio>Bed & Breakfast</Radio>
//               <Radio>Condo</Radio>
//               <Radio>Cottage</Radio>
//               <Radio>Hotel</Radio>
//               <Radio>Resort</Radio>
//             </Space>
//           </Radio.Group>
//         </Card>
//         <Card
//           style={{ marginTop: 16 }}
//           bordered={false}
//           type="inner"
//           title="Amenities"
//           extra={<a href="#">More</a>}
//         >
//           <Radio.Group >
//             <Space direction="vertical">
//               <Radio>Beach Access</Radio>
//               <Radio>Island</Radio>
//               <Radio>Florida Green Lodging</Radio>
//               <Radio>Laundry</Radio>
//               <Radio>Washer/Dryer On-Site</Radio>
//               <Radio>Radio</Radio>
//             </Space>
//           </Radio.Group>
//         </Card>
//       </Card>
//       <div
//         className="container"
//         style={{
//           border: "0.5px solid lightGrey",
//           marginLeft: "3%",
//           padding: "13px",
//           width: "80%",
//         }}
//       >
//          <DataCard/>
//       </div>
//     </div>
//   );
// };

// export default Filters;


import React from "react";
import { Card, Radio, Space, Select, Button, Checkbox } from "antd";
import {
  OrderedListOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TableOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
// import DataCardMap from "./CardMapping";
import DataCard from "./Card";

function onChange(checkedValues) {
  console.log("checked = ", checkedValues);
}
const neighbourhood = [
  "Boca Grande & Outer Island",
  "Bonita Spring & Estero",
  "Cape Coral",
  "Fort Myers Beach",
  "Fort Myres",
  "North Fort Myres",
];
const categories = ["Bed & Breakfast", "Condo", "Cottage", "Hotel", "Resort"];
const amenities = [
  "BeachAccess",
  "Island",
  "FloridaGreenLodging",
  "Laundry",
  "Washer / DryerOn - Site",
  "Radio",
];
const options = [
  { label: "Boca Grande & Outer Island", value: "Boca Grande & Outer Island" },
  { label: "Bonita Spring & Estero", value: "Bonita Spring & Estero" },
  { label: "Cape Coral", value: "Cape Coral" },
  { label: "Fort Myers Beach", value: "Fort Myers Beach" },
  { label: "Fort Myres", value: "Fort Myres" },
  { label: "North Fort Myres", value: "North Fort Myres" },
  { label: "Bed & Breakfast", value: "Bed & Breakfast" },
  { label: "Condo", value: "Condo" },
  { label: "Cottage", value: "Cottage" },
  { label: "Hotel", value: "CHotelape" },
  { label: "Resort", value: "Resort" },
  { label: "BeachAccess", value: "BeachAccess" },
  { label: "Island", value: "Island" },
  { label: "Laundry", value: "Laundry" },
  { label: "Washer / DryerOn - Site", value: "Washer / DryerOn - Site" },
  { label: "Radio", value: "Radio" },
];

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
              <Checkbox.Group
              direction="vertical"
                options={neighbourhood}
                defaultValue={["Boca Grande & Outer Island"]}
                onChange={onChange}
              />

              {/* <Radio>Boca Grande & Outer Island</Radio>
              <Radio>Bonita Spring & Estero</Radio>
              <Radio>Cape Coral</Radio>
              <Radio>Fort Myers Beach</Radio>
              <Radio>Fort Myres</Radio>
              <Radio>North Fort Myres</Radio> */}
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
          <Radio.Group>
            <Space direction="vertical">
              <Checkbox.Group
              style={{ flex:1, flexDirection: "column", backgroundColor:'cream'}}
                options={categories}
                defaultValue={["Bed & Breakfast"]}
                onChange={onChange}
              />
              {/* <Radio>Bed & Breakfast</Radio>
              <Radio>Condo</Radio>
              <Radio>Cottage</Radio>
              <Radio>Hotel</Radio>
              <Radio>Resort</Radio> */}
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
          <Radio.Group>
            <Space direction="vertical">
              <Checkbox.Group
                options={amenities}
                defaultValue={["BeachAccess"]}
                onChange={onChange}
              />
              {/* <Radio>Beach Access</Radio>
              <Radio>Island</Radio>
              <Radio>Florida Green Lodging</Radio>
              <Radio>Laundry</Radio>
              <Radio>Washer/Dryer On-Site</Radio>
              <Radio>Radio</Radio> */}
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
        <DataCard />
      </div>
    </div>
  );
};

export default Filters;