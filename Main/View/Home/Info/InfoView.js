import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    Button
} from 'react-native';
import PropsConfig from '@Main/Config/PropsConfig';
import { localizedStrings } from '@Main/Lang/LocalizableString';
import { PX, WPX, HPX, DeviceWidth } from '@Main/Common';
import BaseView from '@Main/View/BaseView';
import { DeviceModel } from '@Main/Common';
import ErrorConfig from '@Main/Config/ErrorConfig';
import Moment from '../../../../kitchen_common/Unit/Moment';

export default class InfoView extends BaseView {

    constructor(props) {
        super(props);

    }

    /**
     * 获取状态标题文本
     */
    getStatusTitle() {
        const { power, settemp, isInit } = this.controller.state;
        let title;

        //正在初始化
        if (isInit) {
            title = localizedStrings.init;
        }
        else {
            if (power === PropsConfig.close) {
                title = localizedStrings.waiting;
            }
            else {
                title = settemp.toString();
            }
        }


        return title;
    }

    /**
     * 获取摆风方向文本
     */
    getSwingTitle() {
        //风摆的title
        let swingTitle = '';
        //支持水平风摆
        if (DeviceModel.supportedSwingHor()) {
            const { swingHor } = this.controller.state;
            swingTitle += swingHor.title;
        }
        //支持水平和垂直
        if (DeviceModel.supportedSwingHor() && DeviceModel.supportedSwingVer()) {
            swingTitle += "   |   ";
        }

        if (DeviceModel.supportedSwingVer()) {
            const { swingVer } = this.controller.state;
            swingTitle += swingVer.title;
        }

        return swingTitle;
    }

    /**
     * 获取定时文本
     */
    getTimerTitle() {
        let timerTitle = '';
        const { power, timer } = this.controller.state;

        //是否开机
        const isOpen = (power === PropsConfig.open);
        if (isOpen) {
            if (timer.status === PropsConfig.open && timer.dateClose === PropsConfig.open && timer.offExeTime !== '') {
                const closeDiff = Moment(timer.offExeTime).diff(new Date(), "seconds");
                timerTitle = localizedStrings.will + timer.getLeftTimeText(closeDiff) + localizedStrings.after + localizedStrings.close;
            }
        }
        else {
            if (timer.status === PropsConfig.open && timer.dateOpen === PropsConfig.open && timer.onExeTime !== '') {
                const openDiff = Moment(timer.onExeTime).diff(new Date(), "seconds");
                timerTitle = localizedStrings.will + timer.getLeftTimeText(openDiff) + localizedStrings.after + localizedStrings.open;
            }
        }

        return timerTitle;
    }

    /**
     * 获取风速文本
     */
    getWindLevelTitle() {
        const { wind_level } = this.controller.state;

        for (const key in PropsConfig.wind_level) {
            if (PropsConfig.wind_level[key] === wind_level) {
                return localizedStrings.wind_level[key];
            }
        }

        return null;
    }

    onExamine() {
        const { examine } = this.controller.state;

        this.controller.checkedErrors();

        //故障数量大于1时，进入故障页面
        if (examine.errors.length > 1) {
            let errors = [];

            for (let i = 0; i < examine.errors.length; i++) {
                const key = examine.errors[i].toString();
                errors.push({
                    title: key + ": " + localizedStrings.error_title[key]
                })
            }

            this.controller.props.navigation.navigate('ErrorPage', {
                errors: errors,
                showAccessIndicator: false
            });
        }
    }

    render() {
        const { power, mode, timer, examine, isPowering } = this.controller.state;
        //是否开机
        const isOpen = (power === PropsConfig.open);
        //背景机型Icon
        let bg_icon = (DeviceModel.isOnWall() ? icons.none : null);

        const windLevelTitle = this.getWindLevelTitle();

        const statusTitle = this.getStatusTitle();

        //当有定时任务时的title
        const timerTitle = this.getTimerTitle();

        //风摆的title
        const swingTitle = this.getSwingTitle();

        //是否显示故障提示
        let hasExamine = false;
        let examineTitle = '';

        /**
         * 当故障数量>0时
         * 当故障提示不是none时
         * 当前在开机状态时
         */
        if (
            examine.errors.length > 0 &&
            examine.errors[0] !== ErrorConfig.none &&
            isOpen
        ) {
            hasExamine = true;
            if (examine.errors.length > 1) {
                examineTitle = localizedStrings.info_view.examineTitle_head_2(examine.errors.length) + localizedStrings.info_view.examineTitle_tail;
            }
            else {
                examineTitle = localizedStrings.info_view.examineTitle_head_1 + examine.errors[0] + localizedStrings.info_view.examineTitle_tail;
            }
        }

        if (isOpen) {
            bg_icon = icons[mode.key];
        }

        return (
            <View style={styles.bg}>
                <View style={styles.tips}>
                    {
                        timer.status === PropsConfig.open ?
                        <Text style={styles.timerTips}>{timerTitle}</Text>
                        :
                        null
                    }
                    {
                        hasExamine ?
                            <TouchableOpacity
                                onPress={() => {
                                    requestAnimationFrame(() => {
                                        this.onExamine();
                                    })
                                }}
                                style={styles.errorTips}
                            >
                                <View style={styles.errorTips_bg} />
                                <Text style={styles.errorTips_text}>{examineTitle}</Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>
                <View style={styles.content}>
                    <View style={styles.content_text}>
                        <View style={styles.statusView}>
                            <Text style={[styles.text_title, isOpen ? { fontSize: 55, marginTop: -HPX(10) } : null]}>{statusTitle}</Text>
                            {
                                isOpen ?
                                    <Image style={styles.icon_unit} resizeMode='contain' source={require('../../../../resources/image/unit_icon.png')} />
                                    :
                                    null
                            }
                        </View>
                        {
                            power === PropsConfig.close
                                ?
                                null
                                :
                                <View>
                                    <Text style={[styles.text_subtitle, { marginTop: HPX(3) }]}>{mode.title}<Text style={{ fontWeight: 'normal' }}>{' - '}</Text>{windLevelTitle}</Text>
                                    <Text style={[styles.text_subtitle_2, { marginTop: HPX(6) }]}>{swingTitle}</Text>
                                </View>
                        }
                    </View>
                    {
                        DeviceModel.isOnWall() ?
                            <ImageBackground resizeMode={'stretch'} style={styles.bg_wall} source={require('../../../../resources/image/wall_bg.png')}>
                                <Image resizeMode={'stretch'} style={styles.bg_wall_icon} source={bg_icon} />
                            </ImageBackground>
                            :
                            <ImageBackground resizeMode={'stretch'} style={styles.bg_stand} source={require('../../../../resources/image/stand_bg.png')}>
                                <Image resizeMode={'stretch'} style={styles.bg_stand_icon} source={bg_icon} />
                            </ImageBackground>
                    }
                </View>
                {/*{*/}
                    {/*isOpen && DeviceModel.supportedAI() ?*/}
                        {/*<TouchableOpacity*/}
                            {/*onPress={() => {*/}
                                {/*this.controller.triggerFunction(this.controller.state.ai);*/}
                            {/*}}*/}
                            {/*style={{ width: 120, height: 50, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', position:'absolute', alignSelf:'center', top:HPX(250) }}*/}
                        {/*>*/}
                            {/*<Text style={{ color: 'white', fontSize: 16 }}>*/}
                                {/*{this.controller.state.ai.status ? 'AI：开启' : 'AI：关闭'}*/}
                            {/*</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*:*/}
                        {/*null*/}
                {/*}*/}
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

    bg_wall: {
        width: WPX(170),
        height: HPX(130)
    },

    bg_wall_icon: {
        width: WPX(26),
        height: HPX(26),
        marginLeft: WPX(21),
        marginTop: HPX(21),
        opacity: 0.4
    },

    bg_stand: {
        width: WPX(120),
        height: HPX(290),
        marginRight: WPX(53),
        opacity: 0.4
    },

    bg_stand_icon: {
        width: WPX(22),
        height: HPX(22),
        marginTop: HPX(50),
        alignSelf: 'center',
    },

    text_title: {
        color: 'white',
        fontSize: 34,
        fontWeight: '500'
    },
    text_subtitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '500'
    },
    text_subtitle_2: {
        color: 'white',
        fontSize: 12
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

const icons = {
    none: require('../../../../resources/image/waiting_icon.png'),
    cool: require('../../../../resources/image/cool_icon.png'),
    hot: require('../../../../resources/image/hot_icon.png'),
    dry: require('../../../../resources/image/dry_icon.png'),
    wind: require('../../../../resources/image/wind_icon.png'),
}
