import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableNativeFeedback
} from 'react-native';

import ScrollableTabView from "react-native-scrollable-tab-view";
import ImageTabBar from "../components/ImageTabBar";
const {width,height} = Dimensions.get('window')

import Do from './Do';
import Done from './Done';

class Main extends Component{
    constructor(props){
        super(props);
        this.tabImages = [
            require('../img/chat_on.png'),
            require('../img/done.png'),
        ];
    }
    componentDidMount(){
    }

    componentWillReceiveProps(){
    }

    render(){
        return(
            <View style={{flex:1,justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}>
                <ScrollableTabView
                    locked={false}
                    tabBarPosition="top"
                    renderTabBar={() => <ImageTabBar tabStyle={{width:width*.4}} badgeNum={0} textStyle={{fontSize:12}} imageSources={this.tabImages} />}
                    tabBarUnderlineStyle={{
                        backgroundColor:"#00acff",
                        height:2,
                    }}
                    tabBarActiveTextColor={'#00acff'}
                    tabBarInactiveTextColor='#bdbdbd'
                    initialPage={0}>

                    <Do tabLabel="Do"></Do>
                    <Done tabLabel="Done"></Done>
                </ScrollableTabView>
            </View>
        )
    }
}
export default Main;