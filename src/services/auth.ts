const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const getToken = async (): Promise<string> => {
  const TEST_EMAIL = "petro2@gmail.com";
  const TEST_PASSWORD = "super-password";

  const response = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });

  if (!response.ok) throw new Error("Failed to get token");

  const data = await response.json();
  return data.token;
};
