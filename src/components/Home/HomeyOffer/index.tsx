import React from "react";
import { nanoid } from "nanoid";
import { Card } from "antd";
import "./index.css";
import utils from "@/utils";

type HomeyOffer = {
  src: string
};

const homeyoffers: HomeyOffer[] = [
  { src: `${utils.s3Image}homeyOffer1.05748799.png` },
  { src: `${utils.s3Image}homeyOffer2.a857b50c.png` },
  { src: `${utils.s3Image}homeyOffer3.394b9473.png` },
  { src: `${utils.s3Image}homeyOffer4.83fe5a9f.png` },
];

const HomeyOffer: React.FC = () => (
  <div>
    <h1 className="homeyOffer-title">What Homey Offer!</h1>
    <div className="homeyOffer-list">
      {homeyoffers.map((item) => (
        <Card key={nanoid()} className="homeyOffer-item">
          <img src={item.src} className="homeyOffer-item-image" alt="img"></img>
        </Card>
      ))}
    </div>
  </div>
);

export default HomeyOffer;
