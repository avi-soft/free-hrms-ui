export const fetchElevation = async (latitude, longitude) => {
  const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`);
  const textResponse = await response.text(); // Get the response as text
  console.log('Response:', textResponse); // Log the raw response to check it
  
  try {
    const data = JSON.parse(textResponse); // Parse the text as JSON
    if (data.results && data.results.length > 0) {
      return data.results[0].elevation;
    } else {
      console.warn("No elevation data found.");
      return null;
    }
  } catch (error) {
    console.error("Error parsing JSON:", error, textResponse); // Log error and response
    return null;
  }
  
  };
  