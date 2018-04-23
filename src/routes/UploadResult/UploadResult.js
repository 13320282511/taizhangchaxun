import React, { PureComponent } from 'react';
import { Upload, Icon, message, Butto, Button, Divider, Modal } from 'antd';
// import fetch from 'dva/fetch';
import { connect } from 'dva';
import cookies from 'js-cookie';
// const Dragger = Upload.Dragger;
import { routerRedux } from 'dva/router';

class UploadResult extends PureComponent {
  constructor(props) {
    super(props);
    let { match } = this.props;
    let arraySplit = match.url.split('/');
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileListResult: [],
      fileUpUrl: [],
      id: parseInt(arraySplit[arraySplit.length - 2]),
      idWrap: parseInt(arraySplit[arraySplit.length - 3]),
      type: arraySplit[arraySplit.length - 1],
    };
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };
  handleChangeResult = ({ fileList }) => {
    console.log('fileList', fileList);
    this.setState({ fileListResult: fileList }, () => {});
  };

  render() {
    const { dispatch, ListOfBooks } = this.props;
    const onValidateForm = () => {
      let urlNumber = [];
      let urlNumberResult = [];
      for (let i = 0; i < this.state.fileList.length; i++) {
        urlNumber.push(this.state.fileList[i].response.url);
      }
      for (let i = 0; i < this.state.fileListResult.length; i++) {
        urlNumberResult.push({
          url: this.state.fileListResult[i].response.url,
          name: this.state.fileListResult[i].response.fname,
        });
      }
      let dataId = cookies.get('user_id');
      // let params = {feedbackFile:{fileId:2,url:urlNumberResult},feedbackUpload:{fileId:1,url:urlNumber},id:parseInt(dataId)};
      let params = {
        feedbackFile: { fileId: 2, url: urlNumberResult },
        feedbackUpload: { fileId: 1, url: urlNumber },
        id: this.state.id,
        type: this.state.type,
      };
      this.props
        .dispatch({
          type: 'ListOfBooks/uploadFile',
          payload: params,
        })
        .then(value => {
          if (value.code == 1) {
            message.success('上传成功');
            dispatch(routerRedux.push(`/operator/detailList/${this.state.idWrap}`));
          } else {
            message.error('上传失败');
          }
        })
        .catch(error => {
          console.log('error', error);
          message.error('上传失败');
        });
    };
    const { previewVisible, previewImage, fileList, fileListResult } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <div>
          <div>上传回执单</div>
          <Upload
            action="/api/service/upload/upload"
            listType="picture-card"
            // fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            withCredentials={true}
          >
            {fileList.length >= 20 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
        <Divider />
        <div>
          <div>上传反馈结果</div>
          <Upload
            action="/api/service/upload/upload"
            listType="picture-card"
            fileList={fileListResult}
            onPreview={this.handlePreview}
            onChange={this.handleChangeResult}
            withCredentials={true}
          >
            {fileListResult.length >= 20 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width="100%">
            <img alt="example" style={{ width: '95%' }} src={previewImage} />
          </Modal>
        </div>
        <div>
          <Button type="primary" onClick={onValidateForm}>
            保存
          </Button>
        </div>
      </div>
    );
  }
}
export default connect(({ ListOfBooks }) => ({
  ListOfBooks,
}))(UploadResult);
