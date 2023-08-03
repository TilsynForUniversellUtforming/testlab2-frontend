const toError = (error: unknown, backupMessage: string): Error => {
  if (error instanceof Error) {
    return error;
  } else {
    return new Error(backupMessage);
  }
};

export default toError;
