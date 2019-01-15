import React, {Component} from "react";
import "whatwg-fetch";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {LinkContainer} from "react-router-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css";
import base64 from "base-64";
import {Link} from "react-router-dom";

class TestTemplate extends Component {
  constructor(props) {
    super(props);
    this.getRequests = this.getRequests.bind(this);

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
    this.interval = setInterval(() => this.getRequests(), 60000);
  }

  render() {
    const data = this.state.data;
    const columns = [
      {
        Header: "Self-Test Template(Name)",
        accessor: "name",
        headerStyle: {background: "#00acdc"},
        style: {"text-align": "center"},
      },
      {
        Header: "Description",
        accessor: "description",
        headerStyle: {background: "#00acdc"},
        style: {"text-align": "center"},
      },
      {
        Header: "Action (Edit)",
        Cell: row => (
          <Link
            to="/edit-test-template"
            className="button is-info is-fullwidth"
          >
            Edit
          </Link>
        ),
        headerStyle: {background: "#00acdc"}
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
                    <LinkContainer to="new-template">
                      <a className="button is-info">New Test Template</a>
                    </LinkContainer>
                  </p>
                </div>
              </div>
              <div className="column"/>
              <div className="column"/>
              <div className="column"/>
            </div>

            <div className="box">
              {console.log("data in div----->", data)}
              <ReactTable
                className="-striped -highlight"
                data={data}
                columns={columns}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default TestTemplate;
