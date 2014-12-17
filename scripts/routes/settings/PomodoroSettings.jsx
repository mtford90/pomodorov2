var React = require('react')
    , bootstrap = require('react-bootstrap')
    , config = require('../../../app.config.js')
    , _ = require('underscore')
    , ColouredInput = require('../../components/ColouredInput')
    , data = require('../../data')
    , Config = data.Config
    , InputPanel = require('./InputPanel')
    , InputPanelItem = require('./InputPanelItem')
    , InputPanelTitle = require('./InputPanelTitle')
    , InputPanelDescription = require('./InputPanelDescription');

var PomodoroSettings = React.createClass({
    render: function () {
        return (
            <InputPanel>
                <InputPanelTitle>
                    <span>
                        <img className="pull-left settings-logo pomodoro-logo" src="img/tomato_black.png"/>
                        <span className="title-text">Pomodoro</span>
                    </span>
                </InputPanelTitle>
                <InputPanelDescription>Customise the Pomodoro timings.</InputPanelDescription>
                <InputPanelItem title="Pomodoro Length">
                    <ColouredInput type="text" value={this.state.pomodoroLength}/>
                </InputPanelItem>
                <InputPanelItem title="Long Break Length">
                    <ColouredInput type="text" value={this.state.shortBreakLength}/>
                </InputPanelItem>
                <InputPanelItem title="Short Break Length">
                    <ColouredInput type="text" value={this.state.longBreakLength}/>
                </InputPanelItem>
                <InputPanelItem title="Round Length">
                    <ColouredInput type="text" value={this.state.roundLength}/>
                </InputPanelItem>
            </InputPanel>
        )
    },
    componentDidMount: function () {
        Config.get().then(function (config) {
            this.coloursConfig = config.colours;
            this.setState(config.pomodoro.getAttributes());
            this.cancelListen = config.pomodoro.listen(function () {
                this.setState(config.pomodoro.getAttributes());
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
    }
});

module.exports = PomodoroSettings;