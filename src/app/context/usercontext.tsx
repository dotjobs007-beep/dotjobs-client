"use client";
import { IUser} from "@/interface/interface";
import { createContext, useContext, useState } from "react";

interface UserContextType {
    userDetails: IUser | null;
    setUserDetails: (value: IUser | null) => void;
    userQuery: string;
    setUserQuery: (value: string) => void;
}


const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [userQuery, setUserQuery] = useState<string>("");

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, userQuery, setUserQuery }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}