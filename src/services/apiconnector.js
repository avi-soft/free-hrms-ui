import axios from "axios";

export const axiosInstance = axios.create({

});

export const apiConnector = async (method, url, bodyData = null, headers = null, params = null) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params,
    });
    return response;
  } catch (error) {
    console.error(`Error in apiConnector: ${error}`);
    throw error;
  }
};
