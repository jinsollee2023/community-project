import { postAPI } from "@/lib/api/postAPI";
import { getKoreaTimeDate } from "@/shared/form/common";
import { IInfinitePages, IPost } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const usePostsQueries = () => {
  const {
    fetchNextPage: fetchNextAllPostPage,
    hasNextPage: hasNextAllPostPage,
    isFetchingNextPage: isFetchingNextAllPostPage,
    data: allPostData,
    isLoading: allPostDataIsLoading,
    isError: allPostDataIsError,
  } = useInfiniteQuery<IInfinitePages<IPost>>({
    queryKey: ["postList"],
    queryFn: async ({ pageParam }) => {
      const result = await postAPI.getPostList(pageParam as number);
      return result as IInfinitePages<IPost>;
    },
    initialPageParam: getKoreaTimeDate().getTime(),
    getNextPageParam: (lastPage) => lastPage?.nextPageParam ?? undefined,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    allPostData,
    allPostDataIsLoading,
    allPostDataIsError,
    fetchNextAllPostPage,
    hasNextAllPostPage,
    isFetchingNextAllPostPage,
  };
};

export default usePostsQueries;
