"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState([]);
  const [registrEvent, setRegisterEvent] = useState([]);

  const router = useRouter();
  const pathname = usePathname();
  const hasFetchedUser = useRef(false);

  // const publicRoutes = ['/' ,"/signin",'/admin','/events'];

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/user");
      
      if (res.status === 401) {
        setUser(null);
        return;
      }

      if (!res.ok) throw new Error("Unexpected error while fetching user");

      const data = await res.json();
      setUser(data.user || null);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      setEvent(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvent([]);
    }
  };

  const handleLogin = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar.events",
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      localStorage.setItem("token", token);

      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token }),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          await fetchUser();
          setLoading(false);
          router.push( "/dashboard");
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error("Google login error:", err);
      }
    },
    onError: (err) => console.error("Google Login Failed", err),
  });

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Failed to logout");
        return;
      }

      localStorage.removeItem("token");
      setUser(null);
      router.push("/");
    } catch (error) {
      alert("An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();

    if (!hasFetchedUser.current) {
      hasFetchedUser.current = true;
      fetchUser();
    }
  }, [pathname]);
 
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        handleLogin,
        event,
        registrEvent,
        setRegisterEvent,
        handleLogout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
