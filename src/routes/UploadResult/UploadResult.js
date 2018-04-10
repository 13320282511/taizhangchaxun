import React, { PureComponent } from 'react';
import { Upload, Icon, message, Butto, Button, Divider } from 'antd';
// import fetch from 'dva/fetch';
import { connect } from 'dva';
import request from '../../utils/request';

const Dragger = Upload.Dragger;

export default class UploadResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
    };
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    let that = this;
    request('//jsonplaceholder.typicode.com/posts/', { method: 'post', body: formData })
      .then(value => {
        that.setState({
          fileList: [],
          uploading: false,
        });
        message.success('upload successfully.');
      })
      .catch(error => {
        that.setState({
          uploading: false,
        });
        message.error('upload failed.');
      });
    // reqwest({
    //   url: '//jsonplaceholder.typicode.com/posts/',
    //   method: 'post',
    //   processData: false,
    //   data: formData,
    //   success: () => {
    //     this.setState({
    //       fileList: [],
    //       uploading: false,
    //     });
    //     message.success('upload successfully.');
    //   },
    //   error: () => {
    //     this.setState({
    //       uploading: false,
    //     });
    //     message.error('upload failed.');
    //   },
    // });
  };

  render() {
    const { uploading } = this.state;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };
    return (
      <div>
        <div>
          <Upload {...props}>
            <label>上传回执单</label>
            <Button>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
          <Button
            className="upload-demo-start"
            type="primary"
            onClick={this.handleUpload}
            disabled={this.state.fileList.length === 0}
            loading={uploading}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </div>
        <Divider />
        <div>
          <Upload {...props}>
            <label>上传回执单</label>
            <Button>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
          <Button
            className="upload-demo-start"
            type="primary"
            onClick={this.handleUpload}
            disabled={this.state.fileList.length === 0}
            loading={uploading}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </div>
      </div>
    );
  }
}
