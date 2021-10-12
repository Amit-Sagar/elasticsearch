import React, { Component } from "react";
import { REACT_ELASTICSEARCH_URL, DRUPAL_URL } from "../config";
import { FILTER_API, CSRF_API } from "../constant/const";
import { isMobileOnly, isTablet, isBrowser } from "react-device-detect";
import UTILS from "../utils/utils";
import axios from "axios";
class Search extends Component {
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
  }

  componentDidMount() {
    let paramsQuery = UTILS.queryStringParse(decodeURI(window.location.search));
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
      window.history.pushState({}, document.title, "/" + "search");
      this.makeHttpRequest(requestOptions);
    }
    this.makeDrupalRequest();
  }

  onFilterChange(filter) {
    const { filterList, activeFilter } = this.state;
    if (filter === "ALL") {
      if (activeFilter.length === filterList.length) {
        this.setState(
          {
            activeFilter: [],
            current_page: 0,
            isLoading: true,
            items: [],
            typeFlag: true,
          },
          () => {
            let requestOptions = this.createRequestOptions();
            this.modifyHttpRequest(requestOptions);
          }
        );
      } else {
        this.setState(
          {
            activeFilter: filterList.map((filter) => filter.key),
            current_page: 0,
            isLoading: true,
            items: [],
            typeFlag: true,
          },
          () => {
            let requestOptions = this.createRequestOptions();
            this.modifyHttpRequest(requestOptions);
          }
        );
      }
    } else {
      if (activeFilter.includes(filter)) {
        const filterIndex = activeFilter.indexOf(filter);
        const newFilter = [...activeFilter];
        newFilter.splice(filterIndex, 1);
        this.setState(
          {
            activeFilter: newFilter,
            current_page: 0,
            isLoading: true,
            items: [],
            typeFlag: true,
          },
          () => {
            let requestOptions = this.createRequestOptions();
            this.modifyHttpRequest(requestOptions);
          }
        );
      } else {
        this.setState(
          {
            activeFilter: [...activeFilter, filter],
            current_page: 0,
            isLoading: true,
            items: [],
            typeFlag: true,
          },
          () => {
            let requestOptions = this.createRequestOptions();
            this.modifyHttpRequest(requestOptions);
          }
        );
      }
    }
  }

  handleFilter = (e, type) => {
    this.setState(
      {
        isFilterType: type,
        current_page: 0,
        isLoading: true,
        items: [],
      },
      () => {
        let requestOptions = this.createRequestOptions();
        this.modifyHttpRequest(requestOptions);
      }
    );
  };

  makeHttpRequest = (options) => {
    fetch(REACT_ELASTICSEARCH_URL, options)
      .then(async (response) => {
        const data = await response.json();
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

        this.setState({
          items: [...this.state.items, ...data.hits.hits],
          totalCount: data.hits.total.value,
          current_page: this.state.current_page + 1,
          isinitialLoadingElastic: false,
          isLoadingMore: false,
          isLoading: false,
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
      article: "Article",
      business: "Business",
      category_listing: "Category Listing",
      deals: "Deals",
      department_page: "Department Page",
      event: "Event",
      general_article: "General Article",
      general_page: "General Page",
      itinerary: "Itinerary",
      listicle: "Listicle",
      neighborhood: "Neighborhood",
      overview_page: "Overview Page",
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
    fetch(REACT_ELASTICSEARCH_URL, requestOptions)
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

  loadMore = () => {
    this.setState({ isLoadingMore: true });
    let requestOptions = this.createRequestOptions();
    this.makeHttpRequest(requestOptions);
  };

  handleChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleRefineChange = (event) => {
    this.setState({ refine: event.target.value });
  };

  _handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      this.state.refine !== "" &&
      this.state.filter !== ""
    ) {
      this.setState(
        {
          current_page: 0,
          isLoading: true,
          search: true,
          searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
          items: [],
        },
        () => {
          if (history.pushState) {
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
  };

  _handleKeySearch = (e) => {
    if (e.key === "Enter" && this.state.filter !== "") {
      this.handleClick();
    }
  };

  handleClear = () => {
    this.setState(
      {
        current_page: 0,
        isLoading: true,
        search: false,
        searchedText: "",
        filter: "",
        refine: "",
        items: [],
        activeFilter: [],
        isFilterType: "relevance",
      },
      () => {
        window.history.pushState({}, document.title, "/" + "search");
        let requestOptions = this.createRequestOptions();
        this.modifyHttpRequest(requestOptions);
      }
    );
  };

  createRequestOptions = () => {
    if (this.state.filter === "") {
      let requestbody = {
        from: this.state.per_page * this.state.current_page,
        size: this.state.per_page,
      };
      if (this.state.isFilterType === "date") {
        requestbody["sort"] = [{ created: { order: "desc" } }];
      }
      if (this.state.activeFilter.length) {
        requestbody["query"] = {
          bool: {
            filter: [
              {
                terms: {
                  type: this.state.activeFilter,
                },
              },
            ],
          },
        };
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

  changeRefineToggle = () => {
    const currentState = this.state.refineActive;
    this.setState({ refineActive: !currentState });
  };

  changeSortingToggle = () => {
    const currentState = this.state.sortActive;
    this.setState({ sortActive: !currentState });
  };

  changeFilterToggle = () => {
    const currentState = this.state.filterActive;
    this.setState({ filterActive: !currentState });
  };

  handleClick = () => {
    if (this.state.filter === "") {
      this.setState(
        {
          current_page: 0,
          isLoading: true,
          search: false,
          searchedText: "",
          refine: "",
          items: [],
        },
        () => {
          window.history.pushState({}, document.title, "/" + "search");
          let requestOptions = this.createRequestOptions();
          this.modifyHttpRequest(requestOptions);
        }
      );
    } else {
      this.setState(
        {
          current_page: 0,
          isLoading: true,
          search: true,
          searchedText: [this.state.filter, this.state.refine].join(" ").trim(),
          items: [],
        },
        () => {
          if (history.pushState) {
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
  };

  viewDetailsHandler = (nid) => {
    let url = DRUPAL_URL + "/node/" + nid;
    window.location.href = `${url}`;
  };

  render() {
    let {
      isFilterType,
      isLoading,
      search,
      items,
      errorMsg,
      isError,
      filter,
      totalCount,
      searchedText,
      current_page,
      per_page,
      isinitialLoadingElastic,
      isinitialLoadingDrupal,
      filterList,
      activeFilter,
      isLoadingMore,
      refine,
      typeFlag,
    } = this.state;

    if (isinitialLoadingElastic || isinitialLoadingDrupal) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            className="loader"
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt="Loader"
          />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="main-loader-wrapper">
          <h1>SOME ERROR OCCURRED.</h1>
          <h2>{errorMsg.message}</h2>
        </div>
      );
    }

    if (!items.length && !isLoading && !search && !typeFlag) {
      return (
        <div className="search-page-wrapper">
          <h1>NO RESULTS FOUND.</h1>
        </div>
      );
    }

    if (!items.length && !isLoading && (typeFlag || search)) {
      return (
        <div className="search-page-wrapper">
          <div className="container-fluid">
            <div className="row search-page-row">
              <div className="col-sm-12 col-md-8 col-lg-7">
                <div className="search-results-wrapper">
                  <form
                    className="form-inline justify-content-center md-form form-sm mt-0 "
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <input
                      type="text"
                      onChange={this.handleChange}
                      value={filter}
                      className="form-control form-control-sm  w-100"
                      placeholder="Search the site ..."
                      aria-label="Search"
                      onKeyDown={this._handleKeySearch}
                    />
                    <button
                      id="go"
                      form=""
                      data-text="GO"
                      aria-label="button"
                      className="btn btn--primary"
                      onClick={this.handleClick}
                    >
                      <span>GO</span>
                    </button>
                  </form>
                  {typeFlag && !isLoading && !search ? (
                    <React.Fragment>
                      <div className="search-results-info">
                        <p className="search-results-info-mobile__bydefault">
                          <span id="search-results-info__count">0</span> results
                          found.
                        </p>
                      </div>
                    </React.Fragment>
                  ) : null}
                  {search && !isLoading ? (
                    <React.Fragment>
                      <div className="search-results-info">
                        <span id="search-results-info__count">0</span>{" "}
                        <p>
                          results available within
                          <span id="search-results-info__label">
                            {" "}
                            Search Term
                          </span>{" "}
                          containing{" "}
                          <span id="search-results-info__term">
                            “{searchedText}”
                          </span>
                          {/* <button id="clear-mobile" onClick={this.handleClear}>
                            <span className="mdi mdi-close"></span>CLEAR ALL
                          </button> */}
                        </p>
                        <button id="clear" onClick={this.handleClear}>
                          <span className="mdi mdi-close"></span>CLEAR
                          ALL
                        </button>
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 offset-lg-1">
                {/*    <div className="search-results-wrapper search-results-wrapper-mobile">
                  <form
                    className="form-inline d-flex justify-content-center md-form form-sm mt-0 "
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <input
                      type="text"
                      onChange={this.handleChange}
                      value={filter}
                      className="form-control form-control-sm  w-100"
                      placeholder="Search the site ..."
                      aria-label="Search"
                      onKeyDown={this._handleKeySearch}
                    />
                    <button
                      id="go"
                      form=""
                      data-text="GO"
                      aria-label="button"
                      className="btn btn--primary"
                      onClick={this.handleClick}
                    >
                      <span>GO</span>
                    </button>
                  </form>
                  <div className="search-results-info search-results-info-mobile">
                    {typeFlag && !isLoading && !search ? (
                      <React.Fragment>
                        <p className="search-results-info-mobile__bydefault">
                          <span id="search-results-info__count">0</span> results
                          found.
                        </p>
                      </React.Fragment>
                    ) : null}
                    {search && !isLoading ? (
                      <React.Fragment>
                        <span id="search-results-info__count">0</span>{" "}
                        <p>
                          results available within
                          <span id="search-results-info__label">
                            {" "}
                            Search Term
                          </span>{" "}
                          containing{" "}
                          <span id="search-results-info__term">
                            “{searchedText}”
                          </span>
                          <button id="clear-mobile" onClick={this.handleClear}>
                            <span className="mdi mdi-close"></span>CLEAR ALL
                          </button>
                        </p>
                        <button id="clear" onClick={this.handleClear}>
                          <span className="mdi mdi-close"></span>CLEAR ALL
                        </button>
                      </React.Fragment>
                    ) : null}
                  </div>
                </div> */}
                <div className="filter-results-wrapper">
                  <div className="d-flex align-items-center filter-results-title">
                    <p className="filter-results__label italic">
                      Filter Results
                    </p>
                  </div>
                  <div className="styled-horizontal--line">
                    <hr className="line line--horizontal" />
                  </div>
                  <div className="filter-results-refine">
                    {isMobileOnly ? null : (
                      <div className="filter-results-refine__label">
                        <span>Refine</span>
                        <span className="mdi mdi-plus"></span>
                        <span className="mdi mdi-minus"></span>
                      </div>
                    )}
                    {this.state.refineActive || isBrowser ? (
                      <div className="form-group has-search">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Keyword(s)"
                          value={refine}
                          onChange={this.handleRefineChange}
                          onKeyDown={this._handleKeyDown}
                          disabled={!this.state.search}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="filter-results-sortedby">
                    {isMobileOnly ? null : (
                      <div className="filter-results-sortedby__label">
                        <span>Sort By</span>
                        <span className="mdi mdi-plus"></span>
                        <span className="mdi mdi-minus"></span>
                      </div>
                    )}
                    {this.state.sortActive || isBrowser ? (
                      <div className="custom-radio-button">
                        <div className="form-check">
                          <input
                            type="radio"
                            id="Radios1"
                            value="relevance"
                            checked={
                              isFilterType === "relevance" ? true : false
                            }
                            onChange={(e) => this.handleFilter(e, "relevance")}
                          />
                          <label htmlFor="Radios1">Relevance</label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="Radios2"
                            value="date"
                            checked={isFilterType === "date" ? true : false}
                            onChange={(e) => this.handleFilter(e, "date")}
                          />
                          <label htmlFor="Radios2">Date</label>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="filter-results-bytype">
                    {isMobileOnly ? null : (
                      <div className="filter-results-bytype__label">
                        <span>Results by Type</span>
                        <span className="mdi mdi-plus"></span>
                        <span className="mdi mdi-minus"></span>
                      </div>
                    )}
                    {this.state.filterActive || isBrowser ? (
                      <div className="custom-radio-button">
                        <form action="/">
                          <div className="form-check" key="0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="Select All"
                              id="Radio0"
                              value="Select All"
                              onChange={() => this.onFilterChange("ALL")}
                              checked={
                                activeFilter.length === filterList.length
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="Radio0"
                            >
                              <span></span>
                              Select All
                            </label>
                          </div>
                          {filterList.length
                            ? filterList.map((item, index) => {
                                return (
                                  <div className="form-check" key={index + 1}>
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name={`${item.value}`}
                                      id={`Radio${index + 1}`}
                                      value={`${item.key}`}
                                      checked={activeFilter.includes(item.key)}
                                      onChange={() =>
                                        this.onFilterChange(item.key)
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`Radio${index + 1}`}
                                    >
                                      <span></span>
                                      {`${item.value}`}
                                    </label>
                                  </div>
                                );
                              })
                            : null}
                        </form>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="search-page-wrapper">
        <div className="container-fluid">
          <div className="row search-page-row">
            <div className="col-sm-12 col-md-8 col-lg-7">
              <div className="search-results-wrapper">
                <form
                  className="form-inline justify-content-center md-form form-sm mt-0 "
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={filter}
                    className="form-control form-control-sm  w-100"
                    placeholder="Search the site ..."
                    aria-label="Search"
                    onKeyDown={this._handleKeySearch}
                  />
                  <button
                    id="go"
                    form=""
                    data-text="GO"
                    aria-label="button"
                    className="btn btn--primary"
                    onClick={this.handleClick}
                  >
                    <span>GO</span>
                  </button>
                </form>
                <div className="search-results-info">
                  {items.length && !search && !isLoading ? (
                    <p className="search-results-info-mobile__bydefault">
                      <span id="search-results-info__count">{totalCount}</span>{" "}
                      results found.
                    </p>
                  ) : null}
                  {items.length && search && !isLoading ? (
                    <React.Fragment>
                      <span id="search-results-info__count">{totalCount}</span>{" "}
                      <p>
                        results available within
                        <span id="search-results-info__label">
                          {" "}
                          Search Term
                        </span>{" "}
                        containing{" "}
                        <span id="search-results-info__term">
                          “{searchedText}”
                        </span>
                        <button id="clear-mobile" onClick={this.handleClear}>
                          <span className="mdi mdi-close"></span>CLEAR ALL
                        </button>
                      </p>
                      <button id="clear" onClick={this.handleClear}>
                        <span className="mdi mdi-close"></span>CLEAR ALL
                      </button>
                    </React.Fragment>
                  ) : null}
                </div>

                {items.length ? (
                  items.map((item, index) => {
                    var img = !item._source.hero_images
                      ? "/sites/default/files/styles/menu_pods_504_x_380/public/2020-12/fe800e44-30a5-44c6-a594-4584cd17e625_0.jpg?itok=3tn7Z1S5"
                      : `${item._source.hero_images[0]}`;
                    return (
                      <div className="card-wrapper" key={index}>
                        <div className="sweet--deals_card">
                          <div className="card-img-wrapper">
                            <img
                              className="image card-img-left"
                              src={img}
                              alt="This is  alt text"
                            />
                          </div>
                          <div className="sweet--deals_card-info">
                            <div className="sweet--deals_card-label">
                              {item._source.neighborhood_label &&
                              item._source.neighborhood_label[0].label ? (
                                <a
                                  className="sweet--deals_card-location"
                                  href={item._source.neighborhood_label[0].link}
                                >
                                  {item._source.neighborhood_label[0].label}
                                </a>
                              ) : null}
                              <h5 className="sweet--deals_card-headline">
                                {item._source.title}
                              </h5>
                              <p className="sweet--deals_card-body">
                                {item._source.card_body}
                              </p>
                              <a
                                onClick={(e) =>
                                  this.viewDetailsHandler(item._source.nid)
                                }
                                className="btn btn--primary sweet--deals_card-button"
                                target="_self"
                                data-text="VIEW DETAILS"
                              >
                                <span className="button__inner-rollover-text">
                                  VIEW DETAILS
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      className="loader"
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                      alt="Loader"
                    />
                  </div>
                )}

                {isLoadingMore ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      className="loader"
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                      alt="Loader"
                    />
                  </div>
                ) : (
                  ""
                )}
                {!isLoading &&
                  !isLoadingMore &&
                  items.length > 0 &&
                  current_page < Math.ceil(totalCount / per_page) && (
                    <div className="col-lg-12 col-md-12 text-center search-results-loadmore">
                      <div className="icon--line">
                        <hr className="line line--vertical line--smoky" />
                        <span className="mdi mdi-star"></span>
                      </div>
                      <div className="btn--loadmore">
                        <button
                          data-target="_blank"
                          data-text="LOAD MORE"
                          aria-label="button"
                          className="btn btn--primary"
                          onClick={this.loadMore}
                        >
                          <span>LOAD MORE</span>
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 offset-lg-1">
              {/* <div className="search-results-wrapper search-results-wrapper-mobile">
                <form
                  className="form-inline d-flex justify-content-center md-form form-sm mt-0 "
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={filter}
                    className="form-control form-control-sm  w-100"
                    placeholder="Search the site ..."
                    aria-label="Search"
                    onKeyDown={this._handleKeySearch}
                  />
                  <button
                    id="go"
                    form=""
                    data-text="GO"
                    aria-label="button"
                    className="btn btn--primary"
                    onClick={this.handleClick}
                  >
                    <span>GO</span>
                  </button>
                </form>
                <div className="search-results-info search-results-info-mobile">
                  {items.length && !search && !isLoading ? (
                    <p className="search-results-info-mobile__bydefault">
                      <span id="search-results-info__count">{totalCount}</span>{" "}
                      results found.
                    </p>
                  ) : null}
                  {items.length && search && !isLoading ? (
                    <React.Fragment>
                      <span id="search-results-info__count">{totalCount}</span>{" "}
                      <p>
                        results available within
                        <span id="search-results-info__label">
                          {" "}
                          Search Term
                        </span>{" "}
                        containing{" "}
                        <span id="search-results-info__term">
                          “{searchedText}”
                        </span>
                        <button id="clear-mobile" onClick={this.handleClear}>
                          <span className="mdi mdi-close"></span>CLEAR ALL
                        </button>
                      </p>
                      <button id="clear" onClick={this.handleClear}>
                        <span className="mdi mdi-close"></span>CLEAR ALL
                      </button>
                    </React.Fragment>
                  ) : null}
                </div>
              </div> */}
              <div className="filter-results-wrapper">
                <div className="d-flex align-items-center filter-results-title">
                  <p className="filter-results__label italic">Filter Results</p>
                </div>
                <div className="styled-horizontal--line">
                  <hr className="line line--horizontal" />
                </div>
                <div className="filter-results-refine">
                  {isMobileOnly ? null : (
                    <div className="filter-results-refine__label">
                      <span>Refine</span>
                      <span className="mdi mdi-plus"></span>
                      <span className="mdi mdi-minus"></span>
                    </div>
                  )}
                  {this.state.refineActive || isBrowser ? (
                    <div className="form-group has-search">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Keyword(s)"
                        value={refine}
                        onChange={this.handleRefineChange}
                        onKeyDown={this._handleKeyDown}
                        disabled={!this.state.search}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="filter-results-sortedby">
                  {isMobileOnly ? null : (
                    <div className="filter-results-sortedby__label">
                      <span>Sort By</span>
                      <span className="mdi mdi-plus"></span>
                      <span className="mdi mdi-minus"></span>
                    </div>
                  )}
                  {this.state.sortActive || isBrowser ? (
                    <div className="custom-radio-button">
                      <div className="form-check">
                        <input
                          type="radio"
                          id="Radios1"
                          value="relevance"
                          checked={isFilterType === "relevance" ? true : false}
                          onChange={(e) => this.handleFilter(e, "relevance")}
                        />
                        <label htmlFor="Radios1">Relevance</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="Radios2"
                          value="date"
                          checked={isFilterType === "date" ? true : false}
                          onChange={(e) => this.handleFilter(e, "date")}
                        />
                        <label htmlFor="Radios2">Date</label>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="filter-results-bytype">
                  {isMobileOnly ? null : (
                    <div className="filter-results-bytype__label">
                      <span>Results by Type</span>
                      <span className="mdi mdi-plus"></span>
                      <span className="mdi mdi-minus"></span>
                    </div>
                  )}
                  {this.state.filterActive || isBrowser ? (
                    <div className="custom-radio-button">
                      <form action="/">
                        <div className="form-check" key="0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="Select All"
                            id="Radio0"
                            value="Select All"
                            onChange={() => this.onFilterChange("ALL")}
                            checked={activeFilter.length === filterList.length}
                          />
                          <label className="form-check-label" htmlFor="Radio0">
                            <span></span>
                            Select All
                          </label>
                        </div>
                        {filterList.length
                          ? filterList.map((item, index) => {
                              return (
                                <div className="form-check" key={index + 1}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={`${item.value}`}
                                    id={`Radio${index + 1}`}
                                    value={`${item.key}`}
                                    checked={activeFilter.includes(item.key)}
                                    onChange={() =>
                                      this.onFilterChange(item.key)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`Radio${index + 1}`}
                                  >
                                    <span></span>
                                    {`${item.value}`}
                                  </label>
                                </div>
                              );
                            })
                          : null}
                      </form>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
