import { IUser } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/App";
import { useUser } from "@/store/UserContext";
import { useNavigate } from "react-router-dom";
import { userAPI } from "@/lib/api/userAPI";

const useUserMutations = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const addUserMutation = useMutation({
    mutationFn: async (newUser: IUser) => {
      return await userAPI.addUserToDatabase(newUser, setUser);
    },
    onMutate: async (value) => {
      const previousUser: IUser[] | undefined = queryClient.getQueryData([
        "user",
        value.id,
      ]);
      if (previousUser) {
        await queryClient.cancelQueries({
          queryKey: ["user", value.id],
        });
        queryClient.setQueryData(["user", value.id], value);
      }
      return { previousUser, newUser: value };
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["user", context?.newUser.id], undefined);
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["user", value?.userId],
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (newUser: IUser) => {
      return await userAPI.updateUserToDatabase(newUser, setUser);
    },
    onMutate: async (value) => {
      const previousUser: IUser[] | undefined = queryClient.getQueryData([
        "user",
        value.id,
      ]);
      if (previousUser) {
        await queryClient.cancelQueries({
          queryKey: ["user", value.id],
        });
        queryClient.setQueryData(["user", value.id], value);
      }
      return { previousUser };
    },

    onError: (error, value, context) => {
      queryClient.setQueryData(["user", value.id], context?.previousUser);
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["user", value?.userId],
      });
    },
  });

  return { addUserMutation, updateUserMutation };
};

export default useUserMutations;
