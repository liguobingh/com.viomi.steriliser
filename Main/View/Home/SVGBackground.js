import React, { Component } from 'react';
import {
    View,
    Dimensions
} from 'react-native';
import SVG, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import CommonAdapter from '../../../plugin_common/Adapter/CommonAdapter';

import PropsConfig from '@Main/Config/PropsConfig';
import BaseView from '../BaseView';

import { PX, DeviceWidth, DeviceHeight } from '@Main/Common';

export default class SVGBackground extends BaseView {
    getBGColor() {
        const { power, mode } = this.controller.state;

        let color = 'black';
        if (power === PropsConfig.close) {
            color = 'black';
        }
        else {
            color = ModeColor[mode.key];
        }

        return "url(#" + color + ")";
    }

    render() {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <SVG
                    width={DeviceWidth}
                    height={DeviceHeight - CommonAdapter.TotalNavHeight}
                    style={{
                        position: 'absolute'
                    }}
                >
                    <Defs>
                        <LinearGradient id="black" x1="0" y1="0" x2="0" y2="192">
                            <Stop offset="0" stopColor="#3D3D3D" stopOpacity="1" />
                            <Stop offset="1" stopColor="#666666" stopOpacity="1" />
                        </LinearGradient>
                        <LinearGradient id="blue" x1="0" y1="0" x2="0" y2="192">
                            <Stop offset="0" stopColor="#4458FF" stopOpacity="1" />
                            <Stop offset="1" stopColor="#4458FF" stopOpacity="1" />
                        </LinearGradient>
                        <LinearGradient id="orange" x1="0" y1="0" x2="0" y2="192">
                            <Stop offset="0" stopColor="#FF9A2B" stopOpacity="1" />
                            <Stop offset="1" stopColor="#FF7A45" stopOpacity="1" />
                        </LinearGradient>
                        <LinearGradient id="lightblue" x1="0" y1="0" x2="0" y2="192">
                            <Stop offset="0" stopColor="#2FA8DE" stopOpacity="1" />
                            <Stop offset="1" stopColor="#2FA8DE" stopOpacity="1" />
                        </LinearGradient>
                        <LinearGradient id="lightgreen" x1="0" y1="0" x2="0" y2="192">
                            <Stop offset="0" stopColor="#0FD888" stopOpacity="1" />
                            <Stop offset="1" stopColor="#05C368" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Rect
                        x="0"
                        y="0"
                        width={DeviceWidth}
                        height={DeviceHeight}
                        fill={this.getBGColor()}
                    />
                </SVG>
                {
                    this.props.children
                }
            </View>
        )
    }
}

const ModeColor = {
    cool: 'blue',
    hot: 'orange',
    dry: 'lightblue',
    wind: 'lightgreen'
}