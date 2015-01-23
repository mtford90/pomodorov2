var React = require('react')
    , Timer = require('./pomodoro/Timer');

var comp, instance;

function rerenderRightNavbar() {
    if (instance) instance.setState({}); // re-render
}

var RightNavbarPlaceholder = React.createClass({
    render: function () {
        return comp ? comp : <Timer className="pull-right"/>;
    },
    componentDidMount: function () {
        if (instance) throw Error('Should not be more than one right navbar component...');
        else {
            instance = this;
        }
    },
    componentWillUnmount: function () {
        instance = null;
    }
});


RightNavbarPlaceholder.RightNavbar = React.createClass({
    render: function () {
        return <span/>
    },
    componentDidMount: function () {
        comp = this.props.children;
        console.log('comp', comp);
        if (instance) instance.setState({}); // re-render
    },
    componentWillUnmount: function () {
        comp = null;
        rerenderRightNavbar();
    },
    componentWillReceiveProps: function (nextProps) {
        comp = nextProps.children;
        rerenderRightNavbar();
    }
});

module.exports = RightNavbarPlaceholder;