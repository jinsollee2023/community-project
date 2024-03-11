import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";
import _ from "lodash";
import { useMemo } from "react";
import useSearchUserQueries from "@/hooks/queries/user/useSearchUserQueries";

interface SearchInputProps {
  inputValue: string;
  setInputValue: (inputValue: string) => void;
}

const SearchInput = ({ inputValue, setInputValue }: SearchInputProps) => {
  const { refetchSearchUserData } = useSearchUserQueries({
    keyword: inputValue,
  });
  const searchOnSubmitHanler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const debouncedSearch = useMemo(
    () =>
      _.debounce(() => {
        refetchSearchUserData();
      }, 500),
    [inputValue]
  );

  const searchInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedSearch();
  };

  return (
    <form
      className="w-full md:w-3/5 mx-auto space-x-2 flex items-center "
      onSubmit={searchOnSubmitHanler}
    >
      <input
        value={inputValue}
        onChange={searchInputOnChange}
        placeholder="궁금한 유저를 검색해보세요!"
        className="flex h-10 w-full border-b px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Button size="icon" variant="ghost" type="submit">
        <IoSearch size={20} />
      </Button>
    </form>
  );
};

export default SearchInput;
