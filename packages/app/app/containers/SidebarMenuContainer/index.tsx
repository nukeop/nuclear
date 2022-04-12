import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { ResizablePanel } from '@nuclear/ui';

import SidebarMenu from '../../components/SidebarMenu';
import SidebarMenuCategoryHeader from '../../components/SidebarMenu/SidebarMenuCategoryHeader';
import SidebarMenuItem from '../../components/SidebarMenu/SidebarMenuItem';
import { settingsSelector } from '../../selectors/settings';
import { setBooleanOption } from '../../actions/settings';
import { useResizablePanel } from './hooks';
import categories from './categories';
import styles from './styles.scss';
// import { UserPanelContainer } from '../UserPanelContainer';

const SidebarMenuContainer: React.FC = () => {
  const { t } = useTranslation('app');
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);
  const isCollapsed = settings.compactMenuBar;

  const onCollapse = useCallback((collapsedState: boolean) => {
    dispatch(setBooleanOption('compactMenuBar', collapsedState));
  }, [dispatch]);
  const {
    width,
    onSetWidth
  } = useResizablePanel({
    initialWidth: 300,
    collapsedWidth: 42,
    collapseThreshold: 200,
    onCollapse,
    isCollapsed
  });

  return <ResizablePanel
    width={width}
    onSetWidth={onSetWidth}
    isCollapsed={isCollapsed}
    collapsedWidth={42}
    classes={
      {
        root: cx(
          styles.sidebar_menu_container,
          { [styles.collapsed]: isCollapsed }
        ),
        content: styles.content
      }
    }
  >
    <SidebarMenu>
      {
        categories.map(({ name, items }) => (
          <React.Fragment
            key={name}
          >
            <SidebarMenuCategoryHeader
              compact={settings.compactMenuBar}
              headerText={t(name)}
            />
            {
              items.map(({ name, path, icon }) => (
                <NavLink key={path} to={'/' + path} activeClassName={styles.active_nav_link}>
                  <SidebarMenuItem
                    name={t(name)}
                    compact={settings.compactMenuBar}
                  >
                    <Icon name={icon} />{!settings.compactMenuBar && t(name)}
                  </SidebarMenuItem>
                </NavLink>
              ))}
          </React.Fragment>
        ))}
    </SidebarMenu>
    {/* {
      !isCollapsed &&
      <UserPanelContainer />
    } */}
  </ResizablePanel>;
};

export default SidebarMenuContainer;
