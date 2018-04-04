import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;

const progressColumns = [
  {
    title: '时间',
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

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
export default class BasicProfile extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchBasic',
    });
  }

  render() {
    const { profile, loading } = this.props;
    const { basicGoods, basicProgress } = profile;
    let goodsData = [];
    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
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
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const goodsColumns = [
      {
        title: '商品编号',
        dataIndex: 'id',
        key: 'id',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return <a href="">{text}</a>;
          }
          return {
            children: <span style={{ fontWeight: 600 }}>总计</span>,
            props: {
              colSpan: 4,
            },
          };
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: renderContent,
      },
      {
        title: '商品条码',
        dataIndex: 'barcode',
        key: 'barcode',
        render: renderContent,
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align: 'right',
        render: renderContent,
      },
      {
        title: '数量（件）',
        dataIndex: 'num',
        key: 'num',
        align: 'right',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
    ];
    const detailOfBooks = {
      approver:'最高级别审批人',
      proposer_1st_phone:'18581019181',
      create_time:'null',
      proposer:'申请单位',
      doc_type:'一般',
      feedback_time:'null',
      proposer_2nd:'李四',
      proposer_name:'各区县纪委监委',
      proposer_1st:'张三',
      doc_name:'null',
      id:1,
      org_name:'第1纪监察室',
      proposer_2nd_phone:'18581019181'
    }
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="文号：简称一201801" style={{ marginBottom: 32 }}>
            <Description term="查询类型">{detailOfBooks.doc_type}</Description>
            <Description term="查询员"></Description>
            <Description term="申请人1">{detailOfBooks.proposer_1st}</Description>
            <Description term="联系电话">{detailOfBooks.proposer_1st_phone}</Description>
            <Description term="申请人2">{detailOfBooks.proposer_2nd}</Description>
            <Description term="联系电话">{detailOfBooks.proposer_2nd_phone}</Description>
            <Description term="申请单位">{detailOfBooks.proposer}</Description>
            <Description term="申请单位类型"></Description>
            <Description term="承办单位"></Description>
            <Description term="最高级别审批人">{detailOfBooks.approver}</Description>
            <Description term="查询时间">{detailOfBooks.create_time}</Description>
            <Description term="结果反馈时间"></Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>批文</div>
          <DescriptionList size="large" title="" style={{ marginBottom: 32 }}>
            <Description term="结果反馈时间"></Description>
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
