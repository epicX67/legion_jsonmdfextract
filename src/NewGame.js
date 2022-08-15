import React, { useEffect, useState } from "react";
import "./Modal.scss";

export default function NewGame({ show, wannaShow, columns, action }) {
  const [state, setState] = useState(() => columns.map((item) => ""));
  const clearState = () => setState(columns.map((item) => ""));

  useEffect(() => {
    clearState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  return (
    show && (
      <div className="modal">
        <div className="dialog-box">
          <p>Add new game</p>

          <>
            {state.map((item, index) => (
              <input
                onChange={(e) => {
                  let nState = state.map((item) => item);
                  nState[index] = e.target.value;
                  setState(nState);
                }}
                value={item}
                name="column-name"
                type="text"
                placeholder={`Enter ${columns[index]}`}
              ></input>
            ))}
          </>
          <div>
            <button
              className={state.length > 0 && state[0] !== "" ? "" : "disabled"}
              onClick={() => {
                let obj = {};
                columns.map((item, index) => {
                  obj[item] = state[index];
                });
                clearState();
                action(obj);
                wannaShow(false);
              }}
            >
              Add
            </button>
            <button
              onClick={() => {
                clearState();
                wannaShow(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
}
