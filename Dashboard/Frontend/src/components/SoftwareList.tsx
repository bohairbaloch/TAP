import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "./custom.css";

interface Software {
  _id: string;
  software_id: string;
  software_name: string;
  date_created: string;
  date_modified: string;
  software_desc: string;
  technique_id: string[];
  group_id: string[];
}

interface SoftwareListProps {
  setHighlightedGroupId: React.Dispatch<React.SetStateAction<string>>;
  setHighlightedTechniqueId: React.Dispatch<React.SetStateAction<string>>;
  selectGroupTable: () => void;
  selectTechniqueTable: () => void;
  softwareCount: number;
}

type SortableKeys =
  | "software_id"
  | "software_name"
  | "date_created"
  | "date_modified";

const SoftwareList: React.FC<SoftwareListProps> = ({
  setHighlightedGroupId,
  setHighlightedTechniqueId,
  selectGroupTable,
  selectTechniqueTable,
  softwareCount,
}) => {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [sortKey, setSortKey] = useState<string>("software_id");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/software");
        setSoftwareList(response.data);
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

    const sortedList = [...softwareList].sort((a, b) =>
      a[newSortKey] > b[newSortKey] ? 1 * newSortOrder : -1 * newSortOrder
    );
    setSortKey(newSortKey);
    setSortOrder(newSortOrder);
    setSoftwareList(sortedList);
  };

  return (
    <>
      {" "}
      {!isLoading ? (
        <div className="card">
          <div className="card-header">
            <h2 className="mb-4 d-flex justify-content-between">
              Software
              <span className="text-muted">Total: {softwareCount}</span>
            </h2>
          </div>
          <div>
            <table className="table table-striped table-bordered">
              <thead className="text-center align-middle">
                <tr>
                  <th onClick={() => handleSort("software_id")}>
                    Software ID{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "software_id"
                          ? sortOrder === 1
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th onClick={() => handleSort("software_name")}>
                    Software Name{" "}
                    <FontAwesomeIcon
                      icon={
                        sortKey === "software_name"
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
                  <th>Related Group IDs</th>
                </tr>
              </thead>
              <tbody>
                {softwareList.map((software) => (
                  <tr key={software._id}>
                    <td>{software.software_id}</td>
                    <td>{software.software_name}</td>
                    <td>{software.date_created}</td>
                    <td>{software.date_modified}</td>
                    <td>{software.software_desc}</td>
                    <td>
                      {software.technique_id.map((techniqueId, index) => (
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
                          {index < software.technique_id.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </td>
                    <td>
                      {software.group_id.map((groupId, index) => (
                        <React.Fragment key={groupId}>
                          {groupId.trim() !== "NA" ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                selectGroupTable();
                                setHighlightedGroupId(groupId);
                              }}
                            >
                              {groupId.trim()}
                            </a>
                          ) : (
                            groupId.trim()
                          )}
                          {index < software.group_id.length - 1 && ", "}
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

export default SoftwareList;
