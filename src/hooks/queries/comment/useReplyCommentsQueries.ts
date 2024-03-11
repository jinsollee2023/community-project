import commentAPI from "@/lib/api/commentAPI";
import { IComment, IInfinitePages } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useReplyCommentsQueriesProps {
  commentId: string;
}

const useReplyCommentsQueries = ({
  commentId,
}: useReplyCommentsQueriesProps) => {
  const {
    fetchNextPage: fetchNextReplyCommentPage,
    hasNextPage: hasNextReplyCommentPage,
    isFetchingNextPage: isFetchingNextReplyCommentPage,
    data: replyCommentData,
    isLoading: replyCommentDataIsLoading,
    isError: replyCommentDataIsError,
  } = useInfiniteQuery({
    queryKey: ["replyCommentList", commentId],
    queryFn: async ({ pageParam }) => {
      const result = await commentAPI.getReplyCommentList(
        pageParam as number,
        commentId
      );
      return result as IInfinitePages<IComment>;
    },
    initialPageParam: 999999999999,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam ?? undefined,
    enabled: !!commentId,
    staleTime: 0,
    gcTime: 0,
  });
  return {
    fetchNextReplyCommentPage,
    hasNextReplyCommentPage,
    isFetchingNextReplyCommentPage,
    replyCommentData,
    replyCommentDataIsLoading,
    replyCommentDataIsError,
  };
};

export default useReplyCommentsQueries;
