import { useLayoutEffect, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

import NavGroup from './NavGroup';
import menuItem from '../../../../../menu-items';
import { MenuFromAPI } from '../../../../../menu-items/dashboard';

import { useGetMenu, useGetMenuMaster } from '../../../../../api/menu';
import useConfig from '../../../../../hooks/useConfig';
import { MenuOrientation, HORIZONTAL_MAX_ITEM } from '../../../../../config';

function isFound(arr, str) {
  return arr.items.some((element) => {
    if (element.id === str) {
      return true;
    }
    return false;
  });
}

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();
  const { menuOrientation } = useConfig();
  const { menuLoading } = useGetMenu();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [menuItems, setMenuItems] = useState({ items: [] });

  let dashboardMenu = MenuFromAPI();

  useLayoutEffect(() => {
    //aici e
    // if (menuLoading && !isFound(menuItem, 'group-dashboard-loading')) {
    //   console.log("Menu item:",menuItem);
    //   menuItem.items.splice(0, 0, dashboardMenu);
    //   setMenuItems({ items: [...menuItem.items] });
    // } else if (!menuLoading && dashboardMenu?.id !== undefined && !isFound(menuItem, 'group-dashboard')) {
    //   menuItem.items.splice(0, 1, dashboardMenu);
    //   setMenuItems({ items: [...menuItem.items] });
    // } else {
    //   setMenuItems({ items: [...menuItem.items] });
    // }

    if(menuLoading) {
      setMenuItems({items:[...menuItem.items]})
    }
    // eslint-disable-next-line
  }, [menuLoading]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  //  first it checks menu item is more than giving HORIZONTAL_MAX_ITEM after that get lastItemid by giving horizontal max
  // item and it sets horizontal menu by giving horizontal max item lastly slice menuItem from array and set into remItems

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item, index) => {
    console.log("Item:",item);
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
 
    
  });

  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        ...(isHorizontal && {
          '& > ul:first-of-type': { mt: 0 }
        }),
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
