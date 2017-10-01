import React from 'react';
import PropTypes from 'prop-types';
import withStore from '../../store';


function renderError(error) {
  return (
    <div>Something went wrong {error}</div>
  );
}

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTag: null,
    };
  }

  renderTags() {
    return Object.keys(this.props.newProps.taggedItems).map(
      tag => (
        <div
          key={tag}
          onClick={() => this.setState({ selectedTag: tag })}
          role="button"
          tabIndex="-1"
        >
          {tag} ({this.props.newProps.taggedItems[tag].length})
        </div>
      ));
  }

  renderTaggedEntries() {
    return this.props.newProps.togglFetched.result.filter(item => (
      item.tags && (item.tags.indexOf(this.state.selectedTag) > -1)
    ));
  }

  render() {
    const { newProps, store } = this.props;
    const { error, life, result: entries } = newProps.togglFetched;
    const { taggedItems } = newProps;
    return (
      <div>
        Toggl data:
        <div onClick={store.fetchTogglEntries} role="button" tabIndex="0">Load</div>
        { life === 'loading' ? 'LOADING' : null}
        { entries.length }
        { error ? renderError(error) : null}
        { taggedItems ? this.renderTags() : null }
        { this.renderTaggedEntries().map(entry => <div key={entry.guid}>{entry.guid}</div>) }
      </div>
    );
  }
}

Main.defaultProps = {
  newProps: {},
};

Main.propTypes = {
  store: PropTypes.object,
  newProps: PropTypes.shape({
    togglFetched: PropTypes.shape({
      result: PropTypes.array,
      life: PropTypes.string,
      error: PropTypes.string,
    }),
    taggedItems: PropTypes.object,
  }),
};

const mapToProps = store => ({
  togglFetched: store.toggl,
  taggedItems: store.byTag,
});

export default withStore(Main, mapToProps);
