/**
 * Summernote react component. Just wraps up the jquery extension in React but also adds some
 * placeholder functionality.
 * @module Summernote
 */

var React = require('react'),
    _ = require('underscore');


var UnsafeHTML = React.createClass({
    render: function () {
        var ComponentClass = this.props.componentClass || React.DOM.div;
        var xml = (
            <ComponentClass dangerouslySetInnerHTML={html ? {__html: this.props.html} : {}}></ComponentClass>
        );
        // Pass on the props.
        _.extend(xml, this.props);
        return xml;
    }
});

var Placeholder = React.createClass({
    render: function () {
        return (
            <i className="summernote-placeholder">Click here to add notes</i>
        )
    }
});

var placeholder = <Placeholder/>;

var Summernote = React.createClass({
    render: function () {
        var content = this.state.content
            , html = this.state.html;


        var summernote;
        if (html) {
            console.log('render html', html);
            // Horrible little hack. We pull the raw HTML out of summernote if we detect anything
            // meaningful exists.
            summernote = (
                <div onClick={this.onClick} ref="summernote" dangerouslySetInnerHTML={html ? {__html: html} : {}}>
                </div>
            );
        }
        else {
            console.log('render content', content);

            summernote = (
                <div onClick={this.onClick} ref="summernote">{content}</div>
            )
        }
        var comp = (
            <div className="description">
                {summernote}
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
        console.log('onClick state', this.state);
        if (this.state.content == placeholder && !this.state.html) {
            $summernote.html('');
        }
    },
    onBlur: function () {
        /*
         TODO: Clean up.
         Probably a better way of using React to deal with this bullshit? JQuery extensions seem
         kind of awkward to integrate.
         */
        if (this.existingOnBlur) this.existingOnBlur();
        var $summernote = $(this.refs.summernote.getDOMNode());
        var text = $summernote.text();
        var _updateTask = function() {
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
            html = '';
            this.setState({
                html: null,
                content: placeholder
            }, _updateTask);
        }

    },
    getInitialState: function () {
        return {
            content: this.props.children || placeholder,
            html: this.props.innerHTML
        }
    },
    onFocus: function () {
        if (this.existingOnFocus) this.existingOnFocus();
    }
});

module.exports = Summernote;