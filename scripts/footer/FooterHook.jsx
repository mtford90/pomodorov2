var e = require('./emitter'),
    React = require('react');

var FooterHook = React.createClass({
    render: function () {
        return (
            <div id="footer">
                <div className="container">
                    {this.state.content}
                </div>
            </div>
        )
    },
    getInitialState: function () {
        return {
            content: ''
        }
    },
    componentDidMount: function () {
        this.setState({
            content: e.last || ''
        });
        e.on('change', function (elem) {
            console.log('change catch');
            this.setState({
                content: elem
            });
        }.bind(this));
    }
});

module.exports = FooterHook;