import TextareaAutosize from "react-textarea-autosize";
import { FaCamera } from "react-icons/fa";
import { MdOutlineGifBox } from "react-icons/md";
import useCommentForm from "@/hooks/useCommentForm";
import { useRef, useState } from "react";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { IComment } from "@/types/types";
import { HiOutlineXMark } from "react-icons/hi2";
import GifDialog from "./GifDialog";

interface CommentFormProps {
  postId: string;
  updateComment?: IComment;
  commentId?: string;
  setMode?: (isUpdateMode: boolean) => void;
}

const CommentForm = ({
  postId,
  updateComment,
  commentId,
  setMode,
}: CommentFormProps) => {
  const myId = localStorage.getItem("userId");

  const {
    commentForm,
    onSubmitComment,
    isLoading,
    imageURL,
    imageOnChangeHandler,
    handleDeleteImage,
  } = useCommentForm({
    updateComment,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = commentForm;

  const { ref, onChange, ...rest } = register("image");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const imageButtonHandler = () => {
    imageInputRef.current?.click();
  };

  const [isGifDialogOpen, setIsGifDialogOpen] = useState(false);

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          onSubmitComment(values, myId as string, postId, commentId as string)
        )}
        className="w-full border"
      >
        <TextareaAutosize
          className="w-full p-2 resize-none outline-none"
          placeholder="주제와 무관한 댓글, 악플은 삭제될 수 있습니다."
          minRows={3}
          maxRows={3}
          {...register("comment")}
        />
        {imageURL && (
          <div className="relative p-2 w-24 h-24">
            <img src={imageURL} />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="p-[2px] absolute top-1 right-0 z-10 bg-gray-200 rounded-full"
            >
              <HiOutlineXMark size={15} />
            </button>
          </div>
        )}
        {errors.content && (
          <p className="p-2 text-red-500">{errors.content.message}</p>
        )}
        <div className="border-t flex justify-between">
          <div className="p-3 flex space-x-3">
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={imageButtonHandler}
            >
              <span>
                <FaCamera />
              </span>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                ref={(e) => {
                  imageInputRef.current = e;
                }}
                onChange={(e) => {
                  onChange(e);
                  imageOnChangeHandler(e);
                }}
                {...rest}
              />

              <button type="button">사진</button>
            </div>
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => setIsGifDialogOpen(true)}
            >
              <span>
                <MdOutlineGifBox size={20} />
              </span>
              <button type="button">Gif</button>
            </div>
          </div>
          <div>
            <button
              type="button"
              className={`py-3 px-4 sm:px-6 bg-gray-200 ${
                setMode ? "" : "hidden"
              }`}
              onClick={() => setMode && setMode(false)}
            >
              취소
            </button>
            <button
              type="submit"
              className="py-3 px-4 sm:px-6 bg-gray-800 text-white"
            >
              등록
            </button>
          </div>
        </div>
      </form>
      <GifDialog
        isOpen={isGifDialogOpen}
        setIsOpen={setIsGifDialogOpen}
        postId={postId}
        commentId={commentId as string}
      />
      <LoadingSpinner isLoading={isLoading} text="댓글 등록중..." />
    </>
  );
};

export default CommentForm;
