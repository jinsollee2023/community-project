import { userAPI } from "@/lib/api/userAPI";
import { useQuery } from "@tanstack/react-query";

interface useUserQueriesProps {
  userId: string;
}
const useUserQueries = ({ userId }: useUserQueriesProps) => {
  const {
    data: userData,
    isLoading: userDataIsLoading,
    isError: userDataIsError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        const userData = await userAPI.getUserFromDatabase(userId);
        return userData;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!userId,
  });
  return { userData, userDataIsLoading, userDataIsError };
};

export default useUserQueries;
