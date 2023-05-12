import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "./custom.css";

interface Technique {
  _id: string;
  technique_id: string;
  technique_name: string;
  date_created: string;
  technique_desc: string;
  date_modified: string;
  subtechnique_id: string[];
  mitigation_id: string[];
  detection_id: string[];
  trRef?: React.RefObject<HTMLTableRowElement>;
}

interface TechniqueListProps {
  techniqueCount: number;
  highLightedTechniqueId?: string;
  setHighlightedMitigationId: React.Dispatch<React.SetStateAction<string>>;
  selectMitigationTable: () => void;
}

type SortableKeys =
  | "technique_id"
  | "technique_name"
  | "date_created"
  | "date_modified";

const TechniqueList: React.FC<TechniqueListProps> = ({
  setHighlightedMitigationId,
  selectMitigationTable,
  highLightedTechniqueId,
  techniqueCount,
}) => {
  const [techniqueList, setTechniqueList] = useState<Technique[]>([]);
  const [sortKey, setSortKey] = useState<string>("technique_id");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/techniques");
        const techniqueWithRefs = response.data.map((technique: Technique) => ({
          ...technique,
          trRef: React.createRef<HTMLTableRowElement>(),
        }));
        setTechniqueList(techniqueWithRefs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (highLightedTechniqueId) {
      const highLightedTechnique = techniqueList.find(
        (technique) => technique.technique_id === highLightedTechniqueId
      );

      highLightedTechnique?.trRef?.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, [highLightedTechniqueId, techniqueList]);

  const handleSort = (key: SortableKeys) => {
    const newSortOrder = sortKey === key ? sortOrder * -1 : 1;
    const newSortKey = key;

    const sortedList = [...techniqueList].sort((a, b) =>
      a[newSortKey] > b[newSortKey] ? 1 * newSortOrder : -1 * newSortOrder
    );
    setSortKey(newSortKey);
    setSortOrder(newSortOrder);
    setTechniqueList(sortedList);
  };

  return (
    <>
      {" "}
      {!isLoading ? (
        <div className="card">
          <div className="card-header">
            <h2 className="mb-4 d-flex justify-content-between">
              Techniques
              <span className="text-muted">Total: {techniqueCount}</span>
            </h2>
          </div>
          <div>
            <table className="table table-striped table-bordered">
              <thead className="text-center align-middle">
                <tr>
                  <th onClick={() => handleSort("technique_id")}>
                    Technique ID{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "technique_id"
                          ? sortOrder === 1
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th onClick={() => handleSort("technique_name")}>
                    Technique Name{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "technique_name"
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
                  <th>Sub-technique IDs</th>
                  <th>Related Mitigation IDs</th>
                  <th>Detection IDs</th>
                </tr>
              </thead>
              <tbody>
                {techniqueList.map((technique) => (
                  <tr
                    key={technique._id}
                    ref={technique.trRef}
                    className={
                      technique.technique_id === highLightedTechniqueId
                        ? "table-warning"
                        : ""
                    }
                  >
                    <td>{technique.technique_id}</td>
                    <td>{technique.technique_name}</td>
                    <td>{technique.date_created}</td>
                    <td>{technique.date_modified}</td>
                    <td>{technique.technique_desc}</td>
                    <td>{technique.subtechnique_id.join(", ")}</td>
                    <td>
                      {technique.mitigation_id.map((mitigationId, index) => (
                        <React.Fragment key={mitigationId}>
                          {mitigationId.trim() !== "NA" ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                selectMitigationTable();
                                setHighlightedMitigationId(mitigationId.trim());
                              }}
                            >
                              {mitigationId.trim()}
                            </a>
                          ) : (
                            mitigationId.trim()
                          )}
                          {index < technique.mitigation_id.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </td>
                    <td>{technique.detection_id.join(", ")}</td>
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

export default TechniqueList;
