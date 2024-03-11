export interface IUser {
  id: string;
  email: string;
  nickname: string;
  password: string;
  profileImage: string | File;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGoogleUser {
  email: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

//팔로워가 누군가를 팔로잉한다
export interface IFollow {
  id: string;
  followerId: string; // 하는 사람
  followingId: string; // 받는 사람
  createdAt: Date;
}

export interface IPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  commentCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInfinitePages<T> {
  sortedArray: T[];
  nextPageParam: number | null;
}

export interface IInfiniteData<T> {
  pageParams: number[];
  pages: IInfinitePages<T>[];
}

export interface ILike {
  id: string;
  type: "POST" | "COMMENT";
  userId: string;
  postId?: string;
  postId_userId?: string;
  commentId?: string;
  commentId_userId?: string;
  createdAt: Date;
}

export interface IComment {
  id: string;
  userId: string;
  postId: string;
  comment?: string;
  image?: File | string;
  gif?: string;
  likeCount: number;
  replyCount: number;
  postId_createdAt: string;
  commentId_createdAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type objectType = {
  [key: string]: any;
};

export type IResolveParams = {
  provider: string;
  data?: objectType;
};
