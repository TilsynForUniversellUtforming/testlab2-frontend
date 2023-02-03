export type t<Error, Data> =
  | { type: 'NOT_ASKED' }
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: Data }
  | { type: 'FAILURE'; error: Error };

export function get<datatype>(url: string): Promise<t<string, datatype>> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        return {
          type: 'FAILURE',
          error: `when trying to fetch ${url}, the response from the server was not ok: ${response.status}`,
        };
      } else {
        return response.json();
      }
    })
    .then(
      (data: datatype) => ({ type: 'SUCCESS', data }),
      (error: Error) => ({
        type: 'FAILURE',
        error: `when trying to fetch ${url}, this error occurred: ${error.message}`,
      })
    );
}

export function fold<R, E, D>(
  remoteData: t<E, D>,
  notAsked: () => R,
  loading: () => R,
  failure: (error: E) => R,
  success: (data: D) => R
): R {
  switch (remoteData.type) {
    case 'NOT_ASKED':
      return notAsked();
    case 'LOADING':
      return loading();
    case 'FAILURE':
      return failure(remoteData.error);
    case 'SUCCESS':
      return success(remoteData.data);
  }
}
