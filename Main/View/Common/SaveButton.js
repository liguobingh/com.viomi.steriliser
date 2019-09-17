import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native'
import BaseView from '../BaseView';
import { WPX, HPX, DeviceWidth, DeviceHeight } from '@Main/Common';
import { localizedStrings } from '@Main/Lang/LocalizableString';

import PropsConfig from '@Main/Config/PropsConfig'

export default class SaveButton extends BaseView {


    render() {
        let title = (this.props.title ? this.props.title : '保存');
        return (
            <View style={styles.bg}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.onPress && this.props.onPress()
                    }}
                    style={styles.button}
                >
                    <Text style={styles.title}>{title}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bg: {
        backgroundColor: 'white',
        width: DeviceWidth,
        height: HPX(66),
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        backgroundColor: '#5FD1DB',
        width: HPX(343),
        height: HPX(44),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 14
    }
});