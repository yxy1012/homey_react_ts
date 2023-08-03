import React from "react";
import "./index.css";
import utils from "@/utils";

const brands = { src: `${utils.s3Image}brandsImage.4bdebff3.png` };

const Brands: React.FC = () => (
  <div className="brands">
    <img className="brands-image" src={brands.src} alt="img" />
  </div>
);

export default Brands;
