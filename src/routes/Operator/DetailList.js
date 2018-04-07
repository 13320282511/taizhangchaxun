import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;

const progressColumns = [
  {
    title: '类型',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'success' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="processing" text="进行中" />
      ),
  },
  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

@connect(({ detailListOfBooks, loading }) => ({
  detailListOfBooks,
  loading: loading.effects['detailListOfBooks/fetchBasic'],
}))
export default class BasicProfile extends Component {
  componentDidMount() {
    const { dispatch,match } = this.props;
    let urlArray = match.url.split('/');
    dispatch({
      type: 'detailListOfBooks/fetchBasic',
      payload:{id:urlArray[urlArray.length-1]}
    });
  }

  render() {
    const { detailListOfBooks, loading } = this.props;
    console.log('this.props',this.props)
    const { basicstandingDetail, basicProgress } = detailListOfBooks;
    let goodsData = [];
    if (basicstandingDetail.length) {
      let num = 0;
      let amount = 0;
      basicstandingDetail.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicstandingDetail.concat({
        id: '总计',
        num,
        amount,
      });
    }
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === basicstandingDetail.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    // const detailOfBooks = {
    //   approver: '最高级别审批人',
    //   proposer_1st_phone: '18581019181',
    //   create_time: 'null',
    //   proposer: '申请单位',
    //   doc_type: '一般',
    //   feedback_time: 'null',
    //   proposer_2nd: '李四',
    //   proposer_name: '各区县纪委监委',
    //   proposer_1st: '张三',
    //   doc_name: 'null',
    //   id: 1,
    //   org_name: '第1纪监察室',
    //   proposer_2nd_phone: '18581019181',
    // };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="文号：简称一201801" style={{ marginBottom: 32 }}>
            <Description term="查询类型">{basicstandingDetail.doc_type}</Description>
            <Description term="查询员" />
            <Description term="申请人1">{basicstandingDetail.proposer_1st}</Description>
            <Description term="联系电话">{basicstandingDetail.proposer_1st_phone}</Description>
            <Description term="申请人2">{basicstandingDetail.proposer_2nd}</Description>
            <Description term="联系电话">{basicstandingDetail.proposer_2nd_phone}</Description>
            <Description term="申请单位">{basicstandingDetail.proposer}</Description>
            <Description term="申请单位类型" />
            <Description term="承办单位" />
            <Description term="最高级别审批人">{basicstandingDetail.approver}</Description>
            <Description term="查询时间">{basicstandingDetail.create_time}</Description>
            <Description term="结果反馈时间" />
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>批文</div>
          <DescriptionList size="large" title="" style={{ marginBottom: 32 }}>
            <Description term="结果反馈时间" />
          </DescriptionList>
          <div className={styles.title}>查询结果</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={basicProgress}
            columns={progressColumns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
