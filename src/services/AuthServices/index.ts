"use server";
import { envConfig } from "@/config/envConfig";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface UserData {
  username: string;
  password: string;
}

export const loginUser = async (payload: UserData) => {
  try {
    const res = await fetch(`${envConfig.baseApi}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.success) {
      (await cookies()).set("accessToken", data?.data?.accessToken);
      (await cookies()).set("refreashToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error) {
    console.log("Something went wrong !", error);
  }
};

export const logOutUser = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreashToken");
};

export const accessToken = async () => {
  const accToken = (await cookies()).get("accessToken")?.value;
  return accToken;
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);
    return decodedToken;
  }

  return null;
};
