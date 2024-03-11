import { likeAPI } from "@/lib/api/likeAPI";
import { useQuery } from "@tanstack/react-query";

interface useLikesQueriesProps {
  postId: string;
  userId: string;
}
const usePostLikesQueries = ({ postId, userId }: useLikesQueriesProps) => {
  const {
    data: myPostLikeData,
    isLoading: myPostLikeDataIsLoading,
    isError: myPostLikeDataIsError,
  } = useQuery({
    queryKey: ["like", postId, userId],
    queryFn: async () => {
      try {
        return await likeAPI.getPostLike(postId, userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!userId && !!postId,
  });
  return { myPostLikeData, myPostLikeDataIsLoading, myPostLikeDataIsError };
};

export default usePostLikesQueries;
