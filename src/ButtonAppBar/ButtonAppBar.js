// Feb 18 2019 https://material-ui.com/demos/app-bar/
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import {useTranslation} from "react-i18next";

const styles = {
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const {classes} = props;
  const {t, i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [lanCode, setLanCode] = useState(i18n.language);

  useEffect(() => {
    i18n.changeLanguage(lanCode);
  }, [lanCode]);

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const onMenuItemClick = lng => {
    closeMenu();
    setLanCode(lng);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {t('title')}
          </Typography>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Languages"
            aria-owns={!!anchorEl ? 'long-menu' : undefined}
            aria-haspopup="true"
            onClick={e => setAnchorEl(e.currentTarget)}
          >
            <LanguageIcon/>
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => closeMenu()}
          >
            {
              t('supportedLanguages', {returnObjects: true}).map(lan => {
                return <MenuItem
                  onClick={() => onMenuItemClick(lan.code)}
                  selected={lan.code === lanCode}
                  key={lan.code}>
                  {lan.display}
                </MenuItem>
              })
            }
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
