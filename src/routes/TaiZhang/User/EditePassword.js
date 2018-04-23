import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {routerRedux} from 'dva/router';
import {Form, Icon, Input, Button, Checkbox,message} from 'antd';
// import Login from 'components/Login';
// import styles from './Login.less';
import cookies from 'js-cookie';
import styles from './user.less';


const FormItem = Form.Item;

@connect(({login, loading}) => ({
  login,
  // submitting: loading.effects['login/login'],
}))
class NormalLoginForm extends React.Component {
  constructor(props){
    super(props);
    if(!cookies.get('user_id')){
      this.props.dispatch(routerRedux.push('/user/login'));
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values.new_passwd !== values.new_reset_passwd){
          message.error("两次输入密码不一致");
          return false;
        }else{
          values.id = parseInt(values.id);
          this.props.dispatch({
            type:'login/edite',
            payload:values,
          }).then((res)=>{
            if(res.code == -1){
              message.error('密码修改失败')
            }
          })
        }
      }
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={styles["user-edite"]}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="id"
            labelCol={{span: 5}}
            wrapperCol={{span: 12}}
            style={{display:'none'}}
          >
            {getFieldDecorator('id', {
              initialValue:cookies.get('user_id'),
              rules: [{required: false, message: 'Please input your note!'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label="请输入原密码"
            labelCol={{span: 7}}
            wrapperCol={{span: 14}}
          >
            {getFieldDecorator('old_passwd', {
              rules: [{required: true, message: 'Please input your note!'}],
            })(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem
            label="请输入新密码"
            labelCol={{span: 7}}
            wrapperCol={{span:14}}
          >
            {getFieldDecorator('new_passwd', {
              rules: [{required: true, message: '请输入新密码!'}],
            })(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem
            label="请再次输入新密码"
            labelCol={{span: 7}}
            wrapperCol={{span:14}}
          >
            {getFieldDecorator('new_reset_passwd', {
              rules: [{required: true, message: '请再次输入新密码!'}],
            })(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 7 }}
          >
            <Button type="primary" htmlType="submit">
              确认修改密码
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const EditePassword = Form.create()(NormalLoginForm);
export default EditePassword
