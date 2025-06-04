const API_AUTH_URL = import.meta.env.VITE_REACT_APP_AUTH_URL;

// export const getToken = async () => {
//   const res = await fetch(`${API_AUTH_URL}/v2/get-token`, {
//     method: "POST",
//     headers: {
//       "X-API-KEY": VIDEOSDK_API_KEY,
//       Accept: "application/json",
//     },
//   });

//   const { token } = await res.json();
//   return token;

// };

export const createMeeting = async () => {
  try {
    const url = `${API_AUTH_URL}/v2/rooms`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: import.meta.env.VITE_VIDEOSDK_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to create meeting");

    return data.roomId;
  } catch (error) {
    console.error("createMeeting error:", error.message);
    return null;
  }
};

export const validateMeeting = async ({ roomId }) => {
  try {
    const url = `${API_AUTH_URL}/v2/rooms/validate/${roomId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: import.meta.env.VITE_VIDEOSDK_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Invalid meeting");

    return result.roomId === roomId;
  } catch (error) {
    console.error("validateMeeting error:", error.message);
    return false;
  }
};

