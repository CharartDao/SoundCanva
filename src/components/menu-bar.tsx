import MenuIcon from '@mui/icons-material/Menu';
import { AppBar as AppBarMat, Box, Button, Toolbar } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
//import logo192 from '../logobw.svg';

const MenuBar: React.FC = () => {

  const handleOpenDrawer = () => {
    console.log(0);
  };
  const logo192 = '../logobw.svg';
  return (
    <AppBarMat position="sticky">
      <Toolbar disableGutters>
        <Box>
          <Button
            id="appbar_menuButton"
            startIcon={<MenuIcon />}
            color="inherit"
            onClick={handleOpenDrawer}
          />
        </Box>
        <Box textAlign="center">
          <Link id="Header_Title_Link" color="inherit" to={"charart.de"}>
            <img src={logo192} width={48} />
          </Link>
        </Box>
      </Toolbar>
    </AppBarMat>
  );
};

export default MenuBar;