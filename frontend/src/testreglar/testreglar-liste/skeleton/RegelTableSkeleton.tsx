import React from 'react';
import Skeleton from 'react-loading-skeleton';

const RegelTableSkeleton = () => (
  <>
    {[...Array(15)].map((e, i) => (
      <tr key={`skeleton_${i}`}>
        <td colSpan={7}>
          <Skeleton height={64} />
        </td>
      </tr>
    ))}
  </>
);

export default RegelTableSkeleton;
