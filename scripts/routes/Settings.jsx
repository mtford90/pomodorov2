/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Row = bootstrap.Row
    , Col = bootstrap.Col
    , config = require('../../app.config')
    , _ = require('underscore')
    , ColorPicker = require('../components/ColorPicker')
    , Panel = require('../components/Panel')
    , data = require('../data/pomodoro')
    , Config = data.Config
    , DocumentTitle = require('react-document-title');

// TODO: Once ReactJS has the capability to use inline hover styles we can avoid having to do the focus/blur
var ColouredInput = React.createClass({
    render: function () {
        var style = this.state.focused ? {borderColor: this.state.color} : {};
        var comp = (
            <input style={style} onFocus={this.onFocus} onBlur={this.onBlur}></input>
        );
        _.extend(comp.props, this.props);
        return comp
    },
    getInitialState: function () {
        return {
            color: '',
            hovering: false
        }
    },
    onFocus: function () {
        this.setState({
            focused: true
        });
    },
    onBlur: function () {
        this.setState({
            focused: false
        });
    },
    componentDidMount: function () {
        Config.get().then(function (config) {
            var primaryColor = config.colours.primary;
            console.log('primaryColor', primaryColor);
            this.setState({
                color: primaryColor
            });
            this.cancelListen = config.colours.listen(function (n) {
                this.setState({
                    color: config.colours.primary
                })
            }.bind(this));
        }.bind(this)).catch(function (err) {
            console.error('Error getting colour config for settings page', err);
            if (err instanceof Error) throw err;
        });
    },
    componentWillUnmount: function () {
        this.cancelListen();
    }
});


// TODO: Gotta be a nicer way to handle the right/left padding
var Settings = React.createClass({
    render: function () {
        var pomodoroTitle = (
            <span>
                <img className="pull-left settings-logo pomodoro-logo" src="img/tomato_black.png"/>
                <span className="title-text">Pomodoro</span>
            </span>
        );
        var coloursTitle = (
            <span>
                <i className="fa fa-paint-brush"/>
                <span className="title-text">Colours</span>
            </span>
        );
        var asanaTitle = (
            <span>
                <img className="settings-logo pull-left asana-logo" src="img/asana-minimal-black.png"/>
                <span className="title-text">Asana</span>
            </span>
        );
        var cssUrl = "http://paletton.com/#uid=10K0u0kllllaFw0g0qFqFg0w0aF";
        var options = this.state.config || {};
        var colors = this.state.colours || {};
        return (
            <div className="container">
                <DocumentTitle title={config.brand}>
                    <div id="settings">
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} className="right-padded">
                                <Panel title={pomodoroTitle}>
                                    <p>
                                    Customise the Pomodoro timings.
                                    </p>
                                    <form>
                                        <table className="inputs-table">
                                            <tr>
                                                <td>
                                                Pomodoro Length
                                                </td>
                                                <td>
                                                    <ColouredInput  type="text" value={options.pomodoroLength}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Long Break Length
                                                </td>
                                                <td>
                                                    <ColouredInput  type="text" value={options.longBreakLength}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Short Break Length
                                                </td>
                                                <td>
                                                    <ColouredInput type="text" value={options.shortBreakLength}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Round Length
                                                </td>
                                                <td>
                                                    <ColouredInput type="text" value={options.roundLength}/>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>

                                </Panel>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} className="left-padded">
                                <Panel title={coloursTitle}>
                                    <p>
                                    Use
                                        <a href={cssUrl}>CSS colours</a>
                                    to customise the theme.
                                    </p>
                                    <form>
                                        <table className="inputs-table">
                                            <tr>
                                                <td>
                                                Primary
                                                </td>
                                                <td>
                                                    <ColorPicker color={colors.primary}
                                                        onChange={this.onColorPickerChange}
                                                        onSuccessfulChange={this.onSuccessfulColorPickerChange}
                                                        ref="primary"
                                                        componentClass={ColouredInput}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Short Break
                                                </td>
                                                <td>
                                                    <ColorPicker color={colors.shortBreak}
                                                        onChange={this.onColorPickerChange}
                                                        onSuccessfulChange={this.onSuccessfulColorPickerChange}
                                                        ref="shortBreak"
                                                        componentClass={ColouredInput}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Long Break
                                                </td>
                                                <td>
                                                    <ColorPicker color={colors.longBreak}
                                                        onChange={this.onColorPickerChange}
                                                        onSuccessfulChange={this.onSuccessfulColorPickerChange}
                                                        ref="longBreak"
                                                        componentClass={ColouredInput}
                                                    />
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </Panel>
                            </Col>
                        </Row>
                        <Row >
                            <Col xs={12} sm={12} md={6} lg={6} className="right-padded" >
                                <Panel title={asanaTitle}>
                                    <p>
                                    Enable Asana integration by providing an API key.
                                    </p>
                                    <form>
                                        <table className="inputs-table">
                                            <tr>
                                                <td>
                                                API
                                                </td>
                                                <td>
                                                    <ColouredInput type="text"/>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </Panel>
                            </Col>
                        </Row>
                    </div>
                </DocumentTitle>
            </div>

        );
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
        var prop = this.getProp(change.picker);
        if (prop) {
            var opts = {};
            opts[prop] = change.color;
            var partialState = {
                colours: _.extend(this.state.colours, opts)
            };
            this.setState(partialState);
        }
        else {
            console.warn('Unknown color picker', change);
        }
    },
    componentDidMount: function () {
        Config.get().then(function (config) {
            this.coloursConfig = config.colours;
            this.setState({
                config: config.pomodoro.getAttributes(),
                colours: config.colours.getAttributes()
            });
            this.cancelPomodoroListen = config.pomodoro.listen(function (n) {
                var config = this.state.config;
                config[n.field] = n.new;
                this.setState({
                    config: config
                });
            }.bind(this));
            this.cancelColoursListen = config.colours.listen(function (n) {
                var colours = this.state.colours;
                colours[n.field] = n.new;
                this.setState({
                    colours: colours
                });
            }.bind(this));
        }.bind(this)).catch(function (err) {
            console.error('Error getting pomodoro settings', err);
        });
    },
    componentWillUnmount: function () {
        this.cancelPomodoroListen();
        this.cancelColoursListen();
    },
    getInitialState: function () {
        return {
            config: null,
            colours: null
        }
    },
    onSuccessfulColorPickerChange: function (change) {
        var prop = this.getProp(change.picker);
        if (prop) this.coloursConfig[prop] = change.color;
        else  console.warn('Unknown color picker', change);

    }
});

module.exports = Settings;