import React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';

// Pages
import MainPage from 'pages/main';

const App = () => <MainPage />;

export default hot(module)(App);
