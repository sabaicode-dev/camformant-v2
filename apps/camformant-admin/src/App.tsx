import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageTitle from "./components/PageTitle";
import SignIn from "./page/Authentication/SignIn";
import Profile from "./page/Profile";
import Tables from "./page/ViewApplication";
import "./App.css";
import Chart from "./page/Chart";
import Post from "./page/Post";
import Camformant from "./page/Dashboard";
import { AuthProvider } from "./context/authContext";
import ProtectedRoutes from "./page/ProtectedRoute";
import Approval from "./page/Approval";
import ApprovalDetail from "./page/ApprovalDetail";
import NotFound from "./page/NotFound";
function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route
          path="/signin"
          element={
            <>
              <PageTitle title="Signin |  Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />

        <Route element={<ProtectedRoutes />}>
          <Route
            path="/dashboard"
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
                <Chart />
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
            index
            element={
              <>
                <PageTitle title="User Approval |  Admin Dashboard Template" />
                <Approval />
              </>
            }
          />
          <Route
            path="/approval/:userSub"
            element={
              <>
                <PageTitle title="User Approval Detail |  Admin Dashboard Template" />
                <ApprovalDetail />
              </>
            }
          ></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
export default App;
