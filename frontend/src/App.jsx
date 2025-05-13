// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from './store/session';
import HomePage from "./components/HomePage";
import { ModalProvider, Modal } from './context/Modal';
import SpotList from './spots/SpotList';
import SpotDetails from './spots/SpotDetails';
import Footer from "./components/Footer/Footer"; 
import CreateSpotForm from './spots/CreateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <div className="app-content">
        {isLoaded && <Outlet />}
      </div>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: '/spots',
        element: <SpotList />
      },
      { 
        path: '/spots/:spotId', 
        element: <SpotDetails /> },
      {
        path: '/spots/new',
        element: <CreateSpotForm/>

      }
    ]
  }
]);

function App() {
  return (
    <ModalProvider>
      <Modal />
      <RouterProvider router={router} />
    </ModalProvider>
  );
}

export default App;