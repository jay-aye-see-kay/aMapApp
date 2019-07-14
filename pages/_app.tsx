import App, { Container } from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'

import { withApollo } from '../lib/with-apollo-client'

type Props = {
  Component: any;
  pageProps: any;
  apolloClient:any;
};

class MyApp extends App<Props, {}> {
  render = () => {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApollo(MyApp)
