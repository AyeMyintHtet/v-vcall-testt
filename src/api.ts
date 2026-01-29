const API_BASE_URL = "https://api.videosdk.live";
const VIDEOSDK_TOKEN = import.meta.env.VITE_VIDEOSDK_TOKEN;

export const getToken = async (): Promise<string | undefined> => {
  if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  }

  console.error("Error: ", Error("Please add a token or Auth Server URL"));
  return undefined;
};

export const createMeeting = async ({ token }: { token: string }): Promise<string> => {
  const url = `${API_BASE_URL}/v2/rooms`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const { roomId } = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.error("error", error));

  return roomId;
};

export const validateMeeting = async ({ roomId, token }: { roomId: string; token: string }): Promise<boolean> => {
  const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const result = await fetch(url, options)
    .then((response) => response.json()) //result will have meeting id
    .catch((error) => console.error("error", error));

  return result ? result.roomId === roomId : false;
};
