import React, { useEffect } from "react";
import HomeHeader from "./components/HomeHeader";
import Brands from "./components/Brands";
import PageFooter from "./components/PageFooter";
import Copyright from "./components/Copyright";
import { ConfigProvider } from "antd";
import { useRoutes } from "react-router-dom";
import { connect } from "react-redux";
import { createStoreUserAction } from "@/redux/actions/user";
import routes from './routes';

const App = ({ storeUser }: any) => {
  const element = useRoutes(routes);
  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    const email = sessionStorage.getItem("userEmail");
    if (email && id) {
      storeUser({ id, email });
    }
  }, [storeUser]);
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#e628a6",
            colorLink: "#e628a6",
            colorLinkHover: "#ecb0d8",
          },
        }}
      >
        <HomeHeader />
        {element}
        <Brands />
        <PageFooter />
        <Copyright />
      </ConfigProvider>
    </div>
  );
};

export default connect((state: any) => ({ user: state.user }), {
  storeUser: createStoreUserAction,
})(App);
