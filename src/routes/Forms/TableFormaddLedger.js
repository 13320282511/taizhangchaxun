import React, {PureComponent, Fragment} from 'react';
import {Table, Button, Input, message, Popconfirm, Divider, InputNumber, Select} from 'antd';
import styles from './style.less';
import {connect} from 'dva';
import {Form} from 'antd/lib/index';

// const returnData = [45643, 34343434, 123, 1234];
class TableFormaddLedger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      leaderColor: this.props.leaderColor,
    };
    let codeAdmin = localStorage.getItem('antd-pro-authority');
    let quanx = {code: codeAdmin};
    this.props.dispatch({
      type: 'addLedger/getApplyTypePost',
      payload: quanx,
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
  toggleEditable = (e, key, boolean, dataReturnTtoal,action) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    let contentData = target.content;

    function showhtml(contentData) {
      let html = {__html: contentData};
      return <div dangerouslySetInnerHTML={html}/>;
    }

    if (boolean == 'true') {
      let dataReturn = dataReturnTtoal;
      if(action == 'edite'){

      }else if(action == 'add'){
        dataReturn = dataReturnTtoal.verifyCard ? dataReturnTtoal.verifyCard : {};
        target.id = dataReturnTtoal.id;
      }
      let arrayData = contentData.split(',');
      let departmentLevel = dataReturn.departmentLevel ? dataReturn.departmentLevel : [];
      let hallLevel = dataReturn.hallLevel ? dataReturn.hallLevel : [];
      let ministryLevel = dataReturn.ministryLevel ? dataReturn.ministryLevel : [];
      for (let i = 0; i < arrayData.length; i++) {
        for (let j = 0; j < ministryLevel.length; j++) {
          if (arrayData[i] == ministryLevel[j]) {
            arrayData[i] = `<span style='color:${this.state.leaderColor.ministryLevel}'>${arrayData[i]}</span>`;
          }
        }
        for (let j = 0; j < hallLevel.length; j++) {
          if (arrayData[i] == hallLevel[j]) {
            arrayData[i] = `<span style='color:${this.state.leaderColor.hallLevel}'>${arrayData[i]}</span>`;
          }
        }
        for (let j = 0; j < departmentLevel.length; j++) {
          if (arrayData[i] == departmentLevel[j]) {
            arrayData[i] = `<span style='color:${this.state.leaderColor.departmentLevel}'>${arrayData[i]}</span>`;
          }
        }
      }
      console.log('arrayData',arrayData)
      let stringData = arrayData.join(',');
      target.content = showhtml(stringData);
    } else {
      let dataHtml = target.content.props.dangerouslySetInnerHTML.__html;
      let clearHtml = dataHtml.replace(/<\/?.+?>/g, '');
      target.content = clearHtml;
    }
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = {...target};
      }
      target.editable = !target.editable;
      this.setState({data: newData});
    }
  };

  //查询类型转换
  typeIdQuery(target) {
    let id = 0;
    this.props.addLedger.seletType.map((item, index) => {
      if (item.type_name == target.type) {
        return (id = item.id);
      }
    });
    return id;
  }

  remove(key) {
    this.setState({
      loading: true,
    });
    const target = this.getRowByKey(key) || {};
    let standing_id = parseInt(localStorage.getItem('dataId'));
    let params = {
      condition: target.condition,
      type: this.typeIdQuery(target),
      content: target.content,
      num: target.num,
      operation: 'delete',
      standing_id: standing_id,
      id:target.id,
    };
    let that = this;
    let dispatch = this.props.dispatch;
    dispatch({
      type: 'addLedger/saveOperationApply',
      payload: params,
    })
      .then(value => {
        if (value && value.code && value.code == 1) {
          const newData = this.state.data.filter(item => item.key !== key);
          this.setState({data: newData});
          that.setState({
            loading: false,
          });
        } else {
          that.setState({
            loading: false,
          });
          message.error('删除失败');
        }
      })
      .catch((error) => {
        that.setState({
          loading: false,
        });
      });
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
  }

  newMember = () => {
    let standing_id = parseInt(localStorage.getItem('dataId'));
    const newData = this.state.data.map(item => ({...item}));
    console.log('newData', newData);
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      id: '',
      type:'',
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
        if (fieldName == 'type') {
          this.props.addLedger.seletType.map((item, index) => {
            if (item.id == e) {
              target[fieldName] = item.type_name;
            }
          });
        } else {
          target[fieldName] = e;
        }
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
    if (!target.content || !target.type) {
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
      type: this.typeIdQuery(target),
      content: target.content,
      num: target.num,
      operation: 'edit',
      standing_id: standing_id,
      id:target.id,
    };
    let that = this;
    let dispatch = this.props.dispatch;
    dispatch({
      type: 'addLedger/saveOperationApply',
      payload: params,
    })
      .then(value => {
        if (value && value.code && value.code == 1) {
          delete target.isNew;
          // let dataReturn = [
          //   123, 124, 222, 111, 58
          // ];
          let dataReturn = value.data ? value.data : {};
          that.toggleEditable(e, key, 'true', dataReturn,'edite');
          that.setState({
            loading: false,
          });
        } else {
          that.setState({
            loading: false,
          });
          message.error('保存失败');
        }
      })
      .catch((error) => {
        that.setState({
          loading: false,
        });
      });
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
    if (!target.content || !target.type) {
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
      type: this.typeIdQuery(target),
      content: target.content,
      num: target.num,
      standing_id: standing_id,
    };
    let that = this;
    let dispatch = this.props.dispatch;
    dispatch({
      type: 'addLedger/getAddApply',
      payload: params,
    })
      .then(value => {
        if (value && value.code && value.code == 1) {
          delete target.isNew;
          let dataReturn = value.data ? value.data : {};
          that.toggleEditable(e, key, 'true', dataReturn,'add');
          that.setState({
            loading: false,
          });
        } else {
          that.setState({
            loading: false,
          });
          message.error('增加失败');
        }
      })
      .catch((error) => {
        console.log('error',error)
        that.setState({
          loading: false,
        });
      });
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
        dataIndex:'id',
        key:'id',
        className:styles.cloumnsNone,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                value={text ? text : '请输入类型'}
                showSearch
                style={{width: 200}}
                onChange={e => this.handleFieldChange(e, 'type', record.key)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.props.addLedger.seletType.map((item, index) => {
                  return <Option value={item.id}>{item.type_name}</Option>;
                })}
              </Select>
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
                placeholder="查询内容"
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
                placeholder="查询条件（可为空）"
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
