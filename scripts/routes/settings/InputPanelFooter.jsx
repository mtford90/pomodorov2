var React = require('react');

var InputPanelFooter = React.createClass({
    render: function () {
        var ComponentClass = this.props.componentClass || React.DOM.div;
        var xml = <ComponentClass>{this.props.children}</ComponentClass>;
        _.extend(xml.props, this.props);
        return xml
    }
});

module.exports = InputPanelFooter;