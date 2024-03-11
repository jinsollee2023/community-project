import useUserQueries from "@/hooks/queries/user/useUserQueries";
import { getFormattedDate } from "@/shared/form/common";
import { IComment } from "@/types/types";
import Like from "../like/Like";
import useCommentMutations from "@/hooks/queries/comment/useCommentMutations";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import CommentForm from "./CommentForm";
import ReplyCommentList from "./ReplyCommentList";
import { storageAPI } from "@/lib/api/storageAPI";
import { EmojiVariationsList } from "@giphy/react-components";
import type { GifID } from "@giphy/js-types";
import { GiphyFetch } from "@giphy/js-fetch-api";
import ShowImageDialog from "./ShowImageDialog";

interface CommentCardProps {
  commentData: IComment;
  postUserId: string;
}

const CommentCard = ({ commentData, postUserId }: CommentCardProps) => {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [showImageOpen, setShowImageOpen] = useState(false);
  const myId = localStorage.getItem("userId");
  const {
    id,
    userId,
    postId,
    comment,
    image,
    gif,
    likeCount,
    replyCount,
    createdAt,
    commentId_createdAt,
  } = commentData || {};
  const { userData } = useUserQueries({
    userId,
  });
  const { nickname, profileImage } = userData || {};
  const { year, month, day, hours, minutes } = getFormattedDate(createdAt);

  const { toast } = useToast();
  const { deleteCommentMutation } = useCommentMutations();
  const deleteCommentButtonHandler = () => {
    if (myId === postUserId || myId === userId) {
      const basedCommentId = commentId_createdAt?.split("_")[0];
      if (image) {
        storageAPI.deleteCommentImage(id);
      }
      deleteCommentMutation.mutate({
        postId,
        commentId: id,
        basedCommentId: basedCommentId as string,
        commentCount: -(replyCount + 1),
      });
    } else {
      toast({
        variant: "destructive",
        title: "권한이 없습니다.",
        duration: 1000,
      });
    }
  };

  const updateCommentButtonHandler = () => {
    if (myId === userId) {
      setIsUpdateMode(true);
    } else {
      toast({
        variant: "destructive",
        title: "권한이 없습니다.",
        duration: 1000,
      });
    }
  };

  const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);
  const fetchVariations = (id: GifID) => gf.emojiVariations(id);

  return (
    <div className="w-full py-2 flex items-start justify-between space-x-2">
      <div className="w-full flex items-start space-x-2">
        <img
          src={profileImage}
          alt={`${nickname} profileImage`}
          className="w-8 h-8 rounded-full border"
        />
        {!isUpdateMode && (
          <div className="w-full">
            <div className="flex justify-between">
              <div className="flex flex-col sm:flex-row sm:space-x-2">
                <span className="font-semibold">{nickname}</span>
                <div>
                  <p className="whitespace-pre-line">{comment}</p>
                  {image && (
                    <img
                      src={image as string}
                      alt={`${comment} 이미지`}
                      className="h-24 w-24 rounded-sm"
                      onClick={() => setShowImageOpen(true)}
                    />
                  )}
                  {gif && (
                    <EmojiVariationsList
                      fetchVariations={fetchVariations}
                      gif={JSON.parse(gif)}
                      gifHeight={90}
                    />
                  )}
                </div>
              </div>
              <Like type="COMMENT" likeCount={likeCount} commentId={id} />
            </div>
            <div className="flex space-x-2">
              <button
                className={`text-sm font-semibold text-gray-600 ${
                  commentId_createdAt ? "hidden" : ""
                }`}
                onClick={() => setIsReplyMode(true)}
              >
                답글달기
              </button>
              <span className="text-sm font-semibold text-gray-600 hidden sm:block">
                {year}.{month}.{day} {hours}:{minutes}
              </span>
              <span className="text-sm font-semibold text-gray-600 sm:hidden">
                {month}/{day} {hours}:{minutes}
              </span>
              <button
                className={`text-sm font-semibold text-gray-600 ${
                  myId !== userId || gif ? "hidden" : ""
                }`}
                onClick={updateCommentButtonHandler}
              >
                수정
              </button>
              <button
                className={`text-sm font-semibold text-gray-600 ${
                  myId === userId || myId === postUserId ? "" : "hidden"
                }`}
                onClick={deleteCommentButtonHandler}
              >
                삭제
              </button>
            </div>
            {isReplyMode && (
              <div className="w-full pt-1">
                <CommentForm
                  postId={postId}
                  commentId={id}
                  setMode={setIsReplyMode}
                />
              </div>
            )}
            {
              <ReplyCommentList
                commentId={id}
                replyCount={replyCount}
                postUserId={postUserId as string}
              />
            }
          </div>
        )}
        {isUpdateMode && (
          <div className="w-full px-4">
            <CommentForm
              postId={postId}
              setMode={setIsUpdateMode}
              updateComment={commentData}
            />
          </div>
        )}
      </div>
      <ShowImageDialog
        isOpen={showImageOpen}
        setIsOpen={setShowImageOpen}
        image={image as string}
      />
    </div>
  );
};

export default CommentCard;
