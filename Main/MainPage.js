import React, {Component} from 'react';
import {DeviceEventEmitter, InteractionManager, StyleSheet, View} from 'react-native';
import CommonAdapter from '../plugin_common/Adapter/CommonAdapter';
import DataAdapter from '../plugin_common/Adapter/DataAdapter';
import ProjectAdapter from '../plugin_common/Adapter/ProjectAdapter';
import TitleBarWhite from '../plugin_common/Components/mi/ui/TitleBarWhite';

import PropsConfig from '@Main/Config/PropsConfig';
import UrlConfig from '@Main/Config/UrlConfig';
import {localizedStrings} from '@Main/Lang/LocalizableString';
// import NavigationBar from './View/NavigationBar';
import Common, { HPX, DeviceWidth, DeviceHeight, DeviceModel } from '@Main/Common';

import CommonUnit from '../kitchen_common/Unit/CommonUnit';
import InfoView from "./View/Home/Info/InfoView";
import ControllerView from "./View/Home/Controller/ControllerView";
import ControllerBarView from "./View/Home/Controller/ControllerBarView";

const FunctionConfig = PropsConfig.function;
const readPropsInterval = 4;

export default class MainPage extends Component {

    static navigationOptions = ({navigation}) => {
        let color = navigation.getParam('navColor', NavColor.close);
        return {
            header: (
                <TitleBarWhite
                    title={CommonAdapter.deviceName}
                    style={{backgroundColor: color}}
                    onPressLeft={() => {
                        CommonAdapter.exit()
                    }}
                    onPressRight={() => {
                        navigation.navigate('SettingPage', {
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
    }

    componentWillUnmount() {
        CommonUnit.clearPropsLoop();
        CommonUnit.removeNetInfoListener();

        this.listener_1.remove();
        this.listener_2.remove();
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

        this.props.navigation.setParams({navColor: NavColor[this.state.mode.key]})

        InteractionManager.runAfterInteractions(() => {
            const {mode} = this.state;
            console.log(mode);
            this.getData(mode.getMethod(), mode.getParams(), (isSuccess) => {
                if (isSuccess) {
                    // const str = localizedStrings.beEnabled + mode.title + localizedStrings.mode_str;
                    // Common.showTips(str);
                }
            });
        })
    }

    /**
     * 触发功能设置
     * @param {*} item
     */
    triggerFunction(func) {
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
        const {status, datas, isUpdated, error} = result;

        this.getTimer();

        if (status == 0) {
            const {power, isInit} = this.state;

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

                    this.props.navigation.setParams({navColor: navColor});
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

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                {MainPage.getInfoView()}
                {MainPage.getControllerView()}
            </View>
        )
    }

    static getInfoView() {
        return (
            <InfoView/>
        )
    }

    static getControllerView() {
        const {mode} = Common.mainPage.state;
        return (
            <ControllerView>
                <View style={[styles.bg, {paddingTop: HPX(63)}]}>
                    <ControllerBarView/>
                </View>
            </ControllerView>
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

const styles = StyleSheet.create({
    bg: {
        width: DeviceWidth,
        height: HPX(136),
        backgroundColor: 'white',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center'
    }
})
