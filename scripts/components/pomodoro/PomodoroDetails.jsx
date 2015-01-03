var React = require('react');

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
    render: function () {
        return (
            <div>
                <Num className="" divisor={1} dividend={4} description="Current Round"/>
                <Num className="" divisor={1} dividend={12} description="Target Rounds"/>
            </div>
        );
    }
});

module.exports = PomodoroDetails;