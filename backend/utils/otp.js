/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Verify OTP
 * @param {string} inputOTP - OTP entered by user
 * @param {string} actualOTP - Actual OTP stored in database
 * @returns {boolean} True if OTP matches
 */
const verifyOTP = (inputOTP, actualOTP) => {
  return inputOTP === actualOTP;
};

module.exports = { generateOTP, verifyOTP };