var React = require('react')
    , ColouredInput = require('../../components/ColouredInput')
    , InputPanel = require('./InputPanel')
    , InputPanelItem = require('./InputPanelItem')
    , InputPanelTitle = require('./InputPanelTitle')
    , InputPanelDescription = require('./InputPanelDescription');

var AsanaSettings = React.createClass({
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
                    <ColouredInput type="text" onBlur={this.onBlur} onFocus={this.onFocus} />
                </InputPanelItem>
            </InputPanel>
        )
    },
    onBlur: function (e) {
        var newAPIKey = $(e.target).val();
        if (this.previousAPIKey != newAPIKey) {
            console.log('asana api key changed', newAPIKey);
        }
    },
    onFocus: function (e) {
        var tgt = e.target;
        this.previousAPIKey = $(tgt).val();
    }
});

module.exports = AsanaSettings;