import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  InputNumber,
  Modal,
  DatePicker,
  message,
} from 'antd';
import {Link} from 'dva/router';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import {getAuthority} from "../../utils/authority";

const confirm = Modal.confirm;
const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

    </Modal>
  );
});
@connect(({ListOfBooks, loading}) => ({
  ListOfBooks,
  loading: loading.models.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  constructor(props) {
    super(props);
  }

  newCreateProject = () => {
    if (getAuthority() == 'sjfxy' || getAuthority() == 'cxy' || getAuthority() == 'dzqzy') {
      return (<Link to="/addLedger/step-form">
        <Button icon="plus" type="primary">
          新建
        </Button>
      </Link>);
    }
    return '';
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'ListOfBooks/fetch',
    });
    dispatch({
      type: 'ListOfBooks/queryChengban',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'ListOfBooks/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'ListOfBooks/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'ListOfBooks/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderAdvancedForm() {
    const {getFieldDecorator} = this.props.form;
    const {ListOfBooks} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="文号">
              {getFieldDecorator('doc_name')(<Input placeholder="请输入文号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="申请单位：">
              {getFieldDecorator('proposer_unit')(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="承办单位：">
              {getFieldDecorator('undertaker_unit')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  {ListOfBooks.getShortName.length > 0
                    ? ListOfBooks.getShortName.map((item, index) => {
                      return (
                        <Option value={item.id} key={index}>
                          {item.org_short}
                        </Option>
                      );
                    })
                    : ''}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="选择日期：">
              {getFieldDecorator('date')(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            {/*<a style={{marginLeft: 8}} onClick={this.toggleForm}>*/}
            {/*收起 <Icon type="up"/>*/}
            {/*</a>*/}
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    // return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderAdvancedForm();
  }

  render() {

    const {ListOfBooks, loading, dispatch} = this.props;
    const {data} = ListOfBooks;
    const {selectedRows, modalVisible} = this.state;
    const isDelete = (id) => {
      if (getAuthority() == 'sqyh') {
        return (<span onClick={showDeleteConfirm.bind(this, id)} className={styles.deleteYuansu}>删除</span>);
      }
      return '';
    }
    const showDeleteConfirm = (id) => {
      confirm({
        title: '删除',
        content: '确认删除？',
        okText: '确定删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let params = {id: id};
          let queryRes = dispatch({
            type: 'ListOfBooks/deleteList',
            payload: params,
          })
          queryRes.then((res)=>{
            if(res && res.code ==1){
              message.success("删除成功");
              dispatch({
                type: 'ListOfBooks/fetch',
              });
            }else {
              message.error("删除失败");
            }
          }).catch((error)=>{

          })
        },
        onCancel() {
          // console.log('Cancel');
        },
      });
    }
    const columns = [
      {
        dataIndex: 'id',
        colSpan: 0,
        columnWidth: '0',
        className: styles.hidden,
      },
      {
        title: '文号',
        dataIndex: 'doc_name',
      },
      {
        title: '查询类型',
        dataIndex: 'doc_type',
      },
      {
        title: '申请单位',
        dataIndex: 'proposer',
        sorter: false,
        align: 'right',
        // render: val => `${val} 万`,
        // // mark to display a total number
        needTotal: true,
      },
      {
        title: '承办单位',
        dataIndex: 'org_short',
        sorter: false,
        align: 'right',
      },
      {
        title: '查询时间',
        dataIndex: 'create_time',
        sorter: true,
        align: 'right',
      },
      {
        title: '结果反馈时间',
        dataIndex: 'feedback_time',
        sorter: true,
        align: 'right',
      },
      {
        title: '操作',
        render(val) {
          return (
            <Fragment>
              {isDelete(val.id)}&nbsp;&nbsp;
              <Link to={`/operator/detailList/${val.id}`}>详情</Link>&nbsp;&nbsp;
            </Fragment>
          );
        },
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {this.newCreateProject()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
