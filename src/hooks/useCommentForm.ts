import { commentFormSchema } from "@/shared/form/formValidation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IComment } from "@/types/types";
import { v4 as uuidv4 } from "uuid";
import { getKoreaTimeDate } from "@/shared/form/common";
import useCommentMutations from "./queries/comment/useCommentMutations";
import { ChangeEvent, useEffect, useState } from "react";
import { storageAPI } from "@/lib/api/storageAPI";
import Resizer from "react-image-file-resizer";

interface useCommentFormProps {
  updateComment: IComment | undefined;
}

const useCommentForm = ({ updateComment }: useCommentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");

  type commentFormData = z.infer<typeof commentFormSchema> & {
    content?: string;
  };
  const commentForm = useForm<commentFormData>({
    resolver: zodResolver(commentFormSchema),
  });

  useEffect(() => {
    const setFormValues = async () => {
      setIsLoading(true);
      if (updateComment) {
        const { comment, image } = updateComment;
        commentForm.setValue("comment", comment);
        if (image) {
          commentForm.setValue("image", updateComment.image);
          setImageURL(image as string);
        }
      }
      setIsLoading(false);
    };
    updateComment && setFormValues();
  }, [updateComment]);

  const { addCommentMutation, updateCommentMutation } = useCommentMutations();
  const onSubmitComment = (
    values: z.infer<typeof commentFormSchema>,
    userId: string,
    postId: string,
    commentId: string
  ) => {
    console.log(values);
    const newComment: IComment = {
      id: uuidv4(),
      userId,
      postId,
      comment: values.comment as string,
      image: values.image ? values.image : "",
      likeCount: 0,
      replyCount: 0,
      postId_createdAt: "",
      createdAt: getKoreaTimeDate(),
      updatedAt: getKoreaTimeDate(),
    };
    if (!updateComment && !commentId) {
      addCommentMutation.mutate({ newComment, commentCount: 1 });
    } else if (commentId) {
      addCommentMutation.mutate({
        newComment: { ...newComment, commentId_createdAt: commentId },
        commentCount: 1,
      });
    } else if (updateComment) {
      const updatedComment: IComment = {
        id: updateComment.id,
        userId: updateComment.userId,
        postId: updateComment.postId,
        comment: values.comment as string,
        image: values.image ? values.image : "",
        likeCount: updateComment.likeCount,
        replyCount: updateComment.likeCount,
        postId_createdAt: updateComment.postId_createdAt,
        createdAt: updateComment.createdAt,
        updatedAt: getKoreaTimeDate(),
      };
      if (updateComment.image && updateComment.image !== updatedComment.image) {
        storageAPI.deleteCommentImage(updateComment.id);
      }
      updateCommentMutation.mutate({ updatedComment });
    }
    commentForm.reset();
    setImageURL("");
  };

  const resizeFile = (file: File) =>
    new Promise((res) => {
      Resizer.imageFileResizer(
        file,
        1500,
        1500,
        "JPEG",
        80,
        0,
        (uri) => res(uri),
        "file"
      );
    });
  const imageOnChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    const previewImageUrl = URL.createObjectURL(file as File);
    setImageURL(previewImageUrl);
    const resizedFile = await resizeFile(file as File);
    commentForm.setValue("image", resizedFile as File);
  };
  const handleDeleteImage = () => {
    setImageURL("");
    commentForm.setValue("image", undefined);
  };

  return {
    commentForm,
    onSubmitComment,
    isLoading,
    imageURL,
    imageOnChangeHandler,
    handleDeleteImage,
  };
};

export default useCommentForm;
