import React from 'react';
import PropTypes from 'prop-types';
import withStore from '../../store';


function renderError(error) {
  return (
    <div>Something went wrong {error}</div>
  );
}

const Main = ({ newProps, store }) => {
  // console.log('this is comp data', newProps.togglFetched);
  const { error, life, entries } = newProps.togglFetched;
  console.log("entries:", entries);
  return (
    <div>
      this is the main container, it is connected to the store, for now.
      <div onClick={store.fetchTogglEntries}>Click Here</div>
      { life === 'loading' ? 'LOADING' : null}
      { error ? renderError(error) : null}
      { entries && entries.length }
    </div>
  );
};

Main.propTypes = {
  store: PropTypes.object,
};

const mapToProps = store => ({
  togglFetched: store.toggl,
});

export default withStore(Main, mapToProps);
