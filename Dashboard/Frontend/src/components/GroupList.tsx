import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "./Highlight.css";

interface Group {
  _id: string;
  group_id: string;
  group_name: string;
  date_created: string;
  date_modified: string;
  group_desc: string;
  technique_id: string[];
}

interface GroupListProps {
  highlightedGroupId?: string;
}

type SortableKeys =
  | "group_id"
  | "group_name"
  | "date_created"
  | "date_modified";

const GroupList: React.FC<GroupListProps> = ({ highlightedGroupId }) => {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [sortKey, setSortKey] = useState<string>("group_id");
  const [sortOrder, setSortOrder] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/groups");
        setGroupList(response.data);
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
    const sortedList = [...groupList].sort((a, b) =>
      a[key] > b[key] ? 1 * sortOrder : -1 * sortOrder
    );
    setGroupList(sortedList);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Groups</h2>
      </div>
      <div>
        <table className="table table-striped table-bordered">
          <thead className="text-center align-middle">
            <tr>
              <th onClick={() => handleSort("group_id")}>
                Group ID{" "}
                <FontAwesomeIcon
                  icon={
                    sortKey === "group_id"
                      ? sortOrder === 1
                        ? faSortUp
                        : faSortDown
                      : faSort
                  }
                />
              </th>
              <th onClick={() => handleSort("group_name")}>
                Group Name{" "}
                <FontAwesomeIcon
                  icon={
                    sortKey === "group_name"
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
            </tr>
          </thead>
          <tbody>
            {groupList.map((group) => (
              <tr
                key={group._id}
                className={
                  group.group_id === highlightedGroupId ? "table-warning" : ""
                }
              >
                <td>{group.group_id}</td>
                <td>{group.group_name}</td>
                <td>{group.date_created}</td>
                <td>{group.date_modified}</td>
                <td>{group.group_desc}</td>
                <td>{group.technique_id.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupList;
