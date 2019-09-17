import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { WPX, HPX, DeviceWidth, DeviceHeight, DeviceModel } from '@Main/Common';
import BaseView from '@Main/View/BaseView';
import * as Animatable from 'react-native-animatable';

export default class ControllerPower extends BaseView {
    constructor(props) {
        super(props);
    }

    triggerPower() {
        this.controller.triggerPower();
    }

    render() {
        const { isPowering, isInit } = this.controller.state;
        const disabled = isPowering || isInit;
        return (
            <View style={[styles.bg, this.props.style]}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={() => {
                        requestAnimationFrame(() => {
                            this.triggerPower();
                        })
                    }}
                    style={styles.view_icon}
                >
                    <ImageBackground
                        style={styles.icon_bg}
                        source={require('../../../../resources/image/power_bg_icon.png')}
                    >
                        {
                            disabled ?
                                <Animatable.Image
                                    easing={'linear'}
                                    animation={'rotate'}
                                    iterationCount={'infinite'}
                                    duration={800}
                                    style={styles.icon}
                                    source={require('../../../../resources/image/power_loading.png')}
                                />
                                :
                                <Image style={styles.icon} source={require('../../../../resources/image/power_icon.png')} />
                        }
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        )
    }
}

const size = WPX(76);

const styles = StyleSheet.create({
    bg: {
        width: WPX(108),
        height: WPX(108),
        alignItems: 'center',
        justifyContent: 'center'
    },

    view_icon: {
        // width: size,
        // height: size,
        // borderRadius: size / 2,
        // backgroundColor: 'red',
        // justifyContent: 'center',
        // alignItems: 'center',
    },

    icon_bg: {
        width: WPX(108),
        height: WPX(116),
        justifyContent: 'center',
        alignItems: 'center'
    },

    icon: {
        width: WPX(26),
        height: WPX(26),
        marginTop: -HPX(20)
    }
});

const shadowOpt = {
    width: size,
    height: size,
    color: "#4458FF",
    border: 10,
    radius: size / 2,
    opacity: 0.2,
    x: 0,
    y: 3
}