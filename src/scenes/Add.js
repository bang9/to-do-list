import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableNativeFeedback,
    TextInput,
    AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {TextField} from 'react-native-material-textfield';
const {width,height} = Dimensions.get('window');
class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
        }
        this.onFocus = this.onFocus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitTitle = this.onSubmitTitle.bind(this);
        this.onSubmitBody = this.onSubmitBody.bind(this);
        this.titleRef = this.updateRef.bind(this, 'title');
        this.bodyRef = this.updateRef.bind(this, 'body');
    }

    componentDidMount() {
    }
    onFocus() {
        let { errors = {} } = this.state;

        for (let name in errors) {
            let ref = this[name];

            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }

        this.setState({ errors });
    }
    onChangeText(text) {
        ['title','body']
            .map((name) => ({ name, ref: this[name] }))
            .forEach(({ name, ref }) => {
                if (ref.isFocused()) {
                    this.setState({ [name]: text });
                }
            });
    }
    updateRef(name, ref) {
        this[name] = ref;
    }
    onSubmitTitle() {
        this.body.focus();
    }
    onSubmitBody() {
        this.body.blur();
    }

    onSubmit() {
        let errors = {};

        ['title', 'body']
            .forEach((name) => {
                let value = this[name].value();

                if (!value) {
                    if(name === 'title') errors[name] = '제목을 입력해주세요';
                    if(name === 'body') errors[name] = '내용을 입력해주세요';
                }
            });

        this.setState({ errors });

        if(this.isEmpty(errors)) {
            this.addList();
        }
    }

    async addList(){
        let list_str = await AsyncStorage.getItem('@LIST');
        let list = []
        if(list_str) list = [ ...JSON.parse(list_str)];

        list.push({title:this.state.title, body:this.state.body, time:Date.now()});
        AsyncStorage.setItem('@LIST', JSON.stringify(list));
        Actions.pop({refresh:true})
    }

    isEmpty(obj) {
        for(var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }

    render(){
        let { errors = {}, ...data } = this.state;
        return(
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <ScrollView>
                <View style={{alignItems:'center',justifyContent:'center',height:100}}>
                    <Text>할 일 등록</Text>
                </View>

                <View style={{marginHorizontal:30}}>
                    <TextField
                        ref={this.titleRef}
                        value={data.title}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        onFocus={this.onFocus}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitTitle}
                        returnKeyType='next'
                        label='제목'
                        error={errors.title}
                    />
                    <TextField
                        ref={this.bodyRef}
                        value={data.body}
                        autoCapitalize='none'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        onFocus={this.onFocus}
                        onChangeText={this.onChangeText}
                        blurOnSubmit={false}
                        returnKeyType='done'
                        label='내용'
                        maxLength={200}
                        multiline={true}
                        characterRestriction={200}
                        error={errors.body}
                    />
                </View>
                </ScrollView>

                <View style={{flexDirection:'row', width:width, justifyContent: 'center', bottom:0}}>
                    <TouchableNativeFeedback onPress={()=>Actions.pop()}>
                        <View style={{width:width*.5, height:50, backgroundColor:'#bbb', justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:15}}>취소</Text>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback onPress={()=>this.onSubmit()}>
                        <View style={{width:width*.5, height:50, backgroundColor:'#44aaff',justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:15}}>등록</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}

export default Add;