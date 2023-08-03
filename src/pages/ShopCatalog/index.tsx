import React, { Fragment, useEffect, useState } from "react";
import { Select } from "antd";
import "./index.css";
import { Link } from "react-router-dom";
import axios from "@/axios";
import utils from "@/utils";

const options = [
  { label: "All Items", value: "allItems" },
  { label: "Featured Items", value: "featuredList" },
  { label: "Latest Items", value: "latestList" },
  { label: "Trending Items", value: "trendingList" },
];

type Product = {
  id: number;
  image: string;
  name: string;
  original_price: number;
  price: number;
};

type Collection = {
  allItems: Product[];
  featuredList: Product[];
  latestList: Product[];
  trendingList: Product[];
};

type CollectionType = keyof Collection;

const ShopCatalog: React.FC = () => {
  const [list, setList] = useState([] as Product[]);
  const [allLists, setAllLists] = useState({} as Collection);

  useEffect(() => {
    axios.get("/product/findAll").then((resp) => {
      const all: Product[] = [];
      const featured: Product[] = [];
      const latest: Product[] = [];
      const trending: Product[] = [];
      const collection: Collection = {} as Collection;
      resp.data.forEach((item: any) => {
        all.push(item);
        if (item.type === 1) {
          featured.push(item);
        } else if (item.type === 2) {
          latest.push(item);
        } else if (item.type === 3) {
          trending.push(item);
        }
      });
      collection.allItems = all;
      collection.featuredList = featured;
      collection.latestList = latest;
      collection.trendingList = trending;
      setAllLists(collection);
      setList(collection.allItems);
    });
  }, []);
  return (
    <Fragment>
      <img
        className="shop-catalog"
        src={`${utils.s3Image}shopCatalog.44e313a8.png`}
        alt="logo"
      />
      <div className="shop-catalog-header">
        <div>
          <h3 style={{ margin: 0 }}>All Items</h3>
          <p className="shop-catalog-results">About {list.length} results</p>
        </div>
        <div>
          Sort by:
          <Select
            defaultValue="allItems"
            style={{ width: 130 }}
            options={options}
            onChange={(value: CollectionType) => setList(allLists[value])}
          ></Select>
        </div>
      </div>
      <div className="shop-catalog-content">
        {list.map((item) => (
          <Link
            style={{ color: "black", textDecoration: "none" }}
            to="/productDetails"
            state={{ item }}
            key={item.id}
          >
            <div className="shop-catalog-item">
              <img className="shop-catalog-image" src={item.image} alt="logo" />
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              <span>{utils.priceFilter(item.price)}</span>
              <span
                style={{
                  color: "red",
                  textDecoration: "line-through",
                  marginLeft: "0.5rem",
                }}
              >
                {utils.priceFilter(item.original_price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Fragment>
  );
};

export default ShopCatalog;
