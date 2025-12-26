import apiClient from "@/utils/apiClient";

export async function googleAuthWithCH(queryString: string): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CLEARINGHOUSE_URL}/auth/callback/google?${queryString}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return response;
}
export async function logoutUser() {
  const response = await apiClient.get("/auth/logout");

  // Optionally redirect to login page after successful logout
  if (response.status === 200) {
    window.location.href = "/login";
  }

  return response;
}
export async function me() {
  const response = await apiClient.get("/auth/me");

  return response;
}