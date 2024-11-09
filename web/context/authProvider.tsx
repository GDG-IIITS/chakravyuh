"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { set } from "date-fns";

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
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { withCredentials: true }
        );
        const data = response.data;
        if (data.email) {
          setIsAuthenticated(true);
          setUser(data);
        }
        return;
      } catch (error) {
        console.error("User not authorized");
        return;
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      console.log("login response", response);
      const data = response.data;
      if (!data.email) {
        throw new Error("There was some error logging in");
      }

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

      setUser(data);
      router.push("/auth/login"); // Redirect after signup
      return response;
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        withCredentials: true, // Include cookies in the request
      });
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
