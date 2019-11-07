import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import GlobalStyles from '../../GlobalStyles';
import apolloClient from '../../services/apollo'
import OffersList from '../../components/OffersList';
import { SafeAreaView } from 'react-native';


export default OrgHub = ({ navigation }) =>(
  <ApolloProvider client={apolloClient}>
    <SafeAreaView style={GlobalStyles.droidSafeArea}>

      <OffersList navigation={navigation} />
    </SafeAreaView>
  </ApolloProvider>
);
