/**
 * Ensures that the provided value is returned as an Error object.
 * Returns error if already of Error instance, else a new Error is created
 * with a backup message.
 *
 * @param {unknown} error - The error value to be processed. Can be of any type.
 * @param {string} backupMessage - Backup message if error is not an Error instance.
 * @return {Error} An Error object.
 */

const toError = (error: unknown, backupMessage: string): Error => {
  if (error instanceof Error) {
    return error;
  } else {
    return new Error(backupMessage);
  }
};

export default toError;
