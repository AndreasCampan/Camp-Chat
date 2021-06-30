import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Chat extends Component {

  componentDidMount() {
    let username = this.props.route.params.username; 
    this.props.navigation.setOptions({ title: username });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.route.params.backColor}}>
        {/* Rest of the UI */}
        <Text>Welcome!</Text>
      </View>
    );
  };
}