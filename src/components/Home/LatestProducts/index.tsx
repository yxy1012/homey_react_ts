import React, { useEffect, useState } from "react";
import { Button, ConfigProvider } from "antd";
import { Link } from "react-router-dom";
import "./index.css";
import utils from "@/utils";

type LinkItem = {
  name: string;
};

const links: LinkItem[] = [
  { name: "New Arrival" },
  { name: "Best Seller" },
  { name: "Featured" },
  { name: "Speical Offer" },
];

type Product = {
  id: number;
  image: string;
  name: string;
  original_price: number;
  price: number;
};

interface IProps {
  latestList: Product[];
  featuredList: Product[];
  trendingList: Product[];
  sideList: Product[];
}

const LatestProducts: React.FC<IProps> = ({
  latestList,
  featuredList,
  trendingList,
  sideList,
}) => {
  const [list, setList] = useState(latestList);

  const switchList = (index: Number) => {
    switch (index) {
      case 0:
        return setList(latestList);
      case 1:
        return setList(trendingList);
      case 2:
        return setList(featuredList);
      case 3:
        return setList(sideList);
      default:
        return setList(latestList);
    }
  };

  useEffect(() => {
    setList(latestList);
  }, [latestList, featuredList, trendingList, sideList]);

  return (
    <div>
      <h1 className="latest-title">Latest Products</h1>
      <div className="latest-links">
        <ConfigProvider
          theme={{ token: { colorLink: "#f78989", colorLinkHover: "#efcccc" } }}
        >
          {links.map((item, index) => (
            <Button
              key={index}
              type="link"
              className="latest-link"
              onClick={() => switchList(index)}
            >
              {item.name}
            </Button>
          ))}
        </ConfigProvider>
      </div>
      <div className="latest-list">
        {list.map((item: Product) => (
          <Link
            key={item.id}
            to="/productDetails"
            state={{ item }}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="latest-item">
              <img src={item.image} className="latest-item-image" alt="img" />
              <span>{item.name}</span>
              <span className="latest-item-originalPrice">
                {utils.priceFilter(item.original_price)}
              </span>
              <span className="latest-item-price">
                {utils.priceFilter(item.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
