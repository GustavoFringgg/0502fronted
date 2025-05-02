<template>
  <div v-if="Insert_Mode_Invisible" class="w-full">
    <ComptPermission style="width:390px; float:left;" :post="post" @permission="Permission"></ComptPermission>
    <div class="text-xs" style="float:right; height:32px; line-height:32px; text-align:left;">
      <el-tooltip :content="`Create_Date: ${Create_Date}`" :disabled="!Create_Date" placement="top">
        <span> {{ Data_Updater ? `Update: ${Data_Updater} ${Data_Update}` : '' }}</span>
      </el-tooltip>
      <n-icon class="cursor-pointer p-0.5" :component="Trash" size="16" :depth="2" v-if="IsAuthor && !IsUserEmpty && !Basic_Info_Check"
              @click.prevent="Customer_Maintain({ Mode: 2 })" />
    </div>
    <div id="Head" class="clear-both float-none rounded p-2 text-xs">
      <el-tabs v-model="tabActiveName" type="border-card" size="small">
        <!-- Basic Info -->
        <el-tab-pane label="Basic Info" name="first">
          <table v-for="(item, index) in Customer_Info" :key="index" class="w-full">
            <tbody>
              <tr>
                <td class="text-right">Customer:</td>
                <td>
                  <el-input v-model="item.CustomerID" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="IsAuthor && item.CustomerID.trim().length > 0 && item.CustomerID != $route.params.CustomerID ? Customer_Maintain({ Mode: 1, Name: 'CustomerID', items: item }) : ''"
                            @keyup="$RestrictChars_Replace" type="text" size="small" class="w-full text-left" />
                </td>
                <td class="text-right">VAT Identification Number:</td>
                <td>
                  <el-input v-model="item.VAT_NO" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'VAT_NO', items: item })" type="text" size="small" class="w-full text-left" />
                </td>
                <td class="text-right">Transaction Amount:</td>
                <td class="w-[70px]">
                  <el-select v-model="item.Transaction_Currency" filterable :disabled="!IsAuthor || item.Basic_Info_Check"
                              @change="Customer_Maintain({ Mode: 1, Name: 'Transaction_Currency', items: item })" size="small" placeholder=" ">
                    <el-option v-for="(option, index) in Currency" :key="index" :label="option.Currency" :value="option.Currency" />
                  </el-select>
                </td>
                <td class="w-[100px]">
                  <el-input v-model.number="item.Transaction_Amount" :disabled="!IsAccounting"
                            @change="IsAccounting ? Customer_Maintain({ Mode: 1, Name: 'Transaction_Amount', items: item }) : ''" type="number" size="small"
                            class="text-left" />
                </td>
              </tr>
              <tr>
                <td class="text-right">Full Name:</td>
                <td colspan="3">
                  <el-input v-model="item.Customer_Name" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Customer_Name', items: item })" type="text" size="small" class="w-full text-left" />
                </td>
                <td class="text-right">Establish Date:</td>
                <td>
                  <el-input v-model="item.Establish_Date" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Establish_Date', items: item })" type="text" size="small"
                            :input-style="{ 'color': ($CheckDate(item.Establish_Date) ? 'black' : 'red'), 'width': '80px' }" />
                </td>
                <td class="text-center">
                  <span v-if="item.Establish_Date">( {{ item.YearDifference }} years )</span>
                </td>
              </tr>
              <tr>
                <td class="text-right">Country:</td>
                <td>
                  <el-input v-model="item.Country" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Country', items: item })" type="text" size="small" class="w-[200px] text-left" />
                </td>
                <td class="text-right">Custom Region:</td>
                <td>
                  <el-select v-model="item.Region" filterable :disabled="!IsAuthor || item.Basic_Info_Check"
                              @change="Customer_Maintain({ Mode: 1, Name: 'Region', items: item })" size="small">
                    <el-option v-for="option in Region" :key="option.Region" :label="option.Region" :value="option.Region" />
                  </el-select>
                  <n-icon v-if="Is_IT_Author" @click="dialogRegionVisible = true" class="cursor-pointer p-1" :component="Pencil" size="16" :depth="2" />
                </td>
                <td class="text-right">Annual Sale Amount:</td>
                <td>
                  <el-input v-model.number="item.Annual_Sales_Amount" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Annual_Sales_Amount', items: item })" type="number" size="small"
                            input-style="width: 80px;" />
                </td>
              </tr>
              <tr>
                <td class="text-right align-top">Address:</td>
                <td colspan="3">
                  <el-input v-model="item.Address" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Address', items: item })" type="textarea" resize="none" size="small"
                            class="w-full text-left" />
                </td>
                <td class="text-right align-top pt-1.5">Annual Sale Units:</td>
                <td class="align-top">
                  <el-input v-model.number="item.Annual_Sales_Units" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Annual_Sales_Units', items: item })" type="number" size="small"
                            input-style="width: 80px;" />
                </td>
              </tr>
              <tr>
                <td class="text-right">Department:</td>
                <td >
                  <el-select v-model="item.Department" filterable :disabled="!IsAuthor || item.Basic_Info_Check"
                              @change="Customer_Maintain({ Mode: 1, Name: 'Department', items: item })" size="small" placeholder=" ">
                    <el-option v-for="(option) in Department" :key="option.Department" :label="option.Department" :value="option.Department" />
                  </el-select>
                </td>
                <td class="text-right">Approved:</td>
                <td class="text-left pl-1">
                  <el-checkbox v-model="item.Financial_Approver_Check" :disabled="true"                                
                    :label="item.Financial_Approver ? `${item.Financial_Approver} ${item.Financial_Approve_Date}` : ''" size="small" />
                </td>
                <td colspan="2" class="text-left pl-10" :style="`opacity: ${item.Supervisor_Approver_Check ? '0.1' : '1'}`">
                  <span class="align-middle">History:</span>
                  <el-checkbox v-model="item.History_Check"
                                :disabled="!(IsAuthor || IsDepartment_Superior || IsAccounting) || IsUserEmpty || item.Supervisor_Approver_Check"
                                @change="Customer_Maintain({ Mode: 1, Name: 'History_Check', items: item })"
                                :label="item.History_User ? `${item.History_User} ${item.Histiry_Date}` : ''" class="pl-1 align-middle" size="small" />
                </td>
                <td class="text-right">
                </td>
              </tr>
              <tr>
                <td colspan="7" class="p-2">

                </td>
              </tr>
            </tbody>
          </table>
          <table class="w-full" v-for="(item, index) in Customer_Info" :key="index">
            <tbody>
              <tr>
                <td></td>
                <td colspan="4" class="pb-2">
                  <div class="border border-gray-300 w-[250px] float-left">
                    <table class="w-[248px]">
                      <thead>
                        <tr>
                          <th class="border-b border-gray-300 border-solid">Business Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <el-input v-model="item.Item_Of_Business" :disabled="!IsAuthor" type="textarea" input-style="box-shadow: none;"
                                      resize="none" size="small" @change="Customer_Maintain({ Mode: 1, Name: 'Item_Of_Business', items: item })"
                                      :autosize="{ minRows: 4, maxRows: 6 }" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="border border-gray-300 w-[250px] float-left ml-2">
                    <table class="w-[248px]">
                      <thead>
                        <tr>
                          <th class="border-b border-gray-300 border-solid">Business Geography</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <el-input v-model="item.Business_Geography" :disabled="!IsAuthor" type="textarea" input-style="box-shadow: none;"
                                      placeholder="Business geography statistics&#10;(Europe, US & Asia percentages)?" resize="none" size="small"
                                      @change="Customer_Maintain({ Mode: 1, Name: 'Business_Geography', items: item })"
                                      :autosize="{ minRows: 4, maxRows: 6 }" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="border border-gray-300 w-[250px] float-left ml-2">
                    <table class="w-[248px]">
                      <thead>
                        <tr>
                          <th class="border-b border-gray-300 border-solid">Largest Suppliers</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <el-input v-model="item.Largest_Suppliers" :disabled="!IsAuthor" type="textarea" input-style="box-shadow: none;"
                                      placeholder="Three largest suppliers? What&#10;percentage are they of the business?" resize="none" size="small"
                                      @change="Customer_Maintain({ Mode: 1, Name: 'Largest_Suppliers', items: item })"
                                      :autosize="{ minRows: 4, maxRows: 6 }" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-right">Phone:</td>
                <td>
                  <el-input v-model="item.Phone_Number" :disabled="!IsAuthor"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Phone_Number', items: item })" type="text" size="small"
                            class="w-full text-left" />
                </td>
                <td class="text-right">Fax:</td>
                <td>
                  <el-input v-model="item.Fax_Number" :disabled="!IsAuthor" @change="Customer_Maintain({ Mode: 1, Name: 'Fax_Number', items: item })"
                            type="text" size="small" class="w-full text-left" />
                </td>
                <td colspan="2" rowspan="3">
                  <div class="border border-gray-300 ml-2">
                    <table class="w-full">
                      <thead>
                        <tr>
                          <th class="border-b border-gray-300 border-solid w-[125px]">Agent</th>
                          <th class="border-b border-gray-300 border-solid w-[125px]">Client</th>
                          <th class="border-b border-gray-300 border-solid w-[22px] pr-3">
                            <div v-if="IsAuthor" @click="dialogCreateClientVisible = true">
                              <n-icon class="cursor-pointer pr-0.5" :component="AddCircle" size="16" :depth="2" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div style="height: 80px; width:100%; overflow: hidden scroll;">
                              <div id="Agent" style="padding:3px;line-height: 18px;height:22px; border-bottom:1px solid #cccccc;"
                                    v-for="(obj, idx) in Agent_Info" :key="idx">{{ obj.CustomerID }}</div>
                            </div>
                          </td>
                          <td colspan="2">
                            <div style="height: 80px; width:100%; overflow:hidden scroll;">
                              <div id="Client" style="padding:2px; height:22px; border-bottom:1px solid #cccccc;" v-for="(obj, idx) in Client_Info"
                                    :key="idx">
                                <div
                                      style="float:left; white-space: nowrap; width: 125px; overflow: hidden; text-align:left; line-height: 18px; text-overflow: ellipsis; ">
                                  {{ obj.Client }}</div>
                                <div v-if="IsAuthor" class="float-right"
                                      @click.prevent="IsAuthor ? Client_Maintain({ Mode: 2, Customer_ClientID: obj.Customer_ClientID }) : ''">
                                  <n-icon class="cursor-pointer p-0.5" :component="Trash" size="16" :depth="2" />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-right">WWW:</td>
                <td colspan="3" width="410px">
                  <el-input v-model="item.URL" :disabled="!IsAuthor" @change="Customer_Maintain({ Mode: 1, Name: 'URL', items: item })" type="text"
                            size="small" class="w-full text-left" />
                </td>
              </tr>
              <tr>
                <td class="text-right align-top">Memo:</td>
                <td colspan="3">
                  <el-input v-model="item.Memo" :disabled="!IsAuthor" @change="Customer_Maintain({ Mode: 1, Name: 'Memo', items: item })"
                            :autosize="{ minRows: 4, maxRows: 4 }" type="textarea" resize="none" size="small" class="w-full text-left" />
                </td>
              </tr>
              <tr>
                <td>Contacts</td>
              </tr>
            </tbody>
          </table>
          <div id="Detail" class="text-xs mt-1 overflow-y-auto"
                style="height:150px; border: 1px solid #cccccc; border-radius: 5px; overflow:hidden scroll;">
            <table class="table-auto">
              <thead class="sticky top-0 bg-white z-10">
                <tr>
                  <th class="w-[30px]">No</th>
                  <th class="w-[100px]">Abbr. Co./Dep.</th>
                  <th class="w-[170px]">Full Co./Dep.</th>
                  <th class="w-[65px]">Gender</th>
                  <th class="w-[120px]">Contact</th>
                  <th class="w-[110px]">Title</th>
                  <th class="w-[100px]">Phone</th>
                  <th class="w-[100px]">Fax</th>
                  <th class="w-[130px]">Memo</th>
                  <th class="w-[20px]">
                    <div :style="{ 'cursor': IsAuthor ? 'pointer' : 'default' }" v-if="IsAuthor"
                          @click.prevent="dialogAddCustomerContactVisible = true">
                      <n-icon class="cursor-pointer p-0.5" :component="AddCircle" size="16" :depth="2" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="multi-row" v-for="(item, index) in Customer_Contacts_Info" :key="index">
                <tr>
                  <td rowspan="2" style="text-align:center;">{{ item.RecNo }}</td>
                  <td>
                    <el-input v-model="item.Name" :disabled="!IsAuthor" @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Name', items: item })"
                              type="text" size="small" />
                  </td>
                  <td>
                    <el-input v-model="item.Full_Name" :disabled="!IsAuthor"
                              @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Full_Name', items: item })" type="text" size="small" />
                  </td>
                  <td>
                    <el-select v-model="item.Sex" filterable :disabled="!IsAuthor"
                                @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Sex', items: item })" size="small" placeholder=" ">
                      <el-option v-for="(option, index) in Gender_title" :key="index" :label="option.Sex" :value="option.Sex" />
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="item.Contact" :disabled="!IsAuthor"
                              @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Contact', items: item })" type="text" size="small" />
                  </td>
                  <td>
                    <el-input v-model="item.Contact_Title" :disabled="!IsAuthor"
                              @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Contact_Title', items: item })" type="text" size="small" />
                  </td>
                  <td>
                    <el-input v-model="item.Work_Phone" :disabled="!IsAuthor"
                              @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Work_Phone', items: item })" type="text" size="small" />
                  </td>
                  <td>
                    <el-input v-model="item.Fax_Number" :disabled="!IsAuthor"
                              @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Fax_Number', items: item })" type="text" size="small" />
                  </td>
                  <td rowspan="2" class="align-top">
                    <el-input v-model="item.Memo" :disabled="!IsAuthor" @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Memo', items: item })"
                              type="textarea" input-style="min-height: 50px; max-height: 50px;" resize="none" size="small" />
                  </td>
                  <td rowspan="2">
                    <div v-if="IsAuthor" @click.prevent="Customer_Contacts_Maintain({ Mode: 2, ContactID: item.ContactID })">
                      <n-icon class="cursor-pointer p-0.5" :component="Trash" size="16" :depth="2" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="white-space:nowrap;">
                    <n-icon class="p-0.5" :component="Home" size="16" :depth="2" />
                    <el-input v-model="item.Address" :disabled="!IsAuthor"
                              @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Address', items: item })" style="margin-left: 5px; width: 540px"
                              type="text" size="small" />
                  </td>
                  <td colspan="2" style="white-space:nowrap;">
                    <span style="vertical-align: top;">
                      <n-icon class="p-0.5" :component="Mail" size="16" :depth="2" />
                    </span>
                    <el-input v-model="item.Email" :disabled="!IsAuthor" @change="Customer_Contacts_Maintain({ Mode: 1, Name: 'Email', items: item })"
                              style="margin-left: 5px; width: 190px" type="text" size="small" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ApproveControl :post="approvepost"></ApproveControl>
        </el-tab-pane>
        <!-- Payment Term -->
        <el-tab-pane label="Payment Term" name="second">
          <table v-for="(item, index) in Customer_Info" :key="index" class="w-full">
            <tbody>
              <tr>
                <td class="text-right">Customer:</td>
                <td>
                  <el-input v-model="item.CustomerID" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="IsAuthor && item.CustomerID.trim().length > 0 && item.CustomerID != $route.params.CustomerID ? Customer_Maintain({ Mode: 1, Name: 'CustomerID', items: item }) : ''"
                            @keyup="$RestrictChars_Replace" type="text" size="small" class="w-full text-left" />
                </td>
              </tr>
              <tr>
                <td class="text-right">Full Name:</td>
                <td >
                  <el-input v-model="item.Customer_Name" :disabled="!IsAuthor || item.Basic_Info_Check"
                            @change="Customer_Maintain({ Mode: 1, Name: 'Customer_Name', items: item })" type="text" size="small" class="w-full text-left" />
                </td>
              </tr>
            </tbody>
          </table>
          <el-table :data="Payment_Info" :border="true" style="width: 100%;" row-key="Customer_Payment_GroupID" :expand-row-keys="expands"
                    @expand-change="expandRowHandle" :cell-style="paymentCellStyle" height="492" max-height="492" size="small">
            <el-table-column type="expand">
              <template #default="props">
                <div class="ml-12 Payment_Detail">
                  <el-table :data="props.row.children" :border="false" size="small">
                    <el-table-column width="25">
                      <template #default="scope">
                        <n-icon v-if="!props.row.Supervisor_Approver_Check" class="mt-2 cursor-pointer" :component="scope.row.isEdit ? Save : Pencil"
                                @click="handlePayemntEdit(scope.row, props.row)" size="16" :depth="2" />
                      </template>
                    </el-table-column>
                    <el-table-column width="42">
                      <template #default="scope">
                        <div class="w-full whitespace-nowrap text-right absolute left-1.5 top-1.5">
                          {{ scope.row.Rate }} %
                        </div>
                        <div class="h-6"></div>
                        <el-input v-if="scope.row.isEdit" class="inputNumberNoSpin" min="0" v-model.number="scope.row.Rate"
                                  :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                                  @change="Customer_Payment_Term_Maintain({ Mode: 1, Name: 'Rate', items: scope.row })" type="number" size="small"
                                  input-style="width: 20px; text-align: right;">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column width="18">
                      <template #default="scope">
                        <div class="w-full whitespace-nowrap absolute left-3 top-1.5">
                          {{ handlePaymentString(scope.row) }}
                        </div>
                        <div class="h-6"></div>
                        <span v-if="scope.row.isEdit">
                          %
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column width="15">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <span v-if="scope.row.isEdit" class="text-2xl" style="color: #e5e7eb;">
                          |
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column width="90" :show-overflow-tooltip="false" :highlight-current-row="false"
                                      :cell-style="{ 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'textOverflow': 'ellipsis', 'position': 'relative' }">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <el-select v-if="scope.row.isEdit" v-model="scope.row.Type" filterable
                                    :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                                    @change="Customer_Payment_Term_Maintain({ Mode: 1, Name: 'Type', items: scope.row })" size="small" placeholder=" ">
                          <el-option v-for="(option, index) in Rcv_Type" :key="index" :label="option" :value="option" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column width="100">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <el-select v-if="scope.row.isEdit" v-model="scope.row.Condition" filterable allow-create
                                    :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                                    @change="Customer_Payment_Term_Maintain({ Mode: 1, Name: 'Condition', items: scope.row })" size="small"
                                    placeholder=" ">
                          <el-option v-for="(option, index) in TT_Condition" :key="index" :label="option" :value="option" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column width="42">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <el-input v-if="scope.row.isEdit && !scope.row.Condition" class="inputNumberNoSpin" min="1" v-model.number="scope.row.Days"
                                  :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                                  @change="scope.row.Days > 0 ? Customer_Payment_Term_Maintain({ Mode: 1, Name: 'Days', items: scope.row }) : ''"
                                  type="number" size="small" input-style="width: 20px; text-align: right;" />
                      </template>
                    </el-table-column>
                    <el-table-column width="47">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <span v-if="scope.row.isEdit && !scope.row.Condition">
                          Days
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column width="15">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <span v-if="scope.row.isEdit && !scope.row.Condition" class="text-2xl" style="color: #e5e7eb;">
                          |
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column width="91">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <el-checkbox v-if="scope.row.isEdit && !scope.row.Condition" v-model="scope.row.By_Doc_Rcv" label="By Doc.Rcv."
                                      :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                                      @change="Customer_Payment_Term_Maintain({ Mode: 1, Name: 'By_Doc_Rcv', items: scope.row })" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column width="15">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <span v-if="scope.row.isEdit && !scope.row.Condition && scope.row.Type === 'T/T'" class="text-2xl" style="color: #e5e7eb;">
                          |
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column width="65">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <el-checkbox v-if="scope.row.isEdit && !scope.row.Condition && scope.row.Type === 'T/T'" v-model="scope.row.IsEOM" label="EOM"
                                      :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                                      @change="Customer_Payment_Term_Maintain({ Mode: 1, Name: 'IsEOM', items: scope.row })" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column width="42">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <el-tooltip :content="`EOM Day`">
                          <el-input v-if="scope.row.isEdit && !scope.row.Condition && scope.row.IsEOM && scope.row.Type === 'T/T'"
                                    class="inputNumberNoSpin" min="0" v-model.number="scope.row.EOM_Day"
                                    :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                                    @change="scope.row.EOM_Day >= 0 ? Customer_Payment_Term_Maintain({ Mode: 1, Name: 'EOM_Day', items: scope.row }) : ''"
                                    type="number" size="small" input-style="width: 20px; text-align: right;" />
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column width="47">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <span v-if="scope.row.isEdit && !scope.row.Condition && scope.row.IsEOM && scope.row.Type === 'T/T'">
                          Days
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column width="35">
                      <template #default="scope">
                        <div class="h-6"></div>
                        <n-icon v-if="scope.row.isEdit && IsAuthor && !props.row.Supervisor_Approver_Check" class="cursor-pointer p-0.5"
                                @click.prevent="Customer_Payment_Term_Maintain({ Mode: 2, Customer_Payment_TermID: scope.row.Customer_Payment_TermID })"
                                :component="Trash" size="16" :depth="2" />
                      </template>
                    </el-table-column>
                    <template #append>
                      <div class="h-[28px]" style="border-bottom:1px solid #cccccc;" v-if="IsAuthor && !props.row.Supervisor_Approver_Check">
                        <n-icon @click="Customer_Payment_Term_Maintain({ Mode: 0, Customer_Payment_GroupID: props.row.Customer_Payment_GroupID })"
                                class="cursor-pointer pt-1 pl-1.5" :component="AddCircle" size="20" :depth="2" />
                      </div>
                      <div style="padding:2px 10px 0px 5px;">
                        <ApproveControl :post="{ ProgramID: 391, DepartmentID: '', UserID: groupsStore.UserID, Doc_NO: props.row.Customer_Payment_GroupID, Value: 0 }"></ApproveControl>
                      </div>
                    </template>
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Financial Category" prop="Financial_Category" class="Financial_Category" width="125">
              <template #default="props">
                <el-select v-model="props.row.Financial_Category" filterable :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                            @change="Customer_Payment_Group_Maintain({ Mode: 1, Name: 'Financial_Category', items: props.row })" size="small">
                  <el-option v-for="(option, index) in FC_Options" :key="index" :label="option" :value="option" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Description" prop="Description" width="220">
              <template #default="props">
                <el-input v-model="props.row.Description" :disabled="!IsAuthor || props.row.Supervisor_Approver_Check"
                          @change="props.row.Description ? Customer_Payment_Group_Maintain({ Mode: 1, Name: 'Description', items: props.row }) : ''"
                          size="small"
                          placeholder="Payment Description" />
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>

              </template>
              <template #default="props">
                <el-tooltip :content="`Approver: ${props.row.Financial_Approver} ${props.row.Financial_Approve_Date}`"
                            :disabled="true" placement="left">
                  <el-checkbox class="p-0.5 ml-2" label="Approved" v-model="props.row.Financial_Approver_Check"
                                :disabled="true"
                                size="small" />
                </el-tooltip>
                <el-tooltip v-if="!props.row.isRate || (!props.row.isExpand && !props.row.Financial_Approver_Check)"
                            :content="!props.row.totalRate ? `Total Rate: ${props.row.totalRate}%` : !props.row.isExpand && !props.row.Financial_Approver_Check ? '請展開後確認內容再上鎖！' : ''"
                            placement="top">
                  <n-icon class="p-0.5 ml-4" :component="InformationCircleOutline" color="red" size="16" :depth="2" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="35">
              <template #header>
                <n-icon v-if="IsAuthor" @click="Customer_Payment_Group_Maintain({ Mode: 0 })" class="cursor-pointer p-0.5" :component="AddCircle"
                        size="16" :depth="2" />
              </template>
              <template #default="props">
                <n-icon v-if="IsAuthor && !props.row.Supervisor_Approver_Check"
                        @click.prevent="Customer_Payment_Group_Maintain({ Mode: 2, Customer_Payment_GroupID: props.row.Customer_Payment_GroupID })"
                        class="cursor-pointer p-0.5" :component="Trash" size="16" :depth="2" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
  <iframe id="Res_Detail" ref="Res_Detail" style="display:none; width:0px; height:0px;" src="" title="Res_Detail"></iframe>

  <el-dialog v-model="dialogRegionVisible">
    <div style="padding:6px 16px;">
      <div style="height:10px;border-bottom:1px solid #cccccc;"></div>
      <table style="width:100%; height:262px; overflow: hidden scroll; display:block;">
        <tbody>
          <tr v-for="(item, index) in Region" :key="index">
            <td style="width:250px;">
              <input type="text" :style="{ 'width': '100%' }" v-if="IsAuthor" :disabled="!IsAuthor" :value="item.Region"
                     @change="IsAuthor ? Region_Maintain({ Mode: 1, Name: 'Region', Value_New: $event.target.value, items: item }) : ''" />
              <div style="width:100%; text-align:center; cursor:default;" v-else>{{ item.Region }}</div>
            </td>
            <td style="width:25px;  ">
              <div :style="{ 'width': '100%', 'cursor': 'pointer', 'text-align': 'center' }" v-if="IsAuthor"
                   @click.prevent="IsAuthor ? Region_Maintain({ Mode: 2, items: item }) : ''">
                <i style="width:14px; height:14px; " class="fas fa-trash-alt"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-dialog>
  <el-dialog v-model="dialogCustomerVisible" :before-close="handleCustomerBeforeClose" modal-class="custom-dialog" width="250" top="5vh">
    <div class="text-xs">
      <table>
        <caption style="height:30px; padding:5px 0px 3px 0px; line-height: 2;">Create Customer Data</caption>
        <tbody>
          <tr>
            <td>CustomerID:</td>
            <td>
              <el-input type="text" size="small" :input-style="{ 'width': '100px', 'color': Check_CustomerID_Flag ? 'black' : 'red' }"
                        @keyup="$RestrictChars_Replace" @change="checkCustomerID(Customer_Insert.CustomerID)" v-model="Customer_Insert.CustomerID" />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align:center; height:15px;">
              <hr />
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:center; height:40px;">
              <el-button style="width:80px; border: 1px solid #cccccc;" v-if="Customer_Insert_Flag"
                         @click.prevent="Customer_Maintain({ Mode: 0, items: Customer_Insert })">Save</el-button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </el-dialog>
  <el-dialog v-model="dialogCreateClientVisible" modal-class="custom-dialog" width="250" top="5vh" :header-aria-level="3">
    <table class="text-xs" style="width:100%;">
      <caption>Create Client</caption>
      <tbody>
        <tr>
          <td>Client:</td>
          <td style="width:250px;">
            <el-select-v2 v-model="Client_Insert" :options="Client" filterable :disabled="!IsAuthor" size="small"></el-select-v2>
          </td>
          <td style="width:25px;">
            <div style="width:100%;" v-if="Client_Insert_Flag" @click.prevent="Client_Insert_Flag ? Client_Maintain({ Mode: 0, Client: Client_Insert }) : ''">
              <n-icon class="cursor-pointer pr-0.5" :component="AddCircle" size="16" :depth="2" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
  <el-dialog v-model="dialogAddCustomerContactVisible" modal-class="custom-dialog" width="335" top="5vh" :header-aria-level="3">
    <div class="text-xs">
      <table>
        <caption style="height:30px; padding:5px 0px 3px 0px; line-height: 2;">Add Customer Contact</caption>
        <tbody>
          <tr>
            <td class="text-right">Abbr. Co./Dep. :</td>
            <td>
              <el-input type="text" style="width:200px;" v-model="Customer_contacts_Insert.Name" size="small" />
            </td>
          </tr>
          <tr>
            <td class="text-right">Full Co./Dep. :</td>
            <td>
              <el-input type="text" style="width:200px;" v-model="Customer_contacts_Insert.Full_Name" size="small" />
            </td>
          </tr>
          <tr>
            <td class="text-right">Contact :</td>
            <td>
              <el-select style="float:left; width:85px;" v-model="Customer_contacts_Insert.Sex" filterable :disabled="!IsAuthor" size="small">
                <el-option v-for="(option, index) in Gender_title" :key="index" :label="option.Sex" :value="option.Sex" />
              </el-select>
              <el-input type="text" style="float:left; width:115px; " v-model="Customer_contacts_Insert.Contact" size="small" />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align:center; height:15px;">
              <hr />
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:center; height:40px;">
              <el-button style="width:80px; border: 1px solid #cccccc;" v-if="IsAuthor && Customer_contacts_Insert_Flag"
                         @click.prevent="IsAuthor && Customer_contacts_Insert_Flag ? Customer_Contacts_Maintain({ Mode: 0 }) : ''" size="small">Add</el-button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </el-dialog>
</template>

<script setup>
import ComptPermission from '@/components/pages/Public/Permission.vue' //從指定路徑導入名為 ComptPermission 的組件 (權限控制相關的元件)
import ApproveControl from '@/components/pages/Public/Approve_Control.vue' //從指定路徑導入名為 Approve_Control 的組件 (簽核流程相關的元件)
import axios from 'axios' //導入 axios 用於發送 HTTP 請求, 進行 API 調用
import { ref, reactive, onMounted, computed } from 'vue' //從 Vue Composition API 導入 ref、reactive、onMounted、computed 這些函數
/* ref:用於定義基本的響應式數據。reactive:用於定義複雜的響應式數據結構。 onMounted:一個生命週期鉤子，在組件掛載後執行的函數。computed:用於定義計算屬性，根據其他響應式數據自動計算其值。 */
import { NIcon } from 'naive-ui' //從 Naive UI 導入 NIcon 組件，用於顯示圖標。
import { Trash, Mail, PaperPlaneOutline, AddCircle, Pencil, Home, InformationCircleOutline, Save } from '@vicons/ionicons5' //從 @vicons/ionicons5 導入多個圖標
import { useRoute, useRouter } from 'vue-router' //導入 Vue Router 的 useRoute (獲取當前路由的詳細信息) 和 useRouter (用於程序導航，例如在應用內部跳轉路由) 函數，用於獲取路由資訊和導航
import { useGroupsStore } from '@/stores/store' //從指定路徑導入 useGroupsStore 函數，這是一個 Vuex store，用於狀態管理包含一些共享的狀態和方法。
import commonFunction from '@/composables/commonFunction' //從指定路徑導入 commonFunction 模組, 包含一些通用的函數或邏輯，這些函數可以在元件中重複使用。

/**  設置和初始化 **/
/* 路由相關 */
const route = useRoute() //獲取當前路由的詳細信息，這樣可以訪問路由參數和其他屬性。
const router = useRouter() //獲取路由器實例，用於導航操作，如跳轉路由。

/* Vuex Store */
const groupsStore = useGroupsStore() //獲取 Vuex store 實例，用於訪問和管理全局狀態。

/* 通用函數 */
const { hostname, host_cors, $CheckGroup, $RestrictChars, $RestrictChars_Replace, $CheckDate, $FillUp_Date } = commonFunction()
/*
從 commonFunction 模組中解構出多個函數和變量：
。hostname 和 host_cors：可能是用於網絡請求的主機名和 CORS 配置。
。$CheckGroup：可能是檢查用戶組的函數。
。$RestrictChars 和 $RestrictChars_Replace：可能是限制和替換字符的函數。
。$CheckDate：可能是檢查日期格式的函數。
。$FillUp_Date：可能是填充日期的函數。
*/

/* 定義響應式數據 */
const post = reactive({ Beta: false, Program_Name: 'Customer', IDValue: route.params.CustomerID, Icons: true })
const approvepost = reactive({ ProgramID: route.meta.ProgramID, DepartmentID: '', UserID: groupsStore.UserID, Doc_NO: route.params.CustomerID, Value: 0 })
/*
reactive 定義了一個響應式對象 post，包含以下屬性：
。Beta：布爾值，默認為 false。
。Program_Name：字符串，設置為 'Customer'。
。IDValue：從路由參數中獲取的客戶 ID。
Icons：布爾值，默認為 true。
*/

/* 定義事件和響應式變量 */
const emit = defineEmits(['closeDrawer']) //定義事件 emit：defineEmits(['closeDrawer']) 定義了一個事件，名為 closeDrawer，用於在組件中發出事件。
const tabActiveName = ref('first')  //響應式變量 tabActiveName：ref 定義了一個響應式變量 tabActiveName，默認值為 'first'，可能用於追踪當前活動的標籤頁。

/* 設置生命周期鉤子 */
/* onMounted 是 Vue Composition API 的生命周期鉤子，當組件掛載到 DOM 中後執行一次該函數中的代碼。 */
onMounted(() => {
  if (route.params.CustomerID === 'Insert') {
    dialogCustomerVisible.value = true
  } else {
    getCustomer_Info(0)
    getPaymentTerm()
    getRegion()
    getCurrency()
    Load_Department()
    getClient()
  }
  if (groupsStore.UserID === 'wade-chang') {
    tabActiveName.value = 'second'
  }
  if (groupsStore.UserID === 'darren-chang') {
    tabActiveName.value = 'second'
  }

  route.params.Mode == 0 ? tabActiveName.value = 'first' : tabActiveName.value = 'second';
  expands.value.push(route.params.GroupID);
  

})
/*
檢查路由參數 CustomerID：
if (route.params.CustomerID === 'Insert')：檢查當前路由參數 CustomerID 是否等於 'Insert'。
如果是，設置 dialogCustomerVisible 的值為 true，這可能是顯示一個客戶對話框。
否則，調用多個函數來獲取客戶信息和相關數據：
getCustomer_Info(0)：獲取客戶信息，參數 0 可能表示獲取所有信息或某個特定狀態的信息。
getPaymentTerm()：獲取付款條件信息。
getRegion()：獲取地區信息。
getCurrency()：獲取貨幣信息。
getClient()：獲取客戶相關信息。

檢查用戶 ID 設置活動標籤頁：
if (groupsStore.UserID === 'wade-chang') 和 if (groupsStore.UserID === 'darren-chang')：檢查當前用戶的 ID 是否為 wade-chang 或 darren-chang。
如果是，設置 tabActiveName 的值為 'second'，這可能用於設置當前活動的標籤頁。
*/

/* 定義響應式變量和對象 */
const dialogCustomerVisible = ref(false)
const Customer_Insert = reactive({ CustomerID: '' })
const Check_CustomerID_Flag = ref(false)
/*
dialogCustomerVisible：
使用 ref 定義的一個布爾型響應式變量。
初始值為 false。
用於控制客戶對話框的可見性。當值為 true 時，對話框將顯示；當值為 false 時，對話框將隱藏。

Customer_Insert：
使用 reactive 定義的一個響應式對象。
初始值為 { CustomerID: '' }。
用於存儲客戶插入操作的數據，在這裡特別是 CustomerID。這可能用於插入新客戶時填寫客戶 ID。

Check_CustomerID_Flag：
使用 ref 定義的一個布爾型響應式變量。
初始值為 false。
用於標記客戶 ID 檢查的狀態。例如，當檢查客戶 ID 是否有效時，可以設置為 true 或 false，以指示檢查結果或進度。
*/

/* 定義異步函數 checkCustomerID */
const checkCustomerID = async (CustomerID) => {
  Check_CustomerID_Flag.value = false
  if (CustomerID.length <= 0) {
    return
  }
  try {
    let param = { CustomerID: CustomerID }
    const response = await axios.post(`/api/Sales/Customer/Check_CustomerID`, param)
    Check_CustomerID_Flag.value = response.data.Flag
  } catch (error) {
    console.log(error)
  }
}
/*
Check_CustomerID_Flag.value = false：
初始化 Check_CustomerID_Flag 為 false，表示檢查尚未完成。

if (CustomerID.length <= 0) { return }：
如果 CustomerID 的長度小於或等於 0，則直接返回，不進行後續檢查。

try 區塊：
試圖發送 HTTP POST 請求來檢查客戶 ID。
let param = { CustomerID: CustomerID }：創建請求參數對象，包含 CustomerID。
const response = await axios.post(/api/Sales/Customer/Check_CustomerID, param)：發送 POST 請求到 /api/Sales/Customer/Check_CustomerID，並等待響應。
Check_CustomerID_Flag.value = response.data.Flag：根據響應數據設置 Check_CustomerID_Flag 的值。

catch (error) 區塊：
捕獲和處理異常，如果發生錯誤，則將錯誤信息打印到控制台。
*/

/* 定義異步函數 handleCustomerBeforeClose */
const handleCustomerBeforeClose = async () => {
  emit('closeDrawer')
}
/*
定義一個異步函數，用於在關閉客戶對話框之前執行的操作。
emit('closeDrawer')：觸發 closeDrawer 事件，通常用於通知父組件關閉抽屜或對話框。
*/

/* 定義響應式變量 */
const Customer_Info = ref([]) //使用 ref 定義的一個響應式變量，初始值為空數組 []，用於存儲客戶的基本信息。
const Customer_Contacts_Info = ref([]) //使用 ref 定義的一個響應式變量，初始值為空數組 []，用於存儲客戶聯繫人的信息。
const Agent_Info = ref([]) //使用 ref 定義的一個響應式變量，初始值為空數組 []，用於存儲代理人的信息。
const Client_Info = ref([]) //使用 ref 定義的一個響應式變量，初始值為空數組 []，用於存儲客戶端的信息。
const Payment_Info = ref([]) //使用 ref 定義的一個響應式變量，初始值為空數組 []，用於存儲付款信息。
const Data_Updater = ref('') //使用 ref 定義的一個響應式變量，初始值為空字符串 ''，用於存儲數據更新者的名字或 ID。
const Data_Update = ref('') //使用 ref 定義的一個響應式變量，初始值為空字符串 ''，用於存儲數據的更新日期。
const Create_Date = ref('') //使用 ref 定義的一個響應式變量，初始值為空字符串 ''，用於存儲創建日期。
const Basic_Info_Check = ref(0) //使用 ref 定義的一個響應式變量，初始值為 0，用於存儲基本信息檢查的狀態，這可能是一個狀態碼或標記，指示基本信息是否已檢查或通過檢查。

/* 定義異步函數 getCustomer_Info */
const getCustomer_Info = async (Mode) => {
  let params = { Mode: Mode, CustomerID: route.params.CustomerID } //設置請求參數，包括 Mode 和 CustomerID。
  await axios.post(`/api/Sales/Customer/Customer_Info`, params) //發送 POST 請求到 /api/Sales/Customer/Customer_Info，傳遞 params 參數。
    .then(async (response) => { //then 回調函數：當請求成功時執行以下操作
      // Mode == 0 Get Customer , Customer Contacts And Client Data
      // Mode == 1 Get Customer Data
      // Mode == 2 Get Customer Contacts Data
      // Mode == 3 Get Agent and Client Data
      // Mode == 4 Get Payment Data
      switch (Mode) {
        case 0:
          Customer_Info.value = response.data.Customer_Info
          Customer_Contacts_Info.value = response.data.Customer_Contacts_Info
          Agent_Info.value = response.data.Agent_Info
          Client_Info.value = response.data.Client_Info
          Payment_Info.value = await handlePaymentGroupData(response.data.Payment_Info)
          Data_Updater.value = response.data.Customer_Info[0].Data_Updater;
          Data_Update.value = response.data.Customer_Info[0].Data_Update;
          Create_Date.value = response.data.Customer_Info[0].Create_Date;
          Basic_Info_Check.value = response.data.Customer_Info[0].Basic_Info_Check
          break
        /* 獲取客戶信息、聯繫人信息、代理人信息、客戶端信息和付款信息，並將這些數據存儲在相應的變量中。
同時設置 Data_Updater、Data_Update、Create_Date 和 Basic_Info_Check。 */
        case 1:
          Customer_Info.value = response.data.Customer_Info
          Data_Updater.value = response.data.Customer_Info[0].Data_Updater;
          Data_Update.value = response.data.Customer_Info[0].Data_Update;
          Create_Date.value = response.data.Customer_Info[0].Create_Date;
          Basic_Info_Check.value = response.data.Customer_Info[0].Basic_Info_Check
          break
        /* 獲取客戶信息，並設置 Data_Updater、Data_Update、Create_Date 和 Basic_Info_Check。 */
        case 2:
          Customer_Contacts_Info.value = response.data.Customer_Contacts_Info
          break
        /* 獲取客戶聯繫人信息。 */
        case 3:
          Agent_Info.value = response.data.Agent_Info
          Client_Info.value = response.data.Client_Info
          break
        //獲取代理人信息和客戶端信息。
        case 4:
          Payment_Info.value = await handlePaymentGroupData(response.data.Payment_Info)
          break
        //獲取付款信息，並通過 handlePaymentGroupData 處理後設置 Payment_Info。
        default:
          break
        //對於未定義的 Mode 值，什麼也不做。
      }
    })
    .catch(function (error) {
      console.log(error)
      //捕獲和處理請求中的錯誤，將錯誤信息打印到控制台。
    })
}


/* 函數定義 */
const handlePaymentGroupData = async (data) => {
  // 創建一個空物件用於存放轉換後的資料
  const result = {};
  // 迭代原始資料陣列, 創建空物件 result：用於存放轉換後的資料。
  data.forEach(item => { //迭代原始資料陣列 data：使用 forEach 方法迭代每一個 item。
    // 獲取父層資料的關鍵屬性, 取父層資料的關鍵屬性 key：使用 Customer_Payment_GroupID 作為鍵名。

    const key = `${item.Customer_Payment_GroupID}`;
    // 如果父層資料尚未存在於結果物件中，則創建一個新的父層物件, 檢查父層資料是否存在於 result 中：如果不存在，創建一個新的父層物件，並初始化相關屬性。
    if (!result[key]) {
      result[key] = {
        CustomerID: item.CustomerID,
        Financial_Category: item.Financial_Category,
        Description: item.Description,
        Financial_Approver: item.Financial_Approver,
        Financial_Approver_Check: item.Financial_Approver_Check,
        Financial_Approve_Date: item.Financial_Approve_Date,
        Supervisor: item.Supervisor,
        Supervisor_Approver_Check: item.Supervisor_Approver_Check,
        Supervisor_Approved_Date: item.Supervisor_Approved_Date,
        cpg_Data_Updater: item.cpg_Data_Updater,
        cpg_Data_Update: item.cpg_Data_Update,
        Customer_Payment_GroupID: item.Customer_Payment_GroupID,
        isExpand: false, // 判斷目前Children是否被展開
        isRate: false,  // 判斷 Rate 加總是否為 100, 初始設置為 false
        totalRate: 0,
        children: [],
      };
    }
    if (item.Customer_Payment_TermID) {
      // 創建子層資料物件，將其餘屬性放入子層的物件中, 檢查 item 是否包含 Customer_Payment_TermID：如果存在，創建子層資料物件，並將其餘屬性放入子層物件中。
      const childData = {
        Customer_Payment_TermID: item.Customer_Payment_TermID,
        Rate: Math.round(item.Rate * 100),
        Type: item.Type,
        Condition: item.Condition,
        Days: item.Days,
        By_Doc_Rcv: item.By_Doc_Rcv,
        IsEOM: item.IsEOM,
        EOM_Day: item.EOM_Day,
        cpt_Data_Updater: item.cpt_Data_Updater,
        cpt_Data_Update: item.cpt_Data_Update,
        isEdit: false
      };
      // 將子層資料物件添加到父層的 children 屬性中, 使用 push 方法將子層物件添加到對應的父層物件的 children 陣列中。
      result[key].children.push(childData);
    }
  });
  // 計算 isRate
  for (const key in result) {
    const totalRate = result[key].children.reduce((sum, child) => sum + child.Rate, 0);
    result[key].isRate = totalRate === 100;
    result[key].totalRate = totalRate;
    /* 遍歷 result 中的每個父層物件，計算其 children 中所有子層的 Rate 總和。
如果總和等於 100，則將 isRate 設置為 true，否則設置為 false。同時設置 totalRate 屬性為 Rate 的總和。 */
  }
  // 將結果轉換為陣列形式, 使用 Object.values(result) 將結果物件轉換為陣列形式。
  const finalResult = Object.values(result);
  // 輸出最終結果 finalResult：最終結果是包含所有父層和子層資料的陣列。
  return finalResult
}

/* 創建響應式狀態 */
const expands = ref([]) //expands：一個響應式的空數組，用於存儲當前展開的行的Customer_Payment_GroupID。
/* 定義expandRowHandle函數 */
const expandRowHandle = async (row, expandedRows) => {
  if (expandedRows.length > 0) { //檢查expandedRows數組的長度, 如果expandedRows數組的長度大於0，則執行以下邏輯，
    //console.log(expandedRows)  //並將expandedRows輸出到控制台。
    //for(var i=0;i<expandedRows.length;i++){
    //  expandedRows[i].isExpand = i == 0 ? false : true;
    //}

    /* 處理展開狀態 */
    if (expandedRows.length >= 2 && !expandedRows[1].hasOwnProperty('isExpand')) {
      expandedRows[0].isExpand = true;
    }
    //如果展開的行數大於等於2，且第二個元素沒有isExpand屬性，則將第一個元素的isExpand屬性設置為true。
    if (expandedRows.length >= 2 && expandedRows[1].hasOwnProperty('isExpand')) {
      expandedRows[0].isExpand = false;
      expandedRows[1].isExpand = true;
    }
    //如果展開的行數大於等於2，且第二個元素有isExpand屬性，則將第一個元素的isExpand屬性設置為false，第二個元素的isExpand屬性設置為true。

    if (expandedRows.length == 0 || expandedRows.length == 1) {
      expandedRows[0].isExpand = true;
    }
    //如果展開的行數為0或1，則將第一個元素的isExpand屬性設置為true。

  } else {
    row.isExpand = false
  }
  //如果expandedRows數組為空，則將當前行的isExpand屬性設置為false。

  /*  更新expands狀態 */
  if (expands.value.includes(row.Customer_Payment_GroupID)) {
    expands.value = expands.value.filter(val => val !== row.Customer_Payment_GroupID);
  } else {
    expands.value.length = 0
    expands.value.push(row.Customer_Payment_GroupID);
  }
  /*
  檢查當前行的Customer_Payment_GroupID是否在expands數組中。
  如果在數組中，則將其從數組中移除。
  如果不在數組中，則清空expands數組，並將當前行的Customer_Payment_GroupID添加到數組中。
  */
}

const paymentCellStyle = ({ row }) => { //paymentCellStyle函數接收一個對象參數，這個對象包含一個row屬性。row代表當前表格行的數據。
  if (!row.Financial_Approver_Check) {  //函數檢查當前行的Financial_Approver_Check屬性是否為假（false、null、undefined或0等）。
    return { 'background-color': 'rgb(255 201 92)' } //如果Financial_Approver_Check為假，函數返回一個對象，該對象設置背景顏色為rgb(255 201 92)（一種黃色）。
  }
  return {} //如果Financial_Approver_Check為真，函數返回一個空對象，即不設置任何樣式。
}

/* 函數定義 */
//定義了一個名為 Customer_Maintain 的異步函數，用於處理客戶的新增、修改和刪除操作。根據傳入的對象 obj 的 Mode 屬性決定要執行的操作。
const Customer_Maintain = async (obj) => {
  let result = false //result：一個布爾值，初始設置為 false，用於標記操作是否成功。
  let CustomerID = obj.Mode == 0 ? obj.items.CustomerID.trim().replace($RestrictChars, '').substr(0, 15).toUpperCase() : route.params.CustomerID //CustomerID：根據操作模式設置客戶ID。如果模式是新增（Mode == 0），從 obj.items.CustomerID 中提取並處理客戶ID；否則使用路由參數中的 CustomerID。
  let params = { Mode: obj.Mode, CustomerID: CustomerID } //params：一個對象，包含操作模式和客戶ID，將用於發送請求。
  // req.body.Mode === 0 表示新增
  // req.body.Mode === 1 表示修改
  // req.body.Mode === 2 表示刪除
  switch (obj.Mode) {
    case 0: //新增（Mode == 0）沒有額外的處理，直接跳過。
    case 2: //刪除（Mode == 2）沒有額外的處理，直接跳過。
      break
    case 1: //修改（Mode == 1）
      let Value = '' //Value：初始設置為空字符串，用於存儲字段的值。
      switch (obj.Name) { //根據 obj.Name 確定需要處理的字段
        case 'CustomerID':
          params['Name'] = obj.Name
          Value = obj.items[obj.Name].trim().substr(0, 15).toUpperCase()
          CustomerID = Value
          break
        /* 設置 params['Name'] 為 CustomerID。從 obj.items 中提取並處理 CustomerID，更新 CustomerID 和 Value。 */
        case 'Unpay':
        case 'Establish_Date':
          params['Name'] = obj.Name
          Value = obj.items[obj.Name]
          Value = Value.length > 0 ? $FillUp_Date(Value) : null;
          obj.items[obj.Name] = Value;
          break
        /* 設置 params['Name'] 為相應的字段名稱。
        從 obj.items 中提取值，並根據條件使用 $FillUp_Date 函數處理，更新 obj.items 和 Value。 */
        case 'Supervisor_Approver_Check':
        case 'Financial_Approver_Check':
        case 'History_Check':
          params['Name'] = obj.Name
          Value = obj.items[obj.Name] ? 1 : 0
          break
        /* 設置 params['Name'] 為相應的字段名稱。
        將 obj.items 中的布爾值轉換為數字 1 或 0，更新 Value。 */
        default:
          params['Name'] = obj.Name
          Value = obj.items[obj.Name]
          break
        /* 設置 params['Name'] 為相應的字段名稱。
        直接從 obj.items 中提取值，更新 Value。 */
      }
      params.Value = Value
      break
    /* 最後，將處理後的 Value 設置到 params 中。 */
    default:
      break
  }

  /* 確認刪除操作 */
  obj.Mode == 2 ? result = confirm(`Are you sure you want to delete CustomerID [${CustomerID}] data ?`) : ''
  if ((obj.Mode == 2 && result == false)) {
    return
  }
  /* 如果 obj.Mode 為 2（表示刪除操作），則彈出確認對話框，確認用戶是否確定刪除該客戶數據。如果用戶取消刪除操作 (result 為 false)，則函數提前返回，不執行後續的操作。 */

  /* 發送請求並處理響應 */
  try {
    const response = await axios.post(`/api/Sales/Customer/Customer_Maintain`, params) //發送請求：使用 axios.post 方法向後端發送請求，URL 為 /api/Sales/Customer/Customer_Maintain，携帶 params 數據。
    let Flag = response.data.Flag //處理響應：根據服務器返回的 response.data.Flag 判斷操作是否成功。根據 obj.Mode 的不同值域，設置不同的成功或失敗信息（Msg）。 */
    let Msg = ''
    // console.log(response.data)
    switch (obj.Mode) {
      case 0:
        Msg = `Insert Customer Data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 1:
        Msg = `Update [${obj.Name}] field data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 2:
        Msg = `Delete Customer Data ${Flag ? 'Success!' : 'fail!'}`
        break
      default:
        break
    }
    if (Flag) { //如果操作成功（Flag 為 true）
      window.$message.success(Msg) //使用 window.$message.success 方法顯示成功信息。
      switch (obj.Mode) { //根據 obj.Mode 的值域執行相應的後續處理：
        case 0:
          await router.replace({ name: 'Customer', params: { CustomerID: CustomerID } })
          getCustomer_Info(0)
          getPaymentTerm()
          getRegion()
          getCurrency()
          getClient()
          dialogCustomerVisible.value = false
          break
        /* 新增（Mode == 0）：
          使用 router.replace 方法導航到名稱為 Customer 的路由，並傳遞客戶ID參數。
          分別調用 getCustomer_Info、getPaymentTerm、getRegion、getCurrency、getClient 函數。
          設置 dialogCustomerVisible.value 為 false，關閉客戶對話框。 */
        case 1:
          switch (obj.Name) {
            case 'CustomerID':
              await router.replace({ name: 'Customer', params: { CustomerID: CustomerID } })
              getCustomer_Info(0)
              break
            case 'Supervisor_Approver_Check':
            case 'Financial_Approver_Check':
              await getCustomer_Info(1)
              autoSendMail(0)
              break
            default:
              getCustomer_Info(1)
              break
          }
          break
        /* 修改（Mode == 1）：
        根據 obj.Name 的不同值域執行相應的後續處理：
        如果是 CustomerID，類似新增操作，重新獲取客戶信息。
        如果是 Supervisor_Approver_Check 或 Financial_Approver_Check，調用 getCustomer_Info 和 autoSendMail 函數。
        其他情況下，只調用 getCustomer_Info 函數。 */
        case 2:
          router.push({ name: 'Customer_List' })
          break
        /* 使用 router.push 方法導航到名稱為 Customer_List 的路由，顯示客戶列表。 */
      }
    } else {
      getCustomer_Info(1)
      window.$message.error(Msg)
    }
    /* 失敗處理：
       如果操作失敗（Flag 為 false）：
       使用 window.$message.error 方法顯示錯誤信息。
       不同的操作模式可能會調用 getCustomer_Info 函數來重新加載客戶信息。 */

  } catch (error) {
    console.log(error)
  }
  /*錯誤處理：
    使用 try...catch 捕獲可能的異常情況，並將錯誤信息輸出到控制台。 */
}

/* 定義響應式狀態 */
const dialogAddCustomerContactVisible = ref(false) //控制對話框顯示的狀態 dialogAddCustomerContactVisible：一個布爾值，初始設置為 false。用於控制是否顯示添加客戶聯絡人的對話框。
const Customer_contacts_Insert = reactive({ Name: '', Full_Name: '', Sex: 'Mr.', Contact: '' },) //添加客戶聯絡人的表單數據
/*Customer_contacts_Insert：一個響應式對象，包含添加客戶聯絡人所需的表單字段：
Name：聯絡人的名字，初始值為空字符串。
Full_Name：聯絡人的全名，初始值為空字符串。
Sex：聯絡人的性別，初始值為 Mr.。
Contact：聯絡人的聯繫方式，初始值為空字符串。*/

const Gender_title = ref([{ Sex: '' }, { Sex: 'Mr.' }, { Sex: 'Miss' }, { Sex: 'Mrs.' }, { Sex: 'Ms.' }]) //性別選項列表 Gender_title：一個響應式數組，用於存儲性別選項。每個選項是一個對象，包含一個 Sex 屬性。選項包括空字符串、Mr.、Miss、Mrs. 和 Ms.。

const Customer_Contacts_Maintain = async (obj) => { //Customer_Contacts_Maintain 的異步函數，用於處理客戶聯絡人的新增、修改和刪除操作
  let result = false  //result：一個布爾值，初始設置為 false，用於標記操作是否成功。
  let CustomerID = route.params.CustomerID  //CustomerID：從路由參數中提取客戶ID。
  let params = { Mode: obj.Mode, CustomerID: CustomerID } //params：一個對象，包含操作模式和客戶ID，將用於發送請求。
  // req.body.Mode === 0 表示新增
  // req.body.Mode === 1 表示修改
  // req.body.Mode === 2 表示刪除
  switch (obj.Mode) {
    case 0:
      for (var key in Customer_contacts_Insert) {
        params[key] = Customer_contacts_Insert[key]
      }
      break
    /* 從 Customer_contacts_Insert 對象中提取所有鍵值對，並將其添加到 params 對象中。這些字段包含聯絡人的詳細信息，例如姓名、性別和聯繫方式。 */
    case 1:
      let Value = ''
      params['Name'] = obj.Name
      Value = obj.items[obj.Name]
      params.Value = Value
      params.ContactID = obj.items.ContactID
      break
    //設置 params['Name'] 為要修改的字段名稱。從 obj.items 中提取對應字段的值並設置到 params.Value。設置 params.ContactID 為聯絡人的ID，用於標識要修改的聯絡人。
    case 2:
      params.ContactID = obj.ContactID
      break
    //設置 params.ContactID 為要刪除的聯絡人的ID。
    default:
      break
  }

  /* 確認刪除操作 */
  obj.Mode == 2 ? result = confirm(`Are you sure you want to delete Contact data ?`) : ''
  if ((obj.Mode == 2 && result == false)) {
    return
  }
  /* 如果 obj.Mode 為 2（表示刪除操作），則彈出確認對話框，確認用戶是否確定刪除聯絡人數據。
     如果用戶取消刪除操作 (result 為 false)，則函數提前返回，不執行後續的操作。 */

  /* 發送請求並處理響應 */
  try {
    const response = await axios.post(`/api/Sales/Customer/Customer_Contacts_Maintain`, params) //發送請求：使用 axios.post 方法向後端發送請求，URL 為 /api/Sales/Customer/Customer_Contacts_Maintain，攜帶 params 數據。
    /* 處理響應： */
    let Flag = response.data.Flag //根據服務器返回的 response.data.Flag 判斷操作是否成功。
    let Msg = '' //根據 obj.Mode 的不同值域，設置不同的成功或失敗信息（Msg）。
    // console.log(response.data)

    switch (obj.Mode) {
      case 0: //新增（Mode == 0）
        Msg = `Insert Customer Contact Data ${Flag ? 'Success!' : 'fail!'}`
        break
      /* 調用 getCustomer_Info(2) 函數更新客戶聯絡人信息。 */
      case 1: //修改（Mode == 1）
        Msg = `Update [${obj.Name}] field data ${Flag ? 'Success!' : 'fail!'}`
        break
      /* 目前沒有特別處理，只顯示成功信息。 */
      case 2: //刪除（Mode == 2）
        Msg = `Delete Customer Contact Data ${Flag ? 'Success!' : 'fail!'}`
        break
      /* 調用 getCustomer_Info(2) 函數更新客戶聯絡人信息。 */
      default:
        break
    }
    /* 成功處理 */
    if (Flag) {
      window.$message.success(Msg)
      switch (obj.Mode) {
        case 0:
        case 2:
          getCustomer_Info(2)
          break
        case 1:
          break
      }
    }
    /* 失敗處理 */
    else {
      getCustomer_Info(2)
      window.$message.error(Msg)
    }
    /* 如果操作失敗（Flag 為 false）：
       使用 window.$message.error 方法顯示錯誤信息。
       調用 getCustomer_Info(2) 函數重新加載客戶聯絡人信息。 */
  }
  /* 錯誤處理 */
  catch (error) {
    console.log(error)
    window.$message.error('Data save fail!')
  }
  /*使用 try...catch 捕獲可能的異常情況，並將錯誤信息輸出到控制台。
    使用 window.$message.error 方法顯示數據保存失敗的錯誤信息。 */
}

/* 定義響應式狀態 */
const FC_Options = ref(['Develop', 'Sales']) //FC_Options：一個響應式數組，包含兩個選項 'Develop' 和 'Sales'。這些選項可以用於選擇功能選項（例如，開發部門和銷售部門）。
const Rcv_Type = ref(['T/T', 'L/C', 'OA', 'CAD', 'D/P', 'D/A', 'CASH']) //一個響應式數組，包含不同的收款方式選項
const TT_Condition = ref(['', 'DEPOSIT', 'AT SIGHT', 'BEFORE SHIPMENT']) //一個響應式數組，包含不同的電匯條件選項

/* 函數定義  handlePaymentString 的函數，用於根據給定的付款條件生成描述字符串*/
const handlePayemntEdit = async (row, group) => { //row：當前行的數據對象。 group：包含當前行的數據組對象。
  row.isEdit = !row.isEdit  //切換當前行的編輯狀態 將當前行的 isEdit 狀態進行反轉。如果當前行是可編輯狀態，則設置為不可編輯，反之亦然。
  group.children.forEach(item => { //關閉其他行的編輯狀態
    if (row.Customer_Payment_TermID !== item.Customer_Payment_TermID) {
      item.isEdit = false;
    }
  });
  /*遍歷 group.children，對每一個子項（item）進行檢查。
如果 item 的 Customer_Payment_TermID 與當前行的 Customer_Payment_TermID 不相同，則將該 item 的 isEdit 狀態設置為 false，即關閉其他行的編輯狀態。*/
  if (row.isEdit === false) { //如果當前行編輯狀態設置為 false，則刷新數據
    getCustomer_Info(4)
  }
  /* 如果當前行的 isEdit 狀態被設置為 false，則調用 getCustomer_Info(4) 函數，刷新顯示的客戶信息。 */
}

/*函數定義*/
const handlePaymentString = (row) => { //row：包含付款條件信息的對象。
  const { Type, Days, Condition, By_Doc_Rcv, IsEOM, EOM_Day } = row; //從 row 對象中提取 Type、Days、Condition、By_Doc_Rcv、IsEOM 和 EOM_Day 屬性。
  let result = `${Type}`; //將 Type 作為初始字符串。

  if (Days > 0 && (Condition === '')) { //如果 Days 大於 0 且 Condition 為空，則將天數添加到結果字符串中。
    result += ` ${Days} DAYS`;
  }

  if (Condition === '') {  //處理條件為空的情況
    result += By_Doc_Rcv === true ? ' AFTER DOC. RECEIVED DATE' : ' AFTER ON BOARD DATE'
    if (Type === 'T/T') {
      result += IsEOM === true ? ' END OF MONTH' : ''
      result += (IsEOM === true && EOM_Day > 0) ? ` + ${EOM_Day} DAYS` : ''
    }
  }
  /*如果 Condition 為空，根據 By_Doc_Rcv 的值決定是“AFTER DOC. RECEIVED DATE”還是“AFTER ON BOARD DATE”。
  如果 Type 為 T/T，則根據 IsEOM 的值添加“END OF MONTH”。
  如果 IsEOM 為 true 且 EOM_Day 大於 0，則添加 EOM_Day 天數。*/
  else {  //處理條件不為空的情況
    result += ` ${Condition}`
  }
  /*如果 Condition 不為空，則直接將 Condition 添加到結果字符串中。*/

  return result; /*返回結果字符串*/
};
/*這段代碼根據給定的付款條件生成一個描述字符串。它首先處理天數和條件為空的情況，然後根據其他屬性生成相應的描述。最終返回生成的付款條件描述字符串。這樣可以動態生成適當的付款條件描述，用於顯示或記錄。*/

/*函數定義
handleDescriptionBlur 的異步函數，用於在描述輸入框失去焦點時處理描述值。如果描述值為空，則自動設置一個默認描述並調用維護函數。*/
const handleDescriptionBlur = async (index, value, Customer_Payment_GroupID) => { //index：當前描述項的索引。 value：當前輸入框的值。 Customer_Payment_GroupID：客戶付款組的ID。
  if (!value) { //如果 value 為空，則執行接下來的步驟。
    const items = { //設置默認描述
      Customer_Payment_GroupID,
      Description: `Payment Term ${index}`
    }
    /*創建一個對象 items，其中包含 Customer_Payment_GroupID 和默認的 Description 值，格式為 Payment Term ${index}。 */
    Customer_Payment_Group_Maintain({ Mode: 1, Name: 'Description', items }) //調用Customer_Payment_Group_Maintain維護函數, 傳遞包含 Mode、Name 和 items 的對象。Mode: 1 表示修改操作, Name: 'Description' 指定要修改的字段是描述。
  }
}

/*代碼定義了一個名為 Customer_Payment_Group_Maintain 的異步函數，用於維護客戶付款組信息。根據傳入的 obj 參數的 Mode，可以執行新增、修改或刪除操作 */
const Customer_Payment_Group_Maintain = async (obj) => { //obj：包含維護操作相關信息的對象。
  let result = false  //result：初始化為 false，可能在後續操作中用於表示操作結果。
  let CustomerID = route.params.CustomerID //CustomerID：從路由參數中獲取 CustomerID。
  let params = { Mode: obj.Mode, CustomerID: CustomerID } //params：用於存儲發送到 API 的參數對象，初始包含操作模式和 CustomerID。

  // req.body.Mode === 0 表示新增
  // req.body.Mode === 1 表示修改
  // req.body.Mode === 2 表示刪除
  //Mode：操作模式（0：新增，1：修改，2：刪除）。

  switch (obj.Mode) {
    case 0: //如果模式為0新增，不做任何處理。
      break
    case 1:
      let Value = ''
      switch (obj.Name) { //Name：需要修改的字段名。
        case 'Supervisor_Approver_Check':
        case 'Financial_Approver_Check':
          Value = obj.items[obj.Name] ? 1 : 0 //包含具體數據的對象。
          break
        default:
          Value = obj.items[obj.Name]
          break
      }
      params.Value = Value
      params['Name'] = obj.Name
      params.Customer_Payment_GroupID = obj.items.Customer_Payment_GroupID
      break
    /*如果模式為1修改，根據 obj.Name 確定要修改的值。
    Supervisor_Approver_Check 和 Financial_Approver_Check 字段的值根據布爾值轉換為 1 或 0。
    其他字段直接使用 obj.items[obj.Name] 的值。
    將 Value、Name 和 Customer_Payment_GroupID 添加到 params 對象。 */
    case 2:
      params.Customer_Payment_GroupID = obj.Customer_Payment_GroupID
      break
    /*如果模式為2刪除，僅將 Customer_Payment_GroupID 添加到 params 對象。 */
    default:
      break
    /*對於其他未知模式，不做任何處理。 */
  }

  /*刪除操作確認*/
  obj.Mode == 2 ? result = confirm(`Are you sure you want to delete Payment Group data ?`) : ''
  if ((obj.Mode == 2 && result == false)) {
    return
  }
  /*如果操作模式為2刪除，彈出確認對話框。如果用戶選擇取消，則直接返回，不執行後續操作。 */

  /*發送 API 請求並處理回應*/
  try {
    const response = await axios.post(`/api/Sales/Customer/Customer_Payment_Group_Maintain`, params) //發送 POST 請求到 /api/Sales/Customer/Customer_Payment_Group_Maintain，傳遞 params。
    let Flag = response.data.Flag //根據回應中的 Flag 設置提示信息 Msg。
    let Msg = ''
    switch (obj.Mode) {
      case 0:
        Msg = `Insert Customer Payment Group Data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 1:
        Msg = `Update [${obj.Name}] field data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 2:
        Msg = `Delete Customer Payment Group Data ${Flag ? 'Success!' : 'fail!'}`
        break
      default:
        break
    }
    /*處理操作結果*/
    if (Flag) {
      window.$message.success(Msg)
      await getCustomer_Info(4)
      switch (obj.Mode) {
        case 1:
          switch (obj.Name) {
            case 'Supervisor_Approver_Check':
            case 'Financial_Approver_Check':
              autoSendMail(1, obj)
              break
            default:
              break
          }
          break
        case 0:
        case 2:
          break
        default:
          break
      }
    } else {
      getCustomer_Info(4)
      window.$message.error(Msg)
    }
    /*如果操作成功，顯示成功提示信息並更新客戶信息。
    如果操作失敗，顯示失敗提示信息並更新客戶信息。
    特殊處理修改操作中的 Supervisor_Approver_Check 和 Financial_Approver_Check 字段，調用 autoSendMail 函數。 */
  } catch (error) {
    console.log(error)
    window.$message.error('Data save fail!')
  }
  /*如果發生錯誤，記錄錯誤並顯示錯誤提示信息。 */
}


/*Customer_Payment_Term_Maintain
过向服务器发送 API 请求，实现了对客户付款条款数据的新增、修改和删除操作。根据操作结果显示相应的提示信息，并在操作成功后更新客户信息。操作过程中还包括对一些特殊字段的处理，如 Rate、By_Doc_Rcv、IsEOM 和 Financial_Approver_Check。如果操作模式是删除，还会弹出确认对话框确认操作*/
const Customer_Payment_Term_Maintain = async (obj) => {
  /*初始化变量*/
  let result = false //result：初始化为 false，用于确认操作结果。
  let CustomerID = route.params.CustomerID  //CustomerID：从路由参数中获取 CustomerID。
  let paymentString = obj.Mode === 1 ? handlePaymentString(obj.items) : '' //paymentString：如果操作模式是修改（Mode = 1），则通过 handlePaymentString 函数获取付款字符串，否则为空字符串。
  let params = { Mode: obj.Mode, CustomerID, paymentString } //params：用于存储发送到 API 的参数对象，初始包含操作模式、客户ID和付款字符串。

  // req.body.Mode === 0 表示新增
  // req.body.Mode === 1 表示修改
  // req.body.Mode === 2 表示刪除


  switch (obj.Mode) {
    case 0: //新增模式（Mode = 0）：设置需要新增的付款组ID。
      params.Customer_Payment_GroupID = obj.Customer_Payment_GroupID
      break
    case 1: //修改模式（Mode = 1）：设置需要修改的字段和值。
      let Value = ''
      switch (obj.Name) {
        case 'Rate':
          Value = obj.items[obj.Name] ? Math.abs(obj.items[obj.Name] / 100) : 0
          obj.items[obj.Name] = Math.abs(obj.items[obj.Name])
          break
        case 'By_Doc_Rcv':
        case 'IsEOM':
        case 'Financial_Approver_Check':
          Value = obj.items[obj.Name] ? 1 : 0
          break
        case 'Condition':
          let reg = /[0-9]+/g
          Value = obj.items[obj.Name].substring(0, 50).replace(reg, '')
          obj.items[obj.Name] = Value
          obj.items['Days'] = 0
          break
        default:
          Value = obj.items[obj.Name]
          break
      }
      params.Value = Value
      params['Name'] = obj.Name
      params.Customer_Payment_TermID = obj.items.Customer_Payment_TermID
      break
    case 2: //删除模式（Mode = 2）：设置需要删除的付款条款ID。
      params.Customer_Payment_TermID = obj.Customer_Payment_TermID
      break
    default:
      break
  }

  obj.Mode == 2 ? result = confirm(`Are you sure you want to delete Payment Term data ?`) : '' //確認刪除操作
  if ((obj.Mode == 2 && result == false)) {
    return
  }
  /* 如果操作模式為刪除，則彈出確認對話框。如果使用者取消操作，則返回不執行後續操作。 */

  /*發送 API 請求並處理響應*/
  try {
    const response = await axios.post(`/api/Sales/Customer/Customer_Payment_Term_Maintain`, params)
    let Flag = response.data.Flag
    let Msg = ''
    switch (obj.Mode) {
      case 0:
        Msg = `Insert Customer Payment Term Data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 1:
        Msg = `Update [${obj.Name}] field data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 2:
        Msg = `Delete Customer Payment Term Data ${Flag ? 'Success!' : 'fail!'}`
        break
      default:
        break
    }
    /*發送 POST 請求到 /api/Sales/Customer/Customer_Payment_Term_Maintain，傳遞 params。
根據響應中的 Flag 設置提示信息 Msg。*/

    /*處理操作結果*/
    if (Flag) {
      window.$message.success(Msg)
      switch (obj.Mode) {
        case 0:
        case 2:
          getCustomer_Info(4)
          break
        default:
          break
      }
    } else {
      getCustomer_Info(4)
      window.$message.error(Msg)
    }
    /* 如果操作成功，顯示成功提示信息並更新客戶信息。如果操作失敗，顯示失敗提示信息並更新客戶信息。 */
  }
  /* 錯誤處理 */
  catch (error) {
    console.log(error)
    getCustomer_Info(4)
    window.$message.error('Data save fail!')
  }
  /*如果發生錯誤，記錄錯誤並顯示錯誤提示信息，同時更新客戶信息。*/
}

const Payment_Term = ref([]) //定義 Payment_Term 變數 是一個響應式變數，初始化為空數組。這個變數用於存儲從伺服器獲取的付款條款數據。
const getPaymentTerm = async () => { //定義 getPaymentTerm 函數
  try {
    const response = await axios.post(`/api/Public/Common/Payment_Term`) //getPaymentTerm 是一個異步函數，通過發送 POST 請求到 /api/Public/Common/Payment_Term 來獲取付款條款數據。
    Payment_Term.value = response.data //如果請求成功，將響應中的數據存儲到 Payment_Term 中。這裡使用 .value 來設置 ref 變數的值。
  } catch (error) {
    console.log(error) //如果請求過程中發生錯誤，捕獲錯誤並在控制台打印錯誤信息。
  }
}

const dialogRegionVisible = ref(false) //dialogRegionVisible 是一個響應式變數，初始值為 false。這個變數用於控制地區對話框的顯示和隱藏狀態。
const Region = ref([]) //Region 是一個響應式變數，初始化為空數組。這個變數用於存儲從伺服器獲取的地區數據。
const getRegion = async () => { //getRegion 是一個異步函數，通過發送 POST 請求到 /api/Public/Common/Region 來獲取地區數據。
  try {
    const response = await axios.post(`/api/Public/Common/Region`) //使用 axios.post 發送一個 POST 請求到 /api/Public/Common/Region 端點，請求地區數據。
    Region.value = response.data //如果請求成功，將響應中的數據存儲到 Region 中。這裡使用 .value 來設置 ref 變數的值。
  } catch (error) {
    console.log(error) //如果請求過程中發生錯誤，捕獲錯誤並在控制台打印錯誤信息。
  }
}

const Currency = ref([]) //Currency 是一個響應式變數，初始化為一個空數組。它用於存儲從伺服器獲取的貨幣資料。
const getCurrency = async () => { //getCurrency 是一個異步函數，通過使用 axios 庫發送 POST 請求到 /api/Public/Common/Currency 端點來獲取貨幣資料。
  try {
    const response = await axios.post(`/api/Public/Common/Currency`) //使用 axios.post 方法發送一個 POST 請求到指定的 /api/Public/Common/Currency 端點，該端點負責返回貨幣資料。
    Currency.value = response.data //如果請求成功，將伺服器返回的資料存儲在 Currency 變數中。這裡使用 .value 來設置 ref 變數的值。
  } catch (error) {
    console.log(error)  //如果發送請求過程中出現錯誤，錯誤信息將被捕獲並在控制台中輸出。
  }
}

const Department = ref([]) //Currency 是一個響應式變數，初始化為一個空數組。它用於存儲從伺服器獲取的貨幣資料。
const Load_Department = async () => { //Load_Department 是一個異步函數，通過使用 axios 庫發送 POST 請求到 /api/Public/Common/Currency 端點來獲取部門資料。
  try {
    const response = await axios.post(`/api/Sales/Customer/Department`) //使用 axios.post 方法發送一個 POST 請求到指定的 api/Sales/Customer/Department 端點，該端點負責返回 Department 資料。
    Department.value = response.data //如果請求成功，將伺服器返回的資料存儲在 Department 變數中。這裡使用 .value 來設置 ref 變數的值。
  } catch (error) {
    console.log(error)  //如果發送請求過程中出現錯誤，錯誤信息將被捕獲並在控制台中輸出。
  }
}

const dialogCreateClientVisible = ref(false) //dialogCreateClientVisible 是一個響應式變數，用於控制創建客戶端對話框的顯示和隱藏。
const Client = ref([]) //Client 是一個響應式變數，初始化為一個空數組。它用於存儲從伺服器獲取的客戶端資料，每個客戶端資料都是具有 value 和 label 屬性的物件。
const Client_Insert = ref('')  //Client_Insert 是一個響應式變數，初始化為空字符串。這個變數可能用於存儲要插入的客戶端資料。
const getClient = async () => { //getClient 異步函數，用於從伺服器獲取客戶端資料。
  let params = { CustomerID: route.params.CustomerID }
  try {
    const response = await axios.post(`/api/Sales/Customer/Client`, params) //使用 axios 庫發送 POST 請求到 /api/Sales/Customer/Client 端點，並帶上 params 物件作為請求參數，其中包含 CustomerID。
    Client.value = response.data.map(function (item) { //如果請求成功，將伺服器返回的資料進行映射處理，將每個客戶端資料轉換為 { "value": item.Client, "label": item.Client } 格式，並存儲在 Client 變數中。
      return {
        "value": item.Client,
        "label": item.Client
      }
    })
  } catch (error) {
    console.log(error) //如果發生錯誤，錯誤信息將被捕獲並輸出到控制台。
  }
}
const Client_Maintain = async (obj) => { //obj 是傳入的物件，包含操作模式（Mode）和相關資料。
  let result = false
  let CustomerID = route.params.CustomerID //CustomerID 是當前路由參數中的客戶 ID。
  let params = { Mode: obj.Mode, CustomerID: CustomerID } //params 是將發送到伺服器的請求參數。
  // var CustomerID = this.$route.params.CustomerID
  // var params = { Mode: obj.Mode, CustomerID: CustomerID }

  // req.body.Mode === 0 表示新增
  // req.body.Mode === 1 表示修改
  // req.body.Mode === 2 表示刪除
  switch (obj.Mode) {
    case 0:
      params['Client'] = obj.Client //新增（Mode === 0）將 obj.Client 資料加入到 params 中。
      break
    case 1: //修改（Mode === 1）目前沒有具體操作，根據需求可以加入相應邏輯。
      break
    case 2: //刪除（Mode === 2）將 obj.Customer_ClientID 加入到 params 中。確認是否刪除客戶端資料，如果使用者取消操作，函數將直接返回。
      params['Customer_ClientID'] = obj.Customer_ClientID
      break
  }
  obj.Mode == 2 ? result = confirm(`Are you sure you want to delete Client data ?`) : ''
  if ((obj.Mode == 2 && result == false)) {
    return
  }
  try {
    const response = await axios.post(`/api/Sales/Customer/Client_Maintain`, params) //發送 POST 請求到 /api/Sales/Customer/Client_Maintain，並帶上 params。
    let Flag = response.data.Flag
    let Msg = ''
    // console.log(response.data)
    switch (obj.Mode) { //根據伺服器回應的 Flag，顯示相應的訊息（成功或失敗）。
      case 0:
        Msg = `Insert Client Data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 1:
        Msg = `Update [${obj.Name}] field data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 2:
        Msg = `Delete Client Data ${Flag ? 'Success!' : 'fail!'}`
        break
      default:
        break
    }
    if (Flag) {
      window.$message.success(Msg)
      Client_Insert.value = ''
      switch (obj.Mode) { //根據不同的操作模式（新增、修改、刪除），更新客戶端資料並調用 getClient 和 getCustomer_Info 函數來獲取最新資料。
        case 0:
        case 1:
        case 2:
          getClient()
          getCustomer_Info(3)
          break
      }
    } else {
      getCustomer_Info(3)
      window.$message.error(Msg)
    }
  } catch (error) {
    console.log(error)
  }
}

const State = reactive({}) //初始化 State：將 State 初始化為一個空對象。
const Permission = (item) => {
  State.value = item
}
/* const Permission = (item) => {
  for (const key in item) {
    if (item.hasOwnProperty(key)) {
      State[key] = item[key]
    }
  }
} */

const IsAuthor = computed(() => {
  return (
    $CheckGroup(['develop author', 'sales author']) &&
    (route.params.CustomerID === 'Insert' ||
      State.value?.IsCrew ||
      State.value?.IsSuperior ||
      State.value?.IsOwner ||
      State.value?.IsDeputy ||
      State.value?.IsCooperator ||
      State.value?.IsUserEmpty)
  )
})

const IsUserEmpty = computed(() => {
  return State.value?.IsUserEmpty
})
const IsSuperior = computed(() => { //IsSuperior 是一個計算屬性，從 Customer_Info 中獲取 Superior。
  const { Superior } = Customer_Info.value[0]
  return groupsStore.UserID === Superior || $CheckGroup(["it admin", "it author", "it read"]) //檢查 groupsStore.UserID 是否等於 Superior 或者當前用戶是否屬於某些特定的用戶組。
})
const IsDepartment_Superior = computed(() => { //IsDepartment_Superior 是一個計算屬性，從 Customer_Info 中獲取 Superior。
  const { Department_Superior } = Customer_Info.value[0]
  return groupsStore.UserID === Department_Superior  || groupsStore.UserID === 'wade-chang' || $CheckGroup(["it admin", "it author", "it read"]) //檢查 groupsStore.UserID 是否等於 Department_Superior 或者當前用戶是否屬於某些特定的用戶組。
})
const IsAccounting = computed(() => {
  return groupsStore.UserID === 'wade-chang' || $CheckGroup(["it admin", "it author", "it read"])
})
const Is_IT_Author = computed(() => {
  return ($CheckGroup(['it author']))
})
const Insert_Mode_Invisible = computed(() => {
  return route.params.CustomerID !== 'Insert' && Customer_Info.value.length > 0
})
const Author_Customer_Flag = computed(() => {
  return (IsAuthor.value && Check_CustomerID_Flag.value)
})
const Customer_Insert_Flag = computed(() => {
  return (Author_Customer_Flag.value && Customer_Insert.CustomerID)
})
const Customer_contacts_Insert_Flag = computed(() => {
  return (IsAuthor.value && Customer_contacts_Insert.Name) ? true : false
})
const Author_Region_Flag = computed(() => {
  return (IsAuthor.value && Check_Region_Flag.value)
})
const Region_Insert_Flag = computed(() => {
  return (Author_Region_Flag.value && Region_Insert.Region.value)
})
const Client_Insert_Flag = computed(() => {
  return (IsAuthor.value && Client_Insert.value) ? true : false
})

const clickInfoSendMail = async (item) => {
  const { Department_Superior_Email, User_Email} = Customer_Info.value[0] //從 Customer_Info 中獲取 Department_Superior_Email。
  let mailTo = Department_Superior_Email
  let subject = ''
  let URI = encodeURIComponent(`${host_cors}/Customer_List/${encodeURIComponent(route.params.CustomerID)}`)
  let mailBody = ''
  let mailToCC = User_Email

  if (!item.Supervisor_Approver_Check) { //構造郵件的主題和正文根據 item.Supervisor_Approver_Check 的值。
    subject = `客戶資料審核 『${route.params.CustomerID}』`
    mailBody = `客戶資料審核 『${route.params.CustomerID}』%0D%0A%0D%0A ${URI} %0D%0A 執行審核請點選 1st. Admin 按鈕 %0D%0A%0D%0A -- ${groupsStore.UserID} --`
  } else if (item.Supervisor_Approver_Check) {
    subject = `客戶資料請解鎖 『${route.params.CustomerID}』`
    mailBody = `客戶資料請解鎖 %0D%0A%0D%0A ${URI} %0D%0A%0D%0A 謝謝！`
  } else {
    return
  }

  let mailtoLink = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${mailBody}&cc=${mailToCC}`; //使用 encodeURIComponent 來編碼 URI 和郵件主題及正文。
  window.location.href = mailtoLink //依生成的 mailto連結 設置 window.location.href 來打開郵件客戶端。
}

const clickPaymentSendMail = async () => {
  const wadeEmail = 'wade.chang@shinymark.com'  
  const {User_Email} = Customer_Info.value[0] //從 Customer_Info 中獲取 Department_Superior_Email。

  let mailTo = `${groupsStore.Superior_Email}, ${wadeEmail}`
  let subject = `客戶『${route.params.CustomerID}』交易條件審核 ` //構造郵件的主題。從路由參數中獲取 CustomerID。
  let URI = encodeURIComponent(`${host_cors}/Customer_List/${encodeURIComponent(route.params.CustomerID)}`)
  let mailBody = `若您是此封郵件的主管人員本郵件為通知郵件, 無需進行操作 %0D%0A 所有簽核由財務人員進行, 待財務人員審核後會再收到一封 “已審核” 的通知郵件 %0D%0A%0D%0A ${URI} %0D%0A%0D%0A 謝謝！ %0D%0A%0D%0A -- ${groupsStore.UserID} --` //構造郵件的正文。
  let mailToCC = User_Email

  let mailtoLink = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${mailBody}&cc=${mailToCC}`; //生成 mailto: 連結
  window.location.href = mailtoLink  //依生成的mailto連結 設置 window.location.href 來打開郵件客戶端。
}

const clickDepPaymentSendMail = async () => {
  const { Department_Superior_Email, User_Email } = Customer_Info.value[0] //從 Customer_Info 中獲取 Department_Superior_Email。
  let mailTo = `${groupsStore.Superior_Email}, ${Department_Superior_Email}` //從 Vuex store 中獲取 Superior_Email 和 UserID。
  let subject = `客戶『${route.params.CustomerID}』交易條件審核 ` //構造郵件的主題。從路由參數中獲取 CustomerID。
  let URI = encodeURIComponent(`${host_cors}/Customer_List/${encodeURIComponent(route.params.CustomerID)}`)
  let mailBody = `客戶交易條件審核 %0D%0A%0D%0A ${URI} %0D%0A 一級主管執行審核請點選 1st. Admin 按鈕 %0D%0A%0D%0A -- ${groupsStore.UserID} --` //構造郵件的正文。
  let mailToCC = User_Email

  let mailtoLink = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${mailBody}&cc=${mailToCC}`;
  window.location.href = mailtoLink //依生成的mailto連結 設置 window.location.href 來打開郵件客戶端。
}

const autoSendMail = async (Mode, obj) => {
  const wadeEmail = 'wade.chang@shinymark.com'
  // Mode == 0 審核基本資料
  // Mode == 1 審核付款條件
  let mailTo = ''
  let subject = ''
  let URI = encodeURIComponent(`${host_cors}/Customer_List/${encodeURIComponent(route.params.CustomerID)}`) //使用 encodeURIComponent 對 URI 和郵件主題及正文進行編碼，確保郵件鏈接正確。
  let mailBody = ''
  

  const { Supervisor_Approver_Check, Financial_Approver_Check, Data_Updater_Email, Department_Superior_Email, User_Email } = Customer_Info.value[0] //Customer_Info 用於獲取當前客戶信息。
  let mailToCC = User_Email
  switch (Mode) {
    case 0: //根據不同的 Mode 和客戶審核狀態來決定郵件的接收者、主題和正文。
      if (Supervisor_Approver_Check && !Financial_Approver_Check && groupsStore.UserID !== 'wade-chang') {
        mailTo = wadeEmail
        subject = `客戶資料審核 『${route.params.CustomerID}』` //route 和 groupsStore 用於獲取當前路由參數和用戶信息。
        mailBody = `客戶資料審核 『${route.params.CustomerID}』 %0D%0A%0D%0A ${URI} %0D%0A 執行審核請點選 Financial Approve 按鈕 %0D%0A%0D%0A -- ${groupsStore.UserID} --`
      } else if (Financial_Approver_Check) {
        mailTo = `${Data_Updater_Email}, ${Department_Superior_Email}`
        subject = `客戶資料已審核 『${route.params.CustomerID}』`
        mailBody = `客戶資料已審核 %0D%0A%0D%0A ${URI} %0D%0A%0D%0A -- ${groupsStore.UserID} --`
      } else if (!Supervisor_Approver_Check) {
        mailTo = `${Data_Updater_Email}`
        subject = `客戶資料已解鎖 『${route.params.CustomerID}』`
        mailBody = `客戶資料已解鎖 『${route.params.CustomerID}』 %0D%0A%0D%0A ${URI} %0D%0A%0D%0A -- ${groupsStore.UserID} --`
      }
      break
    case 1:
      let paymentItem = obj.items
      let Description = paymentItem.Description
      if (!paymentItem.Supervisor_Approver_Check) {
        mailTo = `${Data_Updater_Email}`
        subject = `客戶『${route.params.CustomerID}』 交易條件 ${Description} 已解鎖`
        mailBody = `客戶『${route.params.CustomerID}』 交易條件 ${Description} 已解鎖 %0D%0A%0D%0A ${URI} %0D%0A%0D%0A -- ${groupsStore.UserID} --`
      } else if (paymentItem.Supervisor_Approver_Check && !paymentItem.Financial_Approver_Check && groupsStore.UserID !== 'wade-chang') {
        mailTo = wadeEmail
        subject = `客戶『${route.params.CustomerID}』 交易條件 ${Description} 審核`
        mailBody = `客戶『${route.params.CustomerID}』 交易條件審核 %0D%0A%0D%0A ${URI} %0D%0A 執行審核請點選交易條件 ${Description} Financial 按鈕 %0D%0A%0D%0A -- ${groupsStore.UserID} --`
      } else if (paymentItem.Financial_Approver_Check) {
        mailTo = `${Data_Updater_Email}, ${Department_Superior_Email}` //始注釋掉的 mailto 方法
        subject = `客戶『${route.params.CustomerID}』 交易條件 ${Description} 已審核`
        mailBody = `客戶『${route.params.CustomerID}』 交易條件 ${Description} 已審核 %0D%0A%0D%0A ${URI} %0D%0A%0D%0A -- ${groupsStore.UserID} --`
      }
      break
    default:
      break
  }
  if (mailTo && subject && mailBody) {
    //console.log(`${hostname}/Public/Sendmail.aspx?mailTo=${mailTo}&mailBCC=erp-notify@shinymark.com&mailSubject=${subject}&mailBody=${mailBody}&cc=${mailToCC}`)
    document.getElementById("Res_Detail").src = `${hostname}/Public/Sendmail.aspx?mailTo=${mailTo}&mailBCC=erp-notify@shinymark.com&mailSubject=${subject}&mailBody=${mailBody}&mailCC=${mailToCC}`; //使用 document.getElementById("Res_Detail").src 來觸發郵件發送（基於一個假設的 iframe 元素）。
    // let mailtoLink = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
    // window.location.href = mailtoLink
  }
}
</script>

<style lang="css" scoped>
.inputNumberNoSpin :deep(input::-webkit-inner-spin-button),
.inputNumberNoSpin :deep(input::-webkit-outer-spin-button) {
  -webkit-appearance: none;
}
</style>

<style scoped>
/* .custom-dialog {
  margin-right: 100px;
} */
.el-table__placeholder {
  display: none !important;
}

.Payment_Detail .el-table tbody tr:hover>td {
  background: none !important;
}

.Payment_Detail .el-table .el-table__inner-wrapper .el-table__header-wrapper {
  display: none !important;
}

table {
  border-collapse: collapse;
  width: 100%;
}

#Detail th, #Detail td, #Detail tr {
  border: 0px solid #cccccc !important;
}
#Detail {
  margin-bottom: 2px;
}
</style>
