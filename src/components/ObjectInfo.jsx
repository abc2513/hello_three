import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import HoursReport2 from '../components/HoursReport2';
import HoursReport from '../components/HoursReport';
export default class ObjectInfo extends Component {
  state={pickedObjectName:'',ObjectInfo:''}
  render() {
    return (
      <div className="object-info">
        {this.state.pickedObjectName==''?'未选中物体': this.state.pickedObjectName}
        
        <HoursReport2></HoursReport2>
        <HoursReport></HoursReport>
      </div>
    )
  }
  updateObjectInfo=(msg,data)=>{
    this.setState({pickedObjectName:data})
    console.log(msg,data);
  }
  getObjectArr=(msg,data)=>{
    this.setState({objArr:data})
  }
  componentDidMount(){
    PubSub.subscribe('pickedObjectName',this.updateObjectInfo);
    // PubSub.subscribe('objArr',this.getObjectArr);
  }
  componentWillUnmount(){
    PubSub.unsubscribe(this.updateObjectInfo);
    // PubSub.unsubscribe(this.getObjectArr);
  }
}
