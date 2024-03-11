import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema } from "@/shared/form/formValidation";
import Resizer from "react-image-file-resizer";
import { v4 as uuidv4 } from "uuid";
import { IPost } from "@/types/types";
import { getKoreaTimeDate } from "@/shared/form/common";
import usePostMutation from "./queries/post/usePostMutations";
import ResizeModule from "@botom/quill-resize-module";

const BaseImageFormat = Quill.import("formats/image");
const ImageFormatAttributesList = ["alt", "height", "width", "style"];

class ImageFormat extends BaseImageFormat {
  static formats(domNode: any) {
    return ImageFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {} as Record<string, string>);
  }
  format(name: any, value: any) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(ImageFormat, true);
Quill.register("modules/resize", ResizeModule);

interface usePostFormProps {
  updatePost: IPost | undefined;
}

export interface IFile {
  name: string | null;
  previewURL: string;
  file: File | null;
}

const usePostForm = ({ updatePost }: usePostFormProps) => {
  const [images, setImages] = useState<IFile[]>([]);
  const [videos, setVideos] = useState<IFile[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addPostMutation, updatePostMutation } = usePostMutation({
    setIsLoading,
  });

  const userId = localStorage.getItem("userId");
  const quillRef = useRef<ReactQuill>(null);

  const postForm = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    const setFormValues = async () => {
      setIsLoading(true);
      if (updatePost) {
        const { title, content } = updatePost;
        postForm.setValue("title", title);
        postForm.setValue("content", content);
      }
      setIsLoading(false);
    };
    updatePost && setFormValues();
  }, [updatePost]);

  const onSubmitPosting = async (values: z.infer<typeof postFormSchema>) => {
    const { title, content } = values;
    setIsLoading(true);
    if (!updatePost) {
      const newPost: IPost = {
        id: uuidv4(),
        userId: userId as string,
        title,
        content,
        commentCount: 0,
        likeCount: 0,
        createdAt: getKoreaTimeDate(),
        updatedAt: getKoreaTimeDate(),
      };
      addPostMutation.mutate({ newPost, images, videos });
    } else if (updatePost) {
      const updatedPost: IPost = {
        id: updatePost.id,
        userId: updatePost.userId,
        title,
        content,
        commentCount: updatePost.commentCount,
        likeCount: updatePost.likeCount,
        createdAt: updatePost.createdAt,
        updatedAt: getKoreaTimeDate(),
      };
      updatePostMutation.mutate({ updatedPost, images, videos });
    }
  };

  const resizeFile = (file: File) =>
    new Promise((res) => {
      Resizer.imageFileResizer(
        file,
        1500,
        1500,
        "JPEG",
        80,
        0,
        (uri) => res(uri),
        "file"
      );
    });

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "true");
    input.click();

    input.onchange = async (event: any) => {
      const imageFiles: FileList = event?.target?.files;
      setIsResizing(true);
      const resizePromises = Array.from(imageFiles).map(async (file) => {
        const id = file.name;
        const previewURL = URL.createObjectURL(file);
        const imageFile = (await resizeFile(file)) as File;

        if (quillRef.current) {
          const Image = Quill.import("formats/image");
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          Image.sanitize = (imageFileURL: string) => imageFileURL;
          editor.insertEmbed(range?.index as number, "image", previewURL);
        }

        return { name: id, previewURL, file: imageFile };
      });
      const resizedImages = await Promise.all(resizePromises);
      setIsResizing(false);
      setImages((prev: IFile[]) => [...prev, ...resizedImages]);
    };
  };

  const videoHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.setAttribute("multiple", "true");
    input.click();

    input.onchange = (event: any) => {
      const videoFiles: FileList = event?.target?.files;
      const vidoeFileObjects: IFile[] = [];

      Array.from(videoFiles).forEach((videoFile: File) => {
        const id = videoFile.name;
        const previewURL = URL.createObjectURL(videoFile);
        vidoeFileObjects.push({ name: id, previewURL, file: videoFile });
        if (quillRef.current) {
          const Video = Quill.import("formats/video");
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          Video.sanitize = (previewURL: string) => previewURL;
          editor.insertEmbed(range?.index as number, "video", previewURL);
        }
      });
      setVideos((prev: IFile[]) => [...prev, ...vidoeFileObjects]);
    };
  };

  const content = postForm.getValues("content") || "";

  const quillMedia = useMemo(() => {
    const imageMatches = Array.from(
      content.matchAll(/<img[^>]+src=["']([^'">]+)['"]/gi)
    ).map((match) => match[1]);

    const videoMatches = Array.from(
      content.matchAll(/<iframe[^>]+src=["']([^'">]+)['"]/gi)
    ).map((match) => match[1]);

    return {
      images: imageMatches,
      videos: videoMatches,
    };
  }, [content]);

  useEffect(() => {
    const oldImageFiles = quillMedia.images?.filter(
      (url: string) => !images.some((item: IFile) => item.previewURL === url)
    );
    const oldVideoFiles = quillMedia.videos?.filter(
      (url: string) => !videos.some((item: IFile) => item.previewURL === url)
    );
    const deletedImageFiles = images?.filter(
      (item: IFile) => !quillMedia.images.includes(item.previewURL)
    );
    const deletedVideoFiles = videos?.filter(
      (item: IFile) => !quillMedia.videos.includes(item.previewURL)
    );

    const getFileName = (url: string) => {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1].split("?")[0];
      const decodedFileName = decodeURIComponent(fileName);
      return decodedFileName.substring(decodedFileName.lastIndexOf("/") + 1);
    };

    if (oldImageFiles.length) {
      const imageObject = oldImageFiles.map((url) => {
        const imageName = getFileName(url);
        return { name: imageName, previewURL: url, file: null };
      });
      setImages((prev: IFile[]) => [...prev, ...imageObject]);
    } else if (oldVideoFiles.length) {
      const videoObject = oldVideoFiles.map((url) => {
        const videoName = getFileName(url);
        return { name: videoName, previewURL: url, file: null };
      });
      setVideos((prev: IFile[]) => [...prev, ...videoObject]);
    } else if (deletedImageFiles.length) {
      setImages((prevImages) => {
        const remainingImages = prevImages.filter((image: IFile) => {
          return !deletedImageFiles.includes(image);
        });
        return remainingImages;
      });
    } else if (deletedVideoFiles.length) {
      setVideos((prevVideos) => {
        const remainingVideos = prevVideos.filter((video: IFile) => {
          return !deletedVideoFiles.includes(video);
        });
        return remainingVideos;
      });
    }
  }, [images, videos, quillMedia]);

  const modules = useMemo(
    () => ({
      resize: {
        toolbar: {
          alignTools: false,
        },
      },
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["image", "video", "link"],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "align",
    "width",
    "height",
    "style",
    "background",
    "blockquote",
    "bold",
    "code-block",
    "color",
    "font",
    "header",
    "image",
    "video",
    "italic",
    "link",
    "script",
    "strike",
    "size",
    "underline",
  ];

  return {
    postForm,
    onSubmitPosting,
    quillRef,
    modules,
    formats,
    isResizing,
    images,
    videos,
    isLoading,
  };
};

export default usePostForm;
