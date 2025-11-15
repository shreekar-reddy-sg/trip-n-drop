/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

/**
 * Check if delivery is on traveler's route
 * @param {Object} pickup - Pickup coordinates {lat, lng}
 * @param {Object} delivery - Delivery coordinates {lat, lng}
 * @param {Object} journeyStart - Journey start coordinates {lat, lng}
 * @param {Object} journeyEnd - Journey end coordinates {lat, lng}
 * @param {number} radius - Maximum distance in km (default 1.5)
 * @returns {boolean} True if delivery is on route
 */
const isOnRoute = (pickup, delivery, journeyStart, journeyEnd, radius = 1.5) => {
  // Check if pickup is within radius of journey start
  const pickupDistance = calculateDistance(
    journeyStart.lat, journeyStart.lng,
    pickup.lat, pickup.lng
  );
  
  // Check if delivery is within radius of journey end
  const deliveryDistance = calculateDistance(
    journeyEnd.lat, journeyEnd.lng,
    delivery.lat, delivery.lng
  );
  
  return pickupDistance <= radius && deliveryDistance <= radius;
};

module.exports = { calculateDistance, isOnRoute };