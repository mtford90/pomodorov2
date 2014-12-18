var React = require('react');

var InputPanelFooter = React.createClass({
    render: function () {
        return <div>{this.props.children}</div>
    }
});

module.exports = InputPanelFooter;