import React from 'react';
import {Image, InteractionManager, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {DeviceHeight, DeviceWidth, HPX, WPX} from '@Main/Common';
import {localizedStrings} from '@Main/Lang/LocalizableString';
import PropsConfig from '@Main/Config/PropsConfig'
import BasePicker from '../../BasePicker';

const ModeConfig = PropsConfig.mode;

export default class ControllerBarView extends BasePicker {
    getKey(value) {
        for (const key in ModeConfig) {
            if (ModeConfig[key] == value) {
                return key;
            }
        }
        return null;
    }

    onItem(value) {
        this.hide();
        InteractionManager.runAfterInteractions(() => {
            this.controller.setMode(value);
        })
    }

    renderItem(value) {
        const key = this.getKey(value);
        return (
            <TouchableOpacity
                key={value}
                style={styles.item}
                onPress={() => {
                    requestAnimationFrame(() => {
                        this.onItem(value);
                    })
                }}
            >
                <Image style={styles.item_image} source={icons[key]}/>
                <Text style={styles.item_text}>
                    {localizedStrings.mode[key]}
                </Text>
            </TouchableOpacity>
        )
    }

    renderContent() {
        const keyList = [ModeConfig.dry, ModeConfig.sterilize, ModeConfig.auto];
        return (
            <View style={{marginBottom: HPX(24)}}>
                <View style={styles.item_list}>
                    {
                        keyList.map((item, index) => {
                            return this.renderItem(item)
                        })
                    }
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    item_list: {
        width: DeviceWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: HPX(32),
        paddingLeft: HPX(42),
        paddingRight: HPX(42),
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    item_image: {
        width: WPX(56),
        height: WPX(56)
    },
    item_text: {
        fontSize: 14,
        color: '#666666',
        marginTop: HPX(4)
    },
    item_text_gray: {
        color: '#3C3C3C',
    }
});

const icons = {
    dry: require('../../../../resources/dry_dis_2x.png'),
    sterilize: require('../../../../resources/sterilize_dis_2x.png'),
    auto: require('../../../../resources/auto_dis_2x.png')
}
