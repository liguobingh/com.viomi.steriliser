import { localizedStrings } from '@Main/Lang/LocalizableString';
import PropsConfig from '@Main/Config/PropsConfig';
import BaseModel from '../../../kitchen_common/Base/BaseModel';
const ModeLang = localizedStrings.mode;
const ModeConfig = PropsConfig.mode;
/**
 * 功能
 */
export default class Mode extends BaseModel{
    //当前状态
    status = PropsConfig.close;

    constructor(id) {
        super(id);

        this._setBase(id);
    }

    _setBase(id){
        this.id = id;

        for (const key in ModeConfig) {
            if (ModeConfig[key] === this.id) {
                this.key = key;
                this.title = ModeLang[key];
                break;
            }
        }
    }

    /**
     * 设置id
     * @param {*} id
     */
    setId(id){
        this._setBase(id);
    }

    /**
     * 设置属性
     * @param {*} data
     */
    setProps(value) {
        const id = this.getConfigValue(ModeConfig, value);
        this._setBase(id);
    }

    /**
     * 获取请求方法名字
     */
    getMethod() {
        return "set_mode";
    }

    /**
     * 获取参数
     */
    getParams() {
        return [this.id];
    }

    /**
     * 是否支持温度控制
     */
    supportedTemp(){
        return true;
    }
}
