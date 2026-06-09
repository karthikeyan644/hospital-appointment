import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import authService from "../services/authService";

const AuthContext = createContext();

const BACKEND_URL = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize socket connection for logged in user
  const initSocket = (userData) => {
    if (!userData) return;
    
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(BACKEND_URL);
    
    newSocket.emit("join", userData.id);
    
    if (userData.role === "admin") {
      newSocket.emit("join", "admin");
    } else {
      newSocket.emit("join", "patient");
    }

    setSocket(newSocket);
  };

  // On mount: verify token with MongoDB via backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((userData) => {
        setUser(userData);
        initSocket(userData);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    initSocket(userData);
  };

  const logout = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        socket,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
