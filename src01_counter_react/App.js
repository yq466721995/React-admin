import React, { Component } from 'react'

export default class App extends Component {

    state = {
        count: 0
    }

    constructor(props){
        super(props)

        this.numberRef = React.createRef()
    }

    increment = () => {
        const number = this.numberRef.current.value*1
        this.setState({count: this.state.count + number})
    }

    decrement = () => {
        const number = this.numberRef.current.value*1
        this.setState({count: this.state.count - number})
    }

    incrementOfOdd = () => {
        const number = this.numberRef.current.value*1
        if(this.state.count % 2 === 1){
            this.setState({count: this.state.count + number})
        }
    }

    incrementAsync = () => {
        const number = this.numberRef.current.value*1
        setTimeout(() => {
            this.setState({count: this.state.count + number})
        }, 1000);
    }

    render() {
        const {count} = this.state
        return (
            <div>
                <p>click {count} times</p>
                <div>
                    <select ref={this.numberRef}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                    </select>&nbsp;&nbsp;
                    <button onClick={this.increment}>+</button>&nbsp;&nbsp;
                    <button onClick={this.decrement}>-</button>&nbsp;&nbsp;
                    <button onClick={this.incrementOfOdd}>increment of odd</button>&nbsp;&nbsp;
                    <button onClick={this.incrementAsync}>increment async</button>
                </div>
            </div>
        )
    }
}
