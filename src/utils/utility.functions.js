export const fetchElevation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`
      );
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        return data.results[0].elevation;
      } else {
        console.warn("No elevation data found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching elevation: ", error);
      return null; // Return null or a default value in case of error
    }
  };
  