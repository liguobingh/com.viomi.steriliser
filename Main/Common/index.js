import React, { Component } from 'react';
import {
    Platform,
    PixelRatio,
    Dimensions,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import Model from '@Main/DataModel/Model';
import CommonAdapter from '../../plugin_common/Adapter/CommonAdapter';
import PropsConfig from '@Main/Config/PropsConfig';
import { isIphoneX } from 'react-native-iphone-x-helper'

//设计稿的宽和高
const _designWidth = 375;
const _designHeight = 667;

export const DeviceWidth = Dimensions.get('window').width;

export const DeviceHeight = Dimensions.get('window').height;

/**
 * px转换为dp
 * @param {*} size
 */
export const PX = (size) => {
    if (PixelRatio.get() >= 3 && Platform.Os === 'ios' && size === 1) {
        return size;
    }

    return DeviceWidth / (160 * PixelRatio.get()) * size;
}

/**
 * px按宽度比例转换为dp
 * @param {*} size
 */
export const WPX = (size) => {
    if (size === 1) {
        return StyleSheet.hairlineWidth;
    }

    if (size === 0) {
        return 0;
    }

    return DeviceWidth * (size / _designWidth);
}

/**
 * px按高度比例转换为dp
 * @param {*} size
 */
export const HPX = (size) => {
    if (size === 1) {
        return StyleSheet.hairlineWidth;
    }

    if (size === 0) {
        return 0;
    }

    let height = DeviceHeight;

    if(isIphoneX()){
        height = DeviceHeight - 24 - 34 - 80;
    }

    return height * (size / _designHeight);
}

export const DeviceModel = new Model(CommonAdapter.deviceModel);

export default class Common {
    /**
     * 获取相反的状态{open, close}
     * @param {*} value
     */
    static getOppositeStatus(value) {
        if (value === PropsConfig.open) {
            return PropsConfig.close;
        }
        else {
            return PropsConfig.open;
        }
    }

    static showTips(msg){
        DeviceEventEmitter.emit('ShowToast', msg);
    }
}

Common.mainPage = null;
Common.version = '1.0.13';

//性能优化
if (!__DEV__) {
    global.console = {
        info: () => { },
        log: () => { },
        warn: () => { },
        debug: () => { },
        error: () => { }
    };
}
