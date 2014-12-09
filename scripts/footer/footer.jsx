var React = require('react'),
    e = require('./emitter');

var Footer = React.createClass({
    render: function () {
        return (
            <span></span>
        );
    },
    componentDidMount: function () {
        console.log('change emission');
        e.emit('change', this.props.children);
    }
});

module.exports = Footer;