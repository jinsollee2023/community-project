import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IUser } from "@/types/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: IUser;
}

const UserCard = ({ user }: UserCardProps) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const navigate = useNavigate();
  const goToUserPage = () => {
    navigate(`/mypage/${user.id}`);
  };
  return (
    <Card onClick={goToUserPage} className="cursor-pointer">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-center">{user.nickname}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {imageIsLoading && (
            <div className="flex justify-center">
              <Skeleton className="w-40 h-40 rounded-sm" />
            </div>
          )}

          <img
            src={user.profileImage as string}
            alt={`${user.nickname}의 프로필사진`}
            onLoad={() => {
              setImageIsLoading(false);
            }}
            className={`${
              imageIsLoading ? "hidden" : "none"
            } w-3/4 h-3/4 rounded-full mb-2`}
          />
        </div>
        <CardDescription className="pt-2">{user.bio}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default UserCard;
