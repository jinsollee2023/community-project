import { likeAPI } from "@/lib/api/likeAPI";
import { useQuery } from "@tanstack/react-query";

interface useCommentLikesQueries {
  commentId: string;
  userId: string;
}

const useCommentLikesQueries = ({
  commentId,
  userId,
}: useCommentLikesQueries) => {
  const {
    data: myCommentLikeData,
    isLoading: myCommentLikeDataIsLoading,
    isError: myCommentLikeDataIsError,
  } = useQuery({
    queryKey: ["like", commentId, userId],
    queryFn: async () => {
      try {
        const result = await likeAPI.getCommentLike(commentId, userId);
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!userId && !!commentId,
  });
  return {
    myCommentLikeData,
    myCommentLikeDataIsLoading,
    myCommentLikeDataIsError,
  };
};

export default useCommentLikesQueries;
