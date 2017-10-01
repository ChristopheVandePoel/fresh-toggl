import React from 'react';

let config = require('./config.js').default;

if (!config) {
  console.warn('No config file found, you will run into problems when credentials are needed');
  config = {
    toggl: 'DUMMY KEY CHANGE THIS IN config.js',
  };
}

const withStore = (WrappedComponent, propsMap = () => {}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.fetchTogglEntries = this.fetchTogglEntries.bind(this);
      this.state = {
        toggl: {
          entries: [],
          error: null,
          life: null,
        },
      };
    }

    funcStore() {
      return ({
        fetchTogglEntries: this.fetchTogglEntries,
      });
    }

    fetchTogglEntries() {
      const headers = {
        Authorization: `Basic ${config.toggl.apiKey}`,
      };
      this.setState({
        toggl: {
          life: 'loading',
        },
      });
      fetch('https://www.toggl.com/api/v8/time_entries', { mode: 'cors', headers })
        .then(
          (result) => {
            if (result.status === 200) {
              result.json().then(
                (yess) => {
                  this.setState({
                    toggl: {
                      entries: yess,
                      error: null,
                      life: null,
                    },
                  });
                },
              );
            } else {
              this.setState({
                toggl: {
                  entries: this.state.toggl.entries,
                  life: null,
                  error: result.status,
                },
              });
            }
          },
        ).catch(
          err => this.setState({
            toggl: {
              entries: this.state.toggl.entries,
              error: err,
              life: null,
            },
          }),
        );
    }

    render() {
      const newProps = propsMap(this.state);
      return (
        <WrappedComponent {...this.props} newProps={newProps} store={this.funcStore()} />
      );
    }
  };
};

export default withStore;
