import { jwtDecode } from "jwt-decode"; 

interface TokenPayload {
  sub: string;
}

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.sub;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default getCurrentUserId;
