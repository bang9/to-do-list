import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableNativeFeedback,
    AsyncStorage,
    FlatList,
    ActivityIndicator
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
const {width,height} = Dimensions.get('window');
class Do extends Component {
    constructor(props) {
        super(props);
        this.state={
            onLoading:true,
            list : [],
            refreshing:false,
        }
    }

    componentWillMount(){
        this.getList();
    }

    componentWillReceiveProps(){
        this.getList()
    }

    componentDidMount() {
    }

    render(){
        return(
            <View style={{flex:1}}>
                <ScrollView style={{marginBottom:50,backgroundColor:'#fafafa'}}>
                    {
                        this.state.onLoading ?
                            <View style={{alignItems:'center',justifyContent:'center',height:height-90}}>
                                <ActivityIndicator size="small" color="#ff8888" />
                            </View>
                            :
                            <FlatList
                                data={this.state.list}
                                renderItem={({item, index}) => { // renderItem return obj{item,index,sperator}
                                    return (
                                        <ListItem item={item} title={item.title} body={item.body} time={item.time} index={index}/>
                                    )
                                }
                                }
                                keyExtractor={(item => item.body)}
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh()}
                                ListEmptyComponent={() =>
                                    <View style={{height: height-130, alignItems: "center", justifyContent: 'center'}}>
                                        <Text style={{fontSize: 13, textAlign: 'center'}}>{"할 일을 등록하세요"}</Text>
                                    </View>

                                }
                            />
                    }
                </ScrollView>

                <TouchableNativeFeedback onPress={()=>Actions.add()}>
                    <View style={{position:'absolute',bottom:0,width:width,height:50,alignItems:'center',justifyContent:'center', backgroundColor:'#00acff11'}}>
                        <View style={{borderColor:'#00acffcc',borderWidth:1.5,height:35,width:35,borderRadius:20, alignItems:'center',justifyContent:'center'}}>
                            <View style={{backgroundColor:'#00acffcc',position:'absolute',width:20,height:1.5}}></View>
                            <View style={{backgroundColor:'#00acffcc',position:'absolute',width:1.5,height:20}}></View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }

    async getList(){
        let list = JSON.parse(await AsyncStorage.getItem('@LIST'));
        if(!list) list = []
        // let keys = Object.keys(list);
        // let stateList = []
        //
        // for(let i = 0, item; item = list[keys[i]]; i++){
        //     item.time =  keys[i];
        //     stateList.push(item)
        // }
        list.reverse()
        this.setState({list:list,refreshing:false, onLoading:false})
    }

    onRefresh(){
        this.setState({refreshing:true})
        this.getList();
    }
}

class ListItem extends Component {
    constructor(){
        super();
        this.state={
            isCollapsed : true,
        }
    }
    _renderHeader() {
        let a = new Date(parseInt(this.props.time));

        let dateObj = {
            year : a.getFullYear(),
            month : a.getMonth()+1,
            date : a.getDate(),
        }
        let timeObj = {
            hour : a.getHours(),
            min : a.getMinutes(),
            sec : a.getSeconds()
        }
        if(timeObj.hour<10) timeObj.hour = "0"+timeObj.hour;
        if(timeObj.min<10) timeObj.min = "0"+timeObj.min;
        let date = `${dateObj.year}/${dateObj.month}/${dateObj.date}`;
        let time = `${timeObj.hour}:${timeObj.min}`;

        return (
            <View style={{flex:1,flexDirection:'row',alignItems:'center',height:70,marginTop:3,paddingHorizontal:20,backgroundColor:'#fff'}}>
                <View style={{flex:0.5}}>
                    <Text style={{fontSize:18,alignSelf:'flex-start'}}>{this.props.title}</Text>
                </View>
                <View style={{flex:0.5,alignItems:'flex-end'}}>
                    <Text>{date}</Text>
                    <Text>{time}</Text>
                </View>
            </View>
        );
    }

    _renderContent() {
        return (
            <View style={{backgroundColor:'#fff'}}>
                <View style={{margin:15}}>
                    <Text>{this.props.body}</Text>
                </View>
                <View style={{flexDirection:'row',height:25}}>
                    <TouchableNativeFeedback onPress={()=>this.remove()}>
                        <View style={{height:25,width:width*.3333, alignItems:'center',justifyContent:'center', backgroundColor:'#ffb7b5'}}><Text>삭제</Text></View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={()=>Actions.edit({item:this.props.item, index:this.props.index})}>
                        <View style={{height:25,width:width*.3333, alignItems:'center',justifyContent:'center', backgroundColor:'#ffec7a'}}><Text>수정</Text></View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={()=>this.done()}>
                        <View style={{height:25,width:width*.3333, alignItems:'center',justifyContent:'center', backgroundColor:'#bbff96'}}><Text>완료</Text></View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }

    render(){
        return(
            <View>
                <TouchableNativeFeedback onPress={()=>this.toggle()}>
                    {this._renderHeader()}
                </TouchableNativeFeedback>
                <Collapsible collapsed={this.state.isCollapsed}>
                    {this._renderContent()}
                </Collapsible>
            </View>

        )
    }

    toggle(){
        this.setState({isCollapsed:!this.state.isCollapsed})
    }

    async done(){
        const item = this.props.item;
        let list = JSON.parse(await AsyncStorage.getItem('@LIST')) // length - index
        list.splice(list.length - this.props.index -1, 1)
        AsyncStorage.setItem('@LIST', JSON.stringify(list))

        let doneList = JSON.parse(await AsyncStorage.getItem('@DONE'))
        if(!doneList) doneList=[]
        doneList.push(item)
        AsyncStorage.setItem('@DONE', JSON.stringify(doneList))

        Actions.refresh({refresh:true})
    }

    async remove(){
        const item = this.props.item;
        let list = JSON.parse(await AsyncStorage.getItem('@LIST')) // length - index
        list.splice(list.length - this.props.index -1, 1)
        AsyncStorage.setItem('@LIST', JSON.stringify(list))

        Actions.refresh({refresh:true})
    }
}


export default Do;