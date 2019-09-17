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
import ModelConfig from '@Main/Config/ModelConfig';
import PropsConfig from '@Main/Config/PropsConfig';
import BaseView from '@Main/View/BaseView';
import { localizedStrings } from '@Main/Lang/LocalizableString';
import * as Animatable from 'react-native-animatable';

export default class ControllerBar extends BaseView {
    render() {
        const { mode, isPowering } = this.controller.state;
        const enableWindLevel = (mode.id !== PropsConfig.mode.dry);

        return (
            <Animatable.View
                animation={'zoomIn'}
                delay={300}
                duration={500}
            >
                <ImageBackground
                    resizeMode='stretch'
                    style={styles.bar_bg}
                    source={require('../../../../resources/image/controller_bar_bg.png')}
                >
                    <View
                        style={[styles.bar, this.props.style]}
                    >
                        <TouchableOpacity
                            disabled={isPowering}
                            style={styles.item_power}
                            onPress={() => {
                                requestAnimationFrame(() => {
                                    this.controller.triggerPower();
                                })
                            }}
                        >
                            {
                                isPowering ?
                                    <Animatable.Image
                                        easing={'linear'}
                                        animation={'rotate'}
                                        iterationCount={'infinite'}
                                        duration={800}
                                        style={styles.item_icon}
                                        source={require('../../../../resources/image/power_loading.png')}
                                    />
                                    :
                                    <Image style={styles.item_icon} source={require('../../../../resources/image/power_icon.png')} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isPowering}
                            onPress={() => {
                                requestAnimationFrame(() => {
                                    this.controller.showSwingPicker();
                                });
                            }}
                            style={styles.item}
                        >
                            <Image style={styles.item_icon} source={require('../../../../resources/image/swing_icon.png')} />
                            <Text style={styles.item_text}>{localizedStrings.swing_str}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isPowering}
                            onPress={() => {
                                if (!enableWindLevel) {
                                    return;
                                }
                                requestAnimationFrame(() => {
                                    this.controller.showWindLevelPicker();
                                });
                            }}
                            style={styles.item}
                        >
                            <Image
                                style={styles.item_icon}
                                source={
                                    enableWindLevel ?
                                        require('../../../../resources/image/windlevel_icon.png')
                                        :
                                        require('../../../../resources/image/windlevel_dis_icon.png')
                                }
                            />
                            <Text style={[styles.item_text, enableWindLevel ? null : { opacity: 0.8 }]}>{localizedStrings.wind_level_str}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isPowering}
                            onPress={() => {
                                requestAnimationFrame(() => {
                                    this.controller.showModePicker();
                                });
                            }}
                            style={styles.item}
                        >
                            <Image style={styles.item_icon} source={require('../../../../resources/image/mode_icon.png')} />
                            <Text style={styles.item_text}>{localizedStrings.mode_str}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </Animatable.View>
        )
    }
}

const itemSize = WPX(64)
const iconSize = WPX(26)

const styles = StyleSheet.create({
    bar_bg: {
        width: DeviceWidth,
        height: HPX(110),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: HPX(20)
    },

    bar: {
        width: WPX(345),
        height: HPX(76),
        backgroundColor: '#3C3C3C',
        borderRadius: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft:WPX(7),
        paddingRight:WPX(7 + 10)
    },

    item_power: {
        backgroundColor: '#2E2E2E',
        width: itemSize,
        height: itemSize,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16
    },

    item: {
        width: itemSize,
        height: itemSize,
        justifyContent: 'center',
        alignItems: 'center'
    },

    item_icon: {
        width: iconSize,
        height: iconSize,
    },

    item_text: {
        color: '#FEFEFE',
        fontSize: 12,
        marginTop: HPX(4)
    }
});