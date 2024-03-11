import { IFollow } from "@/types/types";
import {
  getDatabase,
  ref,
  set,
  get,
  query,
  remove,
  child,
  orderByChild,
  equalTo,
} from "firebase/database";

export const followAPI = {
  getFollowerList: async (userId: string) => {
    const dbRef = ref(getDatabase());
    const queryRef = query(
      child(dbRef, "follows"),
      orderByChild("followingId"),
      equalTo(userId)
    );
    try {
      const snapshot = await get(queryRef);
      const followsArray: IFollow[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          followsArray.push(childSnapshot.val());
        });
      }
      return followsArray;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getFollowingList: async (userId: string) => {
    const dbRef = ref(getDatabase());
    const queryRef = query(
      child(dbRef, "follows"),
      orderByChild("followerId"),
      equalTo(userId)
    );
    try {
      const snapshot = await get(queryRef);
      const followsArray: IFollow[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          followsArray.push(childSnapshot.val());
        });
      }
      return followsArray;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  addFollow: async (newFollow: IFollow) => {
    const db = getDatabase();
    const timestampCreatedAt = newFollow.createdAt.getTime();
    const followWithTimestamp = {
      ...newFollow,
      createdAt: timestampCreatedAt,
    };
    try {
      await set(ref(db, "follows/" + newFollow.id), followWithTimestamp);
      return { followingId: newFollow.followingId };
    } catch (error) {
      console.error(error);
    }
  },

  deleteFollow: async (followId: string, followingId: string) => {
    const db = getDatabase();
    try {
      await remove(ref(db, `follows/${followId}`));
      return { followingId };
    } catch (error) {
      throw error;
    }
  },
};
