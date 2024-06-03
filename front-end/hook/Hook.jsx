// Make API request to authenticate user and retrieve token
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const username = Cookies.get("username");

export const verifyToken = async (token, TestTokenUrl) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }; // Add your axios configuration here if needed
    const url = `${process.env.NEXT_PUBLIC_DB_HOST}${TestTokenUrl}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
    });
    if (!response.ok) {
    }

    // Parse the JSON response directly and return it
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Verification failed:", error);
    throw error; // Rethrow the error for handling elsewhere if needed
  }
};

export async function getData(serviceURL) {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}`, UserName: username },
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

export function asyncGetData(serviceURL) {
  const url = `${process.env.NEXT_PUBLIC_DB_HOST}${serviceURL}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      UserName: username,
      // ...config.headers,
    },
  });
}

export async function getDataById(serviceURL, id) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_DB_HOST}${serviceURL}/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: config.headers,
    });

    if (!response.ok) {
      // Xử lý các trường hợp lỗi
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    // Parse JSON response và trả về dữ liệu
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Xử lý lỗi
    console.error("Put data failed:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
  }
}

export async function postData(serviceURL, data) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        UserName: username,
      },
    };
    const url = `${process.env.NEXT_PUBLIC_DB_HOST}${serviceURL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...config.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Xử lý các trường hợp lỗi
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    // Parse JSON response và trả về dữ liệu
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Xử lý lỗi
    console.error("Post data failed:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
  }
}
export async function putData(serviceURL, id, data) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        UserName: username,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_DB_HOST}${serviceURL}/${id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: config.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Xử lý các trường hợp lỗi
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    // Parse JSON response và trả về dữ liệu
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Xử lý lỗi
    console.error("Put data failed:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
  }
}
export async function deleteData(serviceURL, id) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        UserName: username,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_DB_HOST}${serviceURL}/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: config.headers,
    });

    if (!response.ok) {
      // Xử lý các trường hợp lỗi
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    // Parse JSON response và trả về dữ liệu
    const responseData = await response.text();
    return responseData;
  } catch (error) {
    // Xử lý lỗi
    console.error("Put data failed:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
  }
}

export function asyncFetch(method, url, data) {
  if (data) {
    return fetch(`${process.env.NEXT_PUBLIC_DB_HOST}${url}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        UserName: username,
      },
      body: JSON.stringify(data),
    });
  }
  else {
    return fetch(`${process.env.NEXT_PUBLIC_DB_HOST}${url}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        UserName: username,
      },
    });
  }
}
