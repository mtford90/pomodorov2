var React = require('react')
    , config = require('../../../app.config.js')
    , ColorPicker = require('../../components/ColorPicker')
    , ColouredInput = require('../../components/ColouredInput')
    , data = require('../../data')
    , Config = data.Config
    , InputPanel = require('./InputPanel')
    , InputPanelItem = require('./InputPanelItem')
    , InputPanelTitle = require('./InputPanelTitle')
    , InputPanelDescription = require('./InputPanelDescription');


var ColourSettings = React.createClass({
    render: function () {
        var cssUrl = "http://paletton.com/#uid=10K0u0kllllaFw0g0qFqFg0w0aF";
        return (
            <InputPanel>
                <InputPanelTitle>
                    <span>
                        <i className="fa fa-paint-brush"/>
                        <span className="title-text">Colours</span>
                    </span>
                </InputPanelTitle>
                <InputPanelDescription>
                    <span>Use
                        <a href={cssUrl}> CSS colours </a>
                    to customise the theme.</span>
                </InputPanelDescription>
                <InputPanelItem title="Primary">
                    <ColorPicker color={this.state.primary}
                        onChange={this.onColorPickerChange}
                        onSuccessfulChange={this.onSuccessfulColorPickerChange}
                        ref="primary"
                        componentClass={ColouredInput}/>
                </InputPanelItem>
                <InputPanelItem title="Short Break">
                    <ColorPicker color={this.state.shortBreak}
                        onChange={this.onColorPickerChange}
                        onSuccessfulChange={this.onSuccessfulColorPickerChange}
                        ref="shortBreak"
                        componentClass={ColouredInput}/>
                </InputPanelItem>
                <InputPanelItem title="Long Break">
                    <ColorPicker
                        color={this.state.longBreak}
                        onChange={this.onColorPickerChange}
                        onSuccessfulChange={this.onSuccessfulColorPickerChange}
                        ref="longBreak"
                        componentClass={ColouredInput}/>
                </InputPanelItem>
            </InputPanel>
        )
    },
    getProp: function (picker) {
        var prop;
        if (picker == this.refs.primary) {
            prop = 'primary';
        }
        else if (picker == this.refs.shortBreak) {
            prop = 'shortBreak';
        }
        else if (picker == this.refs.longBreak) {
            prop = 'longBreak';
        }
        return prop;
    },
    onColorPickerChange: function (change) {
        var prop = this.getProp(change.picker),
            stateChange = {};
        stateChange[prop] = change.color;
        this.setState(stateChange);
    },
    componentDidMount: function () {
        Config.get().then(function (config) {
            this.coloursConfig = config.colours;
            this.setState(config.colours.getAttributes());
            this.cancelListen = config.colours.listen(function (n) {
                this.setState(config.colours.getAttributes());
            }.bind(this));
        }.bind(this)).catch(function (err) {
            console.error('Error getting pomodoro settings', err);
        });
    },
    componentWillUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        return {};
    },
    onSuccessfulColorPickerChange: function (change) {
        var prop = this.getProp(change.picker);
        if (prop) this.coloursConfig[prop] = change.color;
        else  console.warn('Unknown color picker', change);
    }
});

module.exports = ColourSettings;