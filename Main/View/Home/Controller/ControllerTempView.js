import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { WPX, HPX, DeviceWidth, DeviceHeight } from '@Main/Common';
import PropsConfig from '@Main/Config/PropsConfig';
import BaseView from '@Main/View/BaseView';
import * as Animatable from 'react-native-animatable';

export default class ControllerTempView extends BaseView {

    render() {
        const { power, isPowering, settemp } = this.controller.state;

        if (power === PropsConfig.close) {
            return (
                <View style={styles.bg_tempControl} />
            )
        }

        let down_icon = require('../../../../resources/image/down_icon.png');
        let up_icon = require('../../../../resources/image/up_icon.png');

        let isMinTemp = false;
        let isMaxTemp = false;

        if(settemp === PropsConfig.settemp.min){
            isMinTemp = true;
        }

        if(settemp === PropsConfig.settemp.max){
            isMaxTemp = true;
        }

        if(isPowering || isMinTemp){
            down_icon = require('../../../../resources/image/down_dis_icon.png');
        }

        if(isPowering || isMaxTemp){
            up_icon = require('../../../../resources/image/up_dis_icon.png');
        }

        return (
            <Animatable.View
                animation={'zoomIn'}
                delay={300}
                duration={500}
                style={styles.bg}
            >
                <ImageBackground resizeMode={'stretch'} style={[styles.bg_image, this.props.style]} source={require('../../../../resources/image/bg_tempControl.png')} >
                    <View style={styles.tempControl}>
                        <TouchableOpacity
                            disabled={isPowering || isMinTemp}
                            onPress={this.controller.downTemp.bind(this.controller)}
                            style={styles.tempControl_item}
                        >
                            <Image style={styles.tempControl_icon} source={down_icon} />
                        </TouchableOpacity>
                        <View style={styles.tempControl_line} />
                        <TouchableOpacity
                            disabled={isPowering || isMaxTemp}
                            onPress={this.controller.upTemp.bind(this.controller)}
                            style={styles.tempControl_item}
                        >
                            <Image style={styles.tempControl_icon} source={up_icon} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </Animatable.View>
        )
    }
}

const iconSize = DeviceHeight * 0.039;
const tempControlWidth = WPX(215);
const tempControlHeight = HPX(67);
const tempControlItemWidth = (tempControlWidth - 1) / 2;

const styles = StyleSheet.create({
    bg: {
        alignSelf: 'center',
        width: WPX(225),
        height: HPX(63 + 25),
        alignItems: 'center',
        position: 'absolute'
    },

    bg_image: {
        width: WPX(225),
        height: HPX(63),
        marginTop: HPX(25),
        alignItems: 'center'
    },

    tempControl: {
        marginTop: -HPX(25),
        width: tempControlWidth,
        height: tempControlHeight,
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },

    tempControl_item: {
        width: tempControlItemWidth,
        height: tempControlHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tempControl_icon: {
        width: iconSize,
        height: iconSize
    },

    tempControl_line: {
        width: StyleSheet.hairlineWidth,
        height: HPX(22),
        backgroundColor: '#6D6C6C'
    },
});