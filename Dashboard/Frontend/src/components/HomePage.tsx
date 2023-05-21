// components/HomePage.tsx
import React from "react";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaGavel } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { RiShieldUserFill } from "react-icons/ri";
import { TiChartBarOutline } from "react-icons/ti";
import "./HomePage.css";

interface HomePageProps {
  onNavigate: (table: string) => void;
  dataCounts: {
    software: number;
    tactics: number;
    groups: number;
    mitigations: number;
    techniques: number;
  };
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, dataCounts }) => {
  const categoryDescriptions = {
    software: "Information about software used in security",
    tactics: "Tactics used by attackers and defenders",
    groups: "Information about threat actor groups",
    mitigations: "Mitigations for specific vulnerabilities",
    techniques: "Techniques used by attackers and defenders",
  };

  const categoryIcons = {
    software: <BsGrid3X3Gap className="yellow-icon" />,
    tactics: <FaGavel className="yellow-icon" />,
    groups: <HiOutlineUsers className="yellow-icon" />,
    mitigations: <RiShieldUserFill className="yellow-icon" />,
    techniques: <TiChartBarOutline className="yellow-icon" />,
  };

  return (
    <div className="home-page">
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'left', margin: '1rem 0' }}>Cyber-Security Parser</h1>

      <div className="home-page__blocks-container">
        {Object.entries(dataCounts).map(([key, count]) => (
          <div
            key={key}
            className={`home-page__block home-page__block--${key}`}
            onClick={() => onNavigate(key)}
          >
            <div className="home-page__block-inner">
              <div className="home-page__block-icon large-icon">{categoryIcons[key]}</div>
              <div className="home-page__block-content">
                <h3 style={{ textAlign: 'center' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p style={{ textAlign: 'center' }}>Total: {count}</p>
                <p style={{ textAlign: 'center' }}>{categoryDescriptions[key]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
