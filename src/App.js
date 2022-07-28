import "./App.scss";
import axios from "axios";
import { useState } from "react";
import NewColumn from "./NewColumn";
import RenameColumn from "./RenameColumn";

function App() {
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [column, setColumn] = useState("");
  const [eXcolumn, seteXColumn] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);

  const fetch = (url) => {
    axios
      .get(url)
      .then((res) => {
        const data = res.data;

        if (!(data[0] instanceof Object)) throw new Error("Unsupported Format");

        setColumns(Object.keys(data[0]));
        setRows(data);
      })
      .catch((err) => setErr(err));
  };

  const addColumn = () => {
    setColumns([...columns, column]);
    setColumn("");
  };

  const renameColumn = () => {
    let newRows = rows.map((item) => item);
    newRows.forEach((item) => {
      item[column] = item[eXcolumn];
      delete item[eXcolumn];
    });

    const i = columns.indexOf(eXcolumn);
    const newColumnSet = columns.map((item) => item);
    newColumnSet[i] = column;

    setColumns(newColumnSet);
    setRows(newRows);
    setColumn("");
  };

  const removeColumn = (iii) => {
    let newRows = rows.map((item) => item);
    newRows.forEach((item) => {
      delete item[iii];
    });

    const i = columns.indexOf(iii);
    const newColumnSet = columns.map((item) => item);
    newColumnSet.splice(i, 1);

    setColumns(newColumnSet);
    setRows(newRows);
  };

  const addEmptyRow = () => {
    let obj = {};
    columns.forEach((element) => {
      obj[element] = "";
    });
    setRows([...rows, obj]);
  };

  const removeRow = (index) => {
    let newRows = rows.map((item) => item);
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const shiftRow = (index, up = true) => {
    const sindex = up ? index - 1 : index + 1;
    let newRows = rows.map((item) => item);
    const temp = newRows[sindex];
    newRows[sindex] = newRows[index];
    newRows[index] = temp;
    setRows(newRows);
  };

  const shiftColumn = (index, next = true) => {
    const sindex = next ? index + 1 : index - 1;
    let newColumns = columns.map((item) => item);
    const temp = newColumns[sindex];
    newColumns[sindex] = newColumns[index];
    newColumns[index] = temp;
    setColumns(newColumns);
  };

  const changeCellValue = (index, column, value) => {
    const newRows = rows.map((item) => item);
    newRows[index][column] = value;
    setRows(newRows);
  };
  return (
    <div className="App">
      <div className="topBar">
        <input
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          placeholder="Enter Url"
          name="url"
          type="text"
        ></input>
        <button onClick={() => fetch(url)}>Load</button>
        <button>Extract</button>
        <button onClick={() => setShowColumnModal(true)}>Add column</button>
        {/* <p className="errMsg">Error Here</p> */}
      </div>
      <div className="mainCont">
        <div className="row header">
          {columns.map((item, key) => (
            <div key={key} className="item">
              <p>{item}</p>

              <div className="column-action-bar">
                <div>
                  <button
                    onClick={() => shiftColumn(key, false)}
                    className={key === 0 ? "disabled" : ""}
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => shiftColumn(key, true)}
                    className={key === columns.length - 1 ? "disabled" : ""}
                  >
                    {">"}
                  </button>
                </div>
                <button
                  onClick={() => {
                    seteXColumn(item);
                    setColumn(item);
                    setShowRenameColumnModal(true);
                  }}
                >
                  Rename
                </button>
                <button onClick={() => removeColumn(item)}>Delete</button>
              </div>
            </div>
          ))}
          {rows.length > 0 && (
            <div key="Remove" className="item">
              rowActions
            </div>
          )}
        </div>
        {rows.map((item, rkey) => (
          <div key={rkey} className="row">
            {columns.map((col, ckey) => (
              <input
                onChange={(e) => changeCellValue(rkey, col, e.target.value)}
                key={ckey}
                value={item[col]}
                name
                type="text"
                className="item"
              ></input>
            ))}
            <div className="row-action-bar">
              <input
                onClick={() => removeRow(rkey)}
                key={rkey + "remove"}
                type="button"
                value="Delete"
              ></input>
              <input
                className={rkey !== 0 ? "" : "disabled"}
                onClick={() => shiftRow(rkey, true)}
                key={rkey + "up"}
                type="button"
                value="^"
              ></input>

              <input
                className={rkey !== rows.length - 1 ? "" : "disabled"}
                onClick={() => shiftRow(rkey, false)}
                key={rkey + "down"}
                type="button"
                value="v"
              ></input>
            </div>
          </div>
        ))}
        {columns.length > 0 && (
          <div key="big-row" className="row">
            <button onClick={() => addEmptyRow()} className="item big">
              Add row
            </button>
          </div>
        )}
      </div>
      <NewColumn
        show={showColumnModal}
        wannaShow={setShowColumnModal}
        existing_column={columns}
        value={column}
        set={setColumn}
        action={addColumn}
      />
      <RenameColumn
        show={showRenameColumnModal}
        wannaShow={setShowRenameColumnModal}
        existing_column={columns}
        value={column}
        set={setColumn}
        action={renameColumn}
      />
    </div>
  );
}

export default App;
