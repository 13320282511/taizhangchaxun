import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Table, Icon, Card, Form } from 'antd';
import TableFormaddLedger from '../Forms/TableFormaddLedger';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import FooterToolbar from 'components/FooterToolbar';
import styles from './style.less';
const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    number: '1',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    number: '77',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    number: '88',
    department: 'Sidney No. 1 Lake Park',
  },
];
class Step3 extends React.PureComponent {
  state = {
    width: '100%',
  };
  addContent = (val, text) => {
    console.log('vallll', val.target);
    console.log('text', text);
  };
  render() {
    console.log('this.propsss',this.props)
    const { form, dispatch, submitting } = this.props;
    console.log('this.props', this.props);
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const errors = getFieldsError();
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
          dispatch(routerRedux.push('/addLedger/step-form/result'));
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
        <Card title="成员管理" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TableFormaddLedger />)}
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
export default connect(({ addLedger,global, loading }) => ({
  addLedger:addLedger,
  collapsed: addLedger.collapsed,
  loading:loading,
  global:global,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Step3));
// export default connect(({form}) => ({
//   data: form.step,
// }))(Step3);
