import PropsConfig from '@Main/Config/PropsConfig';
import FunctionModel from "./Function";
import TimerModel from './Function/Timer';

import Mode from './Mode';

const FunctionConfig = PropsConfig.mode;

export default class DataModelFactory {
    static getMode(enumValue) {
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
}
