import React, {Component} from "react";
import base64 from "base-64";
import "whatwg-fetch";
import ReactTable from "react-table";
import "react-table/react-table.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import {Link} from "react-router-dom";

const CheckboxTable = checkboxHOC(ReactTable);

const restartButtonStyle = {
  'width': '50%',
  'margin-left': '40px',
}

class SelfTest extends Component {
  constructor(props) {
    super(props);
    this.getRequests = this.getRequests.bind(this);
    this.postMultipleRequest = this.postMultipleRequest.bind(this);

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

      selectedLab: {},
      notification: false,
      notificationText: "",
      notificationType: "",
      redir: false,
      loadedForm: false,

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
          Restart: "Restart",
        },
      ],
      selectedData: [],
    };
  }

  getRequests() {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64.encode(window.localStorage.getItem("authToken") + ":x")
    );

    fetch("/api/ravello/test-template", {
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

  postMultipleRequest(e) {
    let selection = this.state.selection;
    selection.forEach(x => {
      let headers = new Headers();
      headers.append(
        "Authorization",
        "Basic " +
        base64.encode(window.localStorage.getItem("authToken") + ":x")
      );
      e.preventDefault();
      this.setState({
        notification: true,
        notificationText: "Request Submitting....",
        notificationType: "notification is-info",
      });

      let formData = new FormData();
      formData.append("Env", x.Env);
      formData.append("TestStatus", x.TestStatus);
      formData.append("Assigned", x.Assigned);
      formData.append("Class", x.Class);
      formData.append("TestTemplate", x.TestTemplate);

      fetch(`/api/ravello/test-detail`, {
        method: "POST",
        body: formData,
        headers: headers,
      }).then(
        function (data) {
          if (data.status === 200) {
            this.setState({
              notification: true,
              notificationText:
                "The request has been successfully submitted.",
              notificationType: "notification is-success",
              redir: true
            });
          } else if (data.status === 403) {
            this.setState({
              notification: true,
              notificationText: "Too Many Requests!",
              notificationType: "notification is-danger"
            });
          } else if (data.status === 401) {
            this.setState({
              notification: true,
              notificationText:
                "We can not verify this email. Please contact the administrator for more details.",
              notificationType: "notification is-danger"
            });
          } else {
            this.setState({
              notification: true,
              notificationText:
                "An error has occured submitting the request. Please Try again. If the error persists please contact the administrator.",
              notificationType: "notification is-danger"
            });
          }
        }.bind(this)
      )
        .catch(function (error) {
          console.log("Request failure: ", error);
        });
    });
    this.setState({selection: []});
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
    const {selectedData} = this.state;
    selectedData.push(row);
    let keys = [];
    if (shift && this.state.lastSelection !== "") {
      const wrappedInstance = this.checkboxTable.getWrappedInstance();

      let currentRecords = wrappedInstance.getResolvedState().sortedData;
      const state = wrappedInstance.getResolvedState();

      currentRecords = currentRecords.slice(
        state.page * state.pageSize,
        (state.page + 1) * state.pageSize
      );

      let last = currentRecords.findIndex(
        x => x.email === this.state.lastSelection
      );
      let current = currentRecords.findIndex(x => x.email === clickedKey);
      for (let x = Math.min(last, current); x <= Math.max(last, current); x++) {
        if (currentRecords[x].email !== this.state.lastSelection)
          keys.push(currentRecords[x].email);
      }
      this.setState({lastSelection: ""});
    } else {
      keys.push(clickedKey);
      this.setState({lastSelection: clickedKey});
    }
    let selection = [...this.state.selection];
    keys.forEach(key => {
      selection.push(row);
    });
    this.setState({selection});

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
        style: {"text-align": "center"},
      },
      {
        Header: "Assigned",
        accessor: "Assigned",
        style: {"text-align": "center"}
      },
      {
        Header: "Class",
        accessor: "Class",
        style: {"text-align": "center"}
      },
      {
        Header: "Test Status",
        accessor: "TestStatus",
        style: {"text-align": "center"}
      },
      {
        Header: "Test Template",
        accessor: "TestTemplate",
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

        Cell: row => (
          <Link
            to={`/users/${row.value}`}
            className="button is-info is-fullwidth"
            style={restartButtonStyle}
          >
            Restart
          </Link>
        ),
      },
    ];

    return (
      <div>
        <section className="section">
          <div className="container is-fluid">
            <div className="columns">
              <div className="column">
                <div className="field is-grouped">
                  <p className="control">
                    <button onClick={this.postMultipleRequest} className="button is-info is-fullwidth">
                      Select and Run Test
                    </button>
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
    )
      ;
  }
}

export default SelfTest;