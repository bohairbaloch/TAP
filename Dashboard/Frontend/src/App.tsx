import React, { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import SoftwareList from "./components/SoftwareList";
import TacticsList from "./components/TacticsList";
import GroupList from "./components/GroupList";
import MitigationList from "./components/MitigationList";
import TechniqueList from "./components/TechniqueList";
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    fetchDataCounts();
  }, []);

  const [selectedTable, setSelectedTable] = useState("home");
  const [highlightedGroupId, setHighlightedGroupId] = useState<string>("");
  const [highlightedMitigationId, setHighlightedMitigationId] =
    useState<string>("");
  const [highlightedTechniqueId, setHighlightedTechniqueId] =
    useState<string>("");

  const selectGroupTable = () => {
    setSelectedTable("groups");
  };

  const selectTechniqueTable = () => {
    setSelectedTable("techniques");
  };

  const selectMitigationTable = () => {
    setSelectedTable("mitigations");
  };

  const handleNavigation = (table: string) => {
    setSelectedTable(table);
  };

  const resetHighlightedRow = () => {
    setHighlightedGroupId("");
    setHighlightedMitigationId("");
    setHighlightedTechniqueId("");
  };

  const [tableDataCounts, setTableDataCounts] = useState({
    software: 0,
    tactics: 0,
    groups: 0,
    mitigations: 0,
    techniques: 0,
  });

  const fetchDataCounts = async () => {
    const softwareCount = await (await fetch("/api/software/count")).json();
    const tacticsCount = await (await fetch("/api/tactics/count")).json();
    const groupsCount = await (await fetch("/api/groups/count")).json();
    const mitigationsCount = await (
      await fetch("/api/mitigations/count")
    ).json();
    const techniquesCount = await (await fetch("/api/techniques/count")).json();

    setTableDataCounts({
      software: softwareCount.count,
      tactics: tacticsCount.count,
      groups: groupsCount.count,
      mitigations: mitigationsCount.count,
      techniques: techniquesCount.count,
    });
  };

  return (
    <div className="root">
      <nav className="navbar navbar-expand-lg navbar-dark bg-black">
      <div className="container">
    <div className="mx-auto">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </div>
    <div className="collapse navbar-collapse" id="navbarNav">
  <ul className="navbar-nav">
    <li className="nav-item">
      <a href="#" className={`btn btn-outline-warning btn-lg ${selectedTable === "home" ? "active" : ""}`} onClick={() => {
        setSelectedTable("home");
        resetHighlightedRow();
      }}>
        <i className="fas fa-home"></i> Home
      </a>
    </li>
    <li className="nav-item">
      <a href="#" className={`btn btn-outline-warning btn-lg ${selectedTable === "software" ? "active" : ""}`} onClick={() => {
        setSelectedTable("software");
        resetHighlightedRow();
      }}>
        Software
      </a>
    </li>
    <li className="nav-item">
      <a href="#" className={`btn btn-outline-warning btn-lg ${selectedTable === "tactics" ? "active" : ""}`} onClick={() => {
        setSelectedTable("tactics");
        resetHighlightedRow();
      }}>
        Tactics
      </a>
    </li>
    <li className="nav-item">
      <a href="#" className={`btn btn-outline-warning btn-lg ${selectedTable === "groups" ? "active" : ""}`} onClick={() => {
        setSelectedTable("groups");
        resetHighlightedRow();
      }}>
        Groups
      </a>
    </li>
    <li className="nav-item">
      <a href="#" className={`btn btn-outline-warning btn-lg ${selectedTable === "mitigations" ? "active" : ""}`} onClick={() => {
        setSelectedTable("mitigations");
        resetHighlightedRow();
      }}>
        Mitigations
      </a>
    </li>
    <li className="nav-item">
    <a href="#"className={`btn btn-outline-warning btn-lg ${selectedTable === "techniques" ? " active" : ""}`}onClick={() => {
                setSelectedTable("techniques");
                resetHighlightedRow();
              }}
            >
        Techniques
      </a>
    </li>
  </ul>
</div>
</div>
      </nav>
      <div className="d-flex">
        <div className="me-2">
        </div>
        <div className="content">
          {selectedTable === "home" && (
            <HomePage
              onNavigate={handleNavigation}
              dataCounts={tableDataCounts}
            />
          )}
          {selectedTable === "software" && (
            <SoftwareList
              setHighlightedGroupId={setHighlightedGroupId}
              selectGroupTable={selectGroupTable}
              selectTechniqueTable={selectTechniqueTable}
              setHighlightedTechniqueId={setHighlightedTechniqueId}
              softwareCount={tableDataCounts.software}
            />
          )}
          {selectedTable === "tactics" && (
            <TacticsList
              selectTechniqueTable={selectTechniqueTable}
              setHighlightedTechniqueId={setHighlightedTechniqueId}
              tacticCount={tableDataCounts.tactics}
            />
          )}
          {selectedTable === "groups" && (
            <GroupList
              selectTechniqueTable={selectTechniqueTable}
              setHighlightedTechniqueId={setHighlightedTechniqueId}
              highlightedGroupId={highlightedGroupId}
              groupCount={tableDataCounts.groups}
            />
          )}
          {selectedTable === "mitigations" && (
            <MitigationList
              highlightedMitigationId={highlightedMitigationId}
              mitigationCount={tableDataCounts.mitigations}
              selectTechniqueTable={selectTechniqueTable}
              setHighlightedTechniqueId={setHighlightedTechniqueId}
            />
          )}
          {selectedTable === "techniques" && (
            <TechniqueList
              selectMitigationTable={selectMitigationTable}
              setHighlightedMitigationId={setHighlightedMitigationId}
              highLightedTechniqueId={highlightedTechniqueId}
              techniqueCount={tableDataCounts.techniques}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
