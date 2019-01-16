import React, {Component} from "react";
import PropTypes from "prop-types";
import {LinkContainer} from "react-router-bootstrap";

const headStyle = {
  position: 'relative',
  'text-align': 'center',
  'padding-bottom': '50px',
}
const saveButtonStyle = {
  background: '#00ACDC',
  color: 'white',
  width:'74px',
}
const cancelButtonStyle = {
  background: '#00ACDC',
  color: 'white',
}
const textAreaStyle = {
  width: '250px',
  height: 'auto',
}

class EditTestTemplate extends Component {
  static propTypes = {
    welcome: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedLab: {},
      notification: false,
      notificationText: "",
      notificationType: "",
      redir: false,
      loadedForm: false,
    };
  }

  render() {
    const message = this.state.notificationText;
    const type = this.state.notificationType;
    // const { selectedLab } = this.state;
    return (
      <section className="hero is-fullheight">
        <div>
          <div className="column is-10 is-offset-1">
            <div className="box">
              {this.state.notification ? (
                <div className={type}>{message}</div>
              ) : null}
              {!this.state.redir ? (
                <form onSubmit={this.requestFunc} method="post">
                  <div style={headStyle}>
                    <label className="label">Edit Test Template</label>
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
                            style={{width: '250px'}}
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
                    <div className="field-label is-normal" style={{'padding-left': '75px'}}>
                      <label className="label">Description</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control ">
                          <textarea
                            className="input"
                            style={textAreaStyle}
                            placeholder="Test Description"
                            ref="description"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <label className="label" style={{'padding-right': '310px'}}>Parameters:</label>
                  </div>

                  <React.Fragment>

                    <div className="field is-horizontal">
                      <div className="field-body">
                        <div className="field">
                          <div className="control" style={{'padding-left': '100px'}}>
                            <label className="checkbox">
                              <input
                                type="checkbox"
                                ref="test1"
                                name="test1"
                              />
                              <strong>Test 1</strong>
                            </label>
                            <label style={{'padding-left': '24px'}}>Env Status Check through API</label>
                          </div>
                        </div>
                      </div>

                      <div className="field is-horizontal" style={{'padding-right': '28px'}}>
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
                        <label className="label"/>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control" style={{'padding-left': '100px'}}>
                            <label className="checkbox">
                              <input
                                type="checkbox"
                                ref="test2"
                                name="test2"
                              />
                              {"  "}
                              <strong>Test 2</strong>
                            </label>
                            <label style={{'padding-left': '24px'}}>Ping FW Management Interface</label>
                          </div>
                        </div>
                      </div>

                      <div className="field is-horizontal" style={{'padding-right': '28px'}}>
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
                        <label className="label"/>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control" style={{'padding-left': '100px'}}>
                            <label className="checkbox">
                              <input
                                type="checkbox"
                                ref="test3"
                                name="test3"
                              />
                              {"  "}
                              <strong>Test 3</strong>
                            </label>
                            <label style={{'padding-left': '24px'}}>Firewall Functional Test (Job-1)</label>
                          </div>
                        </div>
                      </div>
                      <div className="field is-horizontal" style={{'padding-right': '28px'}}>
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

                  <div style={{'padding-left': '905px'}}>
                    <button type="button submit" className="button" style={saveButtonStyle}>
                      Save
                    </button>
                  </div>
                </form>
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
          </div>
        </div>
      </section>
    );
  }
}

export default EditTestTemplate;

