import commentAPI from "@/lib/api/commentAPI";
import { IComment, IInfinitePages } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useCommentsQueriesProps {
  postId: string;
}

const useCommentsQueries = ({ postId }: useCommentsQueriesProps) => {
  const {
    fetchNextPage: fetchNextAllCommentPage,
    hasNextPage: hasNextAllCommentPage,
    isFetchingNextPage: isFetchingNextAllCommentPage,
    data: allCommentData,
    isLoading: allCommentDataIsLoading,
    isError: allCommentDataIsError,
  } = useInfiniteQuery({
    queryKey: ["commentList", postId],
    queryFn: async ({ pageParam }) => {
      const result = await commentAPI.getCommentList(
        pageParam as number,
        postId
      );
      return result as IInfinitePages<IComment>;
    },
    initialPageParam: 999999999999,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam ?? undefined,
    enabled: !!postId,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    fetchNextAllCommentPage,
    hasNextAllCommentPage,
    isFetchingNextAllCommentPage,
    allCommentData,
    allCommentDataIsLoading,
    allCommentDataIsError,
  };
};

export default useCommentsQueries;
