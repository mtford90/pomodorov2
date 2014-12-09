var React = require('react');

var FilterConfig = React.createClass({
    render: function () {
        var icon = this.props.icon;
        var inlineStyle = this.props.yPos ? {'marginTop': this.props.yPos} : {};
        return (
            <div className={"container filter-config " + this.props.className} style={inlineStyle}>
                <div className="content">
                    <span>
                        <i className={icon} onClick={this.props.onCancel || function () {}}></i>
                    </span>
                    {this.props.children}
                </div>
            </div>
        )
    }
});

module.exports = FilterConfig;