import { IFollow } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/App";
import { followAPI } from "@/lib/api/followAPI";

const useFollowMutations = () => {
  const addFollowMutation = useMutation({
    mutationFn: async ({ newFollow }: { newFollow: IFollow }) => {
      return await followAPI.addFollow(newFollow as IFollow);
    },
    onMutate: async (value) => {
      const previousFollowerList: IFollow[] | undefined =
        queryClient.getQueryData(["followerList", value.newFollow.followingId]);

      if (previousFollowerList?.length) {
        await queryClient.cancelQueries({
          queryKey: ["followerList", value.newFollow.followingId],
        });
        queryClient.setQueryData(
          ["followerList", value.newFollow.followingId],
          [...previousFollowerList, value.newFollow]
        );
        return { previousFollowerList };
      }
    },
    onSuccess: (value) => {
      queryClient.removeQueries({
        queryKey: ["followerInfoList", value?.followingId],
      });
    },
    onError: (error, value, context) => {
      if (context?.previousFollowerList) {
        queryClient.setQueryData(
          ["followerList", value.newFollow.followingId],
          context?.previousFollowerList
        );
      }
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["followerList", value?.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["followingList", value?.followingId],
      });
    },
  });

  const deleteFollowMutation = useMutation({
    mutationFn: async ({ followData }: { followData: IFollow }) => {
      const { id, followingId } = followData as IFollow;
      return await followAPI.deleteFollow(id, followingId);
    },
    onMutate: async (value) => {
      const previousFollowerList: IFollow[] | undefined =
        queryClient.getQueryData([
          "followerList",
          value.followData.followingId,
        ]);

      if (previousFollowerList?.length) {
        await queryClient.cancelQueries({
          queryKey: ["followerList", value.followData.followingId],
        });
        const followerListAfterDelete = previousFollowerList.filter(
          (followerData) => followerData !== value.followData
        );
        queryClient.setQueryData(
          ["followerList", value.followData.followingId],
          followerListAfterDelete
        );
        return { previousFollowerList };
      }
    },
    onSuccess: (value) => {
      queryClient.removeQueries({
        queryKey: ["followerInfoList", value?.followingId],
      });
    },
    onError: (error, value, context) => {
      if (context?.previousFollowerList) {
        queryClient.setQueryData(
          ["followerList", value.followData.followingId],
          context?.previousFollowerList
        );
      }
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["followerList", value?.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["followingList", value?.followingId],
      });
    },
  });

  return {
    addFollowMutation,
    deleteFollowMutation,
  };
};

export default useFollowMutations;
