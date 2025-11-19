import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useSearchParams, Link } from "react-router-dom";

const FilterPage = ({ className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const province = searchParams.get("province") || "";
  const district = searchParams.get("district") || "";
  const subDistrict = searchParams.get("subDistrict") || "";
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, farmsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/All`),
          axios.get(`${API_BASE_URL}/farms/AllwithProducts`),
        ]);

        const products = productsRes.data || [];
        const farmsData = farmsRes.data || [];
        const searchLower = searchQuery.toLowerCase();

        const filteredProducts = products.filter((product) => {
          if (searchQuery && !product.productName.toLowerCase().includes(searchLower)) {
            return false;
          }
          if (category && product.category !== category) {
            return false;
          }
          return true;
        });

        const results = farmsData
          .map((farm) => {
            if (province && farm.province !== province) return null;
            if (district && farm.district !== district) return null;
            if (subDistrict && farm.subDistrict !== subDistrict) return null;

            const matchedProducts = filteredProducts.filter(
              (product) => product.FID === farm.FID
            );
            if (matchedProducts.length === 0) return null;

            return {
              ...farm,
              matchedProducts,
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
  }, [searchQuery, category, province, district, subDistrict]);

  const handleRemoveFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams({});
  };

  const activeFilters = [
    searchQuery && { key: "search", label: `ค้นหา "${searchQuery}"` },
    category && { key: "category", label: `หมวดหมู่: ${category}` },
    province && { key: "province", label: `จังหวัด: ${province}` },
    district && { key: "district", label: `อำเภอ: ${district}` },
    subDistrict && { key: "subDistrict", label: `ตำบล: ${subDistrict}` },
  ].filter(Boolean);

  if (loading) return <div className={className}>Loading...</div>;

  return (
    <div className={className}>
      <div className="header">
        <h2 className="title">ผลการค้นหา</h2>
        {activeFilters.length > 0 ? (
          <div className="active-filters">
            {activeFilters.map((filter) => (
              <span key={filter.key} className="filter-chip">
                {filter.label}
                <button
                  type="button"
                  className="remove-filter-btn"
                  onClick={() => handleRemoveFilter(filter.key)}
                >
                  ×
                </button>
              </span>
            ))}
            <button className="clear-all-btn" onClick={handleClearAll}>
              ล้างทั้งหมด
            </button>
          </div>
        ) : (
          <div className="active-filters">
            <span className="filter-chip inactive">ไม่มีตัวกรอง</span>
          </div>
        )}
      </div>

      {farms.length === 0 ? (
        <div className="no-result">ไม่พบสินค้า</div>
      ) : (
        farms.map(farm => (
          <div key={farm.FID} className="farm-card">
            <div className="left">
              <Link to={`/farms/${farm.FID}`} className="farm-link">
                <img
                  src={farm.profileImage || "https://via.placeholder.com/150"}
                  alt={farm.farmName}
                />
              </Link>
            </div>
            <div className="right">
              <h3 className="farm-name">
                <Link to={`/farms/${farm.FID}`}>{farm.farmName}</Link>
              </h3>
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

  .header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .title {
    font-size: 22px;
    font-weight: 600;
  }

  .active-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .filter-chip {
    padding: 6px 14px;
    border-radius: 999px;
    background: #22c55e;
    color: white;
    font-size: 13px;
    font-weight: 500;

    &.inactive {
      background: #e5e7eb;
      color: #374151;
    }

    .remove-filter-btn {
      background: transparent;
      border: none;
      color: inherit;
      margin-left: 8px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 0;
    }
  }

  .clear-all-btn {
    background: transparent;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f3f4f6;
    }
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
    display: block;
  }

  .left .farm-link {
    display: block;
  }

  .right {
    padding: 16px;
    flex: 1;
  }

  .farm-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0;

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
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
