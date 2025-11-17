import React, { useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const req = require.context("./asset", false, /\.(png|jpe?g|gif|webp|avif)$/);

const images = req.keys().map((key) => ({
  filename: key.replace("./", ""),
  src: req(key)
}));

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images.length) {
    return <Wrap>ไม่มีรูปภาพในแสดง</Wrap>;
  }

  const currentImage = images[currentIndex].src;

  return (
    <Wrap>
      <CarouselContainer>
        <Button onClick={prev}>
          <ChevronLeft size={24} />
        </Button>

        <BannerCard>
          <BannerImage src={currentImage} alt="Banner" />
        </BannerCard>

        <Button onClick={next}>
          <ChevronRight size={24} />
        </Button>
      </CarouselContainer>
    </Wrap>
  );
}

const Wrap = styled.div`
  text-align: center;

  h1 {
    font-weight: 700;
    margin-bottom: 40px;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  max-width: 100%;
  margin: 0 auto;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const BannerCard = styled.div`
margin-top:20px;
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 0px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
`;

const Button = styled.button`
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: background 0.3s ease;

  &:hover {
    background: #f0f0f0;
  }
`;
