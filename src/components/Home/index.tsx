import React, { useEffect, useState } from "react";
import AdvCarousel from "./AdvCarousel";
import FeaturedProducts from "./FeaturedProducts";
import LatestProducts from "./LatestProducts";
import HomeyOffer from "./HomeyOffer";
import UniqueProduct from "./UniqueProduct";
import TrendingProducts from "./TrendingProducts";
import axios from "@/axios";

type Product = {
  id: number;
  image: string;
  name: string;
  original_price: number;
  price: number;
};

const Home: React.FC = () => {
  const [featuredList, setFeaturedList] = useState([] as Product[]);
  const [latestList, setLatestList] = useState([] as Product[]);
  const [trendingList, setTrendingList] = useState([] as Product[]);
  const [sideList, setSideList] = useState([] as Product[]);

  useEffect(() => {
    axios.get("/product/findAll").then((resp) => {
      const featured: Product[] = [];
      const latest: Product[] = [];
      const trending: Product[] = [];
      const side: Product[] = [];
      resp.data.forEach((item: any) => {
        if (item.type === 1) {
          featured.push(item);
        } else if (item.type === 2) {
          latest.push(item);
        } else if (item.type === 3) {
          trending.push(item);
        } else if (item.type === 4) {
          side.push(item);
        }
      });
      setFeaturedList(featured);
      setLatestList(latest);
      setTrendingList(trending);
      setSideList(side);
    });
  }, []);

  return (
    <div>
      <AdvCarousel />
      <FeaturedProducts featuredList={featuredList} />
      <LatestProducts
        latestList={latestList}
        featuredList={featuredList}
        trendingList={trendingList}
        sideList={sideList}
      />
      <HomeyOffer />
      <UniqueProduct />
      <TrendingProducts trendingList={trendingList} sideList={sideList} />
    </div>
  );
};

export default Home;
