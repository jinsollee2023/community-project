import { useMutation, InfiniteData } from "@tanstack/react-query";
import { queryClient } from "@/App";
import { IPost } from "@/types/types";
import { IFile } from "@/hooks/usePostForm";
import { useNavigate } from "react-router-dom";
import { storageAPI } from "@/lib/api/storageAPI";
import { postAPI } from "@/lib/api/postAPI";

interface usePostMutationProps {
  setIsLoading: (isLoading: boolean) => void;
}

const usePostMutation = ({ setIsLoading }: usePostMutationProps) => {
  const navigate = useNavigate();

  const addPostMutation = useMutation({
    mutationFn: async ({
      newPost,
      images,
      videos,
    }: {
      newPost: IPost;
      images: IFile[];
      videos: IFile[];
    }) => {
      const postFiles = [...images, ...videos];
      try {
        const fileUploadPromises = postFiles.map(async (file) => {
          const fileURL = await storageAPI.uploadPostFile(
            newPost.id,
            file.name!,
            file.file!
          );
          newPost.content = newPost.content.replace(file.previewURL, fileURL);
        });
        await Promise.all(fileUploadPromises);
        return await postAPI.addPost(newPost);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    onMutate: async (value) => {
      const previousPosts: InfiniteData<IPost[]> | undefined =
        queryClient.getQueryData(["postList"]);

      if (previousPosts) {
        await queryClient.cancelQueries({
          queryKey: ["postList"],
        });
        queryClient.setQueryData(["postList"], (old: InfiniteData<IPost[]>) => {
          return {
            ...old,
            pages: [...old.pages, value.newPost],
          };
        });
      }
      return { previousPosts };
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["postList"], context?.previousPosts);
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["postList"],
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      try {
        await storageAPI.deletePostFiles(postId);
        return await postAPI.deletePost(postId);
      } catch (error) {
        console.error(error);
      }
    },
    onMutate: async (value) => {
      await queryClient.cancelQueries({
        queryKey: ["postList", value.postId],
      });
      const previousPost: InfiniteData<IPost[]> | undefined =
        queryClient.getQueryData(["postList", value.postId]);
      queryClient.setQueryData(["postList", value.postId], undefined);
      return { previousPost };
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error, value, context) => {
      queryClient.setQueryData(
        ["postList", value.postId],
        context?.previousPost
      );
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["postList", value?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["postList"],
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({
      updatedPost,
      images,
      videos,
    }: {
      updatedPost: IPost;
      images: IFile[];
      videos: IFile[];
    }) => {
      const postFiles = [...images, ...videos];
      try {
        const storageFiles = await storageAPI.getPostFiles(updatedPost.id);
        const deletedFileNames = storageFiles.filter(
          (fileName) => !postFiles.some((file) => file.name === fileName)
        );

        if (deletedFileNames.length) {
          const deletedFilePromises = deletedFileNames.map(async (fileName) => {
            await storageAPI.deleteSinglePostFile(updatedPost.id, fileName);
          });
          await Promise.all(deletedFilePromises);
        }

        const fileUploadPromises = postFiles.map(async (file) => {
          if (file.file) {
            const fileURL = await storageAPI.uploadPostFile(
              updatedPost.id,
              file.name!,
              file.file!
            );
            updatedPost.content = updatedPost.content.replace(
              file.previewURL,
              fileURL
            );
          }
        });
        await Promise.all(fileUploadPromises);
        return await postAPI.updatePost(updatedPost);
      } catch (error) {
        console.error(error);
      }
    },
    onMutate: async (value) => {
      await queryClient.cancelQueries({
        queryKey: ["postList", value.updatedPost.id],
      });
      const previousPost: InfiniteData<IPost[]> | undefined =
        queryClient.getQueryData(["postList", value.updatedPost.id]);
      queryClient.setQueryData(
        ["postList", value.updatedPost.id],
        value.updatedPost
      );
      return { previousPost };
    },
    onSuccess: (data: { postId: string } | undefined) => {
      navigate(`/post/${data?.postId}`);
      setIsLoading(false);
    },
    onError: (error, value, context) => {
      queryClient.setQueryData(
        ["postList", value.updatedPost.id],
        context?.previousPost
      );
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["postList", value?.postId],
      });
    },
  });
  return { addPostMutation, deletePostMutation, updatePostMutation };
};

export default usePostMutation;
