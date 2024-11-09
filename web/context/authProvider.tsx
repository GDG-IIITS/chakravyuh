"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";

interface AuthContextType {
  user: { id: string; email: string; fullName: string } | null;
  login: (email: string, password: string) => Promise<AxiosResponse<any>>;
  signup: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<AxiosResponse<any>>;
  logout: () => void;
  isAuthenticated: boolean;
}

const defaultContext: AuthContextType = {
  user: null,
  login: async () => Promise.resolve({} as AxiosResponse<any>),
  signup: async () => Promise.resolve({} as AxiosResponse<any>),
  logout: () => {},
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("login reaches authprovider");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("login response", response);
      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);
      setIsAuthenticated(!!data);

      router.push("/admin"); // Redirect after login
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          email,
          password,
          fullName,
        }
      );

      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);
      router.push("/auth/login"); // Redirect after signup
      return response;
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/auth/login"); // Redirect after logout
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
