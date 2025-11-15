/**
 * Calculate distance between two coordinates using Haversine formula
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
 * Calculate perpendicular distance from a point to a line segment
 * @param {Object} point - Point coordinates {lat, lng}
 * @param {Object} lineStart - Line start coordinates {lat, lng}
 * @param {Object} lineEnd - Line end coordinates {lat, lng}
 * @returns {number} Distance in kilometers
 */
const perpendicularDistance = (point, lineStart, lineEnd) => {
  const x = point.lat;
  const y = point.lng;
  const x1 = lineStart.lat;
  const y1 = lineStart.lng;
  const x2 = lineEnd.lat;
  const y2 = lineEnd.lng;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return calculateDistance(x, y, xx, yy);
};

/**
 * Check if delivery points are along the traveler's route
 * IMPROVED: Now checks if points are near the route line, not just endpoints
 * @param {Object} pickup - Pickup coordinates {lat, lng}
 * @param {Object} delivery - Delivery coordinates {lat, lng}
 * @param {Object} journeyStart - Journey start coordinates {lat, lng}
 * @param {Object} journeyEnd - Journey end coordinates {lat, lng}
 * @param {number} radius - Maximum distance in km (default 1.5)
 * @returns {boolean} True if delivery is on route
 */
const isOnRoute = (pickup, delivery, journeyStart, journeyEnd, radius = 1.5) => {
  // Calculate distance from pickup point to traveler's route line
  const pickupToRoute = perpendicularDistance(pickup, journeyStart, journeyEnd);
  
  // Calculate distance from delivery point to traveler's route line
  const deliveryToRoute = perpendicularDistance(delivery, journeyStart, journeyEnd);
  
  // Both pickup and delivery should be within radius of the route
  const pickupNearRoute = pickupToRoute <= radius;
  const deliveryNearRoute = deliveryToRoute <= radius;

  // Additional check: Pickup should be before delivery along the route
  const pickupToStart = calculateDistance(journeyStart.lat, journeyStart.lng, pickup.lat, pickup.lng);
  const deliveryToStart = calculateDistance(journeyStart.lat, journeyStart.lng, delivery.lat, delivery.lng);
  const pickupBeforeDelivery = pickupToStart <= deliveryToStart;

  return pickupNearRoute && deliveryNearRoute && pickupBeforeDelivery;
};

/**
 * Enhanced route matching with more flexible criteria
 * This allows matching even if the route only partially overlaps
 */
const isOnRouteFlexible = (pickup, delivery, journeyStart, journeyEnd, radius = 2.0) => {
  // Option 1: Standard perpendicular distance check
  const pickupToRoute = perpendicularDistance(pickup, journeyStart, journeyEnd);
  const deliveryToRoute = perpendicularDistance(delivery, journeyStart, journeyEnd);
  
  if (pickupToRoute <= radius && deliveryToRoute <= radius) {
    return true;
  }

  // Option 2: Check if either point is near journey start or end
  const pickupToStart = calculateDistance(journeyStart.lat, journeyStart.lng, pickup.lat, pickup.lng);
  const pickupToEnd = calculateDistance(journeyEnd.lat, journeyEnd.lng, pickup.lat, pickup.lng);
  const deliveryToStart = calculateDistance(journeyStart.lat, journeyStart.lng, delivery.lat, delivery.lng);
  const deliveryToEnd = calculateDistance(journeyEnd.lat, journeyEnd.lng, delivery.lat, delivery.lng);

  // Match if pickup is near start and delivery is near end
  if (pickupToStart <= radius && deliveryToEnd <= radius) {
    return true;
  }

  // Match if pickup is near start and delivery is somewhere along the route
  if (pickupToStart <= radius && deliveryToRoute <= radius) {
    return true;
  }

  // Match if pickup is along route and delivery is near end
  if (pickupToRoute <= radius && deliveryToEnd <= radius) {
    return true;
  }

  return false;
};

module.exports = { 
  calculateDistance, 
  isOnRoute, 
  isOnRouteFlexible,
  perpendicularDistance 
};
