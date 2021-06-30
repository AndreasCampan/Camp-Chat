import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends Component {
    constructor() {
      super();
      this.state = {
        messages: [],
      }
    }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble {...props}
        wrapperStyle={{
          right: { backgroundColor: this.props.route.params.backColor }
        }}
      />
    )
  }

  componentDidMount() {
    let username = this.props.route.params.username; 
    this.props.navigation.setOptions({ title: username });
    this.setState({
      messages: [
        {
          _id: 1,
        text: `Thanks for joining the chat ${this.props.route.params.username}!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'System',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
         },
      ],
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          user={{
            _id: 1,
          }}
          onSend={messages => this.onSend(messages)}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  };
}