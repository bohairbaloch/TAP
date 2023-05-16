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
    software: <BsGrid3X3Gap />,
    tactics: <FaGavel />,
    groups: <HiOutlineUsers />,
    mitigations: <RiShieldUserFill />,
    techniques: <TiChartBarOutline />,
  };

  return (
    <div className="home-page">
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', margin: '1rem 0' }}>Cyber-Security Parser</h1>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 500, textAlign: 'center', margin: '1rem 0', color: '#555' }}>The website is a comprehensive platform that focuses on providing detailed and up-to-date information about various aspects of cyber security, including software, groups, mitigations, techniques, and tactics. The website's main objective is to educate and inform users about the latest developments in the field of cyber security, providing a valuable resource for students, professionals, and anyone interested in cyber security.

The software section of the website covers the latest software used in the cyber security industry, including antivirus software, firewalls, and intrusion detection systems. Users can learn about the features and benefits of each software and find recommendations for the best software to use in different situations.

The groups section provides information about various cyber threat actor groups, including their tactics, motives, and capabilities. Users can learn about different groups and their methods of attack, allowing them to stay informed about the latest cyber threats and protect their systems against potential attacks.

The mitigations section provides information about specific vulnerabilities and the measures that can be taken to mitigate them. Users can learn about different vulnerabilities and find recommendations for the best practices to follow to protect their systems from these vulnerabilities.

The techniques section provides information about the latest techniques used by attackers and defenders in the cyber security industry. Users can learn about different techniques and find recommendations for the best practices to follow to stay ahead of potential cyber threats.

Finally, the tactics section provides information about the latest tactics used by attackers and defenders in the cyber security industry. Users can learn about different tactics and find recommendations for the best practices to follow to protect their systems against potential attacks.

Overall, the website is a valuable resource for anyone interested in cyber security, providing comprehensive and up-to-date information about the latest software, groups, mitigations, techniques, and tactics used in the industry.</h3>
      {Object.entries(dataCounts).map(([key, count]) => (
        <div
          key={key}
          className={`home-page__block home-page__block--${key}`}
          onClick={() => onNavigate(key)}
        >
          <div className="home-page__block-inner">
            <div className="home-page__block-icon large-icon">{categoryIcons[key]}</div>
            <div className="home-page__block-content">
              <h3 style={{ textAlign: 'center'}}>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <p style={{ textAlign: 'center'}}>Total: {count}</p>
              <p style={{ textAlign: 'center'}}>{categoryDescriptions[key]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
