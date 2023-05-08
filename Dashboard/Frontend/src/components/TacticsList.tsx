import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

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
  tacticCount: number;
}

type SortableKeys = "tactic_id" | "name" | "date_created" | "date_modified";

const TacticsList: React.FC<TacticsListProps> = ({ tacticCount }) => {
  const [tacticsList, setTacticsList] = useState<Tactic[]>([]);
  const [sortKey, setSortKey] = useState<SortableKeys>("tactic_id");
  const [sortOrder, setSortOrder] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/tactics");
        setTacticsList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleSort = (key: SortableKeys) => {
    if (sortKey === key) {
      setSortOrder(sortOrder * -1);
    } else {
      setSortKey(key);
      setSortOrder(1);
    }
    const sortedList = [...tacticsList].sort((a, b) =>
      a[key] > b[key] ? 1 * sortOrder : -1 * sortOrder
    );
    setTacticsList(sortedList);
  };

  return (
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
              <th>Technique IDs</th>
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
                <td>{tactic.technique_id.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TacticsList;
