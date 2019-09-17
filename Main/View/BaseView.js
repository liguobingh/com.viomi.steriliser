import React, { Component } from 'react';
import Common from '@Main/Common';

export default class BaseView extends Component {
    constructor(props){
        super(props);
        this.controller = Common.mainPage;
    }
}