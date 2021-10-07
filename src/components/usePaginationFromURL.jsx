import { useState, useEffect } from "react";
import axios from "axios";

const usePaginationFromURL = (url) => {
  const [pageNumber, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getNextPage = async (p) => {
      const response = (await axios.get("${url}?page=${p}")).data;
      setHasMoreData(response.total_pages > pageNumber);
      setData((data) => [...data, ...response.data]);
    };

    if (hasMoreData) {
      getNextPage(pageNumber);
    }
  }, [pageNumber, url]);

  const incrementPage = () => {
    setPage((pageNumber) => pageNumber + 1);
  };
  return { data, incrementPage, hasMoreData };
};
export default usePaginationFromURL;
