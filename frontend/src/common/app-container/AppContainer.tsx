import usePathName from '@common/app-container/hooks/usePathName';
import useBaseDocumentTitle from '@common/hooks/useBaseDocumentTitle';
import Breadcrumbs from '@common/navigation/breadcrumbs/Breadcrumbs';
import Navigation from '@common/navigation/Navigation';
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
        <Outlet />
      </div>
    </>
  );
};

export default AppContainer;
