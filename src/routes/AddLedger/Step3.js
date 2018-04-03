import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  render() {
    const { dispatch, data } = this.props;
    const onFinish = () => {
      dispatch(routerRedux.push('/form/step-form'));
    };
    const information = <div className={styles.information} />;
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          再转一笔
        </Button>
        <Button>查看账单</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="预计两小时内到账"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step3);
