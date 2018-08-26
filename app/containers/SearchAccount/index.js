/**
 *
 * SearchAccount
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { lookupAccount, lookupPubkey } from './actions';
import { makeSelectSearchAccounts, makeSelectSearchLoading } from './selectors';

import TestForm from '../../components/testForm'
import ShowForm from '../../components/showForm'
import NetworkClient from '../NetworkClient/index'

import GridContainer from '../../components/GridContainer'

function LoadingSpinner(props) {
  if (props.loading) {
    return <CircularProgress color="secondary" />;
  }
  return '';
}

// eslint-disable-next-line react/prefer-stateless-function
export class SearchAccount extends React.Component {
  render() {
    return (
      <div>
        <NetworkClient/>
        <TestForm{...this.props} />
        <GridContainer>
          {this.props.accounts.map(account => {

            console.log("tam_ LL ", account, account.account_name, JSON.stringify(account, null, 2));
            return <ShowForm account={account}/>
          })}
        </GridContainer>

        
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  accounts: makeSelectSearchAccounts(),
  loading: makeSelectSearchLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    // handleAccountName: form => dispatch(lookupAccount(form.name)),
    handleAccountName: form => dispatch(lookupAccount("123eosgui123")),
    handlePublicKey: form => dispatch(lookupPubkey(form.publicKey)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'SearchAccount', reducer });
const withSaga = injectSaga({ key: 'SearchAccount', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(SearchAccount);
