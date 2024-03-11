import useUserQueries from "@/hooks/queries/user/useUserQueries";
import { getFormattedDate } from "@/shared/form/common";
import { IPost } from "@/types/types";
import { FaHeart } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: IPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const { id, userId, title, commentCount, likeCount, createdAt } = post;
  const { userData } = useUserQueries({ userId });
  const formattedDate = getFormattedDate(createdAt);
  const { month, day, hours, minutes } = formattedDate;
  const navigate = useNavigate();
  const cardClickButtonHandler = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div
      className="px-4 md:px-16 py-4 border rounded-sm hover:bg-slate-50 cursor-pointer"
      onClick={cardClickButtonHandler}
    >
      <div className="flex justify-between items-center">
        <p className="text-lg">
          {title?.length > 15 ? `${title?.slice(0, 15)}...` : title}
        </p>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <span>
              <FaHeart size={14} />
            </span>
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>
              <FaCommentAlt size={12} />
            </span>
            <span>{commentCount}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">{userData?.nickname}</span>
        <span className="text-sm hidden sm:block">
          {month}월{day}일 {hours}시 작성됨
        </span>

        <span className="text-sm sm:hidden">
          {month}/{day} {hours}:{minutes}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
{
  /* <span>·</span> */
}
