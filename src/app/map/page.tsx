'use client'

import GoogleMap from "../components/google-map/GoogleMap";

export default function Home() {
  // Thay đổi tọa độ ở đây để thử nghiệm
  const latitude = 10.8231;
  const longitude = 106.6297;

  return (
    <div>
      <h1>Test Google Maps Component</h1>
      <GoogleMap latitude={latitude} longitude={longitude} />
    </div>
  );
}
