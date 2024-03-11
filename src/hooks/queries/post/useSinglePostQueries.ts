import { postAPI } from "@/lib/api/postAPI";
import { useQuery } from "@tanstack/react-query";

interface useSinglePostQueriesProps {
  postId: string;
}

const useSinglePostQueries = ({ postId }: useSinglePostQueriesProps) => {
  const {
    data: singlePostData,
    isLoading: singlePostIsLoading,
    isError: singlePostIsError,
  } = useQuery({
    queryKey: ["postList", postId],
    queryFn: async () => {
      try {
        return await postAPI.getSinglePost(postId);
      } catch (error) {
        throw error;
      }
    },
    enabled: !!postId,
    staleTime: 0,
    gcTime: 0,
  });
  return { singlePostData, singlePostIsLoading, singlePostIsError };
};

export default useSinglePostQueries;
