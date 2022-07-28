import React, { useState } from "react";
import "./Modal.scss";

export default function NewColumn({
  show,
  wannaShow,
  action,
  existing_column = [],
  value,
  set,
}) {
  const [isValid, setValid] = useState(false);
  const valid = (val) => {
    if (val === "") {
      setValid(false);
      return;
    }

    const x = existing_column.find(
      (item) => item.trim().toLowerCase() === val.trim().toLowerCase()
    );

    if (x) {
      setValid(false);
      return;
    }

    setValid(true);
  };
  return (
    show && (
      <div className="modal">
        <div className="dialog-box">
          <p>Add column</p>
          <input
            onChange={(e) => {
              set(e.target.value);
              valid(e.target.value);
            }}
            value={value}
            name="column-name"
            type="text"
            placeholder="Enter new column name"
          ></input>
          <div>
            <button
              onClick={() => {
                set("");
                wannaShow(false);
              }}
            >
              Cancel
            </button>
            <button
              className={isValid ? "" : "disabled"}
              onClick={() => {
                action();
                wannaShow(false);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
}
