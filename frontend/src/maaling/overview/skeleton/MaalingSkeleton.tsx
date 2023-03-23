import React from 'react';
import Skeleton from 'react-loading-skeleton';

const MaalingSkeleton = () => {
  return (
    <>
      <div>
        <div>
          <ol className="w-75">
            <li>
              <div>
                <div className="fw-bold">Type:</div>
                <div>
                  <Skeleton />
                </div>
              </div>
            </li>
            <li>
              <div>
                <div className="fw-bold">Sak:</div>
                <div>
                  <Skeleton />
                </div>
              </div>
            </li>
            <li>
              <div>
                <div className="fw-bold">Dato start:</div>
                <div>
                  <Skeleton />
                </div>
              </div>
            </li>
            <li>
              <div>
                <div className="fw-bold">Dato avslutta:</div>
                <div>
                  <Skeleton />
                </div>
              </div>
            </li>
          </ol>
        </div>
        <div>
          <ol className="w-50">
            <li>
              <div>
                <div className="fw-bold">Status:</div>
                <Skeleton width={70} />
              </div>
            </li>
            <li>
              <ul>
                <li>
                  <div>
                    {/*md={8}*/}
                    <div>
                      <div>Sideutvalg</div>
                      <div>
                        <Skeleton />
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    {/*md={8}*/}
                    <div>
                      <div>Testing</div>
                      <div>
                        <Skeleton />
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    {/*md={8}*/}
                    <div>
                      <div>Publisert</div>
                      <div>
                        <Skeleton />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <Skeleton height={50} />
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default MaalingSkeleton;
