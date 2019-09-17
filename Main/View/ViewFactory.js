import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    InteractionManager,
    DeviceEventEmitter,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
import BG from './Home/SVGBackground';
import InfoView from './Home/Info/InfoView';

import TestView from './TestView';


import ControllerView from './Home/Controller/ControllerView';
import ControllerBar from './Home/Controller/ControllerBar';
import ControllerTempView from './Home/Controller/ControllerTempView';
import ControllerPower from './Home/Controller/ControllerPower';

import Common, { HPX, DeviceWidth, DeviceHeight } from '@Main/Common';
import ControllerFuncView from './Home/Controller/ControllerFuncView';

import PropsConfig from '@Main/Config/PropsConfig';
import ElectricityStatisPage from '@Main/ElectricityStatisPage';

const isTest = false;
// const isTest = true;

export default class ViewFactory {
    static getMainPage() {
        if (!isTest) {
            return (
                <BG>
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {ViewFactory.getInfoView()}
                        {ViewFactory.getControllerView()}
                    </View>
                </BG>
            )
        }
        else {
            return (
                <TestView />
                // <ElectricityStatisPage />
            )
        }
    }

    static getInfoView() {
        return (
            <InfoView />
        )
    }

    static getControllerView() {
        const { power, mode } = Common.mainPage.state;

        if (power === PropsConfig.close) {
            return (
                <ControllerView>
                    <View style={[styles.bg, { justifyContent: 'center' }]}>
                        <ControllerFuncView />
                        <ControllerPower style={{ marginTop: HPX(20) }} />
                    </View>
                </ControllerView>
            )
        }
        else {
            return (
                <ControllerView>
                    <View style={[styles.bg, { paddingTop: HPX(63) }]}>
                        <ControllerFuncView />
                        <ControllerBar />
                    </View>
                    {
                        mode.supportedTemp() ?
                            <ControllerTempView />
                            :
                            null
                    }
                </ControllerView>
            )
        }
    }
}

const styles = StyleSheet.create({
    bg: {
        width: DeviceWidth,
        height: HPX(252),
        backgroundColor: 'white',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center'
    }
})
