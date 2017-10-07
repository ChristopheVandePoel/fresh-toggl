import React from 'react';
import PropTypes from 'prop-types';
import { withTogglStore } from '../../store';

function renderError(error) {
  return (
    <div>Something went wrong {error}</div>
  );
}

export class TogglContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTag: null,
    };
  }

  renderTags() {
    return Object.keys(this.props.togglData.taggedItems).map(
      tag => (
        <div
          key={tag}
          onClick={() => this.setState({ selectedTag: tag })}
          role="button"
          tabIndex="-1"
        >
          {tag} ({this.props.togglData.taggedItems[tag].length})
        </div>
      ));
  }

  renderTaggedEntries() {
    return this.props.togglData.togglFetched.result.filter(item => (
      item.tags && (item.tags.indexOf(this.state.selectedTag) > -1)
    ));
  }

  render() {
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

TogglContainer.defaultProps = {
  togglData: {},
};

TogglContainer.propTypes = {
  store: PropTypes.shape({}).isRequired,
  togglData: PropTypes.shape({
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

export default withTogglStore(TogglContainer);
