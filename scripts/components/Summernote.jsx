/**
 * Summernote react component. Just wraps up the jquery extension in React but also adds some
 * placeholder functionality.
 *
 * It also removes summernote popovers when needed.
 * @module Summernote
 */

var React = require('react')
    , location = require('./../location')
    , paths = require('./../routes/paths')
    , _ = require('underscore');


var lastPath;

function cleanSummernote() {
    $('.note-popover,.note-handle,.note-dialog').remove();
}

location.addChangeListener(function (x) {
    console.log('summernote location', x);
    var path = x.path;
    if (lastPath == paths.tasks && path != paths.tasks) {
        cleanSummernote();
    }
    lastPath = path;
});

var placeholder = '<i class="summernote-placeholder">Click here to add notes</i>';

var Summernote = React.createClass({
    render: function () {
        var html = this.state.html;
        console.log('rendering html', html);
        var comp = (
            <div className="description">
                <div onClick={this.onClick} ref="summernote" dangerouslySetInnerHTML={html ? {__html: html} : {}}>
                </div>
            </div>
        );
        var props = _.extend({}, this.props);
        if (props.summernoteProps) delete props.summernoteProps;
        _.extend(comp.props, props);
        return comp
    },
    componentDidMount: function () {
        var node = this.refs.summernote.getDOMNode(),
            options = this.props.summernoteProps || {};
        this.existingOnBlur = options.onblur;
        this.existingOnFocus = options.onFocus;
        options.onblur = this.onBlur;
        options.onfocus = this.onFocus;
        $(node).summernote(options);
    },
    onClick: function () {
        console.log('summernote on click');
        if (this.existingOnBlur) this.existingOnBlur();
        var $summernote = $(this.refs.summernote.getDOMNode());
        if ($summernote.find('i.summernote-placeholder').length) {
            $summernote.html('');
        }
    },
    onBlur: function () {
        console.log('summernote on blur');

        if (this.existingOnBlur) this.existingOnBlur();
        var $summernote = $(this.refs.summernote.getDOMNode());

        var text = $summernote.text();


        var _updateTask = function () {
            if (this.props.onChange) this.props.onChange(html);
        }.bind(this);


        if (text.length) {
            console.log('got text', text);
            var html = $summernote.html();
            this.setState({
                html: html
            }, _updateTask);
        }
        else {
            console.log('no text', text);
            this.setState({
                html: placeholder
            }, _updateTask);
        }

        cleanSummernote();
    },
    getInitialState: function () {
        return {
            html: this.props.innerHTML || placeholder,
            summernoteProps: this.props.summernoteProps
        }
    },
    shouldComponentUpdate: function (nextProps) {
        // Component should only update if the html is different.
        var $summernote = $(this.refs.summernote.getDOMNode());
        var shouldUpdate = nextProps.innerHTML != $summernote.html();
        console.log(shouldUpdate ? 'updating summernote' : 'not updating summernote');
        return shouldUpdate;
    },
    componentWillReceiveProps: function (nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        this.setState({
            html: nextProps.innerHTML || placeholder,
            summernoteProps: this.props.summernoteProps
        })
    },
    onFocus: function () {
        if (this.existingOnFocus) this.existingOnFocus();
    },
    focus: function () {
        var $summernote = $(this.refs.summernote.getDOMNode());
        $summernote.click(); // Need to click first to trigger the placeholder check.
        $summernote.focus();
    }
});

module.exports = Summernote;