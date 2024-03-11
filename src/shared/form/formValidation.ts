import * as z from "zod";
import {
  noCommonPatterns,
  noConsecutiveCharsOrSpecial,
  noRepeatedCharsOrDigits,
  passwordRegex,
} from "./validationPatterns";

const createPasswordValidation = () => {
  return z
    .string({ required_error: "비밀번호는 필수 정보입니다." })
    .min(8, { message: "비밀번호는 최소 8자리 이상이어야 합니다." })
    .regex(
      passwordRegex,
      "최소 8자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
    )
    .regex(
      noConsecutiveCharsOrSpecial,
      "3자 이상 연속된 숫자, 영문자, 특수문자는 사용할 수 없습니다."
    )
    .regex(
      noRepeatedCharsOrDigits,
      "3자리 이상 동일한 숫자 및 문자를 사용할 수 없습니다."
    )
    .regex(
      noCommonPatterns,
      "쉬운 패턴(asdf, qwer, password 등)은 사용할 수 없습니다."
    )
    .refine((value) => value !== "prevent@135", {
      message: "이메일에 사용한 문자열은 사용할 수 없습니다.",
    });
};

export const loginFormSchema = z.object({
  email: z
    .string({ required_error: "이메일은 필수 정보입니다." })
    .email({ message: "올바른 이메일을 입력해주세요" }),
  password: createPasswordValidation(),
});

const profileFields = z.object({
  image: z.custom<File | string>((val) => {
    return val instanceof File || typeof val === "string";
  }, "이미지는 필수 정보입니다."),
  name: z.string({ required_error: "이름은 필수 정보입니다." }).min(2, {
    message: "이름은 2글자 이상이어야 합니다.",
  }),

  bio: z
    .string({
      required_error: "자기 소개는 필수 정보입니다.",
    })
    .min(10, {
      message: "자기 소개는 10글자 이상이어야 합니다.",
    }),
});

export const signUpFormSchema = profileFields.extend({
  email: z
    .string({ required_error: "이메일은 필수 정보입니다." })
    .email({ message: "올바른 이메일을 입력해주세요" }),
  password: createPasswordValidation(),
  confirmPassword: createPasswordValidation(),
});

export const profileFormSchema = profileFields;

export const postFormSchema = z.object({
  title: z
    .string({
      required_error: "제목은 필수 정보입니다.",
    })
    .min(2, {
      message: "제목은 2글자 이상이어야 합니다.",
    }),
  content: z
    .string({
      required_error: "내용은 필수 정보입니다.",
    })
    .min(10, {
      message: "내용은 10글자 이상이어야 합니다.",
    }),
});

export const commentFormSchema = z
  .object({
    comment: z.string().optional(),
    image: z
      .custom<File | string>(
        (val) => val instanceof File || typeof val === "string"
      )
      .optional(),
  })
  .partial()
  .refine((data) => data.comment || data.image, {
    path: ["content"],
    message: "댓글, 이미지 중 한개 이상의 내용은 필수입니다.",
  });
