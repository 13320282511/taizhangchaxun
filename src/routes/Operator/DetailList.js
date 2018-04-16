import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Badge, Table, Divider,Button,message,Modal } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';
import {getAuthority} from "../../utils/authority";
const { Description } = DescriptionList;
const detailAlink = (value,standingId,id,type)=>{
  if(getAuthority() == 'sqyh' || getAuthority()=='auditor'){
    return '';
  }else if(value){
    if(!value.feedback_time){
      return (<Link to={`/operator/uploadResult/${standingId}/${id}/${type}`}>上传</Link>)
    }
  }
  return '';
};
const downLoadDisplay = (value,id)=>{
  if(getAuthority() == 'sqyh' || getAuthority()=='auditor'){
    return '';
  }else if(value.length>0){
    return <a href={`/api/service/Standing/feedbackDownload?id=${id}`} target="_blank">下载结果</a>
  }
  return '';
};
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
  {
    title:'反馈结果',
    dataIndex:'feedback_real_file',
    key:'feedback_real_file',
    render(val) {
      const feedback_file = val? val: [];
      return (
        <div className={styles.huizhidan}>
          {feedback_file.map((item,index)=>{
            return (<div key={index}>{item}</div>)
          })}
        </div>
      );
    }
  },
  {
    title:'回执单',
    dataIndex:'feedback_upload',
    key:'feedback_upload',
    render(val) {
      const feedbackFile = val? val: [];
      return (
        <div className={styles.huizhidan}>
          {feedbackFile.map((item,index)=>{
            return (<a href={item} target='_blank' style={{width:'20px',height:'20px',display:'inline-block',marginRight:'10px'}}><img src={item} key={index} style={{width:'100%',height:'100%',display:'block'}}/></a>)
          })}
        </div>
      );
    }
  },
  {
    title:'操作',
    render(val) {

      return (
        <Fragment>
          {detailAlink(val,val.standing_id,val.id,val.type)} &nbsp;&nbsp;
          {downLoadDisplay(val.feedback_file,val.id)}
        </Fragment>
      );
    },
  }
];

@connect(({ detailListOfBooks, loading }) => ({
  detailListOfBooks,
  loading: loading.effects['detailListOfBooks/fetchBasic'],
}))
export default class BasicProfile extends Component {
  constructor(props) {
    super(props);
    this.state={
      previewVisible:false,
      previewImage:'',
    }
  }
  handleCancel = () => this.setState({previewVisible: false})

  handlePreview(file){
    this.setState({
      previewImage: file,
      previewVisible: true,
    })
  }
  sendLoadDisplay = ()=>{
    if(getAuthority() == 'sjfxy' || getAuthority()=='cxy' || getAuthority()=='dzqzy'){
     return (<Button className="btn" type="primary" onClick={this.onSendQuery}>发送结果</Button>);
    }
    return '';
  }
  onSendQuery=()=>{
    const { dispatch, match } = this.props;
    let urlArray = match.url.split('/');
    dispatch({
      type: 'detailListOfBooks/detailSendResult',
      payload: { id: parseInt(urlArray[urlArray.length - 1]) },
    }).then((res)=>{
        if(res && res.code && res.code == 1) {
          message.success('发送结果成功');
          console.log('res1',res)
        }else{
          message.error("发送结果失败");
          console.log('res2',res)
        }
    }).catch((error)=>{
      cosnole.log('error',error);
    })
  }
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
            <Description term="查询员账号" >{basicstandingDetail.account}</Description>
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
          <div className={styles.title}>
            <span>批文</span>
          </div>
          <div className={styles["piwen-img"]}>
            {detailListOfBooks.imgSrcPiwen.map((item,index)=>{
              // return <img src={item} key={index} alt={index} onClick={this.handlePreview.bind(this,item)}/>
              return <a href={item} target='_blank' style={{width:'20px',height:'20px',marginRight:'10px',display:'inline-block'}}><img src={item} key={index} alt={index} style={{display:'block',width:'100%',height:'100%'}}/></a>
            })}
          </div>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>
            <span>查询结果</span>
            {this.sendLoadDisplay()}
          </div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={this.props.detailListOfBooks.standingDetailQuery}
            columns={progressColumns}
            // rowKey="num"
          />
        </Card>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel} width='60%'>
          <img alt="example" style={{width: '50%'}} src={this.state.previewImage}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
