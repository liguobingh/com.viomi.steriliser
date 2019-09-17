import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {DeviceHeight, DeviceModel, DeviceWidth, HPX, WPX} from '@Main/Common';
import PropsConfig from '@Main/Config/PropsConfig';
import BaseView from '@Main/View/BaseView';
import {localizedStrings} from '@Main/Lang/LocalizableString';
import * as Animatable from 'react-native-animatable';

const FunctionConfig = PropsConfig.function;
const FunctionLang = localizedStrings.function;

export default class ControllerFuncView extends BaseView {
    getKey(value) {
        for (const key in FunctionConfig) {
            if (FunctionConfig[key] == value) {
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
        if (this.controller.state[key].status === PropsConfig.open) {
            icon = icons.enableIcon;
        }

        const {isPowering, isInit} = this.controller.state;

        const disabled = isPowering || isInit;

        return (
            <TouchableOpacity
                key={value}
                disabled={disabled}
                style={styles.function_item}
                onPress={() => {
                    this.onItem(key);
                }}
            >
                <Image style={[styles.function_item_icon, {opacity: disabled ? 0.6 : 1}]} source={icon}/>
                <Text style={styles.function_item_text}>{FunctionLang[key]}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {power, mode} = this.controller.state;
        let keyList = [FunctionConfig.timer];

        if (power === PropsConfig.open) {
            if (DeviceModel.supportedOpenLight() && this.controller.state.light.supported(mode)) {
                keyList.push(FunctionConfig.light)
            }

            if (DeviceModel.supportedSoftwind() && this.controller.state.softwind.supported(mode)) {
                keyList.push(FunctionConfig.softwind)
            }

            if (DeviceModel.supportedStrongsave() && this.controller.state.strongsave.supported(mode)) {
                keyList.push(FunctionConfig.strongsave)
            }

            if (DeviceModel.supportedEnergysave() && this.controller.state.energysave.supported(mode)) {
                keyList.push(FunctionConfig.energysave)
            }

            if (DeviceModel.supportedAI() && this.controller.state.ai.supported(mode)) {
                keyList.push(FunctionConfig.ai)
            }

            if (DeviceModel.supportedSleep() && this.controller.state.sleep.supported(mode)) {
                keyList.push(FunctionConfig.sleep)
            }
        } else {
            if (DeviceModel.supportedCloseLight() && this.controller.state.light.supported(mode)) {
                keyList.push(FunctionConfig.light)
            }
        }

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
        width: iconSize,
        height: iconSize
    },

    function_item_text: {
        marginTop: WPX(6),
        fontSize: 12,
        color: '#3C3C3C'
    }
});

const FunctionForm = [
    {
        value: FunctionConfig.timer,
        enableIcon: require('../../../../resources/image/timer_icon.png'),
        disableIcon: require('../../../../resources/image/timer_dis_icon.png')
    },
    {
        value: FunctionConfig.light,
        enableIcon: require('../../../../resources/image/light_icon.png'),
        disableIcon: require('../../../../resources/image/light_dis_icon.png')
    },
    {
        value: FunctionConfig.softwind,
        enableIcon: require('../../../../resources/image/softwind_icon.png'),
        disableIcon: require('../../../../resources/image/softwind_dis_icon.png')
    },
    {
        value: FunctionConfig.strongsave,
        enableIcon: require('../../../../resources/image/strongsave_icon.png'),
        disableIcon: require('../../../../resources/image/strongsave_dis_icon.png')
    },
    {
        value: FunctionConfig.sleep,
        enableIcon: require('../../../../resources/image/sleep_icon.png'),
        disableIcon: require('../../../../resources/image/sleep_dis_icon.png')
    },
    {
        value: FunctionConfig.energysave,
        enableIcon: require('../../../../resources/image/strongsave_icon.png'),
        disableIcon: require('../../../../resources/image/strongsave_dis_icon.png')
    },
    {
        value: FunctionConfig.standAi,
        enableIcon: require('../../../../resources/image/ai_icon.png'),
        disableIcon: require('../../../../resources/image/ai_dis_icon.png')
    },
    {
        value: FunctionConfig.ai,
        enableIcon: require('../../../../resources/image/ai_icon.png'),
        disableIcon: require('../../../../resources/image/ai_dis_icon.png')
    }
];
