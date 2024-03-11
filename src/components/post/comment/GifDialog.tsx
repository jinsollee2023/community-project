import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";
import useCommentMutations from "@/hooks/queries/comment/useCommentMutations";
import { IComment } from "@/types/types";
import { getKoreaTimeDate } from "@/shared/form/common";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { HiOutlineXMark } from "react-icons/hi2";

interface GifDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  postId: string;
  commentId: string;
}

const GifDialog = ({
  isOpen,
  setIsOpen,
  postId,
  commentId,
}: GifDialogProps) => {
  const myId = localStorage.getItem("userId");
  const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);
  const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 });

  const { addCommentMutation } = useCommentMutations();

  const onGifClickHandler = (gif: IGif) => {
    const newComment: IComment = {
      id: uuidv4(),
      userId: myId as string,
      postId,
      gif: JSON.stringify(gif),
      likeCount: 0,
      replyCount: 0,
      postId_createdAt: "",
      createdAt: getKoreaTimeDate(),
      updatedAt: getKoreaTimeDate(),
    };
    if (!commentId) {
      addCommentMutation.mutate({ newComment, commentCount: 1 });
    } else if (commentId) {
      addCommentMutation.mutate({
        newComment: { ...newComment, commentId_createdAt: commentId },
        commentCount: 1,
      });
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="h-[500px] w-[380px] overflow-y-auto">
        <AlertDialogHeader className="flex flex-row justify-between items-center space-y-0">
          <AlertDialogTitle>Gif</AlertDialogTitle>
          <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
            <HiOutlineXMark size={25} />
          </Button>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <Grid
            width={330}
            columns={3}
            fetchGifs={fetchGifs}
            noLink={true}
            onGifClick={(gif) => {
              onGifClickHandler(gif);
            }}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GifDialog;
