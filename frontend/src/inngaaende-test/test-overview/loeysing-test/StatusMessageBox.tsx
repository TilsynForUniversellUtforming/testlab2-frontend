import { Alert, Heading } from '@digdir/designsystemet-react';

const StatusMessageBox = ({statusmessage}:{statusmessage:string}) => {
  return <Alert data-color="success">{statusmessage}</Alert>;
  
}

export default StatusMessageBox