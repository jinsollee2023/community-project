import { IComment } from "@/types/types";
import {
  getDatabase,
  ref,
  set,
  query,
  child,
  orderByChild,
  endBefore,
  limitToLast,
  get,
  startAt,
  update,
  remove,
  increment,
} from "firebase/database";

export const commentAPI = {
  addComment: async (newComment: IComment) => {
    const db = getDatabase();
    const timestampCreatedAt = newComment.createdAt.getTime();
    const timestampUpdatedAt = newComment.updatedAt.getTime();

    const commentWithTimestamp = {
      ...newComment,
      postId_createdAt: `${newComment.postId}_${timestampCreatedAt}`,
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    };

    const replyCommentWithTimestamp = {
      ...newComment,
      commentId_createdAt: `${newComment.commentId_createdAt}_${timestampCreatedAt}`,
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    };
    try {
      if (newComment.commentId_createdAt) {
        await set(
          ref(db, "comments/" + newComment.id),
          replyCommentWithTimestamp
        );
      } else {
        await set(ref(db, "comments/" + newComment.id), commentWithTimestamp);
      }
      return newComment;
    } catch (error) {
      console.error(error);
    }
  },

  getCommentList: async (pageParam: number, postId: string) => {
    const dbRef = ref(getDatabase());
    const queryRef = query(
      child(dbRef, "comments"),
      orderByChild("postId_createdAt"),
      startAt(postId),
      endBefore(`${postId}_${pageParam - 1}`),
      limitToLast(20)
    );
    try {
      const snapshot = await get(queryRef);
      const commentsArray: IComment[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          commentsArray.push(childSnapshot.val());
        });
        const fetchedComments = Object.keys(snapshot.val());
        const nextPageParam =
          fetchedComments.length < 20 ? null : commentsArray[0].createdAt;

        const sortedArray = commentsArray.reverse();
        return { sortedArray, nextPageParam };
      } else {
        return { sortedArray: [], nextPageParam: null };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  updateCommentLikes: async (commentId: string, likeCount: number) => {
    const db = getDatabase();
    try {
      await update(ref(db, `comments/${commentId}`), {
        likeCount: increment(likeCount),
      });
    } catch (error) {
      console.error(error);
    }
  },

  deleteComment: async (commentId: string) => {
    const db = getDatabase();

    try {
      await remove(ref(db, "comments/" + commentId));
      return commentId;
    } catch (error) {
      console.error(error);
    }
  },

  updateComment: async (updatedComment: IComment) => {
    const db = getDatabase();
    const timestampUpdatedAt = updatedComment.updatedAt.getTime();

    const commentWithTimestamp = {
      ...updatedComment,
      updatedAt: timestampUpdatedAt,
    };
    try {
      await update(
        ref(db, "comments/" + updatedComment.id),
        commentWithTimestamp
      );
      return updatedComment;
    } catch (error) {
      console.error(error);
    }
  },

  updateCommentReplyCount: async (commentId: string, commentCount: number) => {
    const db = getDatabase();
    try {
      await update(ref(db, `comments/${commentId}`), {
        replyCount: increment(commentCount),
      });
    } catch (error) {
      console.error(error);
    }
  },

  getReplyCommentList: async (pageParam: number, commentId: string) => {
    const dbRef = ref(getDatabase());
    const queryRef = query(
      child(dbRef, "comments"),
      orderByChild("commentId_createdAt"),
      startAt(commentId),
      endBefore(`${commentId}_${pageParam - 1}`),
      limitToLast(20)
    );
    try {
      const snapshot = await get(queryRef);
      const commentsArray: IComment[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          commentsArray.push(childSnapshot.val());
        });
        const fetchedComments = Object.keys(snapshot.val());
        const nextPageParam =
          fetchedComments.length < 20 ? null : commentsArray[0].createdAt;

        return { sortedArray: commentsArray, nextPageParam };
      } else {
        return { sortedArray: [], nextPageParam: null };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default commentAPI;
