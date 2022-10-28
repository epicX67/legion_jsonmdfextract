import "./App.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import NewColumn from "./NewColumn";
import RenameColumn from "./RenameColumn";
import logo from "./logo.png";
import list from "./res/list.png";
import add from "./res/add.png";
import analytics from "./res/analytics.png";
import NewGame from "./NewGame";

function App() {
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [column, setColumn] = useState("");
  const [eXcolumn, seteXColumn] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);
  const [showNewGameModal, setShowNewGameModal] = useState(false);

  useEffect(() => {
    setColumns([
      "name",
      "link",
      "wideImage",
      "tallImage",
      "squareImage",
      "circleImage",
      "category",
      "creator",
      "date",
      "gender",
      "description",
    ]);

    addEmptyRow();
  }, []);

  const fetch = (url) => {
    axios
      .get(url)
      .then((res) => {
        const data = res.data;

        if (!(data[0] instanceof Object)) throw new Error("Unsupported Format");

        setColumns(getColumns(data));
        setRows(data);
      })
      .catch((err) => setErr(err));
  };

  const getMappedData = () => {
    const data = rows.map((item) => {
      let obj = {};
      columns.forEach((col) => {
        obj[col] = item[col];
      });
      return obj;
    });
    return JSON.stringify(data);
  };

  const getColumns = (data) => {
    let currColumns = [];
    data.forEach((item) => {
      let currKeys = Object.keys(item);

      currKeys.forEach((item) => {
        if (!currColumns.includes(item)) {
          currColumns.push(item);
        }
      });
    });

    return currColumns;
  };

  const extract = () => {
    const element = document.createElement("a");
    const file = new Blob([getMappedData()], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const copyToClipboard = () => {
    const data = getMappedData();
    navigator.clipboard.writeText(data);
  };

  const importFromClipboard = () => {
    navigator.clipboard
      .readText()
      .then((value) => {
        const data = JSON.parse(value);
        if (!(data[0] instanceof Object)) throw new Error("Unsupported Format");

        setColumns(getColumns(data));
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

  const addNewGame = (game) => {
    setRows([...rows, game]);
  };
  return (
    <div className="App">
      <div className="sidebar">
        <div className="header">
          <img className="sidebarLogo" src={logo} alt="logo" />
          <div>LEGiON</div>
        </div>
        <div className="menuSection">
          <div className="headTitle">Administration</div>
          <div className="menuItem">
            <img src={list} alt="list" />
            <div className="title">Game list</div>
          </div>
        </div>
        <div className="menuSection">
          <div className="headTitle">General</div>
          <div className="menuItem">
            <img src={analytics} alt="analytics" />
            <div className="title">Analytics</div>
          </div>
          <div className="menuItem" onClick={() => setShowNewGameModal(true)}>
            <img src={add} alt="add" />
            <div className="title">Add game</div>
          </div>
        </div>
      </div>
      <div className="topBar">
        <input
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          placeholder="Enter Url"
          name="url"
          type="text"
          className="url"
        ></input>
        <button onClick={() => fetch(url)}>Load</button>
        <button onClick={() => extract()}>Extract</button>
        <button onClick={() => copyToClipboard()}>Copy</button>
        <button onDoubleClick={() => importFromClipboard()}>Inject</button>
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
            <div className="item row-action-bar">
              <input
                onClick={() => removeRow(rkey)}
                key={rkey + "remove"}
                type="button"
                value="X"
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
      <NewGame
        show={showNewGameModal}
        wannaShow={setShowNewGameModal}
        action={addNewGame}
        columns={columns}
      />
    </div>
  );
}

export default App;
