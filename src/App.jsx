import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { checkAuth } from './store/slices/authSlice';
import ThemeProvider from './components/ThemeProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes';
import { BRANDING } from './config/branding';
import { initializeTheme } from './services/globalSettingsService';

function App() {
  useEffect(() => {
    // Check authentication status on app load
    store.dispatch(checkAuth());
    
    // Set document title from branding config
    document.title = BRANDING.PAGE_TITLE;
    
    // Initialize theme colors from settings
    initializeTheme();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

