<template>
  <div style="padding:0px; width: fit-content; ">
      <el-dialog v-model="Revoke_Approval_Modal" modal-class="custom-dialog" width="250" top="5vh" :header-aria-level="3">
        <table style="width:100%;">
          <caption style="height:30px; padding:5px 0px 3px 0px; line-height: 2;">Do you want to revoke the approval?</caption>
          <tbody>
            <tr style="height:20px;">
              <td style="color:#cccccc;">
                <div style="margin-left:40px"><input type="checkbox" v-model="Reset_Flow_Flag" />Initiallze New</div>
              </td>
            </tr>
            <tr >
              <td style="text-align:center">
                <button style="width:40px; border:1px solid #cccccc;margin:4px 16px 0px 0px" @click="Approve_Detail_Maintain(Revoke_Approval_Array); Revoke_Approval_Modal = false;" >Yes</button>
                <button style="width:40px; border:1px solid #cccccc;margin:4px 0px 0px 16px" @click="Revoke_Approval_Modal = false; Load_Approve_Detail_Info();" >No</button>
              </td>
            </tr>
          </tbody>
        </table>
      </el-dialog>

      <div id="OuterBox" class="noPrint">
        <table v-if="Approve_Detail_Info.length == 0 ">
          <tbody>
            <tr>
              <td>
                <div v-if="Report_Department_Flag == 1" style="cursor:pointer;" class="icon-approved" @click="Approve_Detail_Maintain({Mode:0})">Perform Approval</div>
              </td>
            </tr>
          </tbody>
        </table>
        <table v-if="Approve_Detail_Info.length > 0 && IsCollapse==0">
          <tbody>
            <tr>
              <td style="vertical-align: top !important; padding:0px 1px !important; text-align: left;" v-for="(item, idx) in Approve_Detail_Info" :key="item+idx">
                <div style="width:99px; padding: 2px; min-height: 44px; white-space:nowrap;" v-if="item.Approver_CHK">
                  <span :style="{'font-weight': item.Force_Approved ? 'bolder':''}">{{item.Approver_Title}}:</span>
                  <input type="checkbox" v-model="item.Approver_CHK" :disabled="!item.Approve_Flag"
                  @change="item.Approve_Flag ? (item.Force_Approved ? Revoke_Approval({Mode:1, idx:item.Stage_No, Name:'Approver_CHK', items: item}) : Approve_Detail_Maintain({Mode:1, idx:item.Stage_No, Name:'Approver_CHK', items: item})):''"/> 
                  <span style="width:100px;" >{{item.Approved_Date_S}} </span>
                  <br/>
                  <span style="width:100px;" >{{item.Approver_UserID}} </span>
               </div>                
                <div style="width:99px; padding: 2px; min-height: 44px;" v-else>
                  <span :style="{'font-weight': item.Force_Approved ? 'bolder':''}">{{item.Approver_Title}}:</span><br/>
                  <input type="checkbox" v-model="item.Approver_CHK" :disabled="!item.Approve_Flag"
                  @change="item.Approve_Flag ? Approve_Detail_Maintain({Mode:1, idx:item.Stage_No, Name:'Approver_CHK', items: item}):''"/> 
                  <span style="width:100px;" v-show="item.Approver_CHK||item.Stage_No==0">{{item.Approver_UserID}} </span>
                  <span style="width:100px;" v-show="!item.Approver_CHK&&item.Stage_No>0">Appr.</span>
                  <input type="checkbox" v-model="item.Approver_Reject" :disabled="!item.Reject_Flag"
                  v-if="!item.Approver_CHK&&item.Stage_No>0" 
                  @change="item.Reject_Flag ? Approve_Detail_Maintain({Mode:1, idx:item.Stage_No, Name:'Approver_Reject', items: item}):''"/> 
                  <span style="width:100px;" v-show="!item.Approver_CHK&&item.Stage_No>0">Rej.</span>
                </div>
                <textarea class="Textarea" :disabled="!item.Comment_Flag"
                  v-model="item.Approver_Comment"  :placeholder="!item.Approver_CHK && item.Stage_No>0 ? `You must write a comment before selecting 'Rejection'!`:''"
                  @change="item.Comment_Flag ? Approve_Detail_Maintain({Mode:1, Name:'Approver_Comment', items: item}):''"></textarea>                 
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="Approve_Detail_Info.length > 0 && IsCollapse==1" style="float:none; clear:both;" class="icon-approved" @click="ClickExpand()">Display The Approval Workflow</div><br/>
        <button v-if="Approve_Detail_Info.length > 0 && Report_Department_Flag == 1 && IsCollapse==0" class="noPrint" style="float:none; clear:both; border:1px solid lightgray; height:30px; width:185px; margin:2px 0px;">
          <a ref="SendUnApprove" :href="`mailto:''?subject=${WebServer} ${AppName} #${props.post.Doc_NO} &body=${WebServer} ${AppName} #${props.post.Doc_NO}/0 %0D%0A%0D%0A ${encodeURIComponent(AppLink )}`">Manually submit for Approval</a>
        </button>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupsStore } from '@/stores/store'
import axios from 'axios'
import commonFunction from '@/composables/commonFunction'
const { hostname, host } = commonFunction()
import format from 'string-format'
import { Expand } from '@vicons/ionicons5'
// import Tutor from './Tutor.vue';

 onMounted(async () => {
    WebServer.value = location.hostname.split('.')[0].toUpperCase() 
    WebServer.value = WebServer.value == 'LOCALHOST' ? 'ADP' : WebServer.value;

    await Check_Report_Department()
    await Load_Approve_Detail_Info()
    location_href.value =location.href
    //console.log(route.params)

    //console.log('location_href:',location_href.value)
    switch(props.post.ProgramID)
    {
      case 33:
        AppName.value = '客戶基本資料'
        AppLink.value = ` ${host}/Customer/0/${encodeURIComponent(props.post.Doc_NO)}/0`
      break;
      case 78:
        AppName.value = '訂單接受單'
        AppLink.value = ` ${host}/Order_Approve_Report/1/${props.post.Doc_NO}`
      break;
      case 120:
        AppName.value = 'Debit Note'
        var jsonData = {Mode: 1, Debit_No: props.post.Doc_NO}
        AppLink.value = `${host}/Sample_Debit_Note_Report/${encodeURIComponent(JSON.stringify(jsonData))}`;

      break;
      case 126:
        AppName.value = 'Mould Debit'
        var jsonData = {Mode: 1, Debit_No: props.post.Doc_NO}
        AppLink.value = `${host}/Model_Debit_Report/${encodeURIComponent(JSON.stringify(jsonData))}`;
      break;
      case 390:
        AppName.value = 'Credit Note'
        var jsonData = {Mode: 0, Debit_No: props.post.Doc_NO}
        AppLink.value = `${host}/Sample_Credit_Note_Report/${encodeURIComponent(JSON.stringify(jsonData))}`;
      break;
      case 391:
        AppName.value = '客戶付款條件'
        AppLink.value = ` ${host}/Customer/1/${encodeURIComponent(route.params.CustomerID)}/${encodeURIComponent(props.post.Doc_NO)}`
      break;
    }
    //console.log(Approve_Detail_Info)
})

const route = useRoute()
const groupsStore = useGroupsStore()
const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      ProgramID: null,
      DepartmentID: '',
      UserID: '',
      Doc_NO: '',
      Value: 0
    })
  }
});

const Approver_UserID_Flag = ref(0);
const Department_Approve_Info = ref([]);
const Reset_Flow_Flag = ref(0);
const Revoke_Approval_Array = ref({});
const Revoke_Approval_Modal = ref(false);
const IsCollapse = ref(0);
const Report_Department_Flag = ref(0);
const Approve_Detail_Info = ref([]);
const WebServer = ref('ADP');
const location_href = ref('');
const AppName = ref('');
const AppLink = ref('');
const Mail = ref({
  To: '',
  Subject: '',
  MailBody: ''
});
const Mail1 = ref({
  To: '',
  Subject: '',
  MailBody: ''
});

const Check_Report_Department = async () => {
    //console.log("Get_UserPrivilege=>", item)
    await axios.post(`/api/Public/Common/Check_Report_Department`, {ProgramID: props.post.ProgramID
    , Doc_NO: props.post.Doc_NO
    })
    .then((Response) => { 
        Report_Department_Flag.value = Response.data.Flag;
        Department_Approve_Info.value = Response.data.Department_Approve_Info.filter((item)=>(item.LoweredUserName == props.post.UserID))
        Approver_UserID_Flag.value = Department_Approve_Info.value.length > 0 ? 1 : 0;
    }) 
    .catch((err) => {
        console.log(err)
    });
}
const Load_Approve_Detail_Info = async () => {
    //console.log("Get_UserPrivilege=>", item)
    await axios.post(`/api/Public/Common/Approve_Detail_Info`, {ProgramID: props.post.ProgramID
    , DepartmentID: props.post.DepartmentID
    , Approver_UserID_Flag: Approver_UserID_Flag.value
    , UserID: props.post.UserID
    , Doc_NO: props.post.Doc_NO
    , Site: WebServer.value
    , Value: props.post.Value
    })
    .then((Response) => { 
        Approve_Detail_Info.value = Response.data;
        var count = 0
        Approve_Detail_Info.value.forEach((item) => {
          if(item.Approved_Date != null ) {
            count += 1;
          }
        })
        IsCollapse.value = Approve_Detail_Info.value.length == count ? 1 : 0;

    }) 
    .catch((err) => {
        console.log(err)
        //this.$emit('permission',this.state);
    });
}
const Approve_Detail_Maintain = (obj) => {
    //console.log(obj)
    var ProgramID = ''
    var result = true;
    var _this = this;
    var params = {Mode: obj.Mode, ProgramID: props.post.ProgramID, Doc_NO: props.post.Doc_NO, Site: WebServer.value};
    
    // req.body.Mode === 0 表示Generate Approve Detail
    // req.body.Mode === 1 表示修改Approve Detail
    // req.body.Mode === 2 表示刪除Approve Detail
    switch(obj.Mode){
        case 0:
          params.Value = props.post.Value
        break;
        case 1:
          var Value = '';
          params.Approve_DetailID = obj.items.Approve_DetailID;
          switch(obj.Name)
          {
            case 'Approver_CHK':
            //console.log(Department_Approve_Info.value)
              Value = obj.items['Approver_CHK'] ? 1:0;
              params.Force_Approved = obj.items.Force_Approved ? 1:0;
              params.Reset_Flow_Flag= Reset_Flow_Flag.value ? 1:0;
              params.Stage_No = obj.idx;
              params.Approver_UserID_Flag= Approver_UserID_Flag.value;
              params.Approver_UserID = Department_Approve_Info.value.map((item)=>(item.LoweredUserName));
              params.Approver_Email = Department_Approve_Info.value.map((item)=>(item.Email));

            break;
            case 'Approver_Reject':
              Value = obj.items['Approver_Reject'] ? 1:0;
              params.Force_Approved = obj.items.Force_Approved ? 1:0;
            break;
            case 'Approver_Comment':
              params.Approver_UserID_Flag= Approver_UserID_Flag.value;
              Value = obj.items[obj.Name];
            break;
          }

          params.Name = obj.Name
          params.Value = Value
        break;
        case 2:
        break;
    }

    obj.Mode == 0 ? result = confirm(`Are you sure you want to Generate Approve data ?`) : '';
    if(obj.Mode == 0 && result == false) {
        return;
    }

    axios.post(`/api/Public/Common/Approve_Detail_Maintain`, params)
        .then(async response => {
            var Flag = response.data.Flag; 
            if(Flag){ 
                  
                switch(obj.Mode){
                    case 0: 
                      Load_Approve_Detail_Info();
                    break;
                    case 1:
                      switch(obj.Name)
                      {
                        case 'Approver_CHK':

                          var Stage_No = 0
                          var Status = ''
                          var Array = []

                          Stage_No = obj.idx+1 >= Approve_Detail_Info.length ? obj.idx : obj.idx+1;
                          Status = Value ? '簽核': '暫緩核簽'

                          Array = Approve_Detail_Info.value.filter((item)=>(item.Stage_No == Stage_No))
                          Mail.value.To = Array.map((item)=>(item.Approver_Email)).join(';')

                          Mail.value.Subject = format('{0} {1} #{2} {3}'
                          , WebServer.value
                          , AppName.value
                          , props.post.Doc_NO
                          , Status
                          )

                          Mail.value.MailBody = format('{0} {1} \n\r                              - {2} -'
                          , Mail.value.Subject
                          , AppLink.value
                          , props.post.UserID
                          )
                          //console.log('Mail:',Mail.value)
                          //params.Mail = this.Mail;
                          obj.idx != Stage_No && Array.map((item)=>(item.Approver_CHK))[0] == 0 ? axios.post(`/api/Public/Common/SendMail`, {Mail:Mail.value}):'';

                          if(params.Force_Approved ) {
                            Status = Value ? '已核准':'已解鎖'

                            //console.log('Stage_No:',0)
                            Mail1.value.To = Approve_Detail_Info.value.filter((item)=>(item.Stage_No == 0)).map((item)=>(item.Approver_Email)).join(';')
              
                            Mail1.value.Subject = format('{0} {1} #{2} {3}'
                            , WebServer.value
                            , AppName.value
                            , props.post.Doc_NO
                            , Status
                            )

                            Mail1.value.MailBody = format('{0} {1} \n\r                              - {2} -'
                            , Mail1.value.Subject
                            , AppLink.value
                            , props.post.UserID
                            )

                            //console.log('Mail:',Mail1)
                            axios.post(`/api/Public/Common/SendMail`, {Mail:Mail1.value})
                            if(Reset_Flow_Flag.value) {
                              Reset_Flow_Flag.value = 0;
                              await axios.post(`/api/Public/Common/Approve_Detail_Maintain`, {Mode: 0, ProgramID: props.post.ProgramID, Doc_NO: props.post.Doc_NO, Site: WebServer.value, Value: props.post.Value});
                            }

                          }

                          await Load_Approve_Detail_Info();
                        break;
                        case 'Approver_Comment':
                          Load_Approve_Detail_Info();
                        break;
                        case 'Approver_Reject':

                          var Stage_No = obj.idx-1
                          Stage_No = (Stage_No < 0 ?  obj.idx+1 : Stage_No)
                       
                          Mail.value.To = Approve_Detail_Info.value.filter((item)=>(item.Stage_No <= Stage_No)).map((item)=>(item.Approver_Email)).join(';')

                          Mail.value.Subject = format('{0} {1} #{2} {3}'
                          , WebServer.value
                          , AppName.value
                          , props.post.Doc_NO
                          , Value ? '退件':''
                          )

                          Mail.value.MailBody = format('{0}  {1} \n\r評論:『{2}』 \n\r                              - {3} -'
                          , Mail.value.Subject
                          , AppLink.value
                          , obj.items.Approver_Comment
                          , props.post.UserID
                          )
                          
                          axios.post(`/api/Public/Common/SendMail`, {Mail:Mail.value})
                       
                          Load_Approve_Detail_Info();
                        break;
                      }

                    break;
                    case 2:
                      Load_Approve_Detail_Info();
                    break;
                }
            } else {
                Load_Approve_Detail_Info();

                window.$message.error('Data save fail!');

            }
        })
        .catch(function(error) {
            Load_Approve_Detail_Info();
            window.$message.error('Data save fail!');
            console.log(error);
        });
}
const ClickExpand = () => {
    IsCollapse.value = 0;
}

const Revoke_Approval = (obj) => {
  console.log('Revoke_Approval')
  Revoke_Approval_Array.value = obj;
  Revoke_Approval_Modal.value = true;
}
</script>
<style  rel="stylesheet/scss" lang="scss">

</style>

<style scoped rel="stylesheet/scss" lang="scss">
    //@import "@/assets/scss/v-tooltip.scss";
</style>

<style scoped>
    @media print {
        .noPrint {display: none}
        .Textarea {display: none}
        .Print {
            display:contents !important;
            white-space: pre-wrap; word-wrap: break-word;
        }
    }
 
    table {
        border-collapse: collapse;          
        width:100%; 
    }

    #table tbody td {
        border: 1px solid #cccccc;
    }

    .NoBorder td {
        border: 0px !important;
        white-space: nowrap;
    }

    .Textarea {
        white-space: pre-wrap; word-wrap: break-word;
        width:100%; height:75px; resize:both !important; border:1px solid #cccccc;
        font-size: 12px;
        line-height: unset !important;
        padding:2px;
    }
    #OuterBox {
      float:none;
      clear: both;
    }
</style>