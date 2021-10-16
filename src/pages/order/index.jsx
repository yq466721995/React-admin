import React, {Component} from 'react';
import {  Switch, Route, Redirect } from 'react-router-dom'

import OrderHome from './home'
import OrderDetail from './detail'
import OrderAddUpdate from "./add-update";

class Order extends Component {
    render() {
        return (
            <Switch>
                <Route path='/order' component={OrderHome} exact/>
                <Route path='/order/detail' component={OrderDetail}/>
                <Route path='/order/addUpdate' component={OrderAddUpdate}/>
                <Redirect to='/order'/>
            </Switch>
        );
    }
}

export default Order;