import { makeSelectTokens as selectTokens, makeSelectReader } from 'containers/NetworkClient/selectors';
import { takeLatest, call, put, select, all, fork, join } from 'redux-saga/effects';
import { makeSelectSearchName, makeSelectSearchPubkey } from './selectors';
import { LOOKUP_ACCOUNT, LOOKUP_PUBKEY } from './constants';
import { lookupLoading, lookupLoaded } from './actions';

function* getCurrency(token, name) {
  const networkReader = yield select(makeSelectReader());
  try {
    const currency = yield networkReader.getCurrencyBalance(token, name);
    const currencies = currency.map(c => {
      return {
        account: token,
        balance: c,
      };
    });
    return currencies;
  } catch (err) {
    console.error('An EOSToolkit error occured - see details below:');
    console.error(err);
    return [];
  }
}

function* getAccountDetail(name) {
  console.log("tam_getAccountDetail ");
  try {
    const networkReader = yield select(makeSelectReader());
    console.log("tam_networkReader  ", networkReader);
    const eosTokens = yield select(selectTokens());
    console.log("tam_eosTokens  ", eosTokens);
    const account = yield networkReader.getAccount(name);

    console.log("tam_account  ", account);
    const tokens = yield all(
      eosTokens.map(token => {
        return fork(getCurrency, token.account, name);
      })
    );
    const currencies = yield join(...tokens);
    console.log("tam_currencies  ", currencies);

    const balances = currencies.reduce((a, b) => a.concat(b), []);
    console.log("tam_currencies  ", balances);
    console.log("tam_account  ", account);
    return {
      ...account,
      balances,
    };
  } catch (err) {
    console.error('An EOSToolkit error occured - see details below:');
    console.error(err);
    return {};
  }
}

//
// Get the EOS all accounts by public key
//
function* performSearchPubkey() {
  const networkReader = yield select(makeSelectReader());
  const publicKey = yield select(makeSelectSearchPubkey());
  yield put(lookupLoading());
  try {
    const res = yield networkReader.getKeyAccounts(publicKey);
    const details = yield all(
      res.account_names.map(accountName => {
        return fork(getAccountDetail, accountName);
      })
    );
    const accounts = yield join(...details);
    yield put(lookupLoaded(accounts));
  } catch (err) {
    console.error('An EOSToolkit error occured - see details below:');
    console.error(err);
    yield put(lookupLoaded([]));
  }
}

function* watchSeachPubkey() {
  yield takeLatest(LOOKUP_PUBKEY, performSearchPubkey);
}

//
// Get the EOS single account
//
function* performSearchAccount() {
  const accountName = yield select(makeSelectSearchName());
  yield put(lookupLoading());
  try {
    const account = yield call(getAccountDetail, accountName);
    yield put(lookupLoaded([account]));
  } catch (err) {
    console.error('An EOSToolkit error occured - see details below:');
    console.error(err);
    yield put(lookupLoaded([]));
  }
}

function* watchSeachAccount() {
  yield takeLatest(LOOKUP_ACCOUNT, performSearchAccount);
}

//
// Combine sagas into root saga
//

export default function* rootSaga() {
  yield all([watchSeachAccount(), watchSeachPubkey()]);
}
