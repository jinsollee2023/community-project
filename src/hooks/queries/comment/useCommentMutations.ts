import commentAPI from "@/lib/api/commentAPI";
import { postAPI } from "@/lib/api/postAPI";
import { storageAPI } from "@/lib/api/storageAPI";
import { IComment, IInfiniteData } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCommentMutations = () => {
  const queryClient = useQueryClient();
  const addCommentMutation = useMutation({
    mutationFn: async ({
      newComment,
      commentCount,
    }: {
      newComment: IComment;
      commentCount: number;
    }) => {
      try {
        if (newComment.commentId_createdAt) {
          await commentAPI.updateCommentReplyCount(
            newComment.commentId_createdAt,
            1
          );
        }
        await postAPI.updatePostComments(newComment.postId, commentCount);
        if (newComment.image instanceof File) {
          const imageURL = await storageAPI.uploadCommentImage(
            newComment.id,
            newComment.image
          );
          newComment.image = imageURL;
        }
        return await commentAPI.addComment(newComment);
      } catch (error) {
        console.error(error);
      }
    },
    onMutate: async (value) => {
      const previousComments: IInfiniteData<IComment> | undefined =
        queryClient.getQueryData(["commentList", value.newComment.postId]);
      if (previousComments) {
        await queryClient.cancelQueries({
          queryKey: ["commentList", value.newComment.postId],
        });
        queryClient.setQueryData(
          ["commentList", value.newComment.postId],
          (old: IInfiniteData<IComment>) => {
            const newData = old?.pages.map((page, idx) => {
              if (idx === 0) {
                return (page.sortedArray = [
                  ...(page.sortedArray as IComment[]),
                  value.newComment,
                ]);
              } else return;
            });
            return {
              ...old,
              pages: newData,
            };
          }
        );
      }
      return { previousComments };
    },
    onError: (error, value, context) => {
      queryClient.setQueryData(
        ["commentList", value.newComment.postId],
        context?.previousComments
      );
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["commentList", value?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["postList", value?.postId],
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      commentId,
      basedCommentId,
      commentCount,
    }: {
      postId: string;
      commentId: string;
      basedCommentId: string;
      commentCount: number;
    }) => {
      try {
        if (basedCommentId) {
          await commentAPI.updateCommentReplyCount(basedCommentId, -1);
        }
        await postAPI.updatePostComments(postId, commentCount);
        const result = await commentAPI.deleteComment(commentId);
        return { result, postId };
      } catch (error) {
        console.error(error);
      }
    },
    onMutate: async (value) => {
      const previousComments: IInfiniteData<IComment> | undefined =
        queryClient.getQueryData(["commentList", value.postId]);
      if (previousComments) {
        await queryClient.cancelQueries({
          queryKey: ["commentList", value.postId],
        });
        queryClient.setQueryData(
          ["commentList", value.postId],
          (old: IInfiniteData<IComment>) => {
            const newData = old?.pages.map((page) => {
              page.sortedArray.filter((item) => item.id !== value.commentId);
            });
            return {
              ...old,
              pages: newData,
            };
          }
        );
      }
      return { previousComments, postId: value.postId };
    },
    onError: (error, value, context) => {
      queryClient.setQueryData(
        ["commentList", value.postId],
        context?.previousComments
      );
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["commentList", value?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["postList", value?.postId],
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ updatedComment }: { updatedComment: IComment }) => {
      try {
        if (updatedComment.image instanceof File) {
          const imageURL = await storageAPI.uploadCommentImage(
            updatedComment.id,
            updatedComment.image
          );
          updatedComment.image = imageURL;
        }
        return await commentAPI.updateComment(updatedComment);
      } catch (error) {
        console.error(error);
      }
    },
    onMutate: async (value) => {
      const previousComments: IInfiniteData<IComment> | undefined =
        queryClient.getQueryData(["commentList", value.updatedComment.postId]);
      if (previousComments) {
        await queryClient.cancelQueries({
          queryKey: ["commentList", value.updatedComment.postId],
        });
        queryClient.setQueryData(
          ["commentList", value.updatedComment.postId],
          (old: IInfiniteData<IComment>) => {
            const newData = old?.pages.map((page) => {
              page.sortedArray.map((item) => {
                if (item.id === value.updatedComment.id) {
                  return item;
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
      return { previousComments };
    },
    onError: (error, value, context) => {
      queryClient.setQueryData(
        ["commentList", value.updatedComment.postId],
        context?.previousComments
      );
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["commentList", value?.postId],
      });
    },
  });
  return { addCommentMutation, deleteCommentMutation, updateCommentMutation };
};

export default useCommentMutations;
