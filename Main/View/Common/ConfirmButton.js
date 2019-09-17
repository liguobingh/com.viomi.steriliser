import React, { Component } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Text,
    InteractionManager
} from 'react-native'
import BaseView from '../BaseView';
import { WPX, HPX, DeviceWidth, DeviceHeight } from '@Main/Common';
import { localizedStrings } from '@Main/Lang/LocalizableString';

import PropsConfig from '@Main/Config/PropsConfig'

const ModeConfig = PropsConfig.mode;

export default class ConfirmButton extends BaseView {


    render() {
        const { confirmTextStyle } = this.props;
        return (
            <View style={styles.btns}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.onCancel && this.props.onCancel()
                    }}
                    style={[styles.btn, {
                        borderStyle: "solid",
                        borderRightWidth: StyleSheet.hairlineWidth,
                        borderRightColor: "#EEEEEE"
                    }]}>
                    <Text style={styles.text_cancel}>{localizedStrings.confirm_button.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.onConfirm && this.props.onConfirm()
                    }}
                    style={styles.btn}
                >
                    <Text style={[styles.text_confirm, confirmTextStyle]}>{localizedStrings.confirm_button.confirm}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btns: {
        height: HPX(60),
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "auto",
        borderStyle: "solid",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#eee"
    },
    btn: {
        height: HPX(60),
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    text_cancel: {
        color: "#999999",
        fontSize: 16
    },
    text_confirm: {
        color: "#3C3C3C",
        fontSize: 16
    }
});