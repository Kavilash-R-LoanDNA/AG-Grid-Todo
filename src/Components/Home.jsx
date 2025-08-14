import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "./Home.css";

// AG Grid Styles
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


const Home = () => {
  const ref = useRef();
  const [rowData, setRowData] = useState([
    { sno: 1, task: "Task 1", isCompleted: "yes" },
    { sno: 2, task: "Task 2", isCompleted: "no" },
    { sno: 3, task: "Task 3", isCompleted: "no" },
  ]);

  // const [formData, setFormData] = useState({
  //   task: "",
  //   isCompleted: "",
  // });

  // Column definitions moved out of state

  const colDefs = [
  {
    field: "sno",
    headerName: "S.No",
    valueGetter: "node.rowIndex+1",
    maxWidth: 90,
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  { field: "task" },
  {
    field: "isCompleted",
    headerName: "isCompleted?",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {values: ["yes", "no"] },
  },
  {
    headerName: "Action",
    filter: false,
    cellRenderer: (params) => {
      return (
        <button
          className="delete-btn"
          onClick={() => {
            const delItem = confirm("want to delete?");

            if (delItem) {
              setRowData((prev) =>
                prev.filter((row) => row.sno !== params.data.sno)
              );
            }
          }}
        >
          Delete
        </button>
      );
    },
  },
];

  const colDefData = useMemo(() => {
    return colDefs;
  }, []);

  useEffect(() => {
    console.log("columnDef");
  }, [colDefData]);

  useEffect(() => {
    console.log("row data");
  }, [rowData]);

  // const handleAdd = () => {
  //   // if (!formData.task.trim()) {
  //   //   alert("Please enter a task!");
  //   //   return;
  //   // }
  //   const newSno =
  //     rowData.length > 0 ? Math.max(...rowData.map((row) => row.sno)) + 1 : 1;

  //   setRowData((prev) => [
  //     ...prev,
  //     // { sno: newSno, task: formData.task, isCompleted: formData.isCompleted },
  //     { sno: newSno, task: "", isCompleted: "" },
  //   ]);
  //   // setFormData({ task: "", isCompleted: "" });
  // };

  const [snoCounter, setSnoCounter] = useState(rowData.length);

  const handleAdd = () => {
    setSnoCounter((prev) => prev + 1);
    setRowData((prev) => [
      ...prev,
      { sno: snoCounter + 1, task: "", isCompleted: "" },
    ]);
  };

  const handleShow = () => {
    ref.current.api.stopEditing();
    console.log(rowData);
  };

  const [searchTxt,setSearchTxt] = useState("");

  const filteredData = useMemo(() => {
    if(!searchTxt) return rowData;
    return rowData.filter((row) => {
      return (
        row.task.toLowerCase().includes(searchTxt.toLowerCase()) ||
        row.isCompleted.toLowerCase().includes(searchTxt.toLowerCase())
      );
    });
  }, [rowData, searchTxt]);

  useEffect(() => {
    console.log("filtered data", filteredData, "searchTxt", searchTxt);
  }, [filteredData]);


  const onSearch = (e) => {
    // if (ref.current) {
    //   ref.current.api.setGridOption("quickFilterText", e.target.value.trim());
    // }
    setSearchTxt(e.target.value.trim());

  };

  const onDelete = () => {
    const delItems = confirm("Do you want to deleted selected items?");

    if (delItems) {
      const selectedNodes = ref.current.api.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      const newData = rowData.filter((row) => !selectedData.includes(row));
      setRowData(newData);
      ref.current.api.deselectAll();
    }
  };

  return (
    <div style={{ padding: 20 }} className="container">
      <h3>Todo App</h3>
      <div
        style={{
          margin: "10px",
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <input
          style={{ borderRadius: "10px", borderWidth: "1px" }}
          onInput={onSearch}
          id="search-inp"
          placeholder="search.."
          type="search"
        />
        <button style={{ backgroundColor: "#ff6565ff" }} onClick={onDelete}>
          Delete Selected{" "}
        </button>
      </div>

      <div
        style={{
          height: 400,
          width: 650,
          borderRadius: "8px",
          overflow: "hidden",
         
        }}
        // className="ag-theme-alpine"
      >
        <AgGridReact
          ref={ref}
          rowData={filteredData}
          columnDefs={colDefData}
          defaultColDef={{
            flex: 1,
            sortable: true,
            // filter: true,
            editable: true,
            suppressCellFocus: false, // Removes border highlight
            cellStyle: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
          rowHeight={50}
          pagination={true}
          paginationPageSize={6}
          paginationPageSizeSelector={[6, 10, 20, 50]}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          deltaRowDataMode={true}
          domLayout="autoHeight"
        />
      </div>

      <div style={{ marginTop: 10 }}>
        {/* <input
          type="text"
          placeholder="Task"
          value={formData.task}
          onChange={(e) => setFormData({ ...formData, task: e.target.value })}
        />

        <input
          type="text"
          placeholder="isCompleted"
          value={formData.isCompleted}
          onChange={(e) => setFormData({ ...formData, isCompleted: e.target.value })}
        /> */}

        {/* <label style={{ marginLeft: 5 }}>
          Completed?
          <input
            type="checkbox"
            checked={formData.isCompleted}
            onChange={(e) =>
              setFormData({ ...formData, isCompleted: e.target.checked })
            }
            style={{ marginLeft: 5 }}
          />
        </label> */}

        {/*  */}

        <div style={{ marginTop: 10 }}>
          <button
            style={{
              marginRight: "10px",
              paddingLeft: "25px",
              paddingRight: "25px",
            }}
            className="add-btn"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            style={{ paddingLeft: "25px", paddingRight: "25px" }}
            className="show-btn"
            onClick={handleShow}
          >
            Show
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
