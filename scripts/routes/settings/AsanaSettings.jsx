var React = require('react')
    , ColouredInput = require('../../components/ColouredInput')
    , InputPanel = require('./InputPanel')
    , InputPanelItem = require('./InputPanelItem')
    , InputPanelTitle = require('./InputPanelTitle')
    , InputPanelDescription = require('./InputPanelDescription');


var AsanaState = {
    Void: 'Void',
    Authorised: 'Authorised',
    Unauthorised: 'Unauthorised',
    Error: 'Error'
};

var AsanaSettings = React.createClass({
    getIndicatorComponent: function () {
        var indicator;
        switch (this.state.asanaState) {
            case AsanaState.Authorised:
                indicator = <i className="fa fa-check-circle"></i>;
                break;
            case AsanaState.Unauthorised:
                indicator = <i className="fa fa-times-circle"></i>;
                break;
            case AsanaState.Error:
                indicator = <i className="fa fa-exclamation-circle"></i>;
                break;
            default:
                indicator = '';
        }
        return indicator;
    },
    render: function () {
        return (
            <InputPanel>
                <InputPanelTitle>
                    <span>
                        <img className="settings-logo pull-left asana-logo" src="img/asana-minimal-black.png"/>
                        <span className="title-text">Asana</span>
                    </span>
                </InputPanelTitle>
                <InputPanelDescription>
                    Enable Asana integration by providing an API key.
                </InputPanelDescription>
                <InputPanelItem title="API Key">
                    <div className="api-key">
                        <ColouredInput type="text" onBlur={this.onBlur} onFocus={this.onFocus} />
                        {this.getIndicatorComponent()}
                    </div>
                </InputPanelItem>
            </InputPanel>
        )
    },
    onBlur: function (e) {
        var newAPIKey = $(e.target).val();
        if (this.previousAPIKey != newAPIKey) {
            if (newAPIKey.trim().length) {
                $.ajax({
                    headers: {
                        Authorization: 'Basic ' + btoa(newAPIKey + ':')
                    },
                    url: 'https://app.asana.com/api/1.0/users/me'
                }).done(function (resp) {
                    console.log("success", resp);
                    this.setState({
                        asanaState: AsanaState.Authorised
                    });
                }.bind(this)).fail(function (xhr) {
                    if (xhr.status == 401) {
                        console.error("Unauthorised");
                        this.setState({
                            asanaState: AsanaState.Unauthorised
                        });
                    }
                    else console.error("Unknown error", xhr);
                }.bind(this))
            }
            else {
                this.setState({
                    asanaState: AsanaState.Void
                });
            }
        }
    },
    onFocus: function (e) {
        var tgt = e.target;
        this.previousAPIKey = $(tgt).val();
    },
    getInitialState: function () {
        return {
            asanaState: AsanaState.Void
        }
    }
});

module.exports = AsanaSettings;