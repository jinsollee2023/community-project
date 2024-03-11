import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IoCloseOutline } from "react-icons/io5";
import useFollowInfoQueries from "@/hooks/queries/follow/useFollowInfoQueries";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { IFollow } from "@/types/types";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

interface FollowDialogProps {
  userId: string;
  followerData: IFollow[];
  followingData: IFollow[];
  setIsOpenFollowDialog: (isOpenFollowDialog: boolean) => void;
  isOpenFollowDialog: boolean;
  showFollow: "follower" | "following";
}

const FollowDialog = ({
  userId,
  followerData,
  followingData,
  setIsOpenFollowDialog,
  isOpenFollowDialog,
  showFollow,
}: FollowDialogProps) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);

  const followerIds = followerData?.map((data) => data.followerId);
  const followingIds = followingData?.map((data) => data.followingId);

  const {
    followerInfoData,
    followerInfoDataIsLoading,
    followerInfoDataIsError,
    followingInfoData,
    followingInfoDataIsLoading,
    followingInfoDataIsError,
  } = useFollowInfoQueries({
    userId,
    followerIds: followerIds,
    followingIds: followingIds,
  });

  const navigate = useNavigate();
  const goToFollowPage = (id: string) => {
    navigate(`/mypage/${id}`);
    setIsOpenFollowDialog(false);
  };

  return (
    <AlertDialog open={isOpenFollowDialog}>
      <AlertDialogContent className="w-5/6 md:w-1/3 p-2">
        <AlertDialogHeader className="flex flex-row items-center justify-between border-b space-y-0">
          <AlertDialogTitle className="p-2">
            {showFollow === "follower" ? "팔로워" : "팔로잉"}
          </AlertDialogTitle>
          <Button
            className="flex items-center"
            variant="ghost"
            size="xs"
            onClick={() => setIsOpenFollowDialog(false)}
          >
            <IoCloseOutline size={25} />
          </Button>
        </AlertDialogHeader>
        {(followerInfoDataIsError || followingInfoDataIsError) && (
          <p>Error...</p>
        )}
        {(followerInfoDataIsLoading || followingInfoDataIsLoading) && (
          <p>Loading...</p>
        )}
        {(followerInfoData || followingInfoData) && (
          <div className="px-2 pb-3 space-y-3">
            {showFollow === "follower"
              ? followerInfoData?.map((info) => (
                  <div
                    key={info.id}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => goToFollowPage(info.id)}
                  >
                    {imageIsLoading && (
                      <Skeleton className="w-7 h-7 rounded-full border" />
                    )}
                    <img
                      src={info.profileImage as string}
                      alt={`${info.nickname} 사진`}
                      onLoad={() => setImageIsLoading(false)}
                      className={
                        imageIsLoading ? "hidden" : "w-7 h-7 rounded-full"
                      }
                    />
                    <p>{info.nickname}</p>
                  </div>
                ))
              : followingInfoData?.map((info) => (
                  <div
                    key={info.id}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => goToFollowPage(info.id)}
                  >
                    <img
                      src={info.profileImage as string}
                      alt={`${info.nickname} 사진`}
                      className="w-7 rounded-full"
                    />
                    <p>{info.nickname}</p>
                  </div>
                ))}
            {showFollow === "follower" && followerData?.length === 0 && (
              <p>팔로워 목록이 없습니다.</p>
            )}
            {showFollow === "following" && followingData?.length === 0 && (
              <p>팔로잉 목록이 없습니다.</p>
            )}
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FollowDialog;
