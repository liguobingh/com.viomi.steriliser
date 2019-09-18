import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropsConfig from '@Main/Config/PropsConfig';
import {localizedStrings} from '@Main/Lang/LocalizableString';
import {DeviceModel, DeviceWidth, HPX, PX, WPX} from '@Main/Common';
import BaseView from '@Main/View/BaseView';
import ErrorConfig from '@Main/Config/ErrorConfig';

export default class InfoView extends BaseView {

    constructor(props) {
        super(props);
    }

    /**
     * 获取状态标题文本
     */
    getStatusTitle() {
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
            } else if (workStatus === PropsConfig.workStatus.close_to_dry) {
                title = localizedStrings.workStatus.close_to_dry;
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
    }

    /**
     * 获取剩余时间
     */
    getLeftTime() {
        const {leftTime} = this.controller.state;
        let left;
        left = leftTime.toString();
    }

    onExamine() {
        const {examine} = this.controller.state;
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
        const {workStatus, temp, leftTime, examine} = this.controller.state;
        //是否开机
        const isWork = (workStatus !== PropsConfig.workStatus.close);
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
            isWork
        ) {
            hasExamine = true;
            if (examine.errors.length > 1) {
                examineTitle = localizedStrings.info_view.examineTitle_head_2(examine.errors.length) + localizedStrings.info_view.examineTitle_tail;
            }
            else {
                examineTitle = localizedStrings.info_view.examineTitle_head_1 + examine.errors[0] + localizedStrings.info_view.examineTitle_tail;
            }
        }

        if (isWork) {
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
                                <View style={styles.errorTips_bg}/>
                                <Text style={styles.errorTips_text}>{examineTitle}</Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>
                <View style={styles.content}>
                    <View style={styles.content_text}>
                        <View style={styles.statusView}>
                            <Text style={[styles.text_title, isWork ? {
                                fontSize: 55,
                                marginTop: -HPX(10)
                            } : null]}>{statusTitle}</Text>
                            {
                                isWork ?
                                    <Image style={styles.icon_unit} resizeMode='contain'
                                           source={require('../../../../resources/image/unit_icon.png')}/>
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
                                    <Text style={[styles.text_subtitle, {marginTop: HPX(3)}]}>{mode.title}<Text
                                        style={{fontWeight: 'normal'}}>{' - '}</Text>{windLevelTitle}</Text>
                                    <Text style={[styles.text_subtitle_2, {marginTop: HPX(6)}]}>{swingTitle}</Text>
                                </View>
                        }
                    </View>
                    {
                        DeviceModel.isOnWall() ?
                            <ImageBackground resizeMode={'stretch'} style={styles.bg_wall}
                                             source={require('../../../../resources/image/wall_bg.png')}>
                                <Image resizeMode={'stretch'} style={styles.bg_wall_icon} source={bg_icon}/>
                            </ImageBackground>
                            :
                            <ImageBackground resizeMode={'stretch'} style={styles.bg_stand}
                                             source={require('../../../../resources/image/stand_bg.png')}>
                                <Image resizeMode={'stretch'} style={styles.bg_stand_icon} source={bg_icon}/>
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
