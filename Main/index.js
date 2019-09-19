import React, { Component } from 'react';
import {
    View,
    Platform,
    BackHandler
} from 'react-native';

// 导航相关组件
import { createStackNavigator } from 'react-navigation';
import TitleBarBlack from '../plugin_common/Components/mi/ui/TitleBarBlack';
import ProjectAdapter from '../plugin_common/Adapter/ProjectAdapter';
// 导入项目页面
import MainPage from './MainPage';
// 导入公共页面
import SettingPage from '../plugin_common/CommonPages/SettingPage';
import { MiSettingPage } from '../plugin_common/CommonPages/MiSetting';
import HelpPage from "../plugin_common/CommonPages/HelpPage";
import RenamePage from "../plugin_common/CommonPages/RenamePage";
import WifiCheckUpdate from "../plugin_common/CommonPages/CheckUpdate";
import ErrorPage from "../plugin_common/CommonPages/ErrorPage";
import ErrorDetailPage from "../plugin_common/CommonPages/ErrorDetailPage";
import BaseApp from '../plugin_common/Adapter/BaseApp';
import CommonAdapter from '../plugin_common/Adapter/CommonAdapter';
import Toast from '../plugin_common/Components/Toast';
import LoadingEffect from '../plugin_common/Components/LoadingEffect';
import MessageDialog from '../plugin_common/Components/MessageDialog';
import ToastView from './View/Common/ToastView';

let MiSetting = require('../plugin_common/CommonPages/MiSetting');
let MoreSetting = MiSetting.MoreSetting;

if (!ProjectAdapter.isYunmi) {
    let CommonSetting = require('miot/ui/CommonSetting');
    MoreSetting = CommonSetting.MoreSetting;
}

const RootStack = createStackNavigator(
    {
        MainPage: MainPage,

        SettingPage: ProjectAdapter.isYunmi ? SettingPage : MiSettingPage,
        MoreSetting: MoreSetting,
        HelpPage: HelpPage,
        RenamePage: RenamePage,
        WifiCheckUpdate: WifiCheckUpdate,
        ErrorPage: ErrorPage,
        ErrorDetailPage: ErrorDetailPage,
    },
    {
        initialRouteName: 'MainPage',
        navigationOptions: ({ navigation }) => {
            return {
                header: (
                    <TitleBarBlack
                        title={navigation.state.params ? navigation.state.params.title : ''}
                        style={{ backgroundColor: '#3D3D3D' }}
                        onPressLeft={() => {
                            navigation.goBack();
                        }}
                    />
                ),
            };
        },
    }
);

export default class App extends BaseApp {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent:'center' }}>
                <RootStack />
                <Toast ref={'toast'} />
                <LoadingEffect ref={'loadingEffect'} />
                <MessageDialog ref={'messageDialog'} />
                <ToastView />
            </View>
        )
    }
    componentDidMount() {

        CommonAdapter.toast = this.refs.toast;
        CommonAdapter.loadingEffect = this.refs.loadingEffect;
        CommonAdapter.messageDialog = this.refs.messageDialog;

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        }
    }

    onBackButtonPressAndroid = () => {
        if (CommonAdapter.isShowMessageDialog()) {
            CommonAdapter.hideMessageDialog();
            return true;
        } else if (CommonAdapter.isShowLoading()) {
            CommonAdapter.hideLoading();
            return false;
        } else {
            return false;
        }

    }

    componentWillUnmount() {
        //必须要执行这一句，要不然BaseApp里无法移除监听
        super.componentWillUnmount();

        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        }
    }
}
