import React from 'react';
import PropTypes from 'prop-types';

let config = require('./config.js').default;

if (!config) {
  console.warn('No config file found, you will run into problems when credentials are needed');
  config = {
    toggl: 'DUMMY KEY CHANGE THIS IN config.js',
  };
}

const withTogglStore = (WrappedComponent, propsMap = () => {}) => {
  const defaultState = {
    toggl: {
      result: [],
      error: null,
      life: null,
    },
    byTag: {},
  };

  class togglStore extends React.Component {
    constructor(props) {
      super(props);
      this.fetchTogglEntries = this.fetchTogglEntries.bind(this);
      this.state = defaultState;
    }

    funcStore(store = {}) {
      return ({
        ...store,
        fetchTogglEntries: this.fetchTogglEntries,
      });
    }

    fetchTogglEntries() {
      const headers = {
        Authorization: `Basic ${config.toggl.apiKey}`,
      };
      this.setState(prevState => ({
        toggl: {
          ...prevState.toggl,
          life: 'loading',
        },
      }));
      fetch('https://www.toggl.com/api/v8/time_entries', { mode: 'cors', headers })
        .then(
          (result) => {
            if (result.status === 200) {
              result.json().then(
                (yess) => {
                  this.setState({
                    toggl: {
                      result: yess,
                      error: null,
                      life: null,
                    },
                  });
                  const dictByTag = {};
                  yess.forEach((element) => {
                    if (element.tags) {
                      element.tags.forEach((tag) => {
                        if (tag in dictByTag) {
                          dictByTag[tag].push(element);
                        } else {
                          dictByTag[tag] = [element];
                        }
                      });
                    }
                  });
                  this.setState({
                    byTag: dictByTag,
                  });
                },
              );
            } else {
              this.setState({
                toggl: {
                  life: null,
                  error: result.status,
                },
              });
            }
          },
        ).catch(
          err => this.setState({
            toggl: {
              error: err,
              life: null,
            },
          }),
        );
    }

    render() {
      const newProps = propsMap(this.state);
      return (
        <WrappedComponent {...this.props} togglData={newProps} store={this.funcStore(this.props.store)} />
      );
    }
  }

  togglStore.defaultProps = {
    store: {},
  };

  togglStore.propTypes = {
    store: PropTypes.shape({}).isRequired,
  };

  return togglStore;
};

export default withTogglStore;
