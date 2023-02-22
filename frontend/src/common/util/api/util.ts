export const responseToJson = (response: Response, errorMessage: string) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(errorMessage);
  }
};

export const getHeader = (
  response: Response,
  header: string,
  errorMessage: string
): string | undefined => {
  if (response.ok) {
    return response.headers.get(header)?.toString();
  } else {
    throw new Error(errorMessage);
  }
};
