var React = require('react')
    , Panel = require('../../components/Panel')
    , InputPanelItem = require('./InputPanelItem');


var InputPanel = React.createClass({
    render: function () {
        var title, description, footer, rows = [];
        this.props.children.forEach(function (child, i) {
            /* TODO: Better way to determine what the type of component is?
             * If we change the name of InputPanelItem the below will break... */
            var displayName = child.type.displayName;
            if (displayName == 'InputPanelItem') {
                rows.push(
                    <tr key={i}>
                        <td>{child.props.title}</td>
                        <td>{child.props.children}</td>
                    </tr>
                )
            }
            else if (displayName == 'InputPanelTitle') {
                if (title) console.warn('Multiple InputPanelTitle components in one InputPanel');
                else title = child;
            }
            else if (displayName == 'InputPanelDescription') {
                if (description) console.warn('Multiple InputPanelDescription components in one InputPanel');
                else description = child;
            }
            else if (displayName == 'InputPanelFooter') {
                if (footer) console.warn('Multiple InputPanelFooter components in one InputPanel');
                else footer = child;
                console.log('footer', footer);
            }
        });
        return (
            <Panel title={title}>
                {description ? <p>{description}</p> : ''}
                <form>
                    <table className="inputs-table">
                        <tbody>{rows}</tbody>
                    </table>
                </form>
                {footer ? footer : ''}
            </Panel>
        )
    }
});

module.exports = InputPanel;