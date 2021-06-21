import React, { Component } from 'react'
import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";

const scheduler = window.scheduler;

export class DHTMLXScheduler extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { data } = this.props
    scheduler.config.header = [
  "day",
  "week",
  "month",
  "date",
  "prev",
  "today",
  "next"
    ]
    scheduler.skin = "material";
    scheduler.init(this.schedulerContainer, new Date(), "month");
    scheduler.clearAll();
    scheduler.parse(data);
  }

  shouldComponentUpdate() {
    const { forceUpdate } = this.props
    if (forceUpdate) {
      return true
    } else {
      return false
    }
  }

render() {
    return (
      <div
        ref={(input) => {
          this.schedulerContainer = input;
        }}
        style={styles.main}
      ></div>
    );
  }
}
const styles = {
  main: {
    width: "100%",
    height: "100vh",
  },
};

export default DHTMLXScheduler
