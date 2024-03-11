// Make API request to authenticate user and retrieve token
import axios from "axios";

export const verifyToken = async (token) => {
  try {
    const config = {
      Headers: { Authorization: `Bearer ${token}` },
    }; // Add your axios configuration here if needed
    const verifyToken = await axios.get(
      process.env.NEXT_PUBLIC_DB_HOST + "/auth/testToken",
      config
    );
    // Handle successful token verification
    return verifyToken.data; // Return data if needed
  } catch (error) {
    console.error("Verification failed:", error);
    throw error; // Rethrow the error for handling elsewhere if needed
  }
};
