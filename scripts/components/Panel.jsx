

var React = require('react');

var Panel = React.createClass({
    render: function () {
        return (
            <div className="custom-panel">
                <div className="title">
                    {this.props.title}
                </div>
                <div className="panel-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
});

module.exports = Panel;