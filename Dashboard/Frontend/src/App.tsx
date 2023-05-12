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
    <div className="container mt-4">
      <div className="d-flex">
        <div className="me-2">
          <div className="logo">
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "home" ? " active" : ""
              }`}
              onClick={() => {
                setSelectedTable("home");
                resetHighlightedRow();
              }}
            >
              TAP
            </a>
          </div>
          <div className="list-group fixed-nav">
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "home" ? " active" : ""
              }`}
              onClick={() => {
                setSelectedTable("home");
                resetHighlightedRow();
              }}
            >
              Home
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "software" ? " active" : ""
              }`}
              onClick={() => {
                setSelectedTable("software");
                resetHighlightedRow();
              }}
            >
              Software
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "tactics" ? " active" : ""
              }`}
              onClick={() => {
                setSelectedTable("tactics");
                resetHighlightedRow();
              }}
            >
              Tactics
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "groups" ? " active" : ""
              }`}
              onClick={() => {
                setSelectedTable("groups");
                resetHighlightedRow();
              }}
            >
              Groups
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "mitigations" ? " active" : ""
              }`}
              onClick={() => {
                setSelectedTable("mitigations");
                resetHighlightedRow();
              }}
            >
              Mitigations
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "techniques" ? " active" : ""
              }`}
              onClick={() => {
                setSelectedTable("techniques");
                resetHighlightedRow();
              }}
            >
              Techniques
            </a>
          </div>
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
