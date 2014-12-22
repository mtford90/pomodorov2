var React = require('react'),
    ColouredButton = require('../../components/ColouredButton');

var Confirmation = React.createClass({
    render: function () {
        return <div className="confirmation-modal">
            <h1 className="title">{this.props.title || "Are you sure?"}</h1>
            {this.props.children ? <p className="confirmation-content">{this.props.children}</p> : ''}
            <div className="buttons">
                <ColouredButton onClick={this.props.cancel}>Cancel</ColouredButton>
                <ColouredButton onClick={this.props.ok}>OK</ColouredButton>
            </div>
        </div>
    }
});

module.exports = Confirmation;