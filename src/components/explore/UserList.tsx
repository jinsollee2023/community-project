import useSearchUserQueries from "@/hooks/queries/user/useSearchUserQueries";
import UserCard from "./UserCard";
import SearchInput from "./SearchInput";
import { useState } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";

const UserList = () => {
  const myId = localStorage.getItem("userId");
  const [inputValue, setInputValue] = useState("");

  const { searchUserData, searchUserDataIsLoading, searchUserDataIsError } =
    useSearchUserQueries({ keyword: inputValue });
  const allUserExceptMe = searchUserData?.filter((user) => user.id !== myId);

  if (searchUserDataIsError) {
    return <p>error...</p>;
  }
  return (
    <div className="space-y-14">
      <SearchInput inputValue={inputValue} setInputValue={setInputValue} />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
        {allUserExceptMe?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        {allUserExceptMe?.length === 0 && <p>등록된 유저가 없습니다.</p>}
      </div>
      <LoadingSpinner
        isLoading={searchUserDataIsLoading}
        text="유저 정보 가져오는 중.."
      />
    </div>
  );
};

export default UserList;
