import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

interface Mitigation {
  _id: string;
  mitigation_id: string;
  mitigation_name: string;
  date_created: string;
  mitigation_desc: string;
  date_modified: string;
}

interface MitigationListProps {
  mitigationCount: number;
}

type SortableKeys =
  | "mitigation_id"
  | "mitigation_name"
  | "date_created"
  | "date_modified";

const MitigationList: React.FC<MitigationListProps> = ({ mitigationCount }) => {
  const [mitigationsList, setMitigationsList] = useState<Mitigation[]>([]);
  const [sortKey, setSortKey] = useState<SortableKeys>("mitigation_id");
  const [sortOrder, setSortOrder] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/mitigations");
        setMitigationsList(response.data);
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
    const sortedList = [...mitigationsList].sort((a, b) =>
      a[key] > b[key] ? 1 * sortOrder : -1 * sortOrder
    );
    setMitigationsList(sortedList);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="mb-4 d-flex justify-content-between">
          Mitigations
          <span className="text-muted">Total: {mitigationCount}</span>
        </h2>
      </div>
      <div>
        <table className="table table-striped table-bordered">
          <thead className="text-center align-middle">
            <tr>
              <th onClick={() => handleSort("mitigation_id")}>
                Mitigation ID{" "}
                <FontAwesomeIcon
                  icon={
                    sortKey === "mitigation_id"
                      ? sortOrder === 1
                        ? faSortUp
                        : faSortDown
                      : faSort
                  }
                />
              </th>
              <th onClick={() => handleSort("mitigation_name")}>
                Mitigation Name{" "}
                <FontAwesomeIcon
                  icon={
                    sortKey === "mitigation_name"
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
            </tr>
          </thead>
          <tbody>
            {mitigationsList.map((mitigation) => (
              <tr key={mitigation._id}>
                <td>{mitigation.mitigation_id}</td>
                <td>{mitigation.mitigation_name}</td>
                <td>{mitigation.date_created}</td>
                <td>{mitigation.date_modified}</td>
                <td>{mitigation.mitigation_desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MitigationList;
