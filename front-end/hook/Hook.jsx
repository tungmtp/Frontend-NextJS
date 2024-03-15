// Make API request to authenticate user and retrieve token
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

export const verifyToken = async (token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }; // Add your axios configuration here if needed
    let data = null;
    const verifyToken = await axios
      .get(process.env.NEXT_PUBLIC_DB_HOST + "/auth/testToken", config)
      .then((response) => {
        data = response.data;
        // Store token in cookies
        //window.location.href = "/home";
      })
      .catch((err) => {
        console.log(err);
      });
    // Handle successful token verification
    return data; // Return data if needed
  } catch (error) {
    console.error("Verification failed:", error);
    throw error; // Rethrow the error for handling elsewhere if needed
  }
};

export async function getData(serviceURL) {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `${process.env.NEXT_PUBLIC_DB_HOST}${serviceURL}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
    });
    if (!response.ok) {
    }

    // Parse the JSON response directly and return it
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors
    console.error("Get productCategory failed:", error);
    throw error; // Rethrow the error for handling elsewhere if needed
  }
}
