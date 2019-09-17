import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Button,
    InteractionManager,
    DeviceEventEmitter,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';

import CommonAdapter from '../../plugin_common/Adapter/CommonAdapter'
import TitleBar from '../../plugin_common/Components/TitleBar/TitleBarBlack';

import ItemPicker from '../../plugin_common/Components/ItemPicker';
import { RkSwitch } from 'react-native-ui-kitten';

import PropsConfig from '../Config/PropsConfig';
const FunctionConfig = PropsConfig.function;

import { localizedStrings } from '../Lang/LocalizableString';

import BaseView from '@Main/View/BaseView';
import CircleSlider from './Common/CircleSlider';

const version = 2.0;
export default class TestView extends BaseView {
    componentDidMount() {
        
    }


    render() {
        const { temperature, settemp, mode, power, swingHor, swingVer } = this.controller.state;
        console.log(swingHor.title)
        return (
            <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
                <CircleSlider />
            </View>
        )
    }

}