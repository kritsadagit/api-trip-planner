import moment from "moment-timezone";
import bcrypt from "bcrypt";

export const getUTC7Isodate = (): string => {
  return moment().utcOffset(7).toISOString(true);
};

export const hashPassword = (password: string): Promise<string> => {
  const saltRound = 10;
  try {
    const hashedPassword = bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const compareHash = async (
  hashedPassword: string,
  password: string
): Promise<boolean> => {
  const isValidate = bcrypt.compare(password, hashedPassword);
  return isValidate;
};