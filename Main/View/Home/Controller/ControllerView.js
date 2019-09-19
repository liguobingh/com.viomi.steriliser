import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { HPX, DeviceWidth, DeviceHeight } from '@Main/Common';
import BaseView from '@Main/View/BaseView';

export default class ControllerView extends BaseView {
    render() {
        return (
            <View style={[styles.bg]}>
                {this.props.children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bg: {
        width: DeviceWidth,
        height: HPX(136),
        backgroundColor: 'transparent',
        alignItems: 'center',
        paddingTop: HPX(25)
    },

    bg_2: {
        width: DeviceWidth,
        height: HPX(136),
        backgroundColor: 'white',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center'
    }
})
