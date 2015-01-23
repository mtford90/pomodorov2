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
        var numCompleted = this.state.rounds.length;
        return (
            <div>
            {this.state.roundLength ?
                (<div>
                    <Num className="" divisor={(numCompleted % this.state.roundLength) + 1} dividend={this.state.roundLength} description="Current Round"/>
                    <Num className="" divisor={numCompleted} dividend={12} description="Target Rounds"/>
                </div>) : ''}
            </div>
        );
    },
    componentDidMount: function () {
        this.listenAndSetState(data.Round.todaysRounds(), 'rounds');
        this.listenAndSetState(data.PomodoroConfig, {fields: ['roundLength']});
    },
    getInitialState: function () {
        return {
            rounds: [],
            roundLength: null
        }
    }
});

module.exports = PomodoroDetails;