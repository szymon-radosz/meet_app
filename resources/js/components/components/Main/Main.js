import React, { Component } from "react";
import Menu from "./Menu.js";

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alertSuccess: false,
            alertSuccessDescription: "",
            alertWarning: false,
            alertWarningDescription: ""
        };

        this.showAlertSuccess = this.showAlertSuccess.bind(this);
        this.showAlertWarning = this.showAlertWarning.bind(this);
        this.hideAlertSuccess = this.hideAlertSuccess.bind(this);
        this.hideAlertWarning = this.hideAlertWarning.bind(this);
    }

    showAlertSuccess(info) {
        this.setState({
            alertSuccess: true,
            alertSuccessDescription: info
        });
    }

    showAlertWarning(info) {
        this.setState({
            alertWarning: true,
            alertWarningDescription: info
        });
    }

    hideAlertSuccess() {
        this.setState({
            alertSuccess: false
        });
    }

    hideAlertWarning() {
        this.setState({
            alertWarning: false
        });
    }

    render() {
        return (
            <div>
                {this.state.alertSuccess && (
                    <div
                        className="alert alert-success alert-dismissible"
                        role="alert"
                    >
                        <a
                            href="#"
                            className="close"
                            onClick={this.hideAlertSuccess}
                        >
                            ×
                        </a>
                        <strong>{this.state.alertSuccessDescription}</strong>
                    </div>
                )}

                {this.state.alertWarning && (
                    <div
                        className="alert alert-danger alert-dismissible"
                        role="alert"
                    >
                        <a
                            href="#"
                            className="close"
                            onClick={this.hideAlertWarning}
                        >
                            ×
                        </a>
                        <strong>{this.state.alertWarningDescription}</strong>
                    </div>
                )}

                <Menu
                    showAlertSuccess={this.showAlertSuccess}
                    showAlertWarning={this.showAlertWarning}
                />
            </div>
        );
    }
}

export default Main;
