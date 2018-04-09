import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, Upload, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../utils/utils';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
      {
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/addLedger/step-form/info'));
    };
    const onValidateForm = () => {
      dispatch(routerRedux.push('/addLedger/step-form/content'));
    };
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <div className="clearfix">
          <Upload
            action="/api/service/upload/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            withCredentials={true}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
        <Form.Item>
          {/*<Button type="primary" onClick={onValidateForm} loading={submitting}>*/}
          {/*提交*/}
          {/*</Button>*/}
          {/*<Button onClick={onPrev} style={{ marginLeft: 8 }}>*/}
          {/*上一步*/}
          {/*</Button>*/}
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  // data: form.step,
}))(Step2);
