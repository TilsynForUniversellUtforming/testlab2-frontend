import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const IkkeFunnet = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div>{error.statusText || error.data.message}</div>;
  } else {
    return <div>Ikke funnet</div>;
  }
};

export default IkkeFunnet;
