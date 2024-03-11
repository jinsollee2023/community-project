import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  list,
} from "firebase/storage";

export const storageAPI = {
  uploadProfileImage: async (id: string, profileImage: File) => {
    const storage = getStorage();
    const childStorageRef = storageRef(storage, "user-image");

    const fileName = `${id}`;
    const imageRef = storageRef(childStorageRef, `${fileName}`);
    const snapshot = await uploadBytes(imageRef, profileImage as File);
    const imageDownloadURL = getDownloadURL(snapshot.ref);

    return imageDownloadURL;
  },

  deleteProfileImage: async (id: string) => {
    const storage = getStorage();
    const desertRef = storageRef(storage, `user-image/${id}`);

    try {
      await deleteObject(desertRef);
    } catch (error) {
      throw error;
    }
  },

  downloadProfileImage: async (imageURL: string): Promise<File> => {
    const storage = getStorage();
    const httpsReference = storageRef(storage, imageURL);
    try {
      const downloadURL = await getDownloadURL(httpsReference);
      const response = await fetch(downloadURL);
      const blob = await response.blob();
      const file = new File([blob], "image", {
        type: response.headers.get("content-type") || "image/jpeg",
      });
      return file;
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  },

  uploadPostFile: async (postId: string, fileName: string, postFile: File) => {
    const storage = getStorage();
    const childStorageRef = storageRef(storage, "post-files");

    const imageRef = storageRef(childStorageRef, `${postId}/${fileName}`);
    const snapshot = await uploadBytes(imageRef, postFile as File);
    const imageDownloadURL = getDownloadURL(snapshot.ref);

    return imageDownloadURL;
  },

  deletePostFiles: async (postId: string) => {
    const storage = getStorage();
    const desertRef = storageRef(storage, `post-files/${postId}`);
    try {
      const result = await listAll(desertRef);
      await Promise.all(result.items.map((item) => deleteObject(item)));
    } catch (error) {
      throw error;
    }
  },

  deleteSinglePostFile: async (postId: string, fileName: string) => {
    const storage = getStorage();
    const desertFileRef = storageRef(
      storage,
      `post-files/${postId}/${fileName}`
    );
    try {
      await deleteObject(desertFileRef);
    } catch (error) {
      throw error;
    }
  },

  getPostFiles: async (postId: string) => {
    const storage = getStorage();
    const postFilesRef = storageRef(storage, `post-files/${postId}`);
    try {
      const { items } = await list(postFilesRef);
      const fileNames = items.map((item) => item.name);
      return fileNames;
    } catch (error) {
      throw error;
    }
  },

  uploadCommentImage: async (commentId: string, commentImage: File) => {
    const storage = getStorage();
    const childStorageRef = storageRef(storage, "comment-image");
    const imageRef = storageRef(childStorageRef, `${commentId}`);
    try {
      const snapshot = await uploadBytes(imageRef, commentImage as File);
      const imageDownloadURL = await getDownloadURL(snapshot.ref);
      return imageDownloadURL;
    } catch (error) {
      console.log(error);
    }
  },

  deleteCommentImage: async (commentId: string) => {
    const storage = getStorage();
    const desertRef = storageRef(storage, `comment-image/${commentId}`);

    try {
      if (desertRef) {
        await deleteObject(desertRef);
      }
    } catch (error) {
      throw error;
    }
  },
};
