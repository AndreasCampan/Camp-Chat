import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground,  TouchableOpacity } from 'react-native';

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      backColor: '#757083'
    }
  }

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ImageBackground
          style={styles.imgBG}
          source={require('../assets/Background-image.png')}
        > 
        <View style={styles.mainTitle}>
          <Text style={styles.title}>Chat Camp</Text>
        </View>
        <View style={styles.whiteBox}>
          <TextInput style={styles.nameInput}
            placeholder='Type your name'
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
          />
          <View>
            <Text style={styles.colorText}>Choose Background Color:</Text>
            <View style={styles.backColor}>
              <TouchableOpacity
                style={styles.colorSelection1}
                onPress={() => this.setState({ backColor: '#090C08' })}
              />
              <TouchableOpacity
                style={styles.colorSelection2}
                onPress={() => this.setState({ backColor: '#474056' })}
              />
              <TouchableOpacity
                style={styles.colorSelection3}
                onPress={() => this.setState({ backColor: '#8A95A5' })}
              />
              <TouchableOpacity
                style={styles.colorSelection4}
                onPress={() => this.setState({ backColor: '#B9C6AE' })}
              />
            </View>
          </View>
          <TouchableOpacity title="Go to Chat" style={styles.startBttn,{backgroundColor: this.state.backColor}}
            onPress={() => this.props.navigation.navigate('Chat', { username: this.state.username, backColor: this.state.backColor })}
            accessible={true}
            accessibilityLabel="Start Chat"
            accessibilityHint="This lets you enter the chat with the username provided in the input."
            accessibilityRole="button"
          > 
          <Text style={styles.startText}>Let's Chat!</Text>
          </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nameInput: {
    height:50,
    borderColor: 'gray',
    borderWidth: 1,
    borderColor: '#8a8697',
    borderRadius: 2,
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    paddingLeft: 15,
  },

  imgBG: {
    width: '100%',  
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  mainTitle: {
    flex: 0.5,
    fontSize: 45,
  },

  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    top: 15,
    height:60,
  },

  colorText:{
    fontSize: 16,
    fontWeight: '500',
    color: '#757083',
    marginBottom: 10,
  },

  whiteBox: {
    minHeight: 260,
    height: '44%',
    backgroundColor: '#fff',
    width: '88%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: '6%',
    paddingRight: '6%',
  },

  startBttn: {
    height: 60,
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
  },

  backColor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  colorSelection1: {
    backgroundColor: '#090C08',
    width:50,
    height:50,
    borderRadius: 25,
  },

  colorSelection2: {
    backgroundColor: '#474056',
    width:50,
    height:50,
    borderRadius: 25,
  },

  colorSelection3: {
    backgroundColor: '#8A95A5',
    width:50,
    height:50,
    borderRadius: 25,
  },

  colorSelection4: {
    backgroundColor: '#B9C6AE',
    width:50,
    height:50,
    borderRadius: 25,
  },

  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 60,
  },
});