import React, {PureComponent, Fragment} from 'react';
import {Table, Button, Input, message, Popconfirm, Divider, InputNumber, Select} from 'antd';
import styles from './style.less';
import {connect} from 'dva';
import {Form} from "antd/lib/index";

class TableFormaddLedger extends PureComponent {
  constructor(props) {
    super(props);
    console.log('props', props)
    // this.state = {
    //   data: props.value,
    //   loading: false,
    // };
    this.state = {
      data: [],
      loading: false,
    };
    let codeAdmin = localStorage.getItem('antd-pro-authority');
    let quanx = {code: codeAdmin};
    this.props.dispatch({
      type: 'addLedger/getApplyTypePost',
      payload: quanx
    });
  }

  componentWillReceiveProps(nextProps) {
    // if ('value' in nextProps) {
    //   this.setState({
    //     data: nextProps.value,
    //   });
    // }
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = {...target};
      }
      target.editable = !target.editable;
      this.setState({data: newData});
    }
  };

  remove(key) {
    this.setState({
      loading: true,
    });
    const target = this.getRowByKey(key) || {};
    let standing_id = parseInt(localStorage.getItem('dataId'));
    let params = {
      condition: target.condition,
      id: target.id,
      content: target.content,
      num: target.num,
      operation: 'delete',
      standing_id:standing_id
    };
    let that = this;
    let dispatch = this.props.dispatch;
    let promiseAdd = new Promise(function (resolve, reject) {
      resolve(dispatch({
        type: 'addLedger/saveOperationApply',
        payload: params
      }))
    })
    promiseAdd.then((value)=>{
      console.log('value',value)
      //delete target.isNew;
      //that.toggleEditable(e, key);
      // that.props.onChange(that.state.data);
      const newData = this.state.data.filter(item => item.key !== key);
      this.setState({data: newData});
      that.setState({
        loading: false,
      });

    }).catch()
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
    //this.props.onChange(newData);
  }

  newMember = () => {
    const newData = this.state.data.map(item => ({...item}));
    console.log('newData', newData)
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      id: '',
      num: '',
      content: '',
      condition: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({data: newData});
  };

  handleKeyPress(e, key) {
    console.log('e', e);
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (typeof e == 'number' || typeof e == 'string') {
        target[fieldName] = e;
      } else {
        target[fieldName] = e.target.value;
      }
      this.setState({data: newData});
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(key) || {};
    if (!target.content || !target.condition || !target.id) {
      message.error('请填写完整成员信息。');
      e.target.focus();
      this.setState({
        loading: false,
      });
      return;
    }
    let standing_id = parseInt(localStorage.getItem('dataId'));
    let params = {
      condition: target.condition,
      id: target.id,
      content: target.content,
      num: target.num,
      operation: 'edit',
      standing_id:standing_id
    };
    let that = this;
    let dispatch = this.props.dispatch;
    let promiseAdd = new Promise(function (resolve, reject) {
      resolve(dispatch({
        type: 'addLedger/saveOperationApply',
        payload: params
      }))
    })
    promiseAdd.then((value)=>{
      console.log('value',value)
      delete target.isNew;
      that.toggleEditable(e, key);
      // that.props.onChange(that.state.data);
      that.setState({
        loading: false,
      });

    }).catch()
  }

  addsaveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });

    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(key) || {};
    if (!target.content || !target.condition || !target.id) {
      message.error('请填写完整成员信息。');
      e.target.focus();
      this.setState({
        loading: false,
      });
      return;
    }
    let standing_id = parseInt(localStorage.getItem('dataId'));
    let params = {
      condition: target.condition,
      id: target.id,
      content: target.content,
      num: target.num,
      standing_id: standing_id
    };
    let that = this;
    let dispatch = this.props.dispatch;
    let promiseAdd = new Promise(function (resolve, reject) {
      resolve(dispatch({
        type: 'addLedger/getAddApply',
        payload: params
      }))
    })
    promiseAdd.then((value)=>{
      console.log('value',value)
      delete target.isNew;
      that.toggleEditable(e, key);
      // that.props.onChange(that.state.data);
      that.setState({
        loading: false,
      });

    }).catch()
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({data: newData});
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: '类型',
        dataIndex: 'id',
        key: 'id',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                value={text}
                showSearch
                style={{width: 200}}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={e => this.handleFieldChange(e, 'id', record.key)}
                // onChange={handleChange}
                // onFocus={handleFocus}
                // onBlur={handleBlur}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.props.addLedger.seletType.map((item, index) => {
                  return (
                    <Option value={item.id}>{item.type_name}</Option>
                  )
                })}
                {/*<Option value="jack">Jack</Option>*/}
                {/*<Option value="lucy">Lucy</Option>*/}
                {/*<Option value="tom">Tom</Option>*/}
              </Select>
              // <Input
              //   value={text}
              //   autoFocus
              //   onChange={e => this.handleFieldChange(e, 'name', record.key)}
              //   // onKeyPress={e => this.handleKeyPress(e, record.key)}
              //   placeholder="成员姓名"
              // />
            );
          }
          return text;
        },
      },
      {
        title: '查询内容',
        dataIndex: 'content',
        key: 'content',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'content', record.key)}
                // onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="工号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '查询条件（可为空）',
        dataIndex: 'condition',
        key: 'condition',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'condition', record.key)}
                // onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="所属部门"
              />
            );
          }
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                defaultValue={1}
                value={text}
                min={1}
                max={9999999}
                onChange={e => this.handleFieldChange(e, 'num', record.key)}
                // onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.addsaveRow(e, record.key)}>添加</a>
                  <Divider type="vertical"/>
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical"/>
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical"/>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{width: '100%', marginTop: 16, marginBottom: 8}}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增查询内容
        </Button>
      </Fragment>
    );
  }
}

export default connect(({addLedger, global, loading}) => ({
  addLedger: addLedger,
  collapsed: addLedger.collapsed,
  loading: loading,
  global: global,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(TableFormaddLedger));
