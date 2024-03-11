import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../ui/button";
import usePostForm from "@/hooks/usePostForm";
import LoadingSpinner from "../layout/LoadingSpinner";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useLocation } from "react-router-dom";
import useSinglePostQueries from "@/hooks/queries/post/useSinglePostQueries";

const PostForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const updatePostId = searchParams.get("postId");
  const { singlePostData, singlePostIsLoading, singlePostIsError } =
    useSinglePostQueries({ postId: updatePostId as string });

  const {
    postForm,
    onSubmitPosting,
    quillRef,
    modules,
    formats,
    isLoading,
    isResizing,
  } = usePostForm({ updatePost: singlePostData });

  const spinners = [
    { text: "이미지 변환 중..", isLoading: isResizing },
    {
      text: updatePostId ? "포스트 수정 중.." : "포스트 등록 중..",
      isLoading: isLoading,
    },
    { text: "포스트 로딩중..", isLoading: singlePostIsLoading },
  ];

  if (singlePostIsError) {
    return <p>Error...</p>;
  }

  return (
    <>
      <Form {...postForm}>
        <form
          onSubmit={postForm.handleSubmit(onSubmitPosting)}
          className="w-full space-y-3 mb-10"
        >
          <FormField
            control={postForm.control}
            name="title"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="제목"
                      {...field}
                      className="focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={postForm.control}
            name="content"
            render={({ field }) => (
              <>
                <FormItem className="w-full">
                  <FormControl>
                    <ReactQuill
                      {...field}
                      className="w-full h-[400px] mb-40 sm:mb-28 md:mb-24 lg:mb-20"
                      ref={quillRef}
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      onChange={(value) => field.onChange(value)}
                      placeholder="내용을 입력하세요."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {updatePostId ? "수정하기" : "등록하기"}
            </Button>
          </div>
        </form>
      </Form>

      {spinners.map((spinner, index) => (
        <LoadingSpinner
          key={index}
          text={spinner.text}
          isLoading={spinner.isLoading}
        />
      ))}
    </>
  );
};

export default PostForm;
