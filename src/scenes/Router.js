import React, {Component} from "react";
import {Alert, BackHandler, Image, Platform, StatusBar, StyleSheet,
    TouchableOpacity, AsyncStorage ,View, Text, AppState, BackAndroid} from "react-native";

//modules
import {Actions, Reducer, Router, Scene} from "react-native-router-flux";

//scenes
import Main from './Main';
import Add from './Add';
import Edit from './Edit';

//services

//global states

class App extends Component {
    constructor(props){
        super(props)
        this.state={
        }
    }

    componentWillMount(){
    }

    componentDidMount(prevProps,prevState){
    }

    componentWillUnmount() {
    }
    render(){
        return(
            <Router navigationBarStyle={styles.navBar}
                    titleStyle={styles.title}
                    createReducer={(params)=>this.reducerCreate(params)}
                    backAndroidHandler={()=>this.onBackHandler()} >

                <Scene key="root">
                    <Scene
                        key="main"
                        component={Main}
                        hideNavBar={true}
                        sceneStyle ={{marginTop:0}}
                        initail={true}
                    />

                    <Scene
                        key="add"
                        component={Add}
                        hideNavBar={true}
                        renderBackButton={()=>this.backButton()}
                        title="추가"
                    />

                    <Scene
                        key="edit"
                        component={Edit}
                        hideNavBar={true}
                        title="수정"
                    />
                </Scene>
            </Router>
        )
    }

    backButton(){
        return (
            <TouchableOpacity
                onPress={()=>Actions.pop()}
                style={{}}>
                <Image
                    style={{width:25,height:25,}}
                    source={require('../img/backButton.png')}
                    resizeMode={Image.resizeMode.contain}
                />
            </TouchableOpacity>
        )
    }
    onBackHandler() {
        //this.sceneKey => Actions.currentScene
        console.log('BackHandler:this.sceneKey:' + Actions.currentScene);
        if (Actions.currentScene === "main") {
            BackHandler.exitApp();
            return true;
        } else {
            try {
                Actions.pop();
                return true;
            } catch (e) {
                console.log('onBackHandler:pop failed -maybe at root?');
                return false;
            }
        }
    }

    //reducer not working
    reducerCreate(params) {
        const defaultReducer = new Reducer(params);
        console.log("PARAM:",params);
        return (state, action) => {
            console.log('hi')
            //console.log("ACTION:", action);
            if (action.scene)
                console.log("ACTION:", [action.scene.sceneKey, action.scene.type]);
            if (action.scene && action.scene.sceneKey === 'main' &&
                (action.scene.type === 'REACT_NATIVE_ROUTER_FLUX_PUSH' || action.scene.type === 'REACT_NATIVE_ROUTER_FLUX_REFRESH')) {
                console.log('catch back to main');
            }
            this.sceneKey = action.scene ? action.scene.sceneKey : '';
            return defaultReducer(state, action);
        }
    }
}

const styles = StyleSheet.create({
    navBar:{
        backgroundColor : '#00acff',
        borderBottomColor:'#ffffff00',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
    scene: {
        flex :1,
        marginTop : (Platform.OS === 'ios') ? 64 : 54
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        color:'white',
    }
});

export default App;

console.ignoredYellowBox = ['setting-detail a timer'];

