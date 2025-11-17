import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const req = require.context('../../assets/farms', false, /\.(png|jpe?g|gif|webp|avif)$/);
const imagesMap = req.keys().reduce((acc, key) => {
  const filename = key.replace('./', '');
  acc[filename] = req(key);
  return acc;
}, {});
const getImage = (filename) => imagesMap[filename] || imagesMap['placeholder.png'];

function FarmCard({ farm, className }) {
  if (!farm) return null;
  const imgSrc = getImage(farm.image || 'placeholder.png');

  return (
    <li className={className}>
      <Link to={`/farm-detail/${farm.id}`}>
        <img className="FarmCard__image" src={imgSrc} alt={farm.name || 'Farm'} />
      </Link>

      <Link to={`/farm-detail/${farm.id}`} className="FarmCard__name">
        {farm.name}
      </Link>

      {farm.province && <small className="FarmCard__province">จังหวัด: {farm.province}</small>}
      {farm.district && <small className="FarmCard__district">อำเภอ: {farm.district}</small>}
      {farm.subDistrict && <small className="FarmCard__subdistrict">ตำบล: {farm.subDistrict}</small>}

      <Link to={`/farm-detail/${farm.id}`}>
        <button className="FarmCard__button">ดูรายละเอียด</button>
      </Link>
    </li>
  );
}

FarmCard.propTypes = {
  farm: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    province: PropTypes.string,
    district: PropTypes.string,
    subDistrict: PropTypes.string,
    image: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default styled(FarmCard)`
  width: 280px;
  height: 400px;
  background: #ffffff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  text-align: center;

  .FarmCard__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    background: #f5f5f5;
  }

  .FarmCard__name {
    font-weight: 600;
    color: #000000ff;
  }

  .FarmCard__province,
  .FarmCard__district,
  .FarmCard__subdistrict {
    color: #333333ff;
    font-size: 14px;
  }

  .FarmCard__button {
    background: linear-gradient(90deg, #22c55e 30%, #16a34a 63%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
  }
`;