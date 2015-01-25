var React = require('react');

var ContentEditable = React.createClass({
    render: function () {
        var ComponentClass = this.props.componentClass;
        return (
            <ComponentClass className={"content-editable " + this.props.className}
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable>{this.props.text}</ComponentClass>
        );
    },

    getDefaultProps: function () {
        return {
            componentClass: React.DOM.div,
            className: ''
        }
    },

    shouldComponentUpdate: function (nextProps) {
        return nextProps.text !== $(this.getDOMNode()).text();
    },

    componentDidUpdate: function () {
        var $node = $(this.getDOMNode());
        $node[0].onselectstart = function () {
            return false;
        };
        if (this.props.text !== $node.text()) {
            $node.text(this.props.text);
        }
    },

    emitChange: function () {
        var text = $(this.getDOMNode()).text();
        console.log('emit change!', text, this.props);
        if (this.props.onChange && text !== this.lastText) {
            this.props.onChange(text);
        }
        this.lastText = text;
    }
});

module.exports = ContentEditable;