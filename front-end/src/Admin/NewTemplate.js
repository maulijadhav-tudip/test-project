import React, { Component } from "react";
// import LabPicker from "../Utils/LabPicker";
import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";
import base64 from "base-64";
// import TokenContainer from "../Student/components/TokenContainer";

const headStyle={
    position: 'relative',
    'text-align': 'center',
    'padding-bottom':'50px',
}
const buttonStyle={
    background: '#00ACDC',
    color:'white',
}
class Request extends Component {
  static propTypes = {
    welcome: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.requestFunc = this.requestFunc.bind(this);
    this.changeLab = this.changeLab.bind(this);

    this.state = {
      selectedLab: {},
      notification: false,
      notificationText: "",
      notificationType: "",
      redir: false,
      loadedForm: false,
    };
  }

  changeLab(lab) {
    this.setState({ selectedLab: lab });
  }

  requestFunc(e) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64.encode(window.localStorage.getItem("authToken") + ":x")
    );
    e.preventDefault();
    this.setState({
      notification: true,
      notificationText: "Request Submitting....",
      notificationType: "notification is-info"
    });

    // const data = {
    //   "name": this.refs.name.value,
    //   "description": this.refs.description.value,
    //   "test1": this.refs.test1.checked,
    //   "test2": this.refs.test2.checked,
    //   "test3": this.refs.test3.checked,
    //   "vmname": this.refs.vmname.value,
    //   "vmusername": this.refs.vmusername.value,
    //   "password": this.refs.password.value,
    // };
    let formData = new FormData();


      formData.append("name", this.refs.name.value);
      formData.append("description", this.refs.description.value);
      formData.append("test1", this.refs.test1.checked);
      formData.append("test2", this.refs.test2.checked);
      formData.append("test3", this.refs.test3.checked);
      formData.append("vmname", this.refs.vmname.value);
      formData.append("vmusername", this.refs.vmusername.value);
      formData.append("password", this.refs.password.value);

    // formData["name"] = this.refs.name.value;
    // formData["description"] = this.refs.description.value;
    // formData["test1"] = this.refs.test1.checked;
    // formData["test2"] = this.refs.test2.checked;
    // formData["test3"] = this.refs.test3.checked;
    // formData["vmname"] = this.refs.vmname.value;
    // formData["vmusername"] = this.refs.vmusername.value;
    // formData["password"] = this.refs.password.value;

    console.log("formData---->",formData);
    fetch("/api/ravello/create-tests", {
      method: "POST",
      body: formData,
      headers: headers,
    })
      .then(
        function(data) {
          if (data.status === 200) {
            this.setState({
              notification: true,
              notificationText:
                "The request has been successfully submitted. Please check your email for your login credentials and then click the link below to login.",
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
      .catch(function(error) {
        console.log("Request failure: ", error);
      });
  }

  render() {
    const message = this.state.notificationText;
    const type = this.state.notificationType;
    // const { selectedLab } = this.state;
    return (
      <section className="hero is-fullheight">
        <div >
          <div className="column is-10 is-offset-1">
            <div className="box">
              {this.state.notification ? (
                <div className={type}>{message}</div>
              ) : null}
              {!this.state.redir ? (
                <form onSubmit={this.requestFunc} method="post">
                    <div style={headStyle}>
                        <label className="label">New Self Test Template</label>
                    </div>

                    <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Name</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control ">
                          <input
                            className="input"
                            style={{width:'250px'}}
                            type="text"
                            ref="name"
                            placeholder="Template Name"
                            required
                            autoFocus
                          />
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="field is-horizontal">
                    <div className="field-label is-normal" style={{'padding-left':'75px'}}>
                      <label className="label">Description</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control ">
                          <input
                            className="input"
                            style={{width:'250px'}}
                            type="text"
                            placeholder="Test Description"
                            ref="description"
                            required
                          />
                        </div>
                      </div>
                    </div>
                      <label className="label" style={{'padding-right':'310px'}}>Parameters:</label>
                  </div>

                  <React.Fragment>

                      <div className="field is-horizontal">
                        <div className="field-body">
                          <div className="field">
                            <div className="control"  style={{'padding-left':'100px'}}>
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  ref="test1"
                                  name="test1"
                                />
                                <strong>Test 1</strong>
                              </label>
                              <label style={{'padding-left':'24px'}}>Env Status Check through API</label>
                            </div>
                          </div>
                        </div>

                          <div className="field is-horizontal"style={{'padding-right':'28px'}}>
                            <div className="field">
                              <label className="label" style={{'padding-right': '17px'}}>VM Name</label>
                            </div>
                            <div className="field-body">
                              <div className="field">
                                <div className="control ">
                                  <input
                                    className="input"
                                    type="text"
                                    ref="vmname"
                                    placeholder=""
                                    required
                                    autoFocus
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                      </div>

                      <div className="field is-horizontal">
                        <div>
                          <label className="label" />
                        </div>
                        <div className="field-body">
                          <div className="field">
                            <div className="control" style={{'padding-left':'100px'}}>
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  ref="test2"
                                  name="test2"
                                />
                                {"  "}
                                <strong>Test 2</strong>
                              </label>
                              <label style={{'padding-left':'24px'}}>Ping FW Management Interface</label>
                            </div>
                          </div>
                        </div>

                          <div className="field is-horizontal" style={{'padding-right':'28px'}}>
                            <div className="field ">
                              <label className="label" style={{'padding-right': '17px'}}>VM Username</label>
                            </div>
                            <div className="field-body">
                              <div className="field">
                                <div className="control ">
                                  <input
                                    className="input"
                                    type="text"
                                    ref="vmusername"
                                    placeholder="Username"
                                    required
                                    autoFocus
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                      </div>

                      <div className="field is-horizontal">
                        <div>
                          <label className="label" />
                        </div>
                        <div className="field-body">
                          <div className="field">
                            <div className="control" style={{'padding-left':'100px'}}>
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  ref="test3"
                                  name="test3"
                                />
                                {"  "}
                                <strong>Test 3</strong>
                              </label>
                              <label style={{'padding-left':'24px'}}>Firewall Functional Test (Job-1)</label>
                            </div>
                          </div>
                        </div>
                          <div className="field is-horizontal" style={{'padding-right':'28px'}}>
                            <div className="field">
                              <label className="label" style={{'padding-right': '17px'}}>VM Password</label>
                            </div>
                            <div className="field-body">
                              <div className="field">
                                <div className="control ">
                                  <input
                                    className="input"
                                    type="text"
                                    ref="password"
                                    placeholder="Password"
                                    required
                                    autoFocus
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>

                  </React.Fragment>

                    <div style={{'padding-left':'920px'}}>
                      <button type="button submit" className="button" style={buttonStyle}>
                        Save
                      </button>
                    </div>
                </form>
              ) : (
                <div>
                  {this.state.selectedLab.type === "qwiklab_one" ? (
                    <a
                      className="button is-link"
                      href="https://paloaltonetworks.qwiklabs.com/"
                    >
                      Login
                    </a>
                  ) : (
                    <div>
                      {this.state.selectedLab.type !== "cloudshare" ? (
                        <LinkContainer to="/test-template">
                          <a className="button is-link">Back</a>
                        </LinkContainer>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Request;

