import React, { Component } from "react";
import base64 from "base-64";
import "whatwg-fetch";
import ReactTable from "react-table";
import moment from "moment-timezone";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import Downloader from "./components/Downloader";
import { LinkContainer } from "react-router-bootstrap";
import Mode from "./components/Mode";
import { Link } from "react-router-dom";

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
        // filterable: true,
        sortable: true,
        resizable: true
      },
      selection: [],
      selectAll: false,
      data:[],

      lastSelection: ""
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
      headers: headers,
    })
      .then(function(response) {
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
            pageSizeOptions: pageSizeOptions.sort(function(a, b) {
              return a - b;
            })
          },
          data: json.test_details,
        });
      })
      .catch(function(ex) {
        console.log(ex);
      });

  }
  componentDidMount() {
    this.getRequests();
    this.interval = setInterval(() => this.getRequests(), 60000);
  }
  // getRequests() {
  // let headers = new Headers();
  // headers.append(
  // "Authorization",
  // "Basic " + base64.encode(window.localStorage.getItem("authToken") + ":x")
  // );
  //
  // fetch("/api/requests", {
  // method: "GET",
  // headers: headers
  // })
  // .then(function(response) {
  // return response.json();
  // })
  // .then(json => {
  // let pageSizeOptions = [5, 10, 20, 25, 50, 100, json.length];
  //
  // this.setState({
  // tableOptions: {
  // loading: false,
  // showPagination: true,
  // showPageSizeOptions: true,
  // showPageJump: true,
  // collapseOnSortingChange: true,
  // collapseOnPageChange: true,
  // collapseOnDataChange: true,
  // freezeWhenExpanded: false,
  // filterable: true,
  // sortable: true,
  // resizable: true,
  // pageSizeOptions: pageSizeOptions.sort(function(a, b) {
  // return a - b;
  // })
  // },
  // data: json
  // });
  // })
  // .catch(function(ex) {
  // console.log(ex);
  // });
  // }
  //
  // approveSelection() {
  // let selection = this.state.selection;
  // selection.forEach(x => {
  // let headers = new Headers();
  // let formData = new FormData();
  // formData.append("requestId", x);
  //
  // headers.append(
  // "Authorization",
  // "Basic " +
  // base64.encode(window.localStorage.getItem("authToken") + ":x")
  // );
  // fetch(`/api/approve`, {
  // method: "POST",
  // body: formData,
  // headers: headers
  // }).then(
  // function(response) {
  // this.getRequests();
  // }.bind(this)
  // );
  // });
  // this.setState({ selection: [] });
  // }
  //
  // componentDidMount() {
  // this.getRequests();
  // this.interval = setInterval(() => this.getRequests(), 60000);
  // }
  // componentWillUnmount() {
  // clearInterval(this.interval);
  // }
  //
  // toggleSelection = (clickedKey, shift, row) => {
  // let keys = [];
  // if (shift && this.state.lastSelection !== "") {
  // const wrappedInstance = this.checkboxTable.getWrappedInstance();
  //
  // let currentRecords = wrappedInstance.getResolvedState().sortedData;
  // const state = wrappedInstance.getResolvedState();
  //
  // currentRecords = currentRecords.slice(
  // state.page * state.pageSize,
  // (state.page + 1) * state.pageSize
  // );
  // let last = currentRecords.findIndex(
  // x => x._original.requestId === this.state.lastSelection
  // );
  // let current = currentRecords.findIndex(
  // x => x._original.requestId === clickedKey
  // );
  // for (let x = Math.min(last, current); x <= Math.max(last, current); x++) {
  // if (currentRecords[x]._original.requestId !== this.state.lastSelection)
  // keys.push(currentRecords[x]._original.requestId);
  // }
  // this.setState({ lastSelection: "" });
  // } else {
  // keys.push(clickedKey);
  // this.setState({ lastSelection: clickedKey });
  // }
  // let selection = [...this.state.selection];
  // keys.forEach(key => {
  // const keyIndex = selection.indexOf(key);
  // if (keyIndex >= 0) {
  // selection = [
  // ...selection.slice(0, keyIndex),
  // ...selection.slice(keyIndex + 1)
  // ];
  // } else {
  // selection.push(key);
  // }
  // });
  // this.setState({ selection });
  // };
  //
  // toggleAll = () => {
  // const selectAll = this.state.selectAll ? false : true;
  // const selection = [];
  // if (selectAll) {
  // const wrappedInstance = this.checkboxTable.getWrappedInstance();
  // let currentRecords = wrappedInstance.getResolvedState().sortedData;
  // const state = wrappedInstance.getResolvedState();
  //
  // currentRecords = currentRecords.slice(
  // state.page * state.pageSize,
  // (state.page + 1) * state.pageSize
  // );
  // currentRecords.forEach(item => {
  // selection.push(item._original.email);
  // });
  // }
  // this.setState({ selectAll, selection });
  // };
  //
  // isSelected = key => {
  // return this.state.selection.includes(key);
  // };

  render() {
    const tabledata = [
      {
        Env: "env",
        Assigned: "y",
        Class: "class",
        TestStatus: "Not Tested",
        TestTemplate: "TT",
        Restart: "Restart"
      },

      {
        Env: "env1",
        Assigned: "y",
        Class: "class",
        TestStatus: "In-progress",
        TestTemplate: "TT",
        Restart: "Restart"
      },
      {
        Env: "env2",
        Assigned: "y",
        Class: "class",
        TestStatus: "Pass",
        TestTemplate: "TT",
        Restart: "Restart"
      },
      {
        Env: "env3",
        Assigned: "y",
        Class: "class",
        TestStatus: "Fail",
        TestTemplate: "TT",
        Restart: "Restart"
      },
      {
        Env: "env4",
        Assigned: "y",
        Class: "class",
        TestStatus: "Pass",
        TestTemplate: "TT",
        Restart: "Restart"
      }
    ];
    const { toggleSelection, toggleAll, isSelected } = this;
    const { selectAll, data } = this.state;
    const checkboxProps = {
      // selectAll,
      // isSelected,
      // toggleSelection,
      // toggleAll,
      selectType: "checkbox"
    };
    const optionItems = data.map((data) =>
                <option key={data.name}>{data.name}</option>
            );
    const columns = [
      {
        Header: "Env",
        accessor: "Env",
        headerStyle: { background: "#00acdc" },
        style: { "text-align": "center" }
        // filterMethod: (filter, rows) =>
        // matchSorter(rows, filter.value, { keys: ["email"] }),
        // filterAll: true
      },
      {
        Header: "Assigned",
        accessor: "Assigned",
        headerStyle: { background: "#00acdc" },
        style: { "text-align": "center" }
        // filterMethod: (filter, rows) =>
        // matchSorter(rows, filter.value, { keys: ["first"] }),
        // filterAll: true
      },
      {
        Header: "Class",
        accessor: "Class",
        headerStyle: { background: "#00acdc" },
        style: { "text-align": "center" }
        // filterMethod: (filter, rows) =>
        // matchSorter(rows, filter.value, { keys: ["first"] }),
        // filterAll: true
      },
      {
        Header: "Test Status",
        accessor: "TestStatus",
        headerStyle: { background: "#00acdc" },
        style: { "text-align": "center" }
        // filterMethod: (filter, rows) =>
        // matchSorter(rows, filter.value, { keys: ["last"] }),
        // filterAll: true
      },
      {
        Header: "Test Template",
        accessor: "TestTemplate",
        headerStyle: { background: "#00acdc" },
        Cell: ({}) => (
          <select onChange={event => {}} style={{ width: "100%" }}>
            {optionItems}
          </select>
        )

        // filterMethod: (filter, row) => {
        // if (filter.value === "all") {
        // return true;
        // }
        // if (filter.value === "true") {
        // return row[filter.id] >= 21;
        // }
        // return row[filter.id] < 21;
        // },
        // Filter: ({ }) =>
        // <select
        // //onChange={event => onChange(event.target.value)}
        // style={{ width: "100%" }}
        // value={ "all"}
        // >
        // <option value="all">Show All</option>
        // <option value="all">Can Drink</option>
        // <option value="all">Can't Drink</option>
        // </select>
      },
      {
        Header: "Restart",
        accessor: "Restart",
        headerStyle: { background: "#00acdc" },

        Cell: row => (
          <Link
            to={`/users/${row.value}`}
            className="button is-info is-fullwidth"
          >
            Restart
          </Link>
        )

        // filterMethod: (filter, rows) =>
        // matchSorter(rows, filter.value, { keys: ["lab"] }),
        // filterAll: true
      }
    ];

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
                keyField="Env"
                ref={r => (this.checkboxTable = r)}
                className="-striped -highlight"
                data={tabledata}
                columns={columns}
                // defaultFilterMethod={(filter, row) =>
                //   String(row[filter.id]) === filter.value
                // }
                // {...this.state.tableOptions}
                {...checkboxProps}
              />
            </div>
          </div>
        </section>
      </div>
    );
    // const { toggleSelection, toggleAll, isSelected } = this;
    // const { data, selectAll } = this.state;
    // const checkboxProps = {
    // selectAll,
    // isSelected,
    // toggleSelection,
    // toggleAll,
    // selectType: "checkbox"
    // };
    // const columns = [
    // {
    // Header: "Email",
    // accessor: "email",
    // filterMethod: (filter, rows) =>
    // matchSorter(rows, filter.value, { keys: ["email"] }),
    // filterAll: true
    // },
    // {
    // Header: "First Name",
    // accessor: "first",
    // filterMethod: (filter, rows) =>
    // matchSorter(rows, filter.value, { keys: ["first"] }),
    // filterAll: true
    // },
    // {
    // Header: "Last Name",
    // accessor: "last",
    // filterMethod: (filter, rows) =>
    // matchSorter(rows, filter.value, { keys: ["last"] }),
    // filterAll: true
    // },
    // {
    // Header: "Lab",
    // accessor: "lab.name",
    // filterMethod: (filter, rows) =>
    // matchSorter(rows, filter.value, { keys: ["lab"] }),
    // filterAll: true
    // },
    //
    // {
    // Header: "Last Request",
    // // accessor: "requestedOn",
    // // Cell: (row) => (
    // // <p>
    // // {moment(row.value.$date).isValid()
    // // ? moment(row.value.$date).format("MMMM Do YYYY, h:mm:ss a Z")
    // // : null}
    // // </p>
    // // )
    // },
    // {
    // Header: "Requests Today",
    // accessor: "requestedEnvs",
    // Cell: row => row.value.toString(),
    // filterMethod: (filter, rows) =>
    // matchSorter(rows, filter.value, { keys: ["requestedEnvs"] }),
    // filterAll: true
    // }
    // ];
    //
    // return (
    // <div>
    // {this.state.logVisible ? (
    // <div id="modal" className="modal is-active">
    // <div className="modal-background" />
    // <div className="modal-content">
    // <div className="box">
    // <Downloader type="request" />
    // </div>
    // </div>
    // <button
    // className="modal-close is-large"
    // aria-label="close"
    // onClick={() => {
    // this.setState({ logVisible: false });
    // }}
    // />
    // </div>
    // ) : null}
    // <section className="section">
    // <div className="container is-fluid">
    // <div className="columns">
    // <div className="column">
    // <div className="field is-grouped">
    // <p className="control">
    // <a
    // className="button is-info"
    // onClick={() => {
    // this.approveSelection();
    // }}
    // >
    // Approve Selection
    // </a>
    // </p>
    // {this.props.role === "admin" ? (
    // <p className="control">
    // <a
    // className="button is-info"
    // onClick={() => {
    // this.setState({ logVisible: true });
    // }}
    // >
    // Download Logs
    // </a>
    // </p>
    // ) : null}
    // </div>
    // </div>
    // </div>
    // <div className="box">
    // <CheckboxTable
    // keyField="requestId"
    // ref={r => (this.checkboxTable = r)}
    // className="-striped -highlight"
    // data={data}
    // columns={columns}
    // defaultFilterMethod={(filter, row) =>
    // String(row[filter.id]) === filter.value
    // }
    // {...this.state.tableOptions}
    // {...checkboxProps}
    // />
    // </div>
    // </div>
    // </section>
    // </div>
    // );
  }
}

export default SelfTest;
