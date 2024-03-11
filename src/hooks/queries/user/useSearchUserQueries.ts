import { userAPI } from "@/lib/api/userAPI";
import { useQuery } from "@tanstack/react-query";

interface useSearchUserQueriesProps {
  keyword: string;
}

const useSearchUserQueries = ({ keyword }: useSearchUserQueriesProps) => {
  const {
    data: searchUserData,
    isLoading: searchUserDataIsLoading,
    isError: searchUserDataIsError,
    refetch: refetchSearchUserData,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const searchUserData = await userAPI.getAllUser();
        return searchUserData?.filter((user) =>
          user.nickname.includes(keyword)
        );
      } catch (error) {
        throw error;
      }
    },
  });

  return {
    searchUserData,
    searchUserDataIsLoading,
    searchUserDataIsError,
    refetchSearchUserData,
  };
};

export default useSearchUserQueries;
