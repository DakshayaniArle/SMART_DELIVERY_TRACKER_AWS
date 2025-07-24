const fetch = require("node-fetch");
const getCoordinates = async (location, apiKey) => {
  const res = await fetch(
    `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(location)}`
  );
  const data = await res.json();
  console.log(data);

  if (!data?.features || data?.features?.length === 0) {
    throw new Error(`Location "${location}" not found.`);
  }

  return data.features[0].geometry.coordinates; // [lng, lat]
};

const getDistanceAndTime = async (from, to, apiKey) => {
  const [fromLng, fromLat] = await getCoordinates(from, apiKey);
  const [toLng, toLat] = await getCoordinates(to, apiKey);
  console.log("🧭 From:", [fromLng, fromLat]);
  console.log("🧭 To:", [toLng, toLat]);


  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        coordinates: [
          [fromLng, fromLat],
          [toLng, toLat]
        ]
      })
    }
  );

  const data = await res.json();
  console.log(data);
  const segment = data.routes[0].segments[0];
//   console.log(segment);

  return {
    distanceKm: segment.distance / 1000,
    durationMin: segment.duration / 60
  };
};

module.exports = { getCoordinates, getDistanceAndTime };
