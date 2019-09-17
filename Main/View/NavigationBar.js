import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    StatusBar
} from 'react-native';
import ImageButton from '../../plugin_common/Components/mi/ui/ImageButton';
import {PX, WPX,HPX} from '@Main/Common';
import { SafeAreaView } from 'react-navigation';
const { width, height } = Dimensions.get('window');
const titleHeight = 44;
const imgHeight = PX(24);


export default class NavigationBar extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let numberOfLines = this.props.numberOfLines ? this.props.numberOfLines : 1;
        return (
            <SafeAreaView style={[styles.titleBarContainer, this.props.style]}>
                <StatusBar
                    translucent={true}
                    animated={true}
                    hidden={false}
                    backgroundColor={'transparent'}
                    barStyle={'dark-content'}
                />
                <ImageButton onPress={this.props.onPressLeft}
                    style={[styles.img]}
                    source={require('../../resources/image/back_icon.png')}
                />
                <View style={[styles.textContainer]}>
                    <Text
                        style={[styles.titleText, this.props.titleStyle]}
                        onPress={this.props.onPressTitle} numberOfLines={numberOfLines}>{this.props.title}</Text>
                    {
                        this.props.subTitle && <Text
                            style={[styles.subtitleText]}
                            onPress={this.props.onPressTitle}>{this.props.subTitle}</Text>
                    }
                </View>
                <ImageButton onPress={this.props.onPressRight}
                    style={[styles.img, {width:WPX(26)}]}
                    source={require('../../resources/image/more_icon.png')}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    titleBarContainer: {
        flexDirection: 'row',
        width: width,
        alignItems: 'flex-end',
        height: StatusBar.currentHeight + titleHeight
    },
    textContainer: {
        height: titleHeight,
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    titleText: {
        color:'white',
        fontSize:16,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    subtitleText: {
        color: '#00000088',
        fontSize: 12,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    leftRightText: {
        flexDirection: 'column',
        backgroundColor: '#0000',
        color: '#00000088',
        fontSize: 14,
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: "center",
        textAlign: "center"
    },
    img: {
        width: imgHeight,
        height: imgHeight,
        resizeMode: 'contain',
        marginLeft: 16,
        marginTop: (titleHeight - imgHeight) / 2,
        marginBottom: (titleHeight - imgHeight) / 2,
        marginRight: 16,
    },
    dot: {
        position: 'absolute',
        width: 10,
        height: 10,
        resizeMode: 'contain',
        right: 14,
        top: StatusBar.currentHeight + (titleHeight - 28) / 2,
    },
});