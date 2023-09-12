import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "./custom.css";

interface Group {
  _id: string;
  group_id: string;
  group_name: string;
  date_created: string;
  date_modified: string;
  group_desc: string;
  technique_id: string[];
  trRef?: React.RefObject<HTMLTableRowElement>;
}

interface GroupListProps {
  setHighlightedTechniqueId: React.Dispatch<React.SetStateAction<string>>;
  selectTechniqueTable: () => void;
  highlightedGroupId?: string;
  groupCount: number;
}

type SortableKeys =
  | "group_id"
  | "group_name"
  | "date_created"
  | "date_modified";

const GroupList: React.FC<GroupListProps> = ({
  setHighlightedTechniqueId,
  selectTechniqueTable,
  highlightedGroupId,
  groupCount,
}) => {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [sortKey, setSortKey] = useState<string>("group_id");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/groups");
        const groupsWithRefs = response.data.map((group: Group) => ({
          ...group,
          trRef: React.createRef<HTMLTableRowElement>(),
        }));
        setGroupList(groupsWithRefs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (highlightedGroupId) {
      const highlightedGroup = groupList.find(
        (group) => group.group_id === highlightedGroupId
      );

      highlightedGroup?.trRef?.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, [highlightedGroupId, groupList]);

  const handleSort = (key: SortableKeys) => {
    const newSortOrder = sortKey === key ? sortOrder * -1 : 1;
    const newSortKey = key;

    const sortedList = [...groupList].sort((a, b) =>
      a[newSortKey] > b[newSortKey] ? 1 * newSortOrder : -1 * newSortOrder
    );
    setSortKey(newSortKey);
    setSortOrder(newSortOrder);
    setGroupList(sortedList);
  };

  return (
    <>
      {" "}
      {!isLoading ? (
        <div className="card">
          <div className="card-header">
            <h2 className="mb-4 d-flex justify-content-between">
              Groups<span className="text-muted">Total: {groupCount}</span>
            </h2>
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
                {groupList.map((group) => (
                  <tr
                    key={group._id}
                    ref={group.trRef}
                    className={
                      group.group_id === highlightedGroupId
                        ? "table-warning"
                        : ""
                    }
                  >
                    <td>{group.group_id}</td>
                    <td>{group.group_name}</td>
                    <td>{group.date_created}</td>
                    <td>{group.date_modified}</td>
                    <td>{group.group_desc}</td>
                    <td>
                      {group.technique_id.map((techniqueId, index) => (
                        <React.Fragment key={techniqueId}>
                          {techniqueId.trim() !== "NA" ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                selectTechniqueTable();
                                setHighlightedTechniqueId(techniqueId);
                              }}
                            >
                              {techniqueId.trim()}
                            </a>
                          ) : (
                            techniqueId.trim()
                          )}
                          {index < group.technique_id.length - 1 && ", "}
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

export default GroupList;
