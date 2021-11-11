import React, { Component } from "react";
import Utils from "../utils/utils";
import {
  Collapse,
  Card,
  Radio,
  Checkbox,
  Button,
  Space,
  Select,
  Pagination,
  Tabs,
  Tag,
} from "antd";
import "antd/dist/antd.css";
import {
  TableOutlined,
  OrderedListOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import MapView from "./Map";
import { $, jQuery } from "jquery";

export class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      refine: "",
      items: [],
      per_page: 10,
      current_page: 0,
      isinitialLoadingElastic: true,
      isinitialLoadingDrupal: true,
      isLoading: true,
      isLoadingMore: true,
      isError: false,
      errorMsg: "",
      search: false,
      searchedText: "",
      isFilterType: "relevance",
      filterList: [],
      activeFilter: [],
      refineActive: false,
      filterActive: false,
      sortActive: false,
      typeFlag: false,
      neighbourhoodFilterList: [],
      neighbourhoodFilter: [],
      categoryFilterList: [],
      categoryFilter: [],
      amenitiesFilterList: [],
      amenitiesFilter: [],
      capacityFilterList: [],
      capacityFilter:[],
      meetingServicesFilterList:[],
      meetingServicesFilter:[],
      filterFields: [
        "title",
        "body",
        "sub_title",
        "field_summary_subtitle",
        "summary_title",
        "field_itinerary_summary_title",
        "itinerary_body",
        "itinerary_sub_title",
        "itinerary_title",
        "itinerary_items_body",
        "itinerary_items_title",
        "listicle_body",
        "listicle_title",
        "itinerary_section_body",
        "itinerary_section_sub_title",
      ],
    };
    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage = (page) => {
    this.setState(
      {
        filter : page,
        current_page: page - 1,
      },
      () =>{
        // if (this.state.filter != "") {
        //   this.setState(
        //     {
        //       current_page: this.state.current_page,
        //       isLoading: true,
        //       search: true,
        //       searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
        //       items: [],
        //     },
        //     () => {
        //       if (window.history.pushState) {
        //         var newurl =
        //           window.location.protocol +
        //           "//" +
        //           window.location.host +
        //           window.location.pathname +
        //           "?q=" +
        //           this.state.filter +
        //           "&r=" +
        //           this.state.refine;
        //         window.history.pushState({ path: newurl }, "", newurl);
        //       }
              let requestOptions = this.createRequestOptions();
              this.modifyHttpRequest(requestOptions);
            // }
          // );
        // }
      }
    );
  };

  componentDidMount() {
    let paramsQuery = Utils.queryStringParse(decodeURI(window.location.search));
    let search_query = paramsQuery.q ? paramsQuery.q : null;
    let refine_query = paramsQuery.r ? paramsQuery.r : "";
    if (search_query) {
      this.setState(
        {
          current_page: 0,
          isLoading: true,
          search: true,
          searchedText: search_query,
          filter: search_query,
          refine: refine_query,
          items: [],
        },
        () => {
          let requestOptions = this.createRequestOptions();
          this.makeHttpRequest(requestOptions);
        }
      );
    } else {
      let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: this.state.per_page * this.state.current_page,
          size: this.state.per_page,
        }),
      };
      window.history.pushState({}, document.title, "/" + "business");
      this.makeHttpRequest(requestOptions);
    }
    this.makeDrupalRequest();
  }

  makeHttpRequest = (options) => {
    fetch(
      "https://search-washingtond8-prod-kz2b5bkdr37mxlfu5v3jksydom.us-east-1.es.amazonaws.com/elasticsearch_index_washingtond8_new_washington_dc/_search",
      options
    )
      .then(async (response) => {
        const data = await response.json();
        // console.log(items)
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          this.setState({
            isError: true,
            isinitialLoadingElastic: false,
            isLoading: false,
            isLoadingMore: false,
            errorMsg: error,
          });
          return Promise.reject(error);
        }
        // console.log(data)
        this.setState({
          items: data.hits.hits,
          totalCount: data.hits.total.value,
          current_page: this.state.current_page + 1,
        });
      })
      .catch((error) => {
        this.setState({
          isError: true,
          isinitialLoadingElastic: false,
          isLoading: false,
          isLoadingMore: false,
          errorMsg: error,
        });
        console.error("There was an error!", error);
      });
  };

  makeDrupalRequest = () => {
    const data = {
      boca_grande: "Boca Grande & Outer Island",
      bonita_spring: "Bonita Spring & Estero",
      cape_coral: "Cape Coral",
      fort_myres_beach: "Fort Myers Beach",
      fort_myres: "Fort Myres",
      north_fort_myres: "North Fort Myres",
      BeachAccess : "BeachAccess",
      Island : "Island",
      FloridaGreenLodging: "FloridaGreenLodging",
      Laundry : "Laundry",
      Washer : "Washer / DryerOn - Site",
      Radio: "Radio"
    };

    let modifyData = Object.keys(data).map((key) => ({
      key,
      value: data[key],
    }));
    this.setState({
      filterList: modifyData,
      isinitialLoadingDrupal: false,
      isLoadingMore: false,
      isLoading: false,
    });
  };
  modifyHttpRequest = (requestOptions) => {
    fetch(
      "https://search-washingtond8-prod-kz2b5bkdr37mxlfu5v3jksydom.us-east-1.es.amazonaws.com/elasticsearch_index_washingtond8_new_washington_dc/_search",
      requestOptions
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          this.setState({
            isError: true,
            isLoading: false,
            isLoadingMore: false,
            errorMsg: error,
          });
          return Promise.reject(error);
        }

        this.setState({
          items: data.hits.hits,
          current_page: this.state.current_page + 1,
          totalCount: data.hits.total.value,
          isLoading: false,
          isLoadingMore: false,
        });
      })
      .catch((error) => {
        this.setState({
          isError: true,
          isLoading: false,
          errorMsg: error,
          isLoadingMore: false,
        });
        console.error("There was an error!", error);
      });
  };
  createRequestOptions = () => {
    // console.log(this.state.current_page);
    if (this.state.filter === "") {
      let requestbody = {
        from: this.state.per_page * this.state.current_page,
        size: this.state.per_page,
        query: {
          bool: {
            filter: [],
          },
        },
      };
      if (this.state.isFilterType === "date") {
        requestbody["sort"] = [{ created: { order: "desc" } }];
      }
      if (this.state.neighbourhoodFilter.length) {
        requestbody["query"].bool.filter.push({
          terms: {
            neighbourhood: this.state.neighbourhoodFilter,
          },
        });
      }
      if (this.state.categoryFilter.length) {
        requestbody["query"].bool.filter.push({
          terms: {
            category: this.state.categoryFilter,
          },
        });
      }
      if (this.state.amenitiesFilter.length) {
        requestbody["query"].bool.filter.push({
          terms: {
            amenities: this.state.amenitiesFilter,
          },
        });
      }
      let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestbody),
      };
      return requestOptions;
    } else {
      let requestbody = {};
      if (this.state.refine === "") {
        requestbody = {
          from: this.state.per_page * this.state.current_page,
          size: this.state.per_page,
          query: {
            bool: {
              must: [
                {
                  exists: {
                    field: "nid",
                  },
                },
                {
                  match: {
                    status: "true",
                  },
                },
                {
                  multi_match: {
                    query: this.state.filter,
                    type: "best_fields",
                    operator: "and",
                    fields: this.state.filterFields,
                  },
                },
              ],
            },
          },
        };
      } else {
        requestbody = {
          from: this.state.per_page * this.state.current_page,
          size: this.state.per_page,
          query: {
            bool: {
              must: [
                {
                  exists: {
                    field: "nid",
                  },
                },
                {
                  match: {
                    status: "true",
                  },
                },
                {
                  multi_match: {
                    query: this.state.filter,
                    type: "best_fields",
                    operator: "and",
                    fields: this.state.filterFields,
                  },
                },
              ],
              filter: [
                {
                  multi_match: {
                    query: this.state.refine,
                    lenient: true,
                    type: "phrase_prefix",
                    fields: this.state.filterFields,
                  },
                },
              ],
            },
          },
        };
      }

      if (this.state.isFilterType === "date") {
        requestbody["sort"] = [{ created: { order: "desc" } }];
      }
      if (this.state.activeFilter.length && !(this.state.refine === "")) {
        requestbody["query"]["bool"]["filter"].push({
          terms: {
            type: this.state.activeFilter,
          },
        });
      } else if (this.state.activeFilter.length) {
        requestbody["query"]["bool"]["filter"] = [
          {
            terms: {
              type: this.state.activeFilter,
            },
          },
        ];
      }
      let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestbody),
      };
      return requestOptions;
    }
  };
  handleRefineChange = (event) => {
    this.setState({ refine: event.target.value });
  };

  viewDetailsHandler = (nid) => {
    let url = "https://dev.washington-d8.oslabs.app" + "/node/" + nid;
    window.location.href = `${url}`;
  };
  onChange(value) {
    console.log(value);
    this.setState(
      {
        isFilterType: value,
        current_page: 0,
        isLoading: true,
        items: [],
      },
      () => {
        let requestOptions = this.createRequestOptions();
        this.modifyHttpRequest(requestOptions);
      }
    );

    if (value === "relevance") {
      this.setState();
    }
    if (value === "date") {
      this.setState();
    }
  }

  // ascending
  handleSortAsc(values) {
    console.log("clicked");
    values.forEach((val) => {
      console.log("before", val._source.title);
    });
    values.sort((a, b) => {
      let a1 = a._source.title;
      let b1 = b._source.title;
      if (a1 < b1) return -1;
      return 1;
    });
    this.setState({
      items: values,
    });
    values.forEach((val) => {
      console.log("after", val._source.title);
    });
  }

  // descending
  handleSortDesc(values) {
    console.log("clicked");
    values.forEach((val) => {
      console.log("before", val._source.title);
    });
    values.sort((a, b) => {
      let a1 = a._source.title;
      let b1 = b._source.title;
      if (a1 < b1) return 1;
      return -1;
    });
    this.setState({
      items: values,
    });
    values.forEach((val) => {
      console.log("after", val._source.title);
    });
  }

  onNeighbourhoodFilterChange = (filter) => {
    const { neighbourhoodFilterList, neighbourhoodFilter } = this.state;
    this.setState(
      {
        filter: filter,
        neighbourhoodFilter: filter,
        current_page: 0,
        isLoading: true,
        items: [],
        typeFlag: true,
      },
      () => {
        if (this.state.filter === "") {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: false,
              searchedText: '',
              refine: '',
              items: [],
            },
            () => {
              window.history.pushState({}, document.title, '/' + 'business')
              let requestOptions = this.createRequestOptions()
              this.modifyHttpRequest(requestOptions)
            },
          )
        } else {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: true,
              // searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
              items: [],
            },
            () => {
              if (window.history.pushState) {
                var newurl =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?q=" +
                  this.state.filter +
                  "&r=" +
                  this.state.refine;
                window.history.pushState({ path: newurl }, "", newurl);
              }
              let requestOptions = this.createRequestOptions();
              this.modifyHttpRequest(requestOptions);
            }
          );
        }
      }
    );
  };

  onlocationFilterChange = (category) => {
    const { categoryFilterList, categoryFilter } = this.state;
    this.setState(
      {
        filter: [this.state.filter, category],
        categoryFilter: category,
        current_page: 0,
        isLoading: true,
        items: [],
        typeFlag: true,
      },
      () => {
        if (this.state.categoryFilter === "") {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: false,
              searchedText: '',
              refine: '',
              items: [],
            },
            () => {
              window.history.pushState({}, document.title, '/' + 'business')
              let requestOptions = this.createRequestOptions()
              this.modifyHttpRequest(requestOptions)
            },
          )
        } else {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: true,
              // searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
              items: [],
            },
            () => {
              if (window.history.pushState) {
                var newurl =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?q=" +
                  this.state.filter +
                  "&r=" +
                  this.state.refine;
                window.history.pushState({ path: newurl }, "", newurl);
              }
              let requestOptions = this.createRequestOptions();
              this.modifyHttpRequest(requestOptions);
            }
          );
        }
      }
    );
  };
  
  onAmenitiesFilterChange = (amenity) => {
    const { amenitiesFilterList, amenitiesFilter } = this.state;
    this.setState(
      {
        filter: [this.state.filter, amenity],
        amenitiesFilter: amenity,
        current_page: 0,
        isLoading: true,
        items: [],
        typeFlag: true,
      },
      () =>  {
        if (this.state.amenitiesFilter === "") {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: false,
              searchedText: '',
              refine: '',
              items: [],
            },
            () => {
              window.history.pushState({}, document.title, '/' + 'business')
              let requestOptions = this.createRequestOptions()
              this.modifyHttpRequest(requestOptions)
            },
          )
        } else {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: true,
              // searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
              items: [],
            },
            () => {
              if (window.history.pushState) {
                var newurl =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?q=" +
                  this.state.filter +
                  "&r=" +
                  this.state.refine;
                window.history.pushState({ path: newurl }, "", newurl);
              }
              let requestOptions = this.createRequestOptions();
              this.modifyHttpRequest(requestOptions);
            }
          );
        }
      }
    );
  };
  onCapacityFilterChange = (capacity) => {
    const { capacityFilterList, capacityFilter } = this.state;
    this.setState(
      {
        filter: [this.state.filter, capacity],
        amenitiesFilter: capacity,
        current_page: 0,
        isLoading: true,
        items: [],
        typeFlag: true,
      },
      () =>  {
        if (this.state.capacityFilter === "") {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: false,
              searchedText: '',
              refine: '',
              items: [],
            },
            () => {
              window.history.pushState({}, document.title, '/' + 'business')
              let requestOptions = this.createRequestOptions()
              this.modifyHttpRequest(requestOptions)
            },
          )
        } else {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: true,
              // searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
              items: [],
            },
            () => {
              if (window.history.pushState) {
                var newurl =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?q=" +
                  this.state.filter +
                  "&r=" +
                  this.state.refine;
                window.history.pushState({ path: newurl }, "", newurl);
              }
              let requestOptions = this.createRequestOptions();
              this.modifyHttpRequest(requestOptions);
            }
          );
        }
      }
    );
  };
  onmeetingServiceFilterChange = (meeting) => {
    const { meetingServiceFilterList, meetingServiceFilter } = this.state;
    this.setState(
      {
        filter: [this.state.filter, meeting],
        amenitiesFilter: meeting,
        current_page: 0,
        isLoading: true,
        items: [],
        typeFlag: true,
      },
      () =>  {
        if (this.state.amenitiesFilter === "") {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: false,
              searchedText: '',
              refine: '',
              items: [],
            },
            () => {
              window.history.pushState({}, document.title, '/' + 'business')
              let requestOptions = this.createRequestOptions()
              this.modifyHttpRequest(requestOptions)
            },
          )
        } else {
          this.setState(
            {
              current_page: 0,
              isLoading: true,
              search: true,
              // searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
              items: [],
            },
            () => {
              if (window.history.pushState) {
                var newurl =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?q=" +
                  this.state.filter +
                  "&r=" +
                  this.state.refine;
                window.history.pushState({ path: newurl }, "", newurl);
              }
              let requestOptions = this.createRequestOptions();
              this.modifyHttpRequest(requestOptions);
            }
          );
        }
      }
    );
  };
  neighbourhood = [
    "Boca Grande & Outer Island",
    "Bonita Spring & Estero",
    "Cape Coral",
    "Fort Myers Beach",
    "Fort Myres",
    "North Fort Myres",
  ];

  location = ["Riverfront", "Bayfront", "Beachfront", "Oceanfront", "Waterfront"];
  amenities = [
    "24-hours room",
    "Airport shuttle",
    "Concierge",
    "wet bar",
    "Beach access",
  ];

  capacity= ["1-5 meeting rooms", "5-10 meeting rooms","10+ meeting rooms",">2500 Largest mtg rm sqft.", "2500-5000 largest mtg rm sqft."]
  meetingServices=["Decorator","off-site veneus nearby","use own catere", "Business center","Audio/visualequipment rental"]
  options = [
    {
      label: "Boca Grande & Outer Island",
      value: "Boca Grande & Outer Island",
    },
    { label: "Bonita Spring & Estero", value: "Bonita Spring & Estero" },
    { label: "Cape Coral", value: "Cape Coral" },
    { label: "Fort Myers Beach", value: "Fort Myers Beach" },
    { label: "Fort Myres", value: "Fort Myres" },
    { label: "North Fort Myres", value: "North Fort Myres" },
    { label: "Riverfront", value: "Riverfront" },
    { label: "Bayfront", value: "Bayfront" },
    { label: "Beachfront", value: "Beachfront" },
    { label: "Oceanfront", value: "Oceanfront" },
    { label: "Waterfront", value: "Waterfront" },
    { label: "24-hours room", value: "24-hours room" },
    { label: "Airport shuttle", value: "Island" },
    { label: "Concierge", value: "Concierge" },
    { label: "wet bar", value: "wet bar" },
    { label: "Beach access", value: "Beach access" },
    {label:"1-5 meeting rooms" , value:"1-5 meeting rooms"},
    {label: "5-10 meeting rooms", value:"5-10 meeting rooms"},
    {label: "10+ meeting rooms", value:"10+ meeting rooms"},
    {label: ">2500 Largest mtg rm sqft.", value:">2500 Largest mtg rm sqft."},
    {label: "2500-5000 largest mtg rm sqft.", value:"2500-5000 largest mtg rm sqft."},
    {label:"Decorator" , value:"Decorator"},
    {label:"off-site veneus nearby" , value:"off-site veneus nearby"},
    {label:"use own catere" , value:"use own catere"},
    {label:"Business center" , value:"Business center"},
    {label:"Audio/visualequipment rental" , value:"Audio/visualequipment rental"},

  ];

  render() {
    let { items, totalCount, per_page, isLoading, isLoadingMore } = this.state;
    const { Option } = Select;
    const { TabPane } = Tabs;
    const { Meta } = Card;
    const { Panel } = Collapse;

    function callback(key) {
      console.log(key);
    }
    function log(e) {
      console.log(e);
    }

    const listItem = items.map((item, index) => {
      return (
        <React.Fragment>
          <Card
            hoverable
            style={{
              width: "70vw",
              margin: "5%",
              marginLeft: "2%",
              height: 225,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <img
                alt="example"
                src={`https://washington.org/${item._source.thumbnail_images}`}
              />
              <div style={{ paddingLeft: "20px" }}>
              <h2><strong>{item._source.title}</strong></h2>
             <p>Number of Sleeping Rooms: <span>200</span></p>
             <p>Number of Meeting Rooms: <span>10</span></p>
             <p>Largest Meeting Room Sq Ft.: <span>5,000</span></p>
             <p>Total Meeting Room Sq Ft.: <span>20,000</span></p>
             <hr/>
             <p>Sanibel & Captiva Island</p>
              </div>
            </div>
          </Card>
        </React.Fragment>
      );
    });

    const gridItem = items.map((item, index) => {
      return (
        <React.Fragment>
          <Space>
            <Card
              hoverable
              style={{ width: 380, margin: "5%", paddingLeft: "10px" }}
              cover={
                <img
                  class="show-image"
                  alt="example"
                  style={{
                    height: "225px",
                    width: "337px",
                    alignItems: "center",
                  }}
                  src={`https://washington.org/${item._source.thumbnail_images}`}
                />
              }
            >
             <h2><strong>{item._source.title}</strong></h2>
             <p>Number of Sleeping Rooms: <span>200</span></p>
             <p>Number of Meeting Rooms: <span>10</span></p>
             <p>Largest Meeting Room Sq Ft.: <span>5,000</span></p>
             <p>Total Meeting Room Sq Ft.: <span>20,000</span></p>
             <hr/>
             <p>Sanibel & Captiva Island</p>
            </Card>
          </Space>
        </React.Fragment>
      );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalCount / per_page); i++) {
      pageNumbers.push(i);
    }
    const neighbourhoodTag = this.state.neighbourhoodFilter.map((filter) => {
      return (
        <Tag closable onClose={log}>
          {filter}
        </Tag>
      );
    });

    const locationTag = this.state.categoryFilter.map((filter) => {
      return (
        <Tag closable onClose={log}>
          {filter}
        </Tag>
      );
    });

    const amenitiesTag = this.state.amenitiesFilter.map((filter) => {
      return (
        <Tag closable onClose={log}>
          {filter}
        </Tag>
      );
    });
   const capacityTag = this.state.capacityFilter.map((filter)=>{
     return(
       <Tag closable onClose={log}>
         {filter}
       </Tag>
     )
   });
   const meetingServicesTag = this.state.meetingServicesFilter.map((filter)=>{
     return(
       <Tag closable onClose={log}>
           {filter}
       </Tag>
     )
   })
    return (
      <div style={{ backgroundColor: "#F2F2Cf" }}>
        <div style={{ margin: "5%", display: "flex" }}>
          <Card
            title="Filters"
            extra={<FilterOutlined />}
            style={{ width: "30%" }}
          >
            <div>
              {neighbourhoodTag}
              {locationTag}
              {amenitiesTag}
              {capacityTag}
              {meetingServicesTag}
              {neighbourhoodTag != "" ||
              locationTag != "" ||
              amenitiesTag != "" || capacityTag != "" || meetingServicesTag !=""? (
                <p> clear all</p>
              ) : null}
            </div>
            <Collapse
              bordered={false}
              defaultActiveKey={["1"]}
              style={{ backgroundColor: "white" }}
            >
              <Panel header="Neighbourhood" key="1">
                <Radio.Group>
                  <Space direction="vertical">
                    <Checkbox.Group
                      direction="vertical"
                      options={this.neighbourhood}
                      onChange={this.onNeighbourhoodFilterChange}
                      // onClick={this.neighbourhoodClick}
                    />
                  </Space>
                </Radio.Group>
              </Panel>
              <Panel header="Location" key="2">
                <Radio.Group>
                  <Space direction="vertical">
                    <Checkbox.Group
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: "cream",
                      }}
                      options={this.location}
                      onChange={this.onCategoryFilterChange}
                      // onClick={this.categoryClick}
                    />
                  </Space>
                </Radio.Group>
              </Panel>
              
              <Panel header="Amenities" key="3">
                <Radio.Group>
                  <Space direction="vertical">
                    <Checkbox.Group
                      id="profileurl"
                      options={this.amenities}
                      onChange={this.onAmenitiesFilterChange}
                    />
                  </Space>
                </Radio.Group>
              </Panel>
              <Panel header="Capacity" key="4">
                <Radio.Group>
                  <Space direction="vertical">
                    <Checkbox.Group
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: "cream",
                      }}
                      options={this.capacity}
                      onChange={this.onCapacityFilterChange}
                      // onClick={this.categoryClick}
                    />
                  </Space>
                </Radio.Group>
              </Panel>
              <Panel header="Meeting Services" key="5">
                <Radio.Group>
                  <Space direction="vertical">
                    <Checkbox.Group
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: "cream",
                      }}
                      options={this.meetingServices}
                      onChange={this.onmeetingServicesFilterChange}
                      // onClick={this.categoryClick}
                    />
                  </Space>
                </Radio.Group>
              </Panel>
            </Collapse>
          </Card>

          <div>
            <div style={{ marginTop: "3%" }}>
              <Select
                placeholder="Sort By"
                size="large"
                style={{ width: 450, marginLeft: "20px" }}
                onChange={(e) => this.onChange(e, this.value)}
              >
                <Option value="relevance">RELEVANCE</Option>
                <Option value="date">DATE</Option>
              </Select>
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
                onClick={() => this.handleSortAsc(items)}
              >
                <span>
                  <SortAscendingOutlined />
                </span>
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
                onClick={() => this.handleSortDesc(items)}
              >
                <span>
                  <SortDescendingOutlined />
                </span>
              </Button>
              <Tabs onChange={callback} type="card" tabPosition="right">
                <TabPane
                  tab={
                    <span>
                      <TableOutlined />
                    </span>
                  }
                  key="1"
                >
                  {gridItem}
                  {!isLoading && !isLoadingMore && totalCount > 6 && (
                    <Pagination
                      class="pagination"
                      onChange={this.onChangePage}
                      total={totalCount}
                      defaultPageSize={per_page}
                      showSizeChanger={false}
                      hideOnSinglePage={true}
                    />
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <OrderedListOutlined />
                    </span>
                  }
                  key="2"
                >
                  {listItem}
                  {!isLoading && !isLoadingMore && totalCount > 6 && (
                    <Pagination
                      class="pagination"
                      onChange={this.onChangePage}
                      total={totalCount}
                      defaultPageSize={per_page}
                      showSizeChanger={false}
                      hideOnSinglePage={true}
                    />
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <EnvironmentOutlined />
                    </span>
                  }
                  key="3"
                >
                  <div style={{ height: "600px" }}>
                    <MapView />
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cards;
