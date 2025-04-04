import React, { useMemo, useState } from "react";
import "./todolist.css";
import CheckIcon from "../icons/CheckIcon";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, setTask, updateTask, toggleTask } from "../../store/taskSlice";
import { setMessage, setVisible } from "../../store/alertSlice";

const TodoList = () => {
  const [filteredTasks, setFilteredTasks] = useState();
  const tasks = useSelector((state) => state.tasks.items);
  const selectedTab = useSelector((state) => state.tasks.filter);
  const dispatch = useDispatch();

  const handleToggleTask = (task) => {
    dispatch(toggleTask(task.id));
  };

  const handleClickAction = (item, action) => {
    switch (action) {
      case "delete": {
        if (confirm(`Are you sure want to delete this task?`)) {
          dispatch(deleteTask(item.id));
          dispatch(setMessage(`Task has been deleted successfully!`));
          dispatch(setVisible(true));
        }
        break;
      }
      default:
        break;
    }
  };

  useMemo(() => {
    let results;
    switch (selectedTab) {
      case "Active": {
        results = tasks.filter((item) => !item?.isCompleted);
        break;
      }
      case "Completed": {
        results = tasks.filter((item) => item?.isCompleted);
        break;
      }
      default:
        results = tasks;
        break;
    }
    setFilteredTasks(results);
  }, [selectedTab, tasks]);

  return (
    <div className="list_container">
      <ul className="list_items">
        {(!filteredTasks || filteredTasks?.length === 0) && (
          <li className="list_item">No task available.</li>
        )}
        {filteredTasks &&
          filteredTasks?.length > 0 &&
          filteredTasks?.map((task) => (
            <li className="list_item" key={`item_${task?.id}`}>
              <div className="list_title">
                <CheckIcon checked={task?.isCompleted} />
                {task?.title}
              </div>
              <div className="item_actions">
                <input
                  type="checkbox"
                  title="Toggle task status"
                  checked={task?.isCompleted}
                  onChange={() => handleToggleTask(task)}
                />
                <span title="Edit" onClick={() => dispatch(setTask(task))}>
                  <EditIcon />
                </span>
                <span
                  title="Delete"
                  onClick={() => handleClickAction(task, "delete")}
                >
                  <DeleteIcon />
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TodoList;
