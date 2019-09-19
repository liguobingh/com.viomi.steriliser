import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {DeviceHeight, DeviceModel, DeviceWidth, HPX, WPX} from '@Main/Common';
import PropsConfig from '@Main/Config/PropsConfig';
import BaseView from '@Main/View/BaseView';
import {localizedStrings} from '@Main/Lang/LocalizableString';
import * as Animatable from 'react-native-animatable';

const ModeConfig = PropsConfig.mode;
const ModeLang = localizedStrings.mode;

export default class ControllerBarView extends BaseView {
    getKey(value) {
        for (const key in ModeConfig) {
            if (ModeConfig[key] == value) {
                return key;
            }
        }
        return null;
    }

    getIcons(value) {
        for (let i = 0; i < FunctionForm.length; i++) {
            const element = FunctionForm[i];
            if (element.value == value) {
                return element;
            }
        }
        return null;
    }

    onItem(key) {
        this.controller.triggerFunction(this.controller.state[key]);
    }

    renderItem(value) {
        const key = this.getKey(value);
        const icons = this.getIcons(value);
        let icon = icons.disableIcon;
        if (this.controller.state.mode === PropsConfig.mode.standby) {
            icon = icons.disableIcon;
        } else if (this.controller.state.mode === PropsConfig.mode.dry) {
        }

        return (
            <TouchableOpacity
                key={value}
                style={styles.function_item}
                onPress={() => {
                    this.onItem(key);
                }}
            >
                <Image style={[styles.function_item_icon, {opacity: disabled ? 0.6 : 1}]} source={icon}/>
                <Text style={styles.function_item_text}>{ModeLang[key]}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        let keyList = [ModeConfig.dry];
        keyList.push(ModeConfig.sterilize);
        keyList.push(ModeConfig.auto);

        return (
            <Animatable.View
                animation={'zoomIn'}
                delay={300}
                duration={500}
                style={[styles.function, this.props.style]}
            >
                {
                    keyList.map((item, index) => {
                        return this.renderItem(item)
                    })
                }
            </Animatable.View>
        )
    }
}

const iconSize = DeviceHeight * 0.039;

const styles = StyleSheet.create({
    function: {
        width: DeviceWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    function_item: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: WPX(25),
        marginRight: WPX(25)
    },

    function_item_icon: {
        width: 56,
        height: 56
    },

    function_item_text: {
        marginTop: WPX(6),
        fontSize: 12,
        color: '#3C3C3C'
    }
});

const FunctionForm = [
    {
        value: ModeConfig.dry,
        enableIcon: require('../../../../resources/dry_2x.png'),
        disableIcon: require('../../../../resources/dry_dis_2x.png')
    },
    {
        value: ModeConfig.sterilize,
        enableIcon: require('../../../../resources/sterilize_2x.png'),
        disableIcon: require('../../../../resources/sterilize_dis_2x.png')
    },
    {
        value: ModeConfig.auto,
        enableIcon: require('../../../../resources/auto_2x.png'),
        disableIcon: require('../../../../resources/auto_dis_2x.png')
    }
];
