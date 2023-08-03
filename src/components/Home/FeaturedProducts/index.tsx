import React, { useEffect, useState } from "react";
import { Card } from "antd";
import "./index.css";
import { Link } from "react-router-dom";
import utils from "@/utils";

const cardStyle = {
  padding: "0rem",
};

type FeaturedItem = {
  id: number;
  image: string;
  name: string;
  price: number;
};

interface IProps {
  featuredList: Array<FeaturedItem>;
}

const FeaturedProducts: React.FC<IProps> = ({ featuredList }) => {
  const [items, setItems] = useState(featuredList);
  useEffect(() => {
    setItems(featuredList);
  }, [featuredList]);
  return (
    <div>
      <h1 className="featured-title">Featured Products</h1>
      <div className="featured-list">
        {items.map((item: FeaturedItem) => (
          <Link
            key={item.id}
            to="/productDetails"
            state={{ item }}
            style={{ textDecoration: "none" }}
          >
            <Card className="featured-item" bodyStyle={cardStyle}>
              <img src={item.image} className="featured-item-image" alt="img" />
              <h3 className="featured-item-name">{item.name}</h3>
              <div className="featured-item-price">
                {utils.priceFilter(item.price)}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
