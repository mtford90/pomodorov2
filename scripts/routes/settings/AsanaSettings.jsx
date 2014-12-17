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
                    <ColouredInput type="text"/>
                </InputPanelItem>
            </InputPanel>
        )
    }
});

module.exports = AsanaSettings;