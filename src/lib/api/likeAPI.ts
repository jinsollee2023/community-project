import { ILike } from "@/types/types";
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

export const likeAPI = {
  getPostLike: async (postId: string, userId: string) => {
    const dbRef = ref(getDatabase());
    const queryRef = query(
      child(dbRef, "likes"),
      orderByChild("postId_userId"),
      equalTo(`${postId}_${userId}`)
    );
    try {
      const snapshot = await get(queryRef);
      if (snapshot.exists()) {
        const likeObject = snapshot.val();
        const likeValue = Object.values(likeObject)[0];
        return likeValue;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  },

  getCommentLike: async (commentId: string, userId: string) => {
    const dbRef = ref(getDatabase());
    const queryRef = query(
      child(dbRef, "likes"),
      orderByChild("commentId_userId"),
      equalTo(`${commentId}_${userId}`)
    );
    try {
      const snapshot = await get(queryRef);
      if (snapshot.exists()) {
        const likeObject = snapshot.val();
        const likeValue = Object.values(likeObject)[0];
        return likeValue;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  },

  addLike: async (newLike: ILike) => {
    const db = getDatabase();
    const timestampCreatedAt = newLike.createdAt.getTime();
    const likeWithTimestamp = {
      ...newLike,
      createdAt: timestampCreatedAt,
    };
    try {
      await set(ref(db, "likes/" + newLike.id), likeWithTimestamp);
      return newLike;
    } catch (error) {
      console.error(error);
    }
  },

  deleteLike: async (likeData: ILike) => {
    const db = getDatabase();
    try {
      await remove(ref(db, `likes/${likeData?.id}`));
      return likeData;
    } catch (error) {
      throw error;
    }
  },
};
