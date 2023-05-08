import React, { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import SoftwareList from "./components/SoftwareList";
import TacticsList from "./components/TacticsList";
import GroupList from "./components/GroupList";
import MitigationList from "./components/MitigationList";
import "./components/custom.css";

const App: React.FC = () => {
  useEffect(() => {
    fetchDataCounts();
  }, []);

  const [selectedTable, setSelectedTable] = useState("home");
  const [highlightedGroupId, setHighlightedGroupId] = useState<string>("");

  const selectGroupTable = () => {
    setSelectedTable("groups");
  };

  const handleNavigation = (table: string) => {
    setSelectedTable(table);
  };

  const resetHighlightedRow = () => {
    setHighlightedGroupId("");
  };

  const [tableDataCounts, setTableDataCounts] = useState({
    software: 0,
    tactics: 0,
    groups: 0,
    mitigations: 0,
  });

  const fetchDataCounts = async () => {
    const softwareCount = await (await fetch("/api/software/count")).json();
    const tacticsCount = await (await fetch("/api/tactics/count")).json();
    const groupsCount = await (await fetch("/api/groups/count")).json();
    const mitigationsCount = await (
      await fetch("/api/mitigations/count")
    ).json();

    setTableDataCounts({
      software: softwareCount.count,
      tactics: tacticsCount.count,
      groups: groupsCount.count,
      mitigations: mitigationsCount.count,
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex">
        <div className="me-2">
          <div className="logo">TAP</div>
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
              highlightedGroupId={highlightedGroupId}
              setHighlightedGroupId={setHighlightedGroupId}
              selectGroupTable={selectGroupTable}
              softwareCount={tableDataCounts.software}
            />
          )}
          {selectedTable === "tactics" && (
            <TacticsList tacticCount={tableDataCounts.tactics} />
          )}
          {selectedTable === "groups" && (
            <GroupList
              highlightedGroupId={highlightedGroupId}
              groupCount={tableDataCounts.groups}
              resetHighlightedRow={resetHighlightedRow}
            />
          )}
          {selectedTable === "mitigations" && (
            <MitigationList mitigationCount={tableDataCounts.mitigations} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
