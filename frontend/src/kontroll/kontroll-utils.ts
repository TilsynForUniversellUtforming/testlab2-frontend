export const getKontrollIdFromParams = (
  kontrollIdString: string | undefined
): number => {
  const kontrollId = parseInt(kontrollIdString ?? '', 10);
  if (isNaN(kontrollId)) {
    throw new Error('Id-en i URL-en er ikke et tall');
  }
  return kontrollId;
};
