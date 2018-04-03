import React, {Fragment} from 'react';
import {connect} from 'dva';
import {Button, Row, Col, Table,Icon,Card} from 'antd';
import TableForm from '../Forms/TableForm'
import {routerRedux} from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  constructor(props){
    super(props);

  }
  addContent=(val,text) => {
    console.log('vallll',val.target)
    console.log('text',text)
  }
  render() {
    return (
      <div>台账</div>
    )
  }
}

export default connect(({form}) => ({
  data: form.step,
}))(Step3);
