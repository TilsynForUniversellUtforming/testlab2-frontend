import usePathName from '@common/app-container/hooks/usePathName';
import useBaseDocumentTitle from '@common/hooks/useBaseDocumentTitle';
import Breadcrumbs from '@common/navigation/breadcrumbs/Breadcrumbs';
import Navigation from '@common/navigation/Navigation';
import OutletErrorBoundary from '@common/error-boundary/OutletErrorBoundary';
import { Outlet } from 'react-router';

const AppContainer = () => {
  const pathNameList = usePathName();
  const pathDepth = pathNameList.length;
  const currentPathName =
    pathDepth === 1 ? 'uu - Dashboard' : pathNameList[pathDepth - 1].name;
  useBaseDocumentTitle(currentPathName);

  return (
    <>
      <Navigation />
      <Breadcrumbs crumbs={pathNameList} />
      <div className="app-container">
        <OutletErrorBoundary>
          <Outlet />
        </OutletErrorBoundary>
      </div>
    </>
  );
};

export default AppContainer;
