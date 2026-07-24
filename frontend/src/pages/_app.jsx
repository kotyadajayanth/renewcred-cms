import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/store';
import { restoreToken } from '../store/authSlice';
import '../styles/globals.css';

// page refresh wipes the redux store, but the token itself is still sitting
// in localStorage, so we just pull it back in on mount instead of forcing
// the admin to log in again every time they refresh the page.
function TokenRestorer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem('renewcred_token');
    if (saved) dispatch(restoreToken(saved));
  }, [dispatch]);

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <TokenRestorer>
        <Component {...pageProps} />
      </TokenRestorer>
    </Provider>
  );
}
