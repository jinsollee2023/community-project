export const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const noCommonPatterns = /^(?!.*(asdf|zxcv|qwer|password))/;
export const noConsecutiveCharsOrSpecial =
  /^(?!.*(.)\1{2,})(?!.*[!@#$%^&*()_+|~=\-\\\[\]{};:'",.<>/?]{3,})/;
export const noRepeatedCharsOrDigits = /^(?!.*(.)\1{3,})/;
