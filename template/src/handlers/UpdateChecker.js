// src/handlers/UpdateChecker.js
const pkg = require("../../package.json");

module.exports = class UpdateChecker {
  static async checkVersionWithResult() {
    try {
      const res = await fetch("https://api.github.com/repos/omar00050/quran_radio/tags");
      if (!res.ok) {
        return { success: false, error: "Failed to fetch tags" };
      }

      const json = await res.json();
      const latest = json[0].name.split(".").map(Number);
      const current = pkg.version.split(".").map(Number);

      const updateAvailable =
        latest[0] > current[0] ||
        (latest[0] === current[0] && latest[1] > current[1]) ||
        (latest[0] === current[0] && latest[1] === current[1] && latest[2] > current[2]);

      return {
        success: true,
        latest: json[0].name,
        current: pkg.version,
        updateAvailable,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
