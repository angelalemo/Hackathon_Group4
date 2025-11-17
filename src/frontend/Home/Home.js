import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSquareOutline } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

export default function Home() {
  return (
    <Container>
      
      {/* -------- BANNER IMAGE -------- */}
      <Banner src="/banner_veg.jpg" alt="banner" />

      {/* -------- FARMER SECTION -------- */}
      <SectionHeader>
        <SectionTitle>เกษตรกร</SectionTitle>
        <SectionLine />
      </SectionHeader>

      <FarmerScrollContainer>
        <FarmerGrid>
          <FarmerCard>
            <FarmerIcon>
              <FaUser size={24} />
            </FarmerIcon>
            <FarmerName>โรงผักสร้างสุข</FarmerName>
          </FarmerCard>
          <FarmerCard>
            <FarmerIcon>
              <FaUser size={24} />
            </FarmerIcon>
            <FarmerName>กรีนเฮาส์</FarmerName>
          </FarmerCard>
          <FarmerCard>
            <FarmerIcon>
              <FaUser size={24} />
            </FarmerIcon>
            <FarmerName>กรีนโรด</FarmerName>
          </FarmerCard>
          <FarmerCard>
            <FarmerIcon>
              <FaUser size={24} />
            </FarmerIcon>
            <FarmerName>กรีนโรด</FarmerName>
          </FarmerCard>
        </FarmerGrid>
      </FarmerScrollContainer>

      {/* -------- ALL VEGETABLES -------- */}
      <SectionHeader>
        <SectionTitle>ผักทั้งหมด</SectionTitle>
        <SectionLine />
      </SectionHeader>

      <VegGrid>
        <VegItem>
          <img src="/veg01.png" alt="ผัก" />
          <p>คะน้า</p>
        </VegItem>

        <VegItem>
          <img src="/veg02.png" alt="ผัก" />
          <p>ผักกาดขาว</p>
        </VegItem>

        <VegItem>
          <img src="/veg03.png" alt="ผัก" />
          <p>หัวหอม</p>
        </VegItem>

        <VegItem>
          <img src="/veg04.png" alt="ผัก" />
          <p>มะเขือเทศ</p>
        </VegItem>

        <VegItem>
          <img src="/veg05.png" alt="ผัก" />
          <p>พริกชี้ฟ้า</p>
        </VegItem>

        <VegItem>
          <img src="/veg06.png" alt="ผัก" />
          <p>แตงกวา</p>
        </VegItem>

        <VegItem>
          <img src="/veg07.png" alt="ผัก" />
          <p>ต้นหอม</p>
        </VegItem>

        <VegItem>
          <img src="/veg08.png" alt="ผัก" />
          <p>หัวไชเท้า</p>
        </VegItem>

        <VegItem>
          <img src="/veg09.png" alt="ผัก" />
          <p>ตะไคร้</p>
        </VegItem>

        <VegItem>
          <img src="/veg10.png" alt="ผัก" />
          <p>ใบมะกรูด</p>
        </VegItem>

        <VegItem>
          <img src="/veg11.png" alt="ผัก" />
          <p>โหระพา</p>
        </VegItem>

        <VegItem>
          <img src="/veg12.png" alt="ผัก" />
          <p>แรดิช</p>
        </VegItem>

        <VegItem>
          <img src="/veg13.png" alt="ผัก" />
          <p>แครอท</p>
        </VegItem>

        <VegItem>
          <img src="/veg14.png" alt="ผัก" />
          <p>ผักกาดหวา</p>
        </VegItem>
      </VegGrid>
    </Container>
  );
}

/* -------- STYLES -------- */

const Container = styled.div`
  width: 100%;
  margin: auto;
  padding: 10px 15px 80px;
  background: #ffffff;
  font-family: "Prompt", sans-serif;

  @media (min-width: 768px) {
    padding: 20px 30px 80px;
  }

  @media (min-width: 1024px) {
    padding: 20px 50px 80px;
  }
`;

/* HEADER */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 8px 0;
`;

const MenuIcon = styled.div`
  cursor: pointer;
`;

const AppTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #2baa00;
  margin: 0;
  flex: 1;
  margin-left: 10px;
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #000;
`;

/* SEARCH */
const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f2f2f2;
  padding: 10px 12px;
  border-radius: 20px;
  margin-bottom: 15px;

  input {
    border: none;
    background: transparent;
    width: 100%;
    outline: none;
    font-size: 14px;
  }
`;

/* FILTERS */
const FilterRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const CategoryLabel = styled.span`
  font-size: 13px;
  color: #333;
  margin-right: 4px;
`;

const FilterChip = styled.div`
  padding: 6px 14px;
  background: #ffffff;
  border-radius: 18px;
  border: 1.5px solid #2baa00;
  font-size: 13px;
  color: #2baa00;
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* BANNER */
const Banner = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
  object-fit: cover;

  @media (min-width: 768px) {
    border-radius: 12px;
  }
`;

/* SECTION HEADER */
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 12px;
  width: 100%;

  @media (min-width: 768px) {
    margin-top: 24px;
    margin-bottom: 16px;
  }
`;

const SectionLine = styled.div`
  flex: 1;
  height: 2px;
  background: #2baa00;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0;
  color: #2baa00;
  white-space: nowrap;
`;

/* FARMER SCROLL CONTAINER */
const FarmerScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #2baa00 #f0f0f0;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #2baa00;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #228800;
  }
`;

/* FARMER CARDS */
const FarmerGrid = styled.div`
  display: flex;
  gap: 12px;
  min-width: min-content;
  padding-bottom: 4px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const FarmerCard = styled.div`
  background: #ececec;
  border-radius: 8px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 150px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    min-width: 180px;
    padding: 24px 15px;
  }
`;

const FarmerIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ececec;
`;

const FarmerName = styled.div`
  font-size: 14px;
  text-align: center;
  color: #333;
`;

/* VEG ITEMS */
const VegGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 50px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(7, 1fr);
    gap: 20px;
  }
`;

const VegItem = styled.div`
  text-align: center;
  font-size: 12px;

  img {
    width: 55px;
    height: 55px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #2baa00;
    padding: 3px;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    color: #333;
  }

  @media (min-width: 768px) {
    font-size: 13px;

    img {
      width: 65px;
      height: 65px;
    }
  }
`;
