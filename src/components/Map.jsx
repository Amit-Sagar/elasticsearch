import React from "react";
import { Card } from "antd";
// import L from 'leaflet';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  CircleMarker,
  ZoomControl,
} from "react-leaflet";
import FullscreenControl from 'react-leaflet-fullscreen';
class MapView extends React.Component {
  constructor() {
    super();
    this.mapRef = React.createRef();
    this.state = {
      lat: 51.315,
      lng: -0.09,
      zoom: 10,
      positions: [
        {
          lat: 51.315,
          lng: -0.09,
          zoom: 13,
        },
        {
          lat: 51.305,
          lng: -0.09,
          zoom: 13,
        },
        {
          lat: 51.325,
          lng: -0.09,
          zoom: 13,
        },
      ],
    };
  }
  componentDidMount() {}
  zoomOut = () => {
    const map = this.mapRef.current;
    if (map != null) {
      map.leafletElement.zoomOut();
    }
  };
  zoomOut() {
    alert("zoomOut");
    window.map = this.map;
    this.map.setZoom(0);
    //this.setState({ ...this.state, zoom: this.state.zoom - 1 });
  }
  renderPositions(positions) {
    return (
      <>
        {/* <Polyline color="#220bb9" positions={positions} /> */}
        {positions.map((position, index) => (
          <CircleMarker
            key={index}
            center={position}
            fill={true}
            color="#220bb9"
            radius={8}
          >
            <Popup>
              <Card
                // hoverable
                // style={{
                //   width: "70vw",
                //   margin: "5%",
                //   marginLeft: "2%",
                //   height: 225,
                // }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {/* <img
                    alt="example"
                    // src={`https://washington.org/${item._source.thumbnail_images}`}
                  /> */}
                  <div>
                    <h2>heading</h2>
                    <p>body</p>
                  </div>
                </div>
              </Card>
            </Popup>
            <Tooltip direction="top" opacity={1}>
              toolTip
            </Tooltip>
          </CircleMarker>
        ))}
      </>
    );
  }
  render() {
    const center = { lat: 28.7041, lng: 77.1025 };
    const positions = [
      { lat: 28.7041, lng: 77.1025},
      { lat: 28.5562, lng: 77.1000 },
      { lat: 28.5744, lng:  77.2096},
    ];
    return (
      <Map
        ref={this.mapRef}
        onContextmenu={() => this.zoomOut()}
        center={center}
        zoom={this.state.zoom}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Marker position={[51.515, -0.09]}>
          <Popup>
            <b>lat:</b> {center.lat} <br />
            <b>lng:</b> {center.lng} <br />
          </Popup>
          <Tooltip direction="auto" offset={[0, 10]} opacity={1}>
            toolTip
          </Tooltip>
        </Marker> */}
        {this.renderPositions(positions)}
        <FullscreenControl position="topright" />
        <  ZoomControl />
      </Map>
    );
  }
}
export default MapView;