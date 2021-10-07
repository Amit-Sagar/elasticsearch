import React from "react";
import "antd/dist/antd.css";
import usePaginationFromURL from "./usePaginationFromURL";
import DataCard from "./Card";



  const DataCardMap = () => {
    const { data, incrementPage, hasMoreData } =
      usePaginationFromURL(
      "https://search-washingtond8-prod-kz2b5bkdr37mxlfu5v3jksydom.us-east-1.es.amazonaws.com/elasticsearch_index_washingtond8_new_washington_dc"   //api link
      );
  
    console.log("===DATA===");
    console.log(data);
    return (
      <div>
        {data.map((user) => (
          <DataCard
            key={user.id}
            
          />
        ))}
        {hasMoreData && (
          <button
            style={{
              backgroundColor: "",
              alignItems:"bottom",
              color: "black",
              width: "100px",
              // height: "75px",
              frontWeight: 900,
              cursor: "pointer",
              boxSizing: "border-box",
            }}
            onClick={incrementPage}
          >
            LoadMore
          </button>
        )}
      </div>
    );
  };

  export default DataCardMap;
  