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
import { WPX, HPX, DeviceWidth, DeviceHeight } from '@Main/Common';
import { localizedStrings } from '@Main/Lang/LocalizableString';
import PropsConfig from '@Main/Config/PropsConfig'
import BasePicker from './BasePicker';

const ModeConfig = PropsConfig.mode;

export default class ModePicker extends BasePicker {
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
                <Image style={styles.item_image} source={icons[key]} />
                <Text style={styles.item_text}>
                    {localizedStrings.mode[key]}
                </Text>
            </TouchableOpacity>
        )
    }

    renderContent() {
        const keyList = [ModeConfig.cool, ModeConfig.hot, ModeConfig.dry, ModeConfig.wind];
        return (
            
            <View style={{marginBottom:HPX(20)}}>
                <Text style={styles.title}>{localizedStrings.mode_select}</Text>
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
    title: {
        marginTop: HPX(14),
        fontSize: 14,
        color: '#666666',
        alignSelf: 'center'
    },

    item_list: {
        width: DeviceWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: HPX(22),
        paddingLeft: HPX(19),
        paddingRight: HPX(19),
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
        color: '#3C3C3C',
        marginTop: HPX(8)
    },

    item_text_gray: {
        color: '#3C3C3C',
    }
});

const icons = {
    cool: require('../../../resources/image/cool_symbol.png'),
    hot: require('../../../resources/image/hot_symbol.png'),
    dry: require('../../../resources/image/dry_symbol.png'),
    wind: require('../../../resources/image/wind_symbol.png')
}