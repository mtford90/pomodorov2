/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Row = bootstrap.Row
    , Col = bootstrap.Col
    , config = require('../../app.config')
    , _ = require('underscore')
    , ColorPicker = require('../colorPicker')
    , Footer = require('../footer/index.jsx').Footer
    , Panel = require('../Panel')
    , pomodoroFlux = require('../flux/pomodoro')
    , coloursFlux = require('../flux/colours')
    , DocumentTitle = require('react-document-title');


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
        var options = this.state.options;
        var colors = this.state.colours;
        return (
            <div>
                <DocumentTitle title={config.brand}>
                    <div id="settings">
                        <Row componentClass={React.DOM.div}>
                            <Col xs={12} sm={12} md={6} lg={6} className="right-padded" componentClass={React.DOM.div}>
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
                                                    <input type="text" value={options.pomodoroLength}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Long Break Length
                                                </td>
                                                <td>
                                                    <input type="text" value={options.longBreakLength}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Short Break Length
                                                </td>
                                                <td>
                                                    <input type="text" value={options.shortBreakLength}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                Round Length
                                                </td>
                                                <td>
                                                    <input type="text" value={options.roundLength}/>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>

                                </Panel>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} className="left-padded" componentClass={React.DOM.div}>
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
                                                        ref="primary"/>
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
                                                        ref="shortBreak"/>
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
                                                        ref="longBreak"/>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </Panel>
                            </Col>
                        </Row>
                        <Row componentClass={React.DOM.div}>
                            <Col xs={12} sm={12} md={6} lg={6} className="right-padded" componentClass={React.DOM.div}>
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
                                                    <input type="text"/>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </Panel>
                            </Col>
                        </Row>
                    </div>
                </DocumentTitle>
                <Footer>
                ASafsmasfaf
                </Footer>
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
        console.log('componentDidMount');

    },
    getInitialState: function () {
        return {
            options: pomodoroFlux.store.getOptions(),
            colours: coloursFlux.store.getOptions()
        }
    },
    onSuccessfulColorPickerChange: function (change) {
        var prop = this.getProp(change.picker);
        if (prop) {
            var opts = {};
            opts[prop] = change.color;
            console.log('Successful color picker change', opts);
            coloursFlux.actions.mergeOptions(opts);
        }
        else {
            console.warn('Unknown color picker', change);
        }
    }
});

module.exports = Settings;