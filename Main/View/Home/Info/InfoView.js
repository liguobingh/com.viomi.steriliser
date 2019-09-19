import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import PropsConfig from '@Main/Config/PropsConfig';
import {localizedStrings} from '@Main/Lang/LocalizableString';
import {DeviceModel, DeviceWidth, HPX, PX, WPX} from '@Main/Common';
import BaseView from '@Main/View/BaseView';

export default class InfoView extends BaseView {

    constructor(props) {
        super(props);
    }

    /**
     * 获取工作状态文本
     */
    getWorkStatusTitle() {
        const {workStatus, isInit} = this.controller.state;
        let title;

        //正在初始化
        if (isInit) {
            title = localizedStrings.init;
        }
        else {
            if (workStatus === PropsConfig.workStatus.close) {
                title = localizedStrings.workStatus.close;
            } else if (workStatus === PropsConfig.workStatus.standby) {
                title = localizedStrings.workStatus.standby;
            } else if (workStatus === PropsConfig.workStatus.dry) {
                title = localizedStrings.workStatus.dry;
            } else if (workStatus === PropsConfig.workStatus.sterilize) {
                title = localizedStrings.workStatus.sterilize;
            } else if (workStatus === PropsConfig.workStatus.auto) {
                title = localizedStrings.workStatus.auto;
            }
        }
        return title;
    }

    /**
     * 获取当前温度
     */
    getCurTemp() {
        const {temp} = this.controller.state;
        let curTemp;
        curTemp = temp.toString();
        return curTemp;
    }

    /**
     * 获取剩余时间
     */
    getLeftTime() {
        const {leftTime} = this.controller.state;
        let left;
        left = leftTime.toString();
        return left;
    }

    render() {
        const {workStatus, temp, leftTime} = this.controller.state;

        // 工作状态
        const statusTitle = this.getWorkStatusTitle();
        // 当前温度
        const curTemp = this.getCurTemp();
        // 剩余时间
        const left = this.getLeftTime();

        return (
            <View style={styles.bg}>
                <View style={styles.content}>
                    <View style={styles.content_text}>
                        <View style={styles.statusView}>
                            <Text style={styles.text_title}>{statusTitle}</Text>
                        </View>
                        {
                            workStatus === PropsConfig.workStatus.close ?
                                null
                                :
                                <View>
                                    <Text style={[styles.text_subtitle, {marginTop: HPX(3)}]}>当前温度<Text style={{fontWeight: 'normal'}}></Text>{curTemp}</Text>
                                    <Text style={[styles.text_title, {marginTop: HPX(6)}]}>{left}</Text>
                                    <Text style={[styles.text_subtitle, {marginTop: HPX(3)}]}>剩余时间</Text>
                                </View>
                        }
                    </View>
                    {
                        <ImageBackground resizeMode={'stretch'} style={styles.bg_dev}
                                         source={require('../../../../resources/device_pic.png')}>
                        </ImageBackground>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bg: {
        flex: 1
    },
    tips: {
        position: 'absolute',
        width: DeviceWidth,
        height: HPX(44),
    },
    timerTips: {
        width: DeviceWidth,
        textAlign: 'center',
        color: 'white'
    },
    content: {
        width: DeviceWidth,
        marginTop: HPX(84),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusView: {
        flexDirection: 'row'
    },
    content_text: {
        paddingLeft: WPX(27)
    },
    bg_dev: {
        width: WPX(170),
        height: HPX(130)
    },
    text_title: {
        color: '#636E7E',
        fontSize: 30,
        fontWeight: '500'
    },
    text_subtitle: {
        color: '#636E7E',
        fontSize: 16,
        fontWeight: '500'
    },
    icon_unit: {
        marginTop: WPX(7),
        marginLeft: WPX(7),
        width: WPX(18),
        height: HPX(16),
    },
    errorTips: {
        marginTop: HPX(5),
        width: DeviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        height: HPX(44),
    },
    errorTips_bg: {
        position: 'absolute',
        width: DeviceWidth,
        height: HPX(44),
        backgroundColor: '#FFFFFF',
        opacity: 0.2
    },
    errorTips_text: {
        color: '#FFFFFF',
        fontSize: 14
    }
});
