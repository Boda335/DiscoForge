/**
 * Converts milliseconds to a human-readable duration string.
 * @param {number} ms - The duration in milliseconds.
 * @returns {string} - The human-readable duration string.
 */

function msToDuration(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let years = Math.floor(days / 365);
  let months = Math.floor((days % 365) / 30);
  days = (days % 365) % 30;

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  let parts = [];

  if (years) parts.push(`${years} Years`);
  if (months) parts.push(`${months} Months`);
  if (days) parts.push(`${days} Days`);
  if (hours) parts.push(`${hours} Hours`);
  if (minutes) parts.push(`${minutes} Minutes`);
  if (seconds) parts.push(`${seconds} Seconds`);

  if (parts.length === 0) return '0 Seconds';

  if (parts.length === 1) return parts[0];

  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
}

module.exports = msToDuration;
