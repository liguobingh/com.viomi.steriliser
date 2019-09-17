import React, { Component } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Text,
    InteractionManager
} from 'react-native'
import BaseView from '../BaseView';
import { DeviceWidth, DeviceHeight } from '@Main/Common';
import * as Animatable from 'react-native-animatable';
import { localizedStrings } from '@Main/Lang/LocalizableString';

export default class BasePicker extends BaseView {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        }

        this.showing = false;
        this.hidding = false;
    }

    outAnimation() {
        this.contentView.fadeOutDown(200)
    }

    /**
     * 显示选择器
     * @param {*} state 显示时需要设置的state属性，优化性能
     */
    show(state = {}) {
        if (this.showing) {
            return;
        }

        this.showing = true;

        this.setState({
            visible: true,
            ...state
        })

        InteractionManager.runAfterInteractions(() => {
            this.showing = false;
        })
    }

    hide(state = {}) {
        if (this.hidding) {
            return;
        }
        this.hidding = true;

        this.outAnimation();

        InteractionManager.runAfterInteractions(() => {
            this.setState({
                visible: false,
                ...state
            });
            this.props.hidden && this.props.hidden();

            this.hidding = false;
        })
    }

    renderContent() {
        return <Text>{localizedStrings.basepicker_tip}</Text>
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType="none"
                visible={this.state.visible}
                onRequestClose={() => { }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.hide()
                    }}
                    style={styles.mask}
                />
                <Animatable.View
                    ref={c => this.contentView = c}
                    style={styles.bar}
                    animation={'slideInUp'}
                    duration={300}
                >
                    {
                        this.renderContent()
                    }
                </Animatable.View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    mask: {
        position: 'absolute',
        width: DeviceWidth,
        height: DeviceHeight,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },

    bg: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    bar: {
        position: 'absolute',
        width: DeviceWidth,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        bottom: 0,
        alignSelf: 'center'
    }
});