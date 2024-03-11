import { IPost } from "@/types/types";
import {
  getDatabase,
  ref,
  set,
  get,
  query,
  remove,
  child,
  orderByChild,
  endBefore,
  limitToLast,
  update,
  increment,
} from "firebase/database";

export const postAPI = {
  addPost: async (newPost: IPost) => {
    const db = getDatabase();
    const timestampCreatedAt = newPost.createdAt.getTime();
    const timestampUpdatedAt = newPost.createdAt.getTime();

    const postWithTimestamp = {
      ...newPost,
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    };
    try {
      await set(ref(db, "posts/" + newPost.id), postWithTimestamp);
    } catch (error) {
      console.error(error);
    }
  },

  getPostList: async (pageParam: number) => {
    const dbRef = ref(getDatabase());
    const queryRef = query(
      child(dbRef, "posts"),
      orderByChild("createdAt"),
      endBefore(pageParam - 1),
      limitToLast(10)
    );
    try {
      const snapshot = await get(queryRef);
      const postsArray: IPost[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          postsArray.push(childSnapshot.val());
        });
        const fetchedPosts = Object.keys(snapshot.val());
        const nextPageParam =
          fetchedPosts.length < 10 ? null : postsArray[0].createdAt;

        const sortedArray = postsArray.reverse();
        return { sortedArray, nextPageParam };
      } else {
        return { sortedArray: [], nextPageParam: null };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getSinglePost: async (postId: string) => {
    const db = getDatabase();
    const postPath = `posts/${postId}`;
    const q = query(ref(db, postPath));

    try {
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const postsObject = snapshot.val();
        return postsObject;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  },

  updatePost: async (updatedPost: IPost) => {
    const { id } = updatedPost;
    const timestampUpdatedAt = updatedPost.updatedAt.getTime();
    const postWithTimestamp = {
      ...updatedPost,
      updatedAt: timestampUpdatedAt,
    };
    const db = getDatabase();
    try {
      await update(ref(db, `posts/${id}`), postWithTimestamp);
      return { postId: updatedPost.id };
    } catch (error) {
      console.error(error);
    }
  },

  deletePost: async (postId: string) => {
    const db = getDatabase();
    try {
      remove(ref(db, `posts/${postId}`));
      return { postId };
    } catch (error) {
      console.error(error);
    }
  },

  updatePostLikes: async (postId: string, newLikeCount: number) => {
    const db = getDatabase();
    try {
      await update(ref(db, `posts/${postId}`), {
        likeCount: newLikeCount,
      });
    } catch (error) {
      console.error(error);
    }
  },
  updatePostComments: async (postId: string, newCommentCount: number) => {
    const db = getDatabase();
    try {
      await update(ref(db, `posts/${postId}`), {
        commentCount: increment(newCommentCount),
      });
    } catch (error) {
      console.error(error);
    }
  },
};
