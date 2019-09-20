import { localizedStrings } from '@Main/Lang/LocalizableString';
import ModelConfig from '@Main/Config/ModelConfig';
import BaseModel from '../../../kitchen_common/Base/BaseModel';
import PropsConfig from '@Main/Config/PropsConfig';
import Mode from "../Mode";
import FunctionModel from "../Function";

const FunctionConfig = PropsConfig.mode;
const AutoDryConfig = PropsConfig.auto_dry;
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
     * 是否支持模式切换
     */
    supportedModeChange() {
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

    getMode(enumValue) {
        return new Mode(enumValue);
    }

    static getFunction(enumValue) {
        if (enumValue === FunctionConfig.timer) {
            return new TimerModel(enumValue);
        }
        else {
            return new FunctionModel(enumValue);
        }
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
            mode: getFunction(FunctionConfig.mode),
            //自动烘干
            auto_dry:getFunction(AutoDryConfig.auto_dry),
        }

        return {
            props: _props,
            states: _states
        }
    }
}
