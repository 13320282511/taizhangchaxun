import React, {Fragment} from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Select, Divider, Radio} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './style.less';

const {Option, OptGroup} = Select;

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
  constructor(props) {
    super(props);
    this.state = {
      fankuiUnit: {},
      disabled: true,
      arrayKes: [],
    };
    this.props.dispatch({
      type: 'addLedger/querySelectUnit',
      payload: '',
    });
    this.props.dispatch({
      type: 'addLedger/selectShortName',
      payload: '',
    });
    this.props.dispatch({
      type: 'addLedger/queryProposer',
      payload: '',
    });
  }

  handleChangeJilian = (val) => {
    // console.log('val', val)
  }
  handleChangeChengban = (val) => {
    let params = {id: val};
    let that = this;
    this.props.dispatch({
      type: 'addLedger/getAccountNameTo',
      payload: params,
    }).then((res) => {
      that.setState({
        fankuiUnit: {...res.data}
      }, function () {
        that.setState({
          arrayKes: [...Object.keys(that.state.fankuiUnit)],
          disabled: false
        })
      })

    }).catch((error) => {
      console.log('error', error);
    });
  }
  selectJilian = (val, key) => {
    // console.log('key',key);
    // console.log('valuee',val)
  }
  selectValue = (val, option) => {
    let params = {org_id: val, org_short: option.props.children};
    this.props.dispatch({
      type: 'addLedger/querySelectName',
      payload: params,
    });
  };

  render() {
    const {form, dispatch, data} = this.props;
    const {getFieldDecorator, validateFields} = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'addLedger/submitRegularForm',
            payload: values,
          });
          // dispatch(routerRedux.push('/addLedger/step-form/confirm'));
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="查询类型:" help="">
            <div>
              {getFieldDecorator('doc_type', {
                initialValue: '一般',
              })(
                <Radio.Group>
                  <Radio value="一般">一般</Radio>
                  <Radio value="特殊">特殊</Radio>
                </Radio.Group>
              )}
            </div>
          </Form.Item>
          <Form.Item {...formItemLayout} label="文号">
            <Input.Group compact>
              {getFieldDecorator('org_id', {
                // initialValue: data.payAccount,
                rules: [{required: true, message: '请选择申请单位类型'}],
              })(
                <Select placeholder="请选择" style={{width: 100}} onSelect={this.selectValue}>
                  {this.props.select.map((item, index) => {
                    return (
                      <Option value={item.id} key={index}>
                        {item.unit_org}
                      </Option>
                    );
                  })}
                </Select>
              )}
              {getFieldDecorator('doc_name', {
                initialValue: data.doc_name,
              })(<Input style={{width: 'calc(100% - 100px)'}} disabled={true}/>)}
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="申请人1">
            {getFieldDecorator('proposer_1st', {
              // initialValue: data.receiverName,
              rules: [{required: true, message: '请输入申请人'}],
            })(<Input placeholder="请输入申请人"/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系电话">
            {getFieldDecorator('proposer_1st_phone', {
              // initialValue: data.receiverName,
              rules: [{required: true, message: '请输入联系电话'}, {
                pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
                message: '电话格式错误'
              }],
              // trigger:'onBlur',
              validateTrigger: 'onBlur',
            })(<Input placeholder="请输入联系电话"/>)}
            {/*pattern:new RegExp(/^((/(/d{3}/))|(/d{3}/-))?13[0-9]/d{8}|15[89]/d{8}/)*/}
          </Form.Item>
          <Form.Item {...formItemLayout} label="申请人2">
            {getFieldDecorator('proposer_2nd', {
              // initialValue: data.receiverName,
              rules: [{required: true, message: '请输入申请人'}],
            })(<Input placeholder="请输入申请人"/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系电话">
            {getFieldDecorator('proposer_2nd_phone', {
              // initialValue: data.receiverName,
              rules: [{required: true, message: '请输入联系电话'}, {
                pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
                message: '电话格式错误'
              }],
              // trigger:'onBlur',
              validateTrigger: 'onBlur',
            })(<Input placeholder="请输入联系电话"/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="申请单位类型">
            {getFieldDecorator('proposer_org_type', {
              // initialValue: data.payAccount,
              rules: [{required: true, message: '请选择申请单位类型'}],
            })(
              <Select placeholder="请选择">
                {this.props.selectProposer.length > 0 &&
                this.props.selectProposer.map((item, index) => {
                  return (
                    <Option value={item.id} key={index}>
                      {item.proposer_name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="承办单位">
            {getFieldDecorator('undertaker_id', {
              // initialValue: data.payAccount,
              rules: [{required: true, message: '请选择承办单位'}],
            })(
              <Select
                onChange={this.handleChangeChengban}
                placeholder="请选择">
                {this.props.selectShortName.map((item, index) => {
                  return (
                    <Option value={item.id} key={index}>
                      {item.org_short}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="反馈单位/账号">
            {getFieldDecorator('proposer', {
              // initialValue: data.payAccount,
              rules: [{required: true, message: '请选择反馈单位/账号'}],
            })(
              <Select
                defaultValue="lucy"
                style={{}}
                onChange={this.handleChangeJilian}
                onSelect={this.selectJilian}
                placeholder="请选择反馈单位类型"
                disabled={this.state.disabled ? true : false}
              >
                {this.state.arrayKes.map((item, index) => {
                  if (item == 'direct') {
                    return (<OptGroup label="direct">
                      {this.state.fankuiUnit.direct.map((item, index) => {
                        return (<Option value={item.id} key={index}>{item.user_name}</Option>)
                      })}
                    </OptGroup>)
                  } else {
                    return (<OptGroup label="other">
                      {this.state.fankuiUnit.other.map((item, index) => {
                        return (<Option value={item.id} key={index}>{item.user_name}</Option>)
                      })}
                    </OptGroup>)
                  }
                })}
              </Select>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="最高级别审批人">
            {getFieldDecorator('approver', {
              // initialValue: data.receiverName,
              rules: [{required: true, message: '请输入输入申请人'}],
            })(<Input placeholder="请输入输入申请人"/>)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: {span: 24, offset: 0},
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
        <Divider style={{margin: '40px 0 24px'}}/>
        <div className={styles.desc}/>
      </Fragment>
    );
  }
}

export default connect(({addLedger}) => ({
  data: addLedger.step,
  select: addLedger.select,
  selectShortName: addLedger.selectShortName,
  selectProposer: addLedger.selectProposer,
}))(Step1);
