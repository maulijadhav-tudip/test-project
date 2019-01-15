import React, {Component} from "react";
import base64 from "base-64";
import "whatwg-fetch";
import ReactTable from "react-table";
import "react-table/react-table.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import {LinkContainer} from "react-router-bootstrap";
import {Link} from "react-router-dom";

const CheckboxTable = checkboxHOC(ReactTable);

class SelfTest extends Component {
  constructor(props) {
    super(props);
    this.getRequests = this.getRequests.bind(this);

    this.state = {
      tableOptions: {
// loading: true,
        showPagination: true,
        showPageSizeOptions: true,
        showPageJump: true,
        collapseOnSortingChange: true,
        collapseOnPageChange: true,
        collapseOnDataChange: true,
        freezeWhenExpanded: false,
        sortable: true,
        resizable: true
      },
      selection: [],
      selectAll: false,
      data: [],
      lastSelection: "",
      tableData: [
        {
          id: "1",
          Env: "env",
          Assigned: "y",
          Class: "class",
          TestStatus: "Not Tested",
          TestTemplate: "test2",
          Restart: "Restart"
        },
        {
          id: "2",
          Env: "env1",
          Assigned: "y",
          Class: "class",
          TestStatus: "In-progress",
          TestTemplate: "test2",
          Restart: "Restart"
        },
        {
          id: "3",
          Env: "env2",
          Assigned: "y",
          Class: "class",
          TestStatus: "Pass",
          TestTemplate: "test2",
          Restart: "Restart"
        },
        {
          id: "4",
          Env: "env3",
          Assigned: "y",
          Class: "class",
          TestStatus: "Fail",
          TestTemplate: "test2",
          Restart: "Restart"
        },
        {
          id: "5",
          Env: "env4",
          Assigned: "y",
          Class: "class",
          TestStatus: "Pass",
          TestTemplate: "test2",
          Restart: "Restart"
        },
      ],
      selectedData:[],
    };
  }

  getRequests() {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64.encode(window.localStorage.getItem("authToken") + ":x")
    );

    fetch("/api/ravello/create-tests", {
      method: "GET",
      headers: headers
    })
      .then(function (response) {
        return response.json();
      })
      .then(json => {
        let pageSizeOptions = [5, 10, 20, 25, 50, 100, json.length];

        this.setState({
          tableOptions: {
            loading: false,
            showPagination: true,
            showPageSizeOptions: true,
            showPageJump: true,
            collapseOnSortingChange: true,
            collapseOnPageChange: true,
            collapseOnDataChange: true,
            freezeWhenExpanded: false,
            filterable: true,
            sortable: true,
            resizable: true,
            pageSizeOptions: pageSizeOptions.sort(function (a, b) {
              return a - b;
            })
          },
          data: json.test_details,
        });
      })
      .catch(function (ex) {
        console.log(ex);
      });
  }


  componentDidMount() {
    this.getRequests();
  }

  setTestForRow(event, row) {
    const {id: rowId} = row._original;
    const currentState = this.state;
    currentState.tableData.find((data, index) => {
      if (data.id === rowId) {
        data.TestTemplate = event.target.value;
        currentState.tableData[index] = data;
      }
    });
    this.setState(currentState);
  }
  toggleSelection = (clickedKey, shift, row) => {
    console.log("selfTest------->",row);
    const { selectedData } = this.state;
    this.setState({selectedData: row});

  };

  render() {
    const {data, tableData} = this.state;
    const optionItems = data.map((data) =>
      <option value={data.name} key={data.name}>{data.name}</option>
    );
    const {toggleSelection, toggleAll, isSelected} = this;
    const {selectAll} = this.state;
    const checkboxProps = {
      toggleSelection,
      selectType: "checkbox",
    };
    const columns = [
      {
        Header: "Env",
        accessor: "Env",
        headerStyle: {background: "#00acdc"},
        style: {"text-align": "center"}
      },
      {
        Header: "Assigned",
        accessor: "Assigned",
        headerStyle: {background: "#00acdc"},
        style: {"text-align": "center"}
      },
      {
        Header: "Class",
        accessor: "Class",
        headerStyle: {background: "#00acdc"},
        style: {"text-align": "center"}
      },
      {
        Header: "Test Status",
        accessor: "TestStatus",
        headerStyle: {background: "#00acdc"},
        style: {"text-align": "center"}
      },
      {
        Header: "Test Template",
        accessor: "TestTemplate",
        headerStyle: {background: "#00acdc"},
        Cell: ({row}) =>
          <select
            onChange={event => this.setTestForRow(event, row)}
            style={{width: "100%"}}
          >
            {optionItems}
          </select>
      },
      {
        Header: "Restart",
        accessor: "Restart",
        headerStyle: {background: "#00acdc"},

        Cell: row => (
          <Link
            to={`/users/${row.value}`}
            className="button is-info is-fullwidth"
          >
            Restart
          </Link>
        ),
      },
    ];
    {console.log("selectedData--safsf-->", this.state.selectedData)}

    return (
      <div>
        <section className="section">
          <div className="container is-fluid">
            <div className="columns">
              <div className="column">
                <div className="field is-grouped">
                  <p className="control">
                    <LinkContainer to="">
                      <a className="button is-info">Select and Run Tests</a>
                    </LinkContainer>
                  </p>
                </div>
              </div>
            </div>

            <div className="box">
              <CheckboxTable
                keyField="id"
                ref={r => (this.checkboxTable = r)}
                className="-striped -highlight"
                data={tableData}
                columns={columns}
                {...checkboxProps}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default SelfTest;