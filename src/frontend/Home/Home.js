import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  return (
    <Container>
      {/* -------- SEARCH -------- */}
      <SearchBox>
        <FaSearch color="#888" />
        <input type="text" placeholder="Search" />
      </SearchBox>

      {/* -------- FILTER CHIPS -------- */}
      <FilterRow>
        <Chip>หมวดหมู่</Chip>
        <Chip>ชนิดผัก</Chip>
        <Chip>ตำบล</Chip>
        <Chip>อำเภอ</Chip>
        <Chip>จังหวัด</Chip>
      </FilterRow>

      {/* -------- BANNER IMAGE -------- */}
      <Banner src="/banner_veg.jpg" alt="banner" />

      {/* -------- FARMER SECTION -------- */}
      <SectionTitle>เกษตรกร</SectionTitle>

      <FarmerGrid>
        <FarmerCard>โรงผักสร้างสุข</FarmerCard>
        <FarmerCard>กรันอาส์</FarmerCard>
        <FarmerCard>กรันโรด</FarmerCard>
        <FarmerCard>กรันโรด</FarmerCard>
      </FarmerGrid>

      {/* -------- ALL VEGETABLES -------- */}
      <SectionTitle>ผักทั้งหมด</SectionTitle>

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
          <p>หอมใหญ่</p>
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

        {/* ใส่เพิ่มได้เรื่อย ๆ */}
      </VegGrid>
    </Container>
  );
}

/* -------- STYLES -------- */

const Container = styled.div`
  width: 100%;
  max-width: 480px;  /* ขนาดมือถือ */
  margin: auto;
  padding: 10px 15px 80px;
  background: #ffffff;
  font-family: "Prompt", sans-serif;
`;

/* SEARCH */
const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f2f2f2;
  padding: 10px 12px;
  border-radius: 20px;
  margin: 8px 0 15px;

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
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const Chip = styled.div`
  padding: 6px 14px;
  background: #ffffff;
  border-radius: 18px;
  border: 1.5px solid #2baa00;
  font-size: 13px;
  color: #2baa00;
`;

/* BANNER */
const Banner = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
`;

/* SECTION TITLE */
const SectionTitle = styled.h2`
  font-size: 18px;
  margin-top: 16px;
  margin-bottom: 12px;
  color: #2baa00;
`;

/* FARMER CARDS */
const FarmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const FarmerCard = styled.div`
  background: #ececec;
  border-radius: 8px;
  padding: 20px 10px;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 14px;
`;

/* VEG ITEMS */
const VegGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 50px;
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
  }
`;
