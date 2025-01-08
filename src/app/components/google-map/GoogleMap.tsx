import { useEffect, useRef, useState } from "react";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
}

const GoogleMap = ({ latitude, longitude }: GoogleMapProps) => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState("");

  // Hàm để tải Google Maps JavaScript API
  useEffect(() => {
    const loadMap = () => {
      const location = { lat: latitude, lng: longitude };

      // Tạo bản đồ và đánh dấu vị trí
      // const map = new google.maps.Map(mapRef.current, {
      //   center: location,
      //   zoom: 12,
      // });

      // new google.maps.Marker({
      //   position: location,
      //   map: map,
      // });
    };

    // if (!window.google) {
    //   const script = document.createElement("script");
    //   script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDntbME_T2qylFjJKsAofSigw1JlkWJIe0`;
    //   script.async = true;
    //   script.onload = loadMap;
    //   document.head.appendChild(script);
    // } else {
    //   loadMap();
    // }
  }, [latitude, longitude]);

  // Sử dụng Geocoding API để lấy địa chỉ từ tọa độ
  useEffect(() => {
    const apiKey = "AIzaSyDntbME_T2qylFjJKsAofSigw1JlkWJIe0";
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Không tìm thấy địa chỉ.");
        }
      })
      .catch((error) => console.error("Lỗi:", error));
  }, [latitude, longitude]);

  return (
    <div>
      <h2>Bản đồ Google Maps</h2>
      <div ref={mapRef} style={{ height: "500px", width: "100%" }} />
      <p>Địa chỉ: {address}</p>
    </div>
  );
};

export default GoogleMap;
