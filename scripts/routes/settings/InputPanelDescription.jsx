var React = require('react');

var InputPanelDescription = React.createClass({
    render: function () {
        return <div>{this.props.children}</div>
    }
});

module.exports = InputPanelDescription;