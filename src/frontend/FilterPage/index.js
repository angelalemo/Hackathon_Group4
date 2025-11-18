import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useSearchParams, Link } from "react-router-dom";

const FilterPage = ({ className }) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, farmsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/All`),
          axios.get(`${API_BASE_URL}/farms/AllwithProducts`)
        ]);

        const products = productsRes.data || [];
        const farmsData = farmsRes.data || [];

        // ค้นหาสินค้า
        const matchedProducts = products.filter(p =>
          p.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // จับคู่ฟาร์มกับสินค้าที่ตรง
        const results = farmsData
          .map(farm => {
            const matched = matchedProducts.filter(p => p.FID === farm.FID);
            if (matched.length === 0) return null;

            return {
              ...farm,
              matchedProducts: matched
            };
          })
          .filter(Boolean);

        setFarms(results);
      } catch (e) {
        console.error("Error fetching filter data:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchQuery]);

  if (loading) return <div className={className}>Loading...</div>;

  return (
    <div className={className}>
      <h2 className="title">ผลการค้นหา: {searchQuery}</h2>

      {farms.length === 0 ? (
        <div className="no-result">ไม่พบสินค้า</div>
      ) : (
        farms.map(farm => (
          <div key={farm.FID} className="farm-card">
            <div className="left">
              <img
                src={farm.image || "https://via.placeholder.com/150"}
                alt={farm.farmName}
              />
            </div>
            <div className="right">
              <h3 className="farm-name">{farm.farmName}</h3>
              <p className="address">
                {farm.province} • {farm.district} • {farm.subDistrict}
              </p>

              <div className="product-list">
                {farm.matchedProducts.map(p => (
                  <Link
                    key={p.PID}
                    to={`/product/${p.PID}`}
                    className="product-item"
                  >
                    {p.productName} — {p.price} บาท
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default styled(FilterPage)`
  padding: 20px;

  .title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .farm-card {
    display: flex;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 18px;
    border: 1px solid #e5e7eb;
  }

  .left img {
    width: 180px;
    height: 140px;
    object-fit: cover;
  }

  .right {
    padding: 16px;
    flex: 1;
  }

  .farm-name {
    font-size: 18px;
    font-weight: 700;
  }

  .address {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0 8px;
  }

  .product-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .product-item {
    color: #22c55e;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
