import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { GlobalContextProvider } from 'strapi-helper-plugin';
import { IntlProvider, defineMessages } from 'react-intl';

import translationMessages from '../../../../translations/en.json';

import EditView from '../index';

const history = createMemoryHistory();

describe('Admin | containers | EditView', () => {
  afterEach(cleanup);

  it('should render EditView', () => {
    const intlProvider = new IntlProvider(
      {
        locale: 'en',
        messages: translationMessages,
      },
      {}
    );
    const { intl: originalIntl } = intlProvider.getChildContext();

    const intl = {
      ...originalIntl,
      formatMessage: ({ id, defaultMessage }) => {
        return originalIntl.formatMessage({
          id,
          defaultMessage: defaultMessage || id,
        });
      },
    };

    const { asFragment } = render(
      <IntlProvider
        locale="en"
        defaultLocale="en"
        messages={defineMessages(translationMessages)}
      >
        <GlobalContextProvider formatMessage={intl.formatMessage}>
          <Router history={history}>
            <Switch>
              <Route>
                <EditView />
              </Route>
            </Switch>
          </Router>
        </GlobalContextProvider>
      </IntlProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
