import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IoMdSettings } from "react-icons/io";
import useUserQueries from "@/hooks/queries/user/useUserQueries";
import { useEffect, useState } from "react";
import ProfileFormDialog from "./ProfileFormDialog";
import { useLocation } from "react-router-dom";
import { useDialog } from "@/store/DialogContext";
import UpdatePasswordDialog from "./UpdatePasswordDialog";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import useFollowMutations from "@/hooks/queries/follow/useFollowMutations";
import { IFollow } from "@/types/types";
import { getKoreaTimeDate } from "@/shared/form/common";
import { v4 as uuidv4 } from "uuid";
import useFollowQueries from "@/hooks/queries/follow/useFollowQueries";
import FollowDialog from "./FollowDialog";
import LoadingSpinner from "../layout/LoadingSpinner";

const ProfileCard = () => {
  const userIdFromLocalStorage = localStorage.getItem("userId");
  const location = useLocation();
  const queryString = location.search;
  const pathname = location.pathname;
  const userIdFromPath = pathname.split("/mypage/")[1];

  const { userData, userDataIsLoading, userDataIsError } = useUserQueries({
    userId: userIdFromPath as string,
  });
  const { nickname, bio, profileImage, email } = userData || {};
  const { setIsOpen } = useDialog();
  const [isOpenPasswordDialog, setIsOpenPasswordDialog] = useState(false);
  const [isOpenFollowDialog, setIsOpenFollowDialog] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [showFollow, setShowFollow] = useState<"follower" | "following">(
    "follower"
  );

  const {
    followerData,
    followerDataIsLoading,
    followerDataIsError,
    followingData,
    followingDataIsLoading,
    followingDataIsError,
  } = useFollowQueries(userIdFromPath as string);

  const myFollowData = followerData?.find(
    (follow) => follow.followerId === userIdFromLocalStorage
  );

  const { addFollowMutation, deleteFollowMutation } = useFollowMutations();
  const followButtonHandler = () => {
    const newFollow: IFollow = {
      id: uuidv4(),
      followerId: userIdFromLocalStorage as string,
      followingId: userIdFromPath as string,
      createdAt: getKoreaTimeDate(),
    };
    !myFollowData && addFollowMutation.mutate({ newFollow });
  };
  const unFollowButtonHandler = () => {
    myFollowData && deleteFollowMutation.mutate({ followData: myFollowData });
  };

  const openFollowInfoButtonHandler = (type: "follower" | "following") => {
    setShowFollow(type);
    setIsOpenFollowDialog(true);
  };

  useEffect(() => {
    if (queryString === "?newUser") {
      setIsOpen(true);
    }
  }, []);

  if (userDataIsError || followerDataIsError || followingDataIsError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      <Card className="w-full">
        <CardContent className="py-10 px-2 md:px-12 lg:px-32">
          <div className="flex flex-col md:flex-row md:space-x-14">
            <div className="w-52 h-52 mx-auto md:mx-0 rounded-full">
              {imageIsLoading && (
                <Skeleton className="w-full h-full rounded-full" />
              )}
              <img
                src={profileImage}
                alt="Profile"
                className={`w-full h-full rounded-full ${
                  imageIsLoading ? "hidden" : ""
                }`}
                onLoad={() => setImageIsLoading(false)}
              />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-center items-center space-x-2 md:justify-start">
                <p className="text-2xl">{nickname}</p>
                {userIdFromLocalStorage === userIdFromPath ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <IoMdSettings size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setIsOpen(true)}>
                        프로필 수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={
                          !queryString && userData?.password === "google@135"
                            ? "none"
                            : ""
                        }
                        onClick={() => setIsOpenPasswordDialog(true)}
                      >
                        비밀번호 변경
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    size="xs"
                    variant={myFollowData ? "outline" : "default"}
                    onClick={
                      myFollowData ? unFollowButtonHandler : followButtonHandler
                    }
                  >
                    {myFollowData ? "팔로우 취소" : "팔로우하기"}
                  </Button>
                )}
              </div>
              <div className="flex space-x-4">
                <div
                  className="space-x-1 cursor-pointer"
                  onClick={() => openFollowInfoButtonHandler("follower")}
                >
                  <span>팔로워</span>
                  <span className="font-semibold">{followerData?.length}</span>
                </div>
                <div
                  className="space-x-1 cursor-pointer"
                  onClick={() => openFollowInfoButtonHandler("following")}
                >
                  <span>팔로잉</span>
                  <span className="font-semibold">{followingData?.length}</span>
                </div>
              </div>

              <p className="text-lg">{bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <ProfileFormDialog />
      <UpdatePasswordDialog
        isOpen={isOpenPasswordDialog}
        setIsOpen={setIsOpenPasswordDialog}
        email={email}
      />
      <FollowDialog
        userId={userIdFromPath}
        followerData={followerData as IFollow[]}
        followingData={followingData as IFollow[]}
        setIsOpenFollowDialog={setIsOpenFollowDialog}
        isOpenFollowDialog={isOpenFollowDialog}
        showFollow={showFollow}
      />
      <LoadingSpinner
        isLoading={
          userDataIsLoading || followerDataIsLoading || followingDataIsLoading
        }
        text="유저 정보 로딩 중..."
      />
    </div>
  );
};

export default ProfileCard;
