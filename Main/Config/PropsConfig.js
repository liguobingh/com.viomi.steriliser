export default {
    workStatus: {
        close: 0,
        standby: 1,
        dry: 2,
        sterilize: 3,
        auto: 4,
        close_to_dry: 5
    },
    temp: {
        // 0℃以下都默认为0℃，160℃以上都默认为160℃
        // default: 25,
        min: 0,
        max: 160
    },
    leftTime: {
        min: 0,
        max: 120
    },
    mode: {
        standby: 0,
        dry: 1,
        sterilize: 2,
        auto: 3
    },
    auto_dry: {
        close_auto: 0,
        min: 30,
        max: 120,
        interval: 10
    }
}
