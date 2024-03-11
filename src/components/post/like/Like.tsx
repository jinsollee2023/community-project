import useLikeMutations from "@/hooks/queries/like/useLikeMutations";
import usePostLikesQueries from "@/hooks/queries/like/usePostLikesQueries";
import { getKoreaTimeDate } from "@/shared/form/common";
import { ILike } from "@/types/types";
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { useMemo } from "react";
import useCommentLikesQueries from "@/hooks/queries/like/useCommentLikesQueries";

interface LikeProps {
  type: "POST" | "COMMENT";
  commentId?: string;
  likeCount: number;
}

const Like = ({ type, likeCount, commentId }: LikeProps) => {
  const location = useLocation();
  const postId = location.pathname.split("/").pop();
  const myId = localStorage.getItem("userId");

  const { myPostLikeData, myPostLikeDataIsLoading, myPostLikeDataIsError } =
    usePostLikesQueries({
      postId: postId as string,
      userId: myId as string,
    });
  const { myCommentLikeData } = useCommentLikesQueries({
    commentId: commentId as string,
    userId: myId as string,
  });

  const { postLikeMutation, commentLikeMutation } = useLikeMutations();

  const debouncedPostLike = useMemo(
    () =>
      _.debounce(() => {
        if (myPostLikeData) {
          postLikeMutation.mutate({
            type: "delete",
            likeData: myPostLikeData as ILike,
            newLikeCount: likeCount - 1,
          });
        } else if (!myPostLikeData) {
          const newLike: ILike = {
            id: uuidv4(),
            type: "POST",
            userId: myId as string,
            postId: postId,
            postId_userId: `${postId}_${myId}`,
            createdAt: getKoreaTimeDate(),
          };
          postLikeMutation.mutate({
            type: "add",
            newLike,
            newLikeCount: likeCount + 1,
          });
        }
      }, 200),
    [postLikeMutation, myPostLikeData, likeCount]
  );
  const debouncedCommentLike = useMemo(
    () =>
      _.debounce(() => {
        if (myCommentLikeData) {
          commentLikeMutation.mutate({
            type: "delete",
            postId: postId as string,
            likeData: myCommentLikeData as ILike,
          });
        } else if (!myCommentLikeData) {
          const newLike: ILike = {
            id: uuidv4(),
            type: "COMMENT",
            userId: myId as string,
            commentId,
            commentId_userId: `${commentId}_${myId}`,
            createdAt: getKoreaTimeDate(),
          };
          commentLikeMutation.mutate({
            type: "add",
            postId: postId as string,
            newLike,
          });
        }
      }, 200),
    [commentLikeMutation, myCommentLikeData, likeCount]
  );

  const likeButtonHandler = () => {
    if (type === "POST") {
      debouncedPostLike();
    } else if (type === "COMMENT") {
      debouncedCommentLike();
    }
  };

  return (
    <>
      {(myPostLikeDataIsLoading || myPostLikeDataIsError) && (
        <div className="text-sm border px-3 py-1">
          {myPostLikeDataIsLoading ? "로딩중..." : "Error"}
        </div>
      )}

      {type === "POST" && (
        <div
          className="px-3 py-1 flex items-center space-x-1 border cursor-pointer"
          onClick={likeButtonHandler}
        >
          <span>
            {myPostLikeData ? (
              <IoHeartSharp size={18} color="red" />
            ) : (
              <IoHeartOutline size={18} color="red" />
            )}
          </span>
          <span>{likeCount}</span>
        </div>
      )}

      {type === "COMMENT" && (
        <div className="flex items-center space-x-1">
          <span className="cursor-pointer" onClick={likeButtonHandler}>
            {myCommentLikeData ? (
              <IoHeartSharp size={18} color="red" />
            ) : (
              <IoHeartOutline size={18} color="red" />
            )}
          </span>
          <span>{likeCount}</span>
        </div>
      )}
    </>
  );
};

export default Like;
