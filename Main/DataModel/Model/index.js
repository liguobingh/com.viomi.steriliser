import { localizedStrings } from '@Main/Lang/LocalizableString';
import ModelConfig from '@Main/Config/ModelConfig';
import BaseModel from '../../../kitchen_common/Base/BaseModel';
import PropsConfig from '@Main/Config/PropsConfig';
import DMFactory from '../DataModelFactory';

const FunctionConfig = PropsConfig.mode;
/**
 * 型号
 */
export default class Model extends BaseModel {
    //设备属性
    props = null;
    //插件state
    states = null;

    constructor(id) {
        super(id);

        const data = this._getDatas();

        this.props = data.props;
        this.states = data.states;
    }

    /**
     * 判断型号是否相同
     * @param {*} emunValue
     */
    is(emunValue) {
        return this.id === emunValue;
    }

    /**
     * 判断型号是否在列表中
     * @param {*} list
     */
    isContained(list) {
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (this.is(element)) {
                return true;
            }
        }

        return false;
    }

    // MARK: 设备支持
    /**
     * 是否墙挂式空调
     */
    isOnWall() {
        const list = [
            ModelConfig.v6,
            ModelConfig.v7,
            ModelConfig.v8
        ];
        return this.isContained(list)
    }

    /**
     * 是否支持设置页面额外的功能
     */
    supportedSettingPageConfig() {
        if (this.supportedAutoDry()) {
            return true;
        }
        return false;
    }

    /**
     * 是否支持自动烘干
     */
    supportedAutoDry() {
        const list = [
            ModelConfig.v1
        ];
        return this.isContained(list)
    }

    /**
     * 是否支持烘干
     */
    supportedDry() {
        const list = [
            ModelConfig.v1
        ];
        return this.isContained(list)
    }

    /**
     * 是否支持消毒
     */
    supportedSterilize() {
        const list = [
            ModelConfig.v1
        ];
        return this.isContained(list)
    }

    /**
     * 是否支持灯光功能（开机界面显示）
     */
    supportedAuto() {
        const list = [
            ModelConfig.v1
        ];
        return this.isContained(list)
    }

    /**
     * 是否支持固件升级
     */
    supportedOTA() {
        return true;
    }

    // MARK: 属性
    /**
     * 获取State属性和PropertyList属性
     */
    _getDatas() {
        //属性列表
        let _props = [
            //工作状态
            "workStatus",
            //当前温度
            "temp",
            //剩余时间
            "leftTime",
            //模式
            "mode",
            //自动烘干
            "auto_dry",
        ];

        //state对象
        let _states = {
            //工作状态
            workStatus: PropsConfig.workStatus.close,
            //当前温度
            temp: PropsConfig.temp.min,
            //剩余时间
            leftTime: PropsConfig.leftTime.min,
            //模式
            mode: PropsConfig.mode.standby,
            //自动烘干
            auto_dry:PropsConfig.auto_dry.close_auto
        }

        //睡眠功能
        if (this.supportedSleep()) {
            _props.push("sleep");
            _states.sleep = DMFactory.getFunction(FunctionConfig.sleep);
        }

        //柔风功能
        if (this.supportedSoftwind()) {
            _props.push("softwind");
            _states.softwind = DMFactory.getFunction(FunctionConfig.softwind)
        }

        //语音控制
        if(this.supportedAudio()){
            _props.push("audio");
            _states.audio = DMFactory.getFunction(FunctionConfig.audio)
        }

        //定额省电功能
        if (this.supportedStrongsave()) {
            _props.push("strongsave");
            _states.strongsave = DMFactory.getFunction(FunctionConfig.strongsave)
        }

        //节能
        if (this.supportedEnergysave()) {
            _props.push("energysave");
            _states.energysave = DMFactory.getFunction(FunctionConfig.energysave)
        }

        //AI智能风
        if (this.supportedAI()) {
            _props.push("ai");
            _states.ai = DMFactory.getFunction(FunctionConfig.ai)
        }

        //立式空调AI功能
        if (this.supportedStandAI()) {
            _props.push("ai_autostop");
            _props.push("ai_sport");
            _props.push("ai_followman");
            _props.push("ai_avoidman");
            _states.standAi = DMFactory.getFunction(FunctionConfig.standAi)
        }

        //水平扫风
        if (this.supportedSwingHor()) {
            _props.push("swingh");
            _states.swingHor = DMFactory.getSwing(SwingConfig.swing.horizontal)
        }

        //垂直扫风
        if (this.supportedSwingVer()) {
            _props.push("swing");
            _states.swingVer = DMFactory.getSwing(SwingConfig.swing.vertical)
        }

        return {
            props: _props,
            states: _states
        }
    }
}
