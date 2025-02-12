import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import useStyles from './Root.styles';
import { Header } from '../../components';
import { AppContext } from '../../context';

function Root() {
  const classes = useStyles();

  const { buttonRoute, buttonTitle } = useContext(AppContext);

  return (
    <div className={classes.root}>
      <Header buttonRoute={buttonRoute} buttonTitle={buttonTitle} />
      <Outlet />
    </div>
  );
}

export default Root;
