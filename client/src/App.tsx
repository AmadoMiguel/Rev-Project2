import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './App.css';
import colors from './assets/Colors';
import Budget from './components/Budget.component';
import Expenses from './components/Expenses.component';
import Incomes from './components/Incomes.component';
import Login from './components/Login.component';
import Logout from './components/Logout.component';
import NavBar from './components/Navbar.component';
import Overview from './components/Overview.component';
import Register from './components/Register.component';
import User from './components/User.component';
import { persistor, store } from './redux/Store';
import { getThemeProps } from '@material-ui/styles';


// We will define our theme here, feel free to add to it.
// All components will inherit from this.
// https://material-ui.com/customization/themes/
// Of course, we needn't use Material UI, open to suggestions~

const theme = createMuiTheme({
  // Override CSS types of any component
  overrides: {
    MuiDivider: {
      root: {
        backgroundColor: colors.teal
      }
    },
    MuiTablePagination: {
      root: {
        marginLeft: '-35px'
      }
    }
  },
  // Override the props of any component
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'secondary'
    }
  },
  // Theme settings
  palette: {
    primary: {
      main: colors.lightGreen
    },
    secondary: {
      main: colors.teal
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <Redirect to="/login" />
            <div style={{ height: '7px', width: '100%', backgroundColor: colors.darkGreen }} />
            <NavBar />
            <br />
            <Route path="/" exact component={Overview} />
            <Route path="/login" exact component={Login} />
            <Route path="/logout" exact component={Logout} />
            <Route path="/register" exact component={Register} />
            <Route path="/user" exact component={User} />
            <Route path="/incomes" exact component={Incomes} />
            <Route path="/budget" exact component={Budget} />
            <Route path="/expenses" exact component={Expenses} />
          </Router>
        </MuiThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
