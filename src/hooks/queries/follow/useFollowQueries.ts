import { followAPI } from "@/lib/api/followAPI";
import { useQuery } from "@tanstack/react-query";

const useFollowQueries = (userId: string) => {
  const {
    data: followerData,
    isLoading: followerDataIsLoading,
    isError: followerDataIsError,
  } = useQuery({
    queryKey: ["followerList", userId],
    queryFn: async () => {
      try {
        return await followAPI.getFollowerList(userId);
      } catch (error) {
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: followingData,
    isLoading: followingDataIsLoading,
    isError: followingDataIsError,
  } = useQuery({
    queryKey: ["followingList", userId],
    queryFn: async () => {
      try {
        return await followAPI.getFollowingList(userId);
      } catch (error) {
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  return {
    followerData,
    followerDataIsLoading,
    followerDataIsError,
    followingData,
    followingDataIsLoading,
    followingDataIsError,
  };
};

export default useFollowQueries;
