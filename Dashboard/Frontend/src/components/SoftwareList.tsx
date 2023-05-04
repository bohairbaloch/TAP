import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

interface Software {
  _id: string;
  software_id: string;
  software_name: string;
  date_created: string;
  date_modified: string;
  software_desc: string;
  technique_id: string[];
  group_id: string;
}

interface SoftwareListProps {
  highlightedGroupId: string;
  setHighlightedGroupId: React.Dispatch<React.SetStateAction<string>>;
  selectGroupTable: () => void;
}

type SortableKeys =
  | "software_id"
  | "software_name"
  | "date_created"
  | "date_modified";

const SoftwareList: React.FC<SoftwareListProps> = ({
  highlightedGroupId,
  setHighlightedGroupId,
  selectGroupTable,
}) => {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [sortKey, setSortKey] = useState<string>("software_id");
  const [sortOrder, setSortOrder] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/software");
        setSoftwareList(response.data);
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
    const sortedList = [...softwareList].sort((a, b) =>
      a[key] > b[key] ? 1 * sortOrder : -1 * sortOrder
    );
    setSoftwareList(sortedList);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Software</h2>
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
              <th onClick={() => handleSort("date_created")}>
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
              <th onClick={() => handleSort("date_modified")}>
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
              <th>Group ID</th>
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
                <td>{software.technique_id.join(", ")}</td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      selectGroupTable();
                      setHighlightedGroupId(software.group_id);
                    }}
                  >
                    {software.group_id}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoftwareList;
