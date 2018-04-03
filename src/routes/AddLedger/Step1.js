import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  constructor(props){
    super(props);
    this.props.dispatch({
      type: 'addLedger/querySelectUnit',
      payload: '',
    });
  }
  selectValue = (val,option) => {
    let params = {org_id:val,org_short:option.props.children};
    this.props.dispatch({
      type: 'addLedger/querySelectName',
      payload: params,
    });
  }
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          // dispatch({
          //   type: 'addLedger/submitRegularForm',
          //   payload: values,
          // });
          dispatch(routerRedux.push('/addLedger/step-form/confirm'));
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="查询类型:" help="客户、邀评人默认被分享">
            <div>
              {getFieldDecorator('doc_type', {
                initialValue: '1',
              })(
                <Radio.Group>
                  <Radio value="1">一般</Radio>
                  <Radio value="2">特殊</Radio>
                </Radio.Group>
              )}
            </div>
          </Form.Item>
          <Form.Item {...formItemLayout} label="文号">
            <Input.Group compact>
              <Select defaultValue="请选择" style={{ width: 100 }} onSelect={this.selectValue}>
                {this.props.select.map((item,index) => {
                  return <Option value={item.id} key={index}>{item.proposer_name}</Option>
                })}
              </Select>
              {getFieldDecorator('doc_name', {
                initialValue: data.doc_name,
              })(<Input style={{ width: 'calc(100% - 100px)' }} disabled={true} />)}
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="申请人1">
            {getFieldDecorator('proposer_2nd', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入输入申请人' }],
            })(<Input placeholder="请输入输入申请人" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系电话">
            {getFieldDecorator('proposer_2nd_phone', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入联系电话' }],
            })(<Input placeholder="请输入输入联系电话" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="申请人2">
            {getFieldDecorator('proposer_1st', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入输入申请人' }],
            })(<Input placeholder="请输入输入申请人" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系电话">
            {getFieldDecorator('proposer_1st_phone', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入联系电话' }],
            })(<Input placeholder="请输入输入联系电话" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="申请单位">
            {getFieldDecorator('proposer', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入输入申请人' }],
            })(<Input placeholder="请输入输入申请人" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="申请单位类型">
            {getFieldDecorator('proposer_org_type', {
              initialValue: data.payAccount,
              rules: [{ required: true, message: '请选择申请单位类型' }],
            })(
              <Select placeholder="test@example.com">
                <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="承办单位">
            {getFieldDecorator('undertaker_id', {
              initialValue: data.payAccount,
              rules: [{ required: true, message: '请选择申请单位类型' }],
            })(
              <Select placeholder="test@example.com">
                <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="最高级别审批人">
            {getFieldDecorator('approver', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入输入申请人' }],
            })(<Input placeholder="请输入输入申请人" />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>

        </div>
      </Fragment>
    );
  }
}

export default connect(({ addLedger }) => ({
  data: addLedger.step,
  select:addLedger.select,

}))(Step1);
