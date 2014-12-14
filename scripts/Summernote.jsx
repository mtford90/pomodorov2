/**
 * Summernote react component. Just wraps up the jquery extension in React but also adds some
 * placeholder functionality.
 * @module Summernote
 */

var React = require('react'),
    _ = require('underscore');

var Placeholder = React.createClass({
    render: function () {
        return (
            <i className="summernote-placeholder">Click here to add notes</i>
        )
    }
});

var placeholder = <Placeholder/>

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
                <div ref="summernote" dangerouslySetInnerHTML={html ? {__html: html} : {}}>
                </div>
            );
        }
        else {
            console.log('render content', content);

            summernote = (
                <div ref="summernote">{content}</div>
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
    onBlur: function () {
        /*
         TODO: Clean up.
         Probably a better way of using React to deal with this bullshit? JQuery extensions seem
         kind of awkward to integrate.
         */
        if (this.existingOnBlur) this.existingOnBlur();
        var $summernote = $(this.refs.summernote.getDOMNode());
        var text = $summernote.text();
        console.log('text', text);
        if (text.length) {
            var html = $summernote.html();
            console.log('html', html);
            this.setState({
                html: html
            })
        }
        else {
            this.setState({
                html: null,
                content: placeholder
            });
        }

    },
    getInitialState: function () {
        return {
            content: this.props.children || placeholder
        }
    },
    onFocus: function () {
        if (this.existingOnFocus) this.existingOnFocus();
        if (!this.state.html && this.state.content == placeholder) {
            var $node = $(this.refs.summernote.getDOMNode());
            $node.html('');
            $node.click();
        }
    }
});

module.exports = Summernote;