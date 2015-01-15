var React = require('react'),
    SiestaMixin = require('../../../../react-siesta').SiestaMixin,
    data = require('../../data'),
    PomodoroTimer = require('../../pomodoroTimer');

var Num = React.createClass({
    render: function () {
        var comp = (
            <div className="num">
                <div className="divisor">{this.props.divisor}</div>
                <div className="adjusted">
                    <div className="slash">/</div>
                    <div className="dividend">{this.props.dividend}</div>
                </div>
                <div className="description">{this.props.description}</div>
            </div>
        );
        _.extend(comp, this.props);
        return comp;
    }

});

var PomodoroDetails = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        return (
            <div>
            {this.state.roundLength ?
                (<div>
                    <Num className="" divisor={(this.state.completed % this.state.roundLength) + 1} dividend={this.state.roundLength} description="Current Round"/>
                    <Num className="" divisor={this.state.completed} dividend={12} description="Target Rounds"/>
                </div>) : ''}
            </div>
        );
    },
    componentDidMount: function () {
        this.listenAndSet(PomodoroTimer, {fields: ['completed']});
        this.listenAndSet(data.PomodoroConfig, {fields: ['roundLength']});
    },
    getInitialState: function () {
        return {
            completed: 0,
            roundLength: null
        }
    }
});

module.exports = PomodoroDetails;