import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  render() {
    const { dispatch } = this.props;
    const onFinish = () => {
      dispatch(routerRedux.push('/addLedger/step-form/info'));
    };
    const onReturnList=()=>{
      dispatch(routerRedux.push('/operator/listOfBooks'));
    }
    const information = <div className={styles.information} />;
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          再次添加
        </Button>
        <Button type="primary" onClick={onReturnList}>
          返回列表页
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="已成功录入一条台帐"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form }) => ({
  // data: form.step,
}))(Step3);
