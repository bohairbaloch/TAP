// components/HomePage.tsx
import React from "react";
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
  return (
    <div className="home-page">
      <h2>Data Status</h2>
      <div className="row">
        {Object.entries(dataCounts).map(([key, count]) => (
          <div
            key={key}
            className={`col-md-3 col-sm-6 home-page__block home-page__block--${key}`}
            onClick={() => onNavigate(key)}
          >
            <div className="home-page__block-inner">
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <p>Total: {count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
