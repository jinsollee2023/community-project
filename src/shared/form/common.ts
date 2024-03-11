export const getKoreaTimeDate = () => {
  const koreaTimeZoneOffset = 9 * 60;
  const currentUTCDate = new Date();
  const koreaTimeDate = new Date(
    currentUTCDate.getTime() + koreaTimeZoneOffset
  );

  return koreaTimeDate;
};

export const getFormattedDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return { year, month, day, hours, minutes };
};
