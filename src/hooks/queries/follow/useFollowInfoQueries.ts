import { userAPI } from "@/lib/api/userAPI";
import { useQuery } from "@tanstack/react-query";

const useFollowInfoQueries = ({
  userId,
  followerIds,
  followingIds,
}: {
  userId: string;
  followerIds?: string[];
  followingIds?: string[];
}) => {
  const {
    data: followerInfoData,
    isLoading: followerInfoDataIsLoading,
    isError: followerInfoDataIsError,
  } = useQuery({
    queryKey: ["followerInfoList", userId],
    queryFn: async () => {
      try {
        return await userAPI.getUserListData(followerIds as string[]);
      } catch (error) {
        throw error;
      }
    },
    enabled: !!followerIds?.length,
  });

  const {
    data: followingInfoData,
    isLoading: followingInfoDataIsLoading,
    isError: followingInfoDataIsError,
  } = useQuery({
    queryKey: ["followingInfoList", userId],
    queryFn: async () => {
      try {
        return await userAPI.getUserListData(followingIds as string[]);
      } catch (error) {
        console.error("getUserListData 호출 중 에러 발생:", error);
        throw error;
      }
    },
    enabled: !!followingIds?.length,
  });
  return {
    followerInfoData,
    followerInfoDataIsLoading,
    followerInfoDataIsError,
    followingInfoData,
    followingInfoDataIsLoading,
    followingInfoDataIsError,
  };
};

export default useFollowInfoQueries;
