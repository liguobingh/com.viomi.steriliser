import { localizedStrings } from '@Main/Lang/LocalizableString';
import PropsConfig from '@Main/Config/PropsConfig';
import BaseModel from '../../../kitchen_common/Base/BaseModel';

const FunctionLang = localizedStrings.function;
const FunctionConfig = PropsConfig.function;
const ModeConfig = PropsConfig.mode;

/**
 * 功能
 */
export default class Function extends BaseModel{
    //当前状态
    status = PropsConfig.close;

    constructor(id) {
        super(id);

        for (const key in FunctionConfig) {
            if (FunctionConfig[key] === this.id) {
                this.key = key;
                this.title = FunctionLang[key];
                console.log("function-index===" + this.title)
                break;
            }
        }
    }

    /**
     * 设置属性
     * @param {*} value
     */
    setProps(value) {
        const flag = (value === PropsConfig.open || value === "1");
        this.status = (flag ? PropsConfig.open: PropsConfig.close);
    }

    /**
     * 获取请求方法名字
     */
    getMethod() {
        switch (this.id) {
            default:{
                return "set_" + this.key;
            }
        }
    }

    /**
     * 获取参数
     */
    getParams() {
        return [this.status];
    }

    /**
     * 判断是否支持
     * @param {*} _mode
     */
    supported(_mode) {
        switch (this.id) {
            case FunctionConfig.softwind: {
                return _mode.id === ModeConfig.cool;
            }
            case FunctionConfig.sleep: {
                return _mode.id === ModeConfig.cool || _mode.id === ModeConfig.hot;
            }
            case FunctionConfig.strongsave: {
                return _mode.id === ModeConfig.cool;
            }
            case FunctionConfig.energysave: {
                return _mode.id === ModeConfig.cool || _mode.id === ModeConfig.hot;
            }
            case FunctionConfig.ai: {
                return _mode.id === ModeConfig.cool || _mode.id === ModeConfig.hot;
            }
            default:{
                return true
            }
        }
    }
}
