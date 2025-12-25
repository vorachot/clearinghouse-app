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
export async function me() {
  const response = await apiClient.get("/auth/me");

  return response;
}