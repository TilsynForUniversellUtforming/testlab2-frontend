import React from 'react';

interface Props {
  show?: boolean;
  onClick?: () => void;
  buttonText?: string;
  errorHeader?: string;
  errorText?: string;
}

const ErrorCard = ({
  show = true,
  onClick,
  buttonText = 'Prøv igjen',
  errorHeader = 'Noko gjekk gale',
  errorText = 'Ver vennleg og prøv igjen',
}: Props) => (
  <>
    {show && (
      <div className="mt-3">
        <div>{errorHeader}</div>
        <p>{errorText}</p>
        {onClick && (
          <>
            <hr />
            <div className="d-flex">
              {/*variant="outline-danger"*/}
              <button onClick={onClick}>{buttonText}</button>
            </div>
          </>
        )}
      </div>
    )}
  </>
);

export default ErrorCard;
