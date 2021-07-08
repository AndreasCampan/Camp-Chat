import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { View, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends Component {
    constructor() {
      super();
      this.state = {
        messages: [],
        user: {
          _id: '',
          name: ''
        },
        uid: 0,
        isConnected: false,
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
    this.referenceMessages = firebase.firestore().collection('messages');
    LogBox.ignoreLogs([
      'Setting a timer'
    ]);
  } 

  componentDidMount() {
    const username = this.props.route.params.username;
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.props.navigation.setOptions({ title: `${username}'s Chat. Online` });
        this.setState({
          isConnected: true,
        });
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          const shuffled = user.uid.split('').sort(function(){return 0.5-Math.random()}).join('');
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: username,
            },
    
            messages: [{
              _id: shuffled,
              text: `Welcome to the chat ${username}`,
              createdAt: new Date(),
             },
          ],
          isConnected: true
          });
          this.addMessages()
          this.unsubscribe = this.referenceMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.props.navigation.setOptions({ title: `${username}'s Chat. Offline` });
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
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

  //-This adds the messages into the state
  addMessages = () => {
    console.log('Is this running?')
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

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.saveMessages();
      this.addMessages();
    })
  }

  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />
    }
  }

  renderBubble = (props) => {
    return (
      <Bubble {...props}
        wrapperStyle={{
          right: { 
            backgroundColor: this.props.route.params.backColor,
            color: '#FFF' 
          },
          left: { 
            backgroundColor: '#cccfcd'
          }
        }}
      />
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar}
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          user={this.state.user}
          renderUsernameOnMessage={true}
          onSend={messages => this.onSend(messages)}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  };
}