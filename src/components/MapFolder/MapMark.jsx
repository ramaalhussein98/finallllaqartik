import React from "react";
import MapCreate from "./MapCreate";

const MapMark = ({
  mapData,
  state,
  isBoxVisible,
  setBoxVisible,
  setSelectedAd,
  setLatZoom,
  setLngZoom,
  setMapZoom,
}) => {
  // const locations = [
  //   { latitude: 24.7136, longitude: 46.6753, price: "100" },
  //   { latitude: 26.3174, longitude: 43.7759, price: "20000" },
  //   { latitude: 21.4858, longitude: 39.1925, price: "300" },
  //   { latitude: 21.4225, longitude: 39.8262, price: "400" },
  //   { latitude: 21.2703, longitude: 40.4159, price: "500" },
  // ];

  return (
    <div style={{ height: "100vh" }}>
      <MapCreate
        locations={mapData}
        setMapZoom={setMapZoom}
        state={state}
        isBoxVisible={isBoxVisible}
        setBoxVisible={setBoxVisible}
        setSelectedAd={setSelectedAd}
        setLatZoom={setLatZoom}
        setLngZoom={setLngZoom}
      />
    </div>
  );
};

export default MapMark;
