var React = require('react');

var defaultState = {
    popoverStyle: {
        opacity: 0,
        pointerEvents: 'none'
    },
    overlayStyle: {
        opacity: 0,
        pointerEvents: 'none'
    },
    contentStyle: {
        width: '0px',
        height: '0px'
    },
    inner: <span></span>
};

var cstr;

var Modal = React.createClass({
    render: function () {
        var self = this;
        return (
            <div>
                <div id="modal-popover" style={this.state.popoverStyle} onClick={self.onOverlayClicked} ref="popover">
                    <div id="inner-modal-popover">
                    </div>
                    <div className="content" style={this.state.contentStyle}>
                    {this.state.inner}
                    </div>
                </div>
                <div id="modal-overlay" style={this.state.overlayStyle} ref="overlay"></div>
            </div>
        )
    },
    componentDidMount: function () {
        // Make available reveal, hide etc so can export functionality of the placeholder
        cstr = this;
    },
    getInitialState: function () {
        return defaultState
    },
    reveal: function (elem) {
        var stateChange = {
            popoverStyle: {
                opacity: 1.0,
                pointerEvents: 'auto'
            },
            overlayStyle: {
                opacity: 0.3,
                pointerEvents: 'auto'
            },
            contentStyle: {
                width: '400px',
                height: '300px'
            }
        };
        if (elem) stateChange['inner'] = elem;
        this.setState(stateChange)
    },
    onOverlayClicked: function (e) {
        console.log('target', e.target);
        if (e.target == this.refs.popover.getDOMNode()) {
            this.hideModal();
        }
    },
    hideModal: function () {
        this.setState(defaultState);
    }

});

var placeholder = <Modal/>;

var exports = {
    placeholder: placeholder,
    reveal: function () {
        cstr.reveal.apply(cstr, arguments);
    },
    hide: function () {
        console.log('hide');
        cstr.hideModal();
    }
};
module.exports = exports;