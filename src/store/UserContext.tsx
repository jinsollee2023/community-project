import { IUser } from "@/types/types";
import React, { createContext, useState } from "react";

interface UserContextProps {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

const contextDefaultValues: UserContextProps = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext(contextDefaultValues);

export const useUser = () => React.useContext(UserContext);

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(contextDefaultValues.user);
  const contextValue: UserContextProps = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
