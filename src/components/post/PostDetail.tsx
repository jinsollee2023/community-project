import useSinglePostQueries from "@/hooks/queries/post/useSinglePostQueries";
import useUserQueries from "@/hooks/queries/user/useUserQueries";
import { getFormattedDate } from "@/shared/form/common";
import { useLocation, useNavigate } from "react-router-dom";
import Dompurify from "dompurify";
import usePostMutation from "@/hooks/queries/post/usePostMutations";
import { useState } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useToast } from "../ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { AiOutlineMore } from "react-icons/ai";
import Like from "./like/Like";
import "./styles.css";
import CommentForm from "./comment/CommentForm";
import CommentList from "./comment/CommentList";

const PostDetail = () => {
  const { toast } = useToast();
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.pathname.split("/").pop();
  const myId = localStorage.getItem("userId");

  const { singlePostData, singlePostIsLoading, singlePostIsError } =
    useSinglePostQueries({ postId: postId as string });
  const { title, content, userId, createdAt, likeCount, commentCount } =
    singlePostData || {};

  const { userData, userDataIsLoading, userDataIsError } = useUserQueries({
    userId,
  });

  const formattedDate = getFormattedDate(createdAt);
  const { year, month, day, hours, minutes } = formattedDate;
  const [isLoading, setIsLoading] = useState(false);
  const { deletePostMutation } = usePostMutation({ setIsLoading });

  const deleteButtonHandler = () => {
    if (myId === userId) {
      setIsLoading(true);
      deletePostMutation.mutate({ postId: postId as string });
    } else {
      toast({
        variant: "destructive",
        title: "게시물 삭제 권한이 없습니다.",
        duration: 1000,
      });
    }
  };

  const updateButtonHandler = () => {
    if (myId === userId) {
      navigate(`/post-registration?postId=${postId}`);
    } else {
      toast({
        variant: "destructive",
        title: "게시물 수정 권한이 없습니다.",
        duration: 1000,
      });
    }
  };
  const profileClickHandler = () => {
    navigate(`/mypage/${userId}`);
  };

  if (singlePostIsLoading || userDataIsLoading) {
    return <LoadingSpinner text="게시글 데이터 로딩중..." />;
  }

  if (singlePostIsError || userDataIsError) {
    return <p>Error...</p>;
  }

  return (
    <>
      {singlePostData && (
        <>
          <div className="py-6 space-y-6">
            <p className="text-3xl text-center">{title}</p>
            <div className="flex justify-between items-center">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={profileClickHandler}
              >
                {imageIsLoading && (
                  <Skeleton className="w-10 h-10 rounded-full border" />
                )}
                <img
                  src={userData?.profileImage}
                  alt={`${userData?.nickname}사진`}
                  className={
                    imageIsLoading ? "hidden" : "w-10 h-10 rounded-full border"
                  }
                  onLoad={() => setImageIsLoading(false)}
                />
                <div className="flex flex-col">
                  <span>{userData?.nickname}</span>
                  <span className="text-sm">
                    {year}.{month}.{day}. {hours}:{minutes}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Like likeCount={likeCount} type="POST" />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={(myId as string) === userId ? "" : "hidden"}
                  >
                    <AiOutlineMore size={27} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={updateButtonHandler}>
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={deleteButtonHandler}>
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <span className="w-full h-2 border-b inline-block"></span>
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: Dompurify.sanitize(content, {
                  ALLOWED_TAGS: [
                    "iframe",
                    "img",
                    "p",
                    "strong",
                    "em",
                    "u",
                    "s",
                  ],
                  ADD_ATTR: [
                    "allow",
                    "allowfullscreen",
                    "frameborder",
                    "scrolling",
                  ],
                }),
              }}
              className="w-full min-h-[450px] px-4 py-4"
            />
          </div>
          <span className="w-full h-2 border-b inline-block"></span>
          <div className="pt-4 space-x-1">
            <span className="font-semibold">댓글</span>
            <span className="font-semibold">{commentCount}</span>
          </div>
          <div className="py-5">
            <CommentForm postId={postId as string} />
            <CommentList
              postId={postId as string}
              postUserId={userId as string}
            />
          </div>
        </>
      )}
      <LoadingSpinner text="게시글 삭제 중..." isLoading={isLoading} />
    </>
  );
};

export default PostDetail;
