import React, { useState } from "react";
import SoftwareList from "./components/SoftwareList";
import TacticsList from "./components/TacticsList";
import GroupList from "./components/GroupList";
import MitigationList from "./components/MitigationList";

const App: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState("software");
  const [highlightedGroupId, setHighlightedGroupId] = useState<string>("");

  const selectGroupTable = () => {
    setSelectedTable("groups");
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Cyber Reporting Parser and Database Dashboard</h1>
      <div className="d-flex">
        <div className="me-2">
          <div className="list-group">
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "software" ? " active" : ""
              }`}
              onClick={() => setSelectedTable("software")}
            >
              Software
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "tactics" ? " active" : ""
              }`}
              onClick={() => setSelectedTable("tactics")}
            >
              Tactics
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "groups" ? " active" : ""
              }`}
              onClick={() => setSelectedTable("groups")}
            >
              Groups
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action${
                selectedTable === "mitigations" ? " active" : ""
              }`}
              onClick={() => setSelectedTable("mitigations")}
            >
              Mitigations
            </a>
          </div>
        </div>
        <div className="content">
          {selectedTable === "software" && (
            <SoftwareList
              highlightedGroupId={highlightedGroupId}
              setHighlightedGroupId={setHighlightedGroupId}
              selectGroupTable={selectGroupTable}
            />
          )}
          {selectedTable === "tactics" && <TacticsList />}
          {selectedTable === "groups" && (
            <GroupList highlightedGroupId={highlightedGroupId} />
          )}
          {selectedTable === "mitigations" && <MitigationList />}
        </div>
      </div>
    </div>
  );
};

export default App;
