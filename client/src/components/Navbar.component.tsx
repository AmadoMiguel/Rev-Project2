import { createStyles, Icon, List, ListItem, makeStyles, Theme, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import colors from '../assets/Colors';
import Logo from '../assets/Logo.svg';
import { IState, IUiState, IUserState } from '../redux';
import { setMobileView } from '../redux/actions';
import Login from './LoginPopover.component';
import { Sidebar } from './Sidebar.component';

const useStyles = makeStyles((theme: Theme) => createStyles({
  logo: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  navbar: {
    color: 'primary'
  },
  title: {
    textTransform: 'initial',
    color: colors.offWhite
  },
  nav_item: {
    width: '85px',
    marginLeft: '10px',
    textTransform: 'initial',
    fontSize: '16px',
    color: colors.offWhite
  },
  nav_right: {
    marginRight: '10px',
    marginLeft: 'auto'
  }
}));

interface INavProps {
  user: IUserState;
  ui: IUiState;
  setMobileView: (val: boolean) => void;
  history: any;
  location: any;
  match: any;
}

function NavBar(props: INavProps) {
  const classes = useStyles(props);

  // Login form
  const [loginOpen, setLoginOpen] = useState(false);

  // Hide/show navbar on scroll
  const [isTopView, setTopView] = useState(true);

  // Hide/show sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  window.onscroll = () => {
    if (window.pageYOffset >= 10) {
      isTopView && setTopView(false);
    } else {
      !isTopView && setTopView(true);
    }
  };

  // Hook into React lifecycle methods.
  // Called only twice when component mounts/unmounts.
  useEffect(() => {
    // Mobile view query
    const mediaQuery = window.matchMedia('(min-width: 800px)');
    const listener = () => {
      props.setMobileView(!mediaQuery.matches);
    }
    // Add listener to update view type
    mediaQuery.addListener(listener);
    // Remove listener when component unmounts
    return () => mediaQuery.removeListener(listener);
  }, [])

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  function onPage(route: string) {
    return props.location.pathname == route;
  }

  return (
    <Fragment>
      <Sidebar history={props.history} open={sidebarOpen} handleClose={handleSidebarClose} isLoggedIn={props.user.isLoggedIn} />
      <AppBar style={{ borderBottom: !isTopView ? `1px solid ${colors.darkGreen}` : undefined, boxShadow: 'none', backgroundColor: isTopView ? 'transparent' : 'rgba(75, 168, 118, 0.95)' }} position='sticky'>
        <Toolbar className={classes.navbar}>
          {props.ui.isMobileView &&
            <Button style={{ marginRight: '5px', maxWidth: '40px', minWidth: '40px' }} variant='text' onClick={handleSidebarOpen}>
              <Icon style={{ fontSize: 30, color: colors.offWhite }}>menu</Icon>
            </Button>}
          <Button className={classes.title} variant='text' component={Link} to="/">
            <img alt='' width='30px' height='30px' src={Logo} />
            <Typography style={{ fontSize: '20px', textTransform: 'initial' }} variant='button'>Budgy</Typography>
          </Button>
          {!props.ui.isMobileView &&
            <Fragment>
              <Button size='small' className={classes.nav_item} variant='text' component={Link} to="/"
                style={{
                  marginLeft: '50px',
                  textDecoration: onPage('/') ? `underline` : undefined
                }}>
                Overview
              </Button>
              <Button size='small' className={classes.nav_item} variant='text' component={Link} to="/budget"
                style={{
                  textDecoration: onPage('/budget') ? `underline` : undefined
                }}>
                Budget
              </Button>
              <Button size='small' className={classes.nav_item} variant='text' component={Link} to="/expenses"
                style={{
                  textDecoration: onPage('/expenses') ? `underline` : undefined
                }}>
                Expenses
              </Button>
              <Button size='small' className={classes.nav_item} variant='text' component={Link} to="/incomes"
                style={{
                  textDecoration: onPage('/incomes') ? `underline` : undefined
                }}>
                Incomes
              </Button>
            </Fragment>}
          <div className={classes.nav_right}>
            {props.user.isLoggedIn ? (
              <List>
                <ListItem>
                  <Button size='small' className={classes.nav_item} variant='text' color='secondary' component={Link} to="/user"
                    style={{
                      width: props.ui.isMobileView ? '90%' : undefined,
                      marginRight: props.ui.isMobileView ? '-8px' : undefined,
                      fontSize: props.ui.isMobileView ? '14px' : undefined
                    }}>
                    Account
                  </Button>
                  <Button size='small' className={classes.nav_item}
                    variant='text' color='secondary'
                    component={Link} to="/logout"
                    style={{
                      width: props.ui.isMobileView ? '90%' : undefined,
                      marginRight: props.ui.isMobileView ? '-30px' : undefined,
                      fontSize: props.ui.isMobileView ? '14px' : undefined
                    }}>
                    Logout
                  </Button>
                </ListItem>
              </List>
            ) : (
                <List>
                  <ListItem>
                    {props.ui.isMobileView ? (
                      <Button className={classes.nav_item} id='loginButton' size='small' variant='outlined' color='secondary'
                        style={{ width: '90%', borderColor: colors.offWhite, fontSize: '12px' }}
                        component={Link} to='/login'>
                        Login
                      </Button>
                    ) : (
                        <Button className={classes.nav_item} id='loginButton' size='small' variant='outlined' color='secondary'
                          style={{ borderColor: colors.offWhite }} onClick={handleLoginOpen}>
                          Login
                        </Button>
                      )}
                    <Login open={loginOpen} handleClose={handleLoginClose} anchorEl={document.getElementById('loginButton')} />
                    <Button className={classes.nav_item} size='small' variant='contained' color='secondary'
                      style={{
                        marginRight: props.ui.isMobileView ? '-30px' : undefined,
                        width: props.ui.isMobileView ? '90%' : undefined,
                        backgroundColor: colors.orange,
                        fontSize: props.ui.isMobileView ? '12px' : undefined
                      }}
                      component={Link} to="/register">
                      Register
                    </Button>
                  </ListItem>
                </List>
              )}
          </div>
        </Toolbar>
      </AppBar >
    </Fragment >
  );
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

const mapDispatchToProps = {
  setMobileView: setMobileView
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
