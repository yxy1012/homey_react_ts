import React from "react";
import { Carousel } from "antd";
import { nanoid } from "nanoid";
import utils from "@/utils";

const contentStyle = {
  width: "100%",
  height: "40rem",
  margin: "0rem",
  display: "block",
};

const items = [
  { src: `${utils.s3Image}advImage1.4b1ea812.png` },
  { src: `${utils.s3Image}advImage2.a98ccc97.png` },
  { src: `${utils.s3Image}advImage3.2123805a.png` },
  { src: `${utils.s3Image}advImage4.e7140e89.png` },
];

const AdvCarousel: React.FC = () => (
  <div>
    <Carousel autoplay>
      {items.map((item) => (
        <div key={nanoid()}>
          <img src={item.src} alt="img" style={contentStyle}></img>
        </div>
      ))}
    </Carousel>
  </div>
);

export default AdvCarousel;
