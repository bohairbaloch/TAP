import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "./custom.css";

interface Tactic {
  _id: string;
  tactic_id: string;
  name: string;
  date_created: string;
  tactic_desc: string;
  date_modified: string;
  technique_id: string[];
}

interface TacticsListProps {
  setHighlightedTechniqueId: React.Dispatch<React.SetStateAction<string>>;
  selectTechniqueTable: () => void;
  tacticCount: number;
}

type SortableKeys = "tactic_id" | "name" | "date_created" | "date_modified";

const TacticsList: React.FC<TacticsListProps> = ({
  setHighlightedTechniqueId,
  selectTechniqueTable,
  tacticCount,
}) => {
  const [tacticsList, setTacticsList] = useState<Tactic[]>([]);
  const [sortKey, setSortKey] = useState<SortableKeys>("tactic_id");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/tactics");
        setTacticsList(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSort = (key: SortableKeys) => {
    const newSortOrder = sortKey === key ? sortOrder * -1 : 1;
    const newSortKey = key;

    const sortedList = [...tacticsList].sort((a, b) =>
      a[newSortKey] > b[newSortKey] ? 1 * newSortOrder : -1 * newSortOrder
    );
    setSortKey(newSortKey);
    setSortOrder(newSortOrder);
    setTacticsList(sortedList);
  };

  return (
    <>
      {" "}
      {!isLoading ? (
        <div className="card">
          <div className="card-header">
            <h2 className="mb-4 d-flex justify-content-between">
              Tactics<span className="text-muted">Total: {tacticCount}</span>
            </h2>
          </div>
          <div>
            <table className="table table-striped table-bordered">
              <thead className="text-center align-middle">
                <tr>
                  <th onClick={() => handleSort("tactic_id")}>
                    Tactic ID{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "tactic_id"
                          ? sortOrder === 1
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th onClick={() => handleSort("name")}>
                    Name{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "name"
                          ? sortOrder === 1
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th
                    className="wide-date-column"
                    onClick={() => handleSort("date_created")}
                  >
                    Date Created{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "date_created"
                          ? sortOrder === 1
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th
                    className="wide-date-column"
                    onClick={() => handleSort("date_modified")}
                  >
                    Date Modified{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "date_modified"
                          ? sortOrder === 1
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th>Description</th>
                  <th>Related Technique IDs</th>
                </tr>
              </thead>
              <tbody>
                {tacticsList.map((tactic) => (
                  <tr key={tactic._id}>
                    <td>{tactic.tactic_id}</td>
                    <td>{tactic.name}</td>
                    <td>{tactic.date_created}</td>
                    <td>{tactic.date_modified}</td>
                    <td>{tactic.tactic_desc}</td>
                    <td>
                      {tactic.technique_id.map((techniqueId, index) => (
                        <React.Fragment key={techniqueId}>
                          {techniqueId.trim() !== "NA" ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                selectTechniqueTable();
                                setHighlightedTechniqueId(techniqueId.trim());
                              }}
                            >
                              {techniqueId.trim()}
                            </a>
                          ) : (
                            techniqueId.trim()
                          )}
                          {index < tactic.technique_id.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
};

export default TacticsList;
