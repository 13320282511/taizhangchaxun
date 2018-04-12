import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Table, Icon, Card, Form } from 'antd';
import TableFormaddLedger from '../Forms/TableFormaddLedger';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import FooterToolbar from 'components/FooterToolbar';
import styles from './style.less';
const tableData = [];
const leaderColor = {
  departmentLevel:'blue',
  hallLevel:'orange',
  ministryLevel:'red'
};

class Step3 extends React.PureComponent {
  state = {
    width: '100%',
  };
  addContent = (val, text) => {};
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const errors = getFieldsError();
    let dataId = localStorage.getItem('dataId');
    let params = { id: parseInt(dataId) };
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'addLedger/postMakeEffect',
            payload: params,
          });
          // dispatch(routerRedux.push('/addLedger/step-form/result'));
        }
      });
    };
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <div>
        <div className={styles["class-leaver-wrap"]}>
          <div className={styles["class-leaver"]}><h1 style={{backgroundColor:leaderColor['departmentLevel']}}></h1><span style={{color:leaderColor['departmentLevel']}}>处级</span></div>
          <div className={styles["class-leaver"]}><h1 style={{backgroundColor:leaderColor['hallLevel']}}></h1><span style={{color:leaderColor['hallLevel']}}>厅级</span></div>
          <div className={styles["class-leaver"]}><h1 style={{backgroundColor:leaderColor['ministryLevel']}}></h1><span style={{color:leaderColor['ministryLevel']}}>部级及以上</span></div>
        </div>
        <Card title="成员管理" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TableFormaddLedger leaderColor={leaderColor}/>)}
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </div>
    );
  }
}
export default connect(({ addLedger, global, loading }) => ({
  addLedger: addLedger,
  collapsed: addLedger.collapsed,
  loading: loading,
  global: global,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Step3));
// export default connect(({form}) => ({
//   data: form.step,
// }))(Step3);
