import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "./custom.css";

interface Mitigation {
  _id: string;
  mitigation_id: string;
  mitigation_name: string;
  date_created: string;
  mitigation_desc: string;
  date_modified: string;
  trRef?: React.RefObject<HTMLTableRowElement>;
}

interface MitigationListProps {
  highlightedMitigationId?: string;
  mitigationCount: number;
}

type SortableKeys =
  | "mitigation_id"
  | "mitigation_name"
  | "date_created"
  | "date_modified";

const MitigationList: React.FC<MitigationListProps> = ({
  mitigationCount,
  highlightedMitigationId,
}) => {
  const [mitigationsList, setMitigationsList] = useState<Mitigation[]>([]);
  const [sortKey, setSortKey] = useState<SortableKeys>("mitigation_id");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/mitigations");
        const mitigationsWithRefs = response.data.map(
          (mitigation: Mitigation) => ({
            ...mitigation,
            trRef: React.createRef<HTMLTableRowElement>(),
          })
        );
        setMitigationsList(mitigationsWithRefs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (highlightedMitigationId) {
      const highlightedMitigation = mitigationsList.find(
        (mitigation) => mitigation.mitigation_id === highlightedMitigationId
      );

      highlightedMitigation?.trRef?.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, [highlightedMitigationId, mitigationsList]);

  const handleSort = (key: SortableKeys) => {
    const newSortOrder = sortKey === key ? sortOrder * -1 : 1;
    const newSortKey = key;

    const sortedList = [...mitigationsList].sort((a, b) =>
      a[newSortKey] > b[newSortKey] ? 1 * newSortOrder : -1 * newSortOrder
    );
    setSortKey(newSortKey);
    setSortOrder(newSortOrder);
    setMitigationsList(sortedList);
  };

  return (
    <>
      {" "}
      {!isLoading ? (
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
                  <tr
                    key={mitigation._id}
                    ref={mitigation.trRef}
                    className={
                      mitigation.mitigation_id === highlightedMitigationId
                        ? "table-warning"
                        : ""
                    }
                  >
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
      ) : (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
};

export default MitigationList;
