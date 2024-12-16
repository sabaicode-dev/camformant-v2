import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PageTitle from './components/PageTitle';
import SignIn from './page/Authentication/SignIn';
import SignUp from './page/Authentication/SignUp';
import Profile from './page/Profile';
import Tables from './page/ViewApplication';
import Settings from './page/Settings';
import './App.css';
import Chart from './page/Chart';
import Loader from './common/Loader';
import Post from "./page/Post"
import Camformant from './page/Dashboard';
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);


  return loading ? (
    <Loader />
  ) : (
    
    <>
      <Routes>
      <Route
          index
          element={
            <>
              <PageTitle title="Dashboard |  Admin Dashboard Template" />
              <Camformant />
            </>
          }
        />
      <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile |  Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
         <Route
          path="/post"
          element={
            <>
              <PageTitle title="Post |  Admin Dashboard Template" />
              <Post />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
               <PageTitle title="Basic Chart | Admin Dashboard Template" />
              <Chart/>
            </>
          }
        />
         <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables |  Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
         <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings |  Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
         <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin |  Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
         <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup |  Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </>
)};
export default App;
