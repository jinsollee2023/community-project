import { IUser } from "@/types/types";
import { getDatabase, ref, set, get, child, update } from "firebase/database";
import axios from "axios";

export const userAPI = {
  addUserToDatabase: async (newUser: IUser, setUser: (user: IUser) => void) => {
    const db = getDatabase();
    const timestampCreatedAt = newUser.createdAt.getTime();
    const timestampUpdatedAt = newUser.updatedAt.getTime();
    const userWithTimestamp = {
      ...newUser,
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    };
    try {
      await set(ref(db, "users/" + newUser.id), userWithTimestamp);
      setUser(newUser);
      localStorage.setItem("userId", newUser.id);
      return { userId: newUser.id };
    } catch (error) {
      console.error(error);
    }
  },

  updateUserToDatabase: async (
    newUser: IUser,
    setUser: (user: IUser) => void
  ) => {
    const db = getDatabase();
    const timestampUpdatedAt = newUser.updatedAt.getTime();
    const userWithTimestamp = {
      ...newUser,
      updatedAt: timestampUpdatedAt,
    };
    try {
      await update(ref(db, "users/" + newUser.id), userWithTimestamp);
      setUser(newUser);
      return { userId: newUser.id };
    } catch (error) {
      console.error(error);
    }
  },

  getUserFromGoogle: async (accessToken: string) => {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getUserFromDatabase: async (userId: string) => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists()) {
        const user = snapshot.val();
        return user;
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getUserListData: async (userIds: string[]): Promise<IUser[] | null> => {
    try {
      const promises: Promise<IUser | null>[] = [];
      userIds.forEach((userId) => {
        promises.push(userAPI.getUserFromDatabase(userId));
      });
      const userDataArray = await Promise.all(promises);
      return userDataArray as IUser[];
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },

  getAllUser: async () => {
    const dbRef = ref(getDatabase());

    try {
      const snapshot = await get(child(dbRef, "users/"));
      if (snapshot.exists()) {
        const usersObject = snapshot.val();
        const usersArray: IUser[] = Object.values(usersObject);
        return usersArray;
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
