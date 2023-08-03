import React from "react";
import { Button } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import "./index.css";

const shareIcons = [
  <FacebookOutlined />,
  <InstagramOutlined />,
  <TwitterOutlined />,
];

const Copyright: React.FC = () => (
  <div className="copyright">
    <div className="copyright-content">©Homey - All Rights Reserved</div>
    <div>
      {shareIcons.map((item, index) => (
        <Button
          key={index}
          className="copyright-button"
          shape="circle"
          icon={item}
        ></Button>
      ))}
    </div>
  </div>
);

export default Copyright;
