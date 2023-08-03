import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { Link } from "react-router-dom";
import "./index.css";
import utils from "@/utils";

const trendCards = [
  {
    title: "23% off in all products",
    color: "#fef6fb",
    action: "Shop Now",
    src: `${utils.s3Image}trendCard1.884e87fa.png`,
    width: "8rem",
    height: "7rem",
  },
  {
    title: "23% off in all products",
    color: "#efeffa",
    action: "View Collection",
    src: `${utils.s3Image}trendCard2.dd7a060b.png`,
    width: "15rem",
    height: "5rem",
  },
];

const cardStyle = {
  padding: "0.3rem",
};

type Product = {
  id: number;
  image: string;
  name: string;
  original_price: number;
  price: number;
};

interface IProps {
  trendingList: Product[];
  sideList: Product[];
}

const TrendingProducts: React.FC<IProps> = ({ trendingList, sideList }) => {
  const [items, setItems] = useState(trendingList);
  const [trendSide, setTrendSide] = useState(sideList);
  useEffect(() => {
    setItems(trendingList);
    setTrendSide(sideList);
  }, [trendingList, sideList]);
  return (
    <div>
      <h1 className="trending-title">Trending Products</h1>
      <div className="trending-list">
        {items.map((item: Product) => (
          <Link
            key={item.id}
            to="/productDetails"
            state={{ item }}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="trending-item" bodyStyle={cardStyle}>
              <img
                src={item.image}
                className="trending-item-image"
                alt="img"
              ></img>
              <h4>{item.name}</h4>
              <span>{utils.priceFilter(item.price)}</span>
              <span className="trending-item-originalPrice">
                {utils.priceFilter(item.original_price)}
              </span>
            </Card>
          </Link>
        ))}
      </div>
      <div className="trending-card-side">
        {trendCards.map((item, index) => (
          <div
            key={index}
            style={{ backgroundColor: item.color }}
            className="trending-card"
          >
            <h3>{item.title}</h3>
            <Button type="link" className="trending-card-button">
              {item.action}
            </Button>
            <div className="trending-card-image-wrapper">
              <img
                src={item.src}
                style={{ width: item.width, height: item.height }}
                alt="img"
              ></img>
            </div>
          </div>
        ))}
        <div>
          {trendSide.map((item: Product) => (
            <Link
              key={item.id}
              to="/productDetails"
              state={{ item }}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="trend-side-item">
                <img
                  src={item.image}
                  className="trend-side-item-image"
                  alt="img"
                ></img>
                <div>
                  <div className="trend-side-item-name">{item.name}</div>
                  <div>
                    <span>{utils.priceFilter(item.price)}</span>
                    <span className="trend-side-item-originalPrice">
                      {utils.priceFilter(item.original_price)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;
