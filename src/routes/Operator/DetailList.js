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
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '查询内容',
    dataIndex: 'content',
    key: 'content',
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   render: text =>
  //     text === 'success' ? (
  //       <Badge status="success" text="成功" />
  //     ) : (
  //       <Badge status="processing" text="进行中" />
  //     ),
  // },
  {
    title: '查询条件',
    dataIndex: 'condition',
    key: 'condition',
  },
  {
    title: '数量',
    dataIndex: 'num',
    key: 'num',
  },
];

@connect(({ detailListOfBooks, loading }) => ({
  detailListOfBooks,
  loading: loading.effects['detailListOfBooks/fetchBasic'],
}))
export default class BasicProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    let urlArray = match.url.split('/');
    dispatch({
      type: 'detailListOfBooks/fetchBasic',
      payload: { id: parseInt(urlArray[urlArray.length - 1]) },
    });
    dispatch({
      type: 'detailListOfBooks/fetchDetailPiwen',
      payload: { standing_id: parseInt(urlArray[urlArray.length - 1]) },
    });
    dispatch({
      type:'detailListOfBooks/piwenDetail',
      payload:{ id: parseInt(urlArray[urlArray.length - 1]) },
    })
  }

  render() {
    const { detailListOfBooks, loading } = this.props;
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
          <DescriptionList
            size="large"
            title={basicstandingDetail.doc_name}
            style={{ marginBottom: 32 }}
          >
            <Description term="查询类型">{basicstandingDetail.doc_type}</Description>
            <Description term="查询员" />
            <Description term="申请人1">{basicstandingDetail.proposer_1st}</Description>
            <Description term="联系电话">{basicstandingDetail.proposer_1st_phone}</Description>
            <Description term="申请人2">{basicstandingDetail.proposer_2nd}</Description>
            <Description term="联系电话">{basicstandingDetail.proposer_2nd_phone}</Description>
            <Description term="申请单位">{basicstandingDetail.proposer}</Description>
            <Description term="申请单位类型">{basicstandingDetail.proposer_name}</Description>
            <Description term="承办单位">{basicstandingDetail.org_name}</Description>
            <Description term="最高级别审批人">{basicstandingDetail.approver}</Description>
            <Description term="查询时间">{basicstandingDetail.create_time}</Description>
            <Description term="结果反馈时间">{basicstandingDetail.feedback_time}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div>批文</div>
          <div className={styles["piwen-img"]}>
            {detailListOfBooks.imgSrcPiwen.map((item,index)=>{
              return <img src={item} key={index}/>
            })}
          </div>
          <div className={styles.title}>查询结果</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={this.props.detailListOfBooks.standingDetailQuery}
            columns={progressColumns}
            // rowKey="num"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
