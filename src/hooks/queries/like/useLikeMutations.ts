import commentAPI from "@/lib/api/commentAPI";
import { likeAPI } from "@/lib/api/likeAPI";
import { postAPI } from "@/lib/api/postAPI";
import { IComment, IInfinitePages, ILike, IPost } from "@/types/types";
import {
  useMutation,
  InfiniteData,
  useQueryClient,
} from "@tanstack/react-query";

const useLikeMutations = () => {
  const queryClient = useQueryClient();
  const postLikeMutation = useMutation({
    mutationFn: async ({
      type,
      newLike,
      likeData,
      newLikeCount,
    }: {
      type: "add" | "delete";
      newLike?: ILike;
      likeData?: ILike;
      newLikeCount: number;
    }) => {
      if (type === "add") {
        await postAPI.updatePostLikes(newLike?.postId as string, newLikeCount);
        return await likeAPI.addLike(newLike as ILike);
      } else if (type === "delete") {
        await postAPI.updatePostLikes(likeData?.postId as string, newLikeCount);
        return await likeAPI.deleteLike(likeData as ILike);
      }
    },
    onMutate: async (value) => {
      const postId = value.newLike?.postId || value.likeData?.postId;
      const previousPost: InfiniteData<IPost[]> | undefined =
        queryClient.getQueryData(["postList", postId]);

      if (previousPost) {
        await queryClient.cancelQueries({
          queryKey: ["postList", postId],
        });

        queryClient.setQueryData(
          ["postList", postId],
          (old: InfiniteData<IPost[]>) => {
            return {
              ...old,
              pages: { ...old.pages, likeCount: value.newLikeCount },
            };
          }
        );
      }
      return { previousPost };
    },
    onError: (error, value, context) => {
      const postId = value.newLike?.postId || value.likeData?.postId;
      queryClient.setQueryData(["postList", postId], context?.previousPost);
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["like", value?.postId, value?.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["postList", value?.postId],
      });
    },
  });

  const commentLikeMutation = useMutation({
    mutationFn: async ({
      type,
      postId,
      newLike,
      likeData,
    }: {
      type: "add" | "delete";
      postId: string;
      newLike?: ILike;
      likeData?: ILike;
    }) => {
      if (type === "add") {
        await commentAPI.updateCommentLikes(newLike?.commentId as string, 1);
        const result = await likeAPI.addLike(newLike as ILike);
        return { result, postId };
      } else if (type === "delete") {
        await commentAPI.updateCommentLikes(likeData?.commentId as string, -1);
        const result = await likeAPI.deleteLike(likeData as ILike);
        return { result, postId };
      }
    },
    onMutate: async (value) => {
      const commentId = value.newLike?.commentId || value.likeData?.commentId;
      const previousComment = queryClient.getQueryData([
        "commentList",
        value.postId,
      ]);

      if (previousComment) {
        await queryClient.cancelQueries({
          queryKey: ["commentList", value.postId],
        });

        queryClient.setQueryData(
          ["postList", value.postId],
          (old: InfiniteData<IInfinitePages<IComment>>) => {
            const newData = old?.pages?.map((page) => {
              page.sortedArray.map((item) => {
                if (item.id === commentId) {
                  if (value.type === "add") {
                    return { ...item, likeCount: item.likeCount + 1 };
                  } else if (value.type === "delete") {
                    return { ...item, likeCount: item.likeCount - 1 };
                  }
                } else return;
              });
            });
            return {
              ...old,
              pages: newData,
            };
          }
        );
      }
      return { previousComment };
    },
    onError: (error, value, context) => {
      queryClient.setQueryData(
        ["commentList", value.postId],
        context?.previousComment
      );
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["like", value?.result?.commentId, value?.result?.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentList", value?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["replyCommentList"],
      });
    },
  });
  return { postLikeMutation, commentLikeMutation };
};

export default useLikeMutations;
