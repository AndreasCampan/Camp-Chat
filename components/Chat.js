import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends Component {
    constructor() {
      super();
      this.state = {
        messages: [],
        user: {
          _id: '',
          user: ''
        },
        uid: 0,
      }

    const firebaseConfig = {
      apiKey: "AIzaSyAGuj69DYYArueDIamuffUujpsEQZhR4rY",
      authDomain: "camp-chat-1.firebaseapp.com",
      projectId: "camp-chat-1",
      storageBucket: "camp-chat-1.appspot.com",
      messagingSenderId: "764013688925",
      appId: "1:764013688925:web:acac652ad5065bdb7875b4",
      measurementId: "G-GB03RJS103"
    };

    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    } 

    LogBox.ignoreLogs([
      'Setting a timer'
    ]);
  } 

  componentDidMount() {
    const username = this.props.route.params.username;
    this.props.navigation.setOptions({ title: `${username}'s Chat` });

    this.referenceMessages = firebase.firestore().collection('messages');

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        user: username,
        messages: [{
          _id: 2,
          text: `Welcome to the chat ${username}`,
          createdAt: new Date(),
          system: true,
         },
      ],
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }


  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {

    const messages = [];
    // go through each document
    querySnapshot.forEach( async (doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
      this.setState({
        messages,
    });
  };

  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessages();
    })
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

  addMessages = () => {
    const username = this.props.route.params.username;
    const messages = this.state.messages[0];
    this.referenceMessages.add({
        _id: messages._id,
        text: messages.text,
        createdAt: messages.createdAt,
        user: {
          _id: this.state.uid,
          name: username,
        },
      })
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          user={this.state.user.name}
          renderUsernameOnMessage={true}
          onSend={messages => this.onSend(messages)}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  };
}