import React, { Component } from "react";
// import base64 from "base-64";
import "whatwg-fetch";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import { LinkContainer } from "react-router-bootstrap";
// import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import base64 from "base-64";
// import moment from "moment-timezone";
import {Link} from "react-router-dom";

class TestTemplate extends Component {
  constructor(props) {
    super(props);
    this.getRequests = this.getRequests.bind(this);

    //   this.getGroups = this.getGroups.bind(this);
    //   this.handleChange = this.handleChange.bind(this);
    //
      this.state = {
        tableOptions: {
          loading: true,
          showPagination: true,
          showPageSizeOptions: true,
          showPageJump: true,
          collapseOnSortingChange: true,
          collapseOnPageChange: true,
          collapseOnDataChange: true,
          freezeWhenExpanded: false,
          filterable: true,
          sortable: true,
          resizable: true
        },
        data: [],
        localTimezone: false
      };
    // }
    // getGroups() {
    //   let headers = new Headers();
    //   headers.append(
    //     "Authorization",
    //     "Basic " + base64.encode(window.localStorage.getItem("authToken") + ":x")
    //   );
    //
    //   fetch("/api/groups", {
    //     method: "GET",
    //     headers: headers
    //   })
    //     .then(function(response) {
    //       return response.json();
    //     })
    //     .then(json => {
    //       let pageSizeOptions = [5, 10, 20, 25, 50, 100, json.length];
    //
    //       this.setState({
    //         tableOptions: {
    //           loading: false,
    //           showPagination: true,
    //           showPageSizeOptions: true,
    //           showPageJump: true,
    //           collapseOnSortingChange: true,
    //           collapseOnPageChange: true,
    //           collapseOnDataChange: true,
    //           freezeWhenExpanded: false,
    //           filterable: true,
    //           sortable: true,
    //           resizable: true,
    //           pageSizeOptions: pageSizeOptions.sort(function(a, b) {
    //             return a - b;
    //           })
    //         },
    //         data: json
    //       });
    //     })
    //     .catch(function(ex) {
    //       console.log(ex);
    //     });
    // }
    //
    // componentDidMount() {
    //   this.getGroups();
    //   this.interval = setInterval(() => this.getGroups(), 60000);
    // }
    // componentWillUnmount() {
    //   clearInterval(this.interval);
    // }
    // handleChange(checked) {
    //   this.setState({ localTimezone: !this.state.localTimezone });
    // }
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

  render() {
    const data = this.state.data;
    // console.log("data----->",data.test_details);
    const columns = [
      {
        Header: "Self-Test Template(Name)",
        accessor: "name",
        headerStyle:{background:"#00acdc"},
        style:{"text-align":"center"},
        // filterMethod: (filter, rows) =>
        //   matchSorter(rows, filter.value, { keys: ["name"] }),
        // filterAll: true
      },
      {
        Header: "Description",
        accessor: "description",
        headerStyle:{background:"#00acdc"},
        style:{"text-align":"center"},
        // filterMethod: (filter, rows) =>
        //   matchSorter(rows, filter.value, { keys: ["description"] }),
        // Cell: row => <p>{row.value.length}</p>,
        // filterAll: true
      },
      {
        Header: "Action (Edit)",
        // accessor: "",
         Cell: row => (
          <Link
            to={`/users/${row.value}`}
            className="button is-info is-fullwidth"
          >
            Edit
          </Link>
        ),
        headerStyle:{background:"#00acdc"}
        // filterMethod: (filter, rows) =>
        //   matchSorter(rows, filter.value, { keys: ["usedEnvs"] }),
        // filterAll: true
      },
    ];
    return (
      <div>
        <section className="section">
          <div className="container is-fluid">
            <div className="columns" >
              <div className="column">
                <div className="field is-grouped">
                  <p className="control">
                    <LinkContainer to="new-template">
                      <a className="button is-info">New Test Template</a>
                    </LinkContainer>
                  </p>
                </div>
              </div>
              <div className="column" />
              <div className="column" />
              <div className="column" />
            </div>

            <div className="box">
              {console.log("data in div----->",data)}
              <ReactTable
                className="-striped -highlight"
                data={data}
                  // resolveData={data => data.map(row => row)}
                columns={columns}
                // defaultFilterMethod={(filter, row) =>
                //   String(row[filter.id]) === filter.value
                // }
                // {...this.state.tableOptions}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default TestTemplate;
