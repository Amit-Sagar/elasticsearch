import React,{useState} from "react";
import { Card, Space ,Button,Input} from "antd";
import Pagination from "./usePaginationFromURL"
import "antd/dist/antd.css";
import {
  OrderedListOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TableOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
// import axios from "axios";
import { data } from "./data";

const DataCard = () => {
  const [filter, setFilter]= useState('');
  const [showPerPage,setShowPerPage]= useState(10)
  const [pagination, setPagination] = useState({
    start :0,
    end : showPerPage,
  });

  const onPaginationChange =(start,end)=>{
    console.log(start,end);
    setPagination({start : start,end : end});
  };

  
  const searchText=(event)=>{
    setFilter(event.target.value);
  }
  let dataSearch =data.cardData.filter(item=>{
    return Object.keys(item).some(key =>
      item[key].toString().toLowerCase().includes(filter.toString().toLowerCase()))
  });
  const { Meta } = Card;

  return(
    <>
     <div>
          <Input
           placeholder="Sort By" 
           type="text"
           value={filter}
           onChange={searchText.bind(this)}
           style={{ width: "50%" }} />
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


  {dataSearch.slice(pagination.start,pagination.end).map((item,index)=>{
    return(
      <Space>
      <Card
      hoverable
      style={{ width: 380, margin: "5%",paddingLeft: "10px"}}
      cover={
        <img alt="example"
        src=""
        />}
        >
          <Meta title ={item.title} description={item.desc}/>
      </Card>
      </Space>
    )
  })} 
  <Pagination 
  showPerPage={showPerPage}
  onPaginationChange={onPaginationChange}
  total={dataSearch.length}
  />
  </>
  )
}
  export default DataCard;