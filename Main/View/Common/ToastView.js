import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    DeviceEventEmitter
} from 'react-native';
import { WPX, HPX } from '@Main/Common';
import BaseView from '../BaseView';
import * as Animatable from 'react-native-animatable';

export default class ToastView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            text: ''
        }

        this.isShowing = false;
    }

    componentDidMount() {
        this.listener_1 = DeviceEventEmitter.addListener('ShowToast', this.show.bind(this));
    }

    componentWillUnmount() {
        this.listener_1.remove()
    }

    show(msg) {
        if(this.isShowing){
            return;
        }

        this.isShowing = true;

        this.setState({
            visible: true,
            text: msg
        });

        this.timer = setTimeout(() => {
            this.hide()
        }, 2000)
    }

    hide() {
        this.animatableView
            .zoomOut (500)
            .then(endState => {
                this.setState({
                    visible: false
                })

                this.isShowing = false;
            });
    }

    render() {
        const { visible } = this.state;
        if (visible) {
            return (
                <Animatable.View
                    ref={c => this.animatableView = c}
                    animation={'zoomIn'}
                    delay={300}
                    duration={500}
                    style={styles.bg}
                >
                    <Text style={styles.text}>
                        {this.state.text}
                    </Text>
                </Animatable.View>
            )
        }
        else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    bg: {
        paddingLeft: HPX(24),
        paddingRight: HPX(24),
        height: HPX(44),
        backgroundColor: '#000000',
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7,
        borderRadius: 6
    },

    text: {
        color: 'white',
        fontSize: 14
    }
})