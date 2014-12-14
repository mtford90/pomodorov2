/**
 * Summernote react component. Just wraps up the jquery extension in React but also adds some
 * placeholder functionality.
 * @module Summernote
 */

var React = require('react'),
    _ = require('underscore');


var placeholder = '<i class="summernote-placeholder">Click here to add notes</i>';

var Summernote = React.createClass({
    render: function () {
        var html = this.state.html;
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
        console.log('onClick');
        if (this.existingOnBlur) this.existingOnBlur();
        var $summernote = $(this.refs.summernote.getDOMNode());
        if ($summernote.find('i.summernote-placeholder').length) {
            $summernote.html('');
        }
    },
    onBlur: function () {
        console.log('summernote onBlur');
        /*
         TODO: Clean up.
         Probably a better way of using React to deal with this bullshit? JQuery extensions seem
         kind of awkward to integrate.
         */
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

    },
    getInitialState: function () {
        return {
            html: this.props.innerHTML || placeholder
        }
    },
    componentWillReceiveProps: function (nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        this.setState({
            html: nextProps.innerHTML || placeholder
        })
    },
    onFocus: function () {
        console.log('summernote onFocus');
        if (this.existingOnFocus) this.existingOnFocus();
    }
});

module.exports = Summernote;