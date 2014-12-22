var React = require('react');

var Confirmation = React.createClass({
    render: function () {
        return <div className="confirmation-modal">
            <h1 className="title">{"Are you sure?"}</h1>
            <div className="content">{this.props.children}</div>
            <div className="buttons">
                <div className="coloured-button" onClick={this.props.cancel}>Cancel</div>
                <div className="coloured-button" onClick={this.props.ok}>OK</div>
            </div>
        </div>
    }
});

module.exports = Confirmation;