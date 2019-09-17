'use strict'

import React, { Component } from 'react';
import {
    View,
    InteractionManager,
    DeviceEventEmitter
} from 'react-native';
import CommonAdapter from '../plugin_common/Adapter/CommonAdapter';
import DataAdapter from '../plugin_common/Adapter/DataAdapter';
import ProjectAdapter from '../plugin_common/Adapter/ProjectAdapter';
import TitleBarWhite from '../plugin_common/Components/mi/ui/TitleBarWhite';

import PropsConfig from '@Main/Config/PropsConfig';
import UrlConfig from '@Main/Config/UrlConfig';

import { localizedStrings } from '@Main/Lang/LocalizableString';

import VFactory from "./View/ViewFactory";
// import NavigationBar from './View/NavigationBar';
import Common, { DeviceModel } from './Common';
import ModePicker from './View/Picker/ModePicker';
import WindLevelPicker from './View/Picker/WindLevelPicker';
import SwingPicker from './View/Picker/SwingPicker';
// import PhoneCallPicker from './View/Picker/PhoneCallPicker';
import SettingItemView from './View/Common/SettingItemView';

import CommonUnit from '../kitchen_common/Unit/CommonUnit';

const FunctionConfig = PropsConfig.function;

const readPropsInterval = 4;

export default class MainPage extends Component {

    static navigationOptions = ({ navigation }) => {
        let color = navigation.getParam('navColor', NavColor.close);
        return {
            header: (
                <TitleBarWhite
                    title={CommonAdapter.deviceName}
                    style={{ backgroundColor: color }}
                    onPressLeft={() => {
                        CommonAdapter.exit()
                    }}
                    onPressRight={() => {
                        navigation.navigate('SettingPage', {
                            featureView: DeviceModel.supportedSettingPageConfig() ? <SettingItemView navigation={navigation} /> : null,
                            showAuto: false,
                            isBluetooth: false,
                            showMiLicense: !ProjectAdapter.isYunmi && !CommonAdapter.isShared,
                            licenseUrl: '',
                            privateUrl: '',
                            showShare: true,
                            showUpdate: DeviceModel.supportedOTA(),
                            url: CommonAdapter.FAQUrl(DeviceModel.id),
                            version: Common.version
                        });
                    }}
                />
            )
        };
    };

    constructor(props, context) {
        super(props, context);

        Common.mainPage = this;

        this.state = {
            ...DeviceModel.states,
            //是否正在初始化
            isInit: true,
            //是否正在开关机状态
            isPowering: false,

        }

        //是否网络正常
        this.isNeting = false;
        //上一次访问属性返回的数据
        this.prePropsDatas = null;
    }

    componentDidMount() {
        this.listener_1 = this.props.navigation.addListener('didFocus', () => {
            CommonUnit.resumePropsLoop({
                updateProps: true
            });
        });
        this.listener_2 = this.props.navigation.addListener('willBlur', () => {
            CommonUnit.stopPropsLoop();
        });
        this.listener_3 = DeviceEventEmitter.addListener('UpdateStrongSave', this.setStrongSave.bind(this));
        this.listener_4 = DeviceEventEmitter.addListener('UpdateAI', this.setStandAI.bind(this));


        CommonUnit.addNetInfoListener((isConnected) => {
            this.isNeting = isConnected;

            if (isConnected) {
                CommonUnit.resumePropsLoop({
                    updateProps: true
                });
            }
            else {
                CommonUnit.stopPropsLoop();
                Common.showTips(localizedStrings.netError)
            }
        });

        CommonUnit.startPropsLoop({
            props: DeviceModel.props,
            interval: readPropsInterval,
            callback: this.setProps.bind(this),
            log: true
        })

        // console.log('测试2222222--------------')
        // console.log(Device.deviceID)
        // Service.scene.loadTimerScenes(Device.deviceID, {
        //     identify: 'timer',
        //     name: 'myTimer'
        // })
        //     .then((sceneArr) => {
        //         console.log('测试--------------')
        //         console.log(sceneArr);

        //         if (sceneArr.length === 0) {
        //             const settinig = {
        //                 enable_timer_on: true, //是否开启定时打开。如果enable_timer设置为false，此属性不会起作用
        //                 on_time: "* * * * *", //crontab string, minute hour day month week。如：59 11 21 3 * 指3月21号11点59分定时开
        //                 off_time: "* * * * *", //crontab string，同上。
        //                 enable_timer_off: true,//是否开启定时关闭。如果enable_timer设置为false，此属性不会起作用
        //                 onMethod: 'set_power', //咨询硬件工程师,指硬件端，打开开关的方法。miot-spec下，一般为：set_properties
        //                 on_param: 'true', //咨询硬件工程师，指硬件端，打开开关应该传入的参数。miot-spec下，一般为：[{did,siid,piid,value}]
        //                 off_method: 'set_power', //咨询硬件工程师，指硬件端，关闭开关的方法。miot-spec下，一般为：set_properties
        //                 off_param: 'false', //咨询硬件工程师，关闭开关应该传入的参数。 miot-spec下，一般为：[{did,siid,piid,value}]
        //                 enable_timer: true, //是否开启此定时器，后续打开，关闭定时器，可以设置此属性
        //             }

        //             const scene = Service.scene.createTimerScene(Device.deviceID, {
        //                 identify: 'timer',//同上面的identify
        //                 name: 'myTimer',//同上面的名称
        //                 setting: settinig
        //             });

        //             scene
        //                 .save()
        //                 .then(scene => {
        //                     console.log('米家定时==')
        //                     console.log(scene)
        //                 })
        //                 .catch(err => {
        //                     console.log('米家定时失败==')
        //                     console.log(err)
        //                 })
        //         }
        //     })
        //     .catch(err => {
        //         console.log('获取米家定时失败==')
        //         console.log(err)
        //     });
    }

    componentWillUnmount() {
        CommonUnit.clearPropsLoop();
        CommonUnit.removeNetInfoListener();

        this.listener_1.remove();
        this.listener_2.remove();
        this.listener_3.remove();
        this.listener_4.remove();
    }

    /**
     * 已经点击了故障提示
     */
    checkedErrors() {
        this.state.examine.hasCheckedTips = true;
        this.setState({
            examine: this.state.examine
        })
    }

    // MARK: 属性设置
    /**
     * 触发开关机
     */
    triggerPower() {
        if (!this.isNeting) {
            Common.showTips(localizedStrings.netError);
            return;
        }

        this.setState({
            isPowering: true
        });

        InteractionManager.runAfterInteractions(() => {
            this.powerTimer = setTimeout(() => {
                const flag = Common.getOppositeStatus(this.state.power);

                this.getData("set_power", [flag], (isSuccess) => {
                    if (isSuccess) {
                        this.setState({
                            power: flag,
                            isPowering: false
                        });

                        if (flag === PropsConfig.close) {
                            this.props.navigation.setParams({ navColor: '#3D3D3D' })
                        }
                        else {
                            this.props.navigation.setParams({ navColor: NavColor[this.state.mode.key] })
                        }
                    }
                    else {
                        this.setState({
                            isPowering: false
                        });
                    }

                    this.powerTimer && clearTimeout(this.powerTimer)
                });
            }, 300)

        });
    }

    /**
     * 设置模式
     * @param {*} item
     */
    setMode(value) {
        if (!this.isNeting) {
            Common.showTips(localizedStrings.netError);
            return;
        }

        this.state.mode.setId(value);

        this.setState({
            mode: this.state.mode
        })

        this.props.navigation.setParams({ navColor: NavColor[this.state.mode.key] })

        InteractionManager.runAfterInteractions(() => {
            const { mode } = this.state;
            console.log(mode);
            this.getData(mode.getMethod(), mode.getParams(), (isSuccess) => {
                if (isSuccess) {
                    const str = localizedStrings.beEnabled + mode.title + localizedStrings.mode_str;
                    Common.showTips(str);
                }
            });
        })
    }

    /**
     * 触发功能设置
     * @param {*} item
     */
    triggerFunction(func) {
        if (!this.isNeting) {
            Common.showTips(localizedStrings.netError);
            return;
        }

        if (func.id === FunctionConfig.timer) {
            this.props.navigation.navigate("AppointmentPage", { timer: this.state.timer })
        }
        else if (func.id === FunctionConfig.strongsave) {
            this.props.navigation.navigate("StrongSavePage", { strongsave: this.state.strongsave })
        }
        else if (func.id === FunctionConfig.standAi) {
            this.props.navigation.navigate("AIPage", { standAi: this.state.standAi })
        }
        else {
            const data = {};
            const flag = Common.getOppositeStatus(func.status);
            func.status = flag;
            data[func.key] = func;
            this.setState(data);

            InteractionManager.runAfterInteractions(() => {
                console.log('功能===');

                this.getData(func.getMethod(), func.getParams(), (isSuccess) => {
                    if (isSuccess) {
                        let isOpenStr = (flag === PropsConfig.open ? localizedStrings.beEnabled : localizedStrings.beDisabled);
                        let str = isOpenStr + func.title;
                        //如果是灯光功能，需要特别字符
                        if (func.id === PropsConfig.function.light) {
                            str = isOpenStr + localizedStrings.light_str;
                        }
                        Common.showTips(str);
                    }
                });
            })
        }
    }


    // MARK: 网络访问
    /**
     * 基础访问
     * @param {*} method
     * @param {*} params
     * @param {*} errorFunc
     */
    getData(method, params, callback) {
        const consoleData = {
            method: method,
            params: params
        }

        console.log(consoleData);

        CommonUnit.stopPropsLoop();

        DataAdapter.callMethodWithNolater(method, params, (isSuccess, result) => {
            CommonUnit.resumePropsLoop();

            if (callback) {
                callback(isSuccess, result)
            }
            else {
                if (isSuccess) {
                    Common.showTips(localizedStrings.settingSuccess);
                }
            }
        });
    }


    /**
     * 设置设备属性
     * @param {*} result
     */
    setProps(result) {
        const { status, datas, isUpdated, error } = result;

        this.getTimer();

        if (status == 0) {
            const { power, isInit } = this.state;

            if (isUpdated) {
                let updateState = this.getPropsState(datas);

                /**
                 * 初始化
                 */
                if (isInit) {
                    updateState['isInit'] = false;
                }

                /**
                 * 电源开关发生改变时访问定时信息
                 */
                if (power !== updateState['power']) {
                    this.getTimer();
                }

                this.setState(updateState, () => {
                    this.prePropsDatas = datas;

                    let navColor = NavColor.close;
                    if (updateState.power === PropsConfig.open) {
                        navColor = NavColor[updateState.mode.key];
                    }

                    this.props.navigation.setParams({ navColor: navColor });
                });
            }
            else {
                console.log('不需要重新渲染');
            }
        }
        else {
            //失败
            console.log('获取失败')
            console.log(error)
        }
    }

    /**
     * 获取属性转化的state
     * @param {*} data
     */
    getPropsState(datas) {
        let updateState = {};
        let obj = {}
        for (let i = 0; i < datas.length; i++) {
            const key = DeviceModel.props[i];
            const value = datas[i];
            obj[key] = value;
            if (this.state[key] !== undefined) {
                //DataModel含有id属性，判断是否是DataModel类型
                if (this.state[key].hasOwnProperty('id')) {
                    this.state[key].setProps(value);
                    updateState[key] = this.state[key];
                }
                //不是model类型
                else {
                    updateState[key] = value;
                }
            }
            else if (key === 'swingh') {
                this.state['swingHor'].setProps(value);
                updateState['swingHor'] = this.state.swingHor;
            }
            else if (key === 'swing') {
                this.state['swingVer'].setProps(value);
                updateState['swingVer'] = this.state.swingVer;
            }
        }

        console.log('结果===');
        console.log(obj);

        return updateState;
    }

    /**
     * 从云端获取定时信息
     */
    getTimer(callback) {
        fetch(UrlConfig.getAppointment, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(respone => {
                return respone.json();
            })
            .then(res => {
                if (res.code === 100) {
                    console.log('获取定时')
                    console.log(res)

                    if (res.result) {
                        const { offExeTime, offSwitch, onExeTime, onSwitch } = res.result;
                        this.state.timer.setProps({ offExeTime, offSwitch, onExeTime, onSwitch });
                        this.setState({
                            timer: this.state.timer
                        })

                        InteractionManager.runAfterInteractions(() => {
                            callback && callback(this.state.timer);
                        })
                    }
                }
                else {
                    console.log('获取定时失败222')
                    console.log(res)
                }
            })
            .catch(err => {
                console.log('获取定时失败111')
                console.log(err)
            });
    }

    /**
     * 保存定时设置
     */
    saveTimer() {
        if (!this.isNeting) {
            Common.showTips(localizedStrings.netError);
            return;
        }

        let params = this.state.timer.getParams();

        console.log(UrlConfig.saveAppointment);
        console.log(params);

        fetch(UrlConfig.saveAppointment, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        })
            .then(respone => {
                return respone.json();
            })
            .then(res => {
                Common.showTips('设置成功');
            })
            .catch(err => {
                Common.showTips('设置失败');
                console.log('保存定时失败')
                console.log(err)
            });
    }

    /**
     * 关闭预约开机或预约关机
     * @param {int} closeType 1: 关闭预约开机 0：关闭预约关机
     */
    closeTimer(closeType) {
        if (!this.isNeting) {
            Common.showTips(localizedStrings.netError);
            return;
        }

        let params = {
            did: CommonAdapter.deviceId,
            optWhich: closeType
        };

        fetch(UrlConfig.closeAppointment, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        })
            .then(respone => {
                return respone.json();
            })
            .then(res => {
                console.log('已经关闭')
                console.log(res)
                if (closeType === 1) {
                    this.state.timer.dateOpen = PropsConfig.close;
                }
                else {
                    this.state.timer.dateClose = PropsConfig.close;
                }

                this.setState({
                    timer: this.state.timer
                })
            })
            .catch(err => {
                console.log('关闭定时失败')
                console.log(err)
            });
    }

    // MARK: 选择器Picker
    /**
     * 显示模式选择器
     */
    showModePicker() {
        CommonUnit.stopPropsLoop();
        this.modePicker.show();
    }

    /**
     * 显示摆风选择器
     */
    showSwingPicker() {
        CommonUnit.stopPropsLoop();
        this.swingPicker.show();
    }

    /**
     * 显示风速选择器
     */
    showWindLevelPicker() {
        CommonUnit.stopPropsLoop();
        this.windLevelPicker.show();
    }

    // /**
    //  * 显示故障服务电话
    //  */
    // showPhoneCallPicker() {
    //     this.phoneCallPicker.show();
    // }

    /**
     * 关闭选择器
     */
    closePicker() {
        CommonUnit.resumePropsLoop();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {VFactory.getMainPage()}
                <ModePicker ref={c => this.modePicker = c} hidden={this.closePicker.bind(this)} />
                <WindLevelPicker ref={c => this.windLevelPicker = c} hidden={this.closePicker.bind(this)} />
                <SwingPicker ref={c => this.swingPicker = c} hidden={this.closePicker.bind(this)} />
                {/* <PhoneCallPicker ref={c => this.phoneCallPicker = c} hidden={this.closePicker.bind(this)}/> */}
            </View>
        )
    }
}

const NavColor = {
    close: '#3D3D3D',
    cool: '#4458FF',
    hot: '#FF9A2B',
    dry: '#2FA8DE',
    wind: '#0FD888'
}
