import { createRouter, createWebHistory } from 'vue-router'

import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { useGroupsStore, useAccountStore } from './stores/store'

const dynamicRoutes = setupLayouts(generatedRoutes)

const staticRoutes = [
  { path: '/Production_Progress_List', name: 'Production_Progress_List', component: {}, meta: { ProgramID: 267, requiresAuth: true }, },
  { path: '/Funds_Request_Edit/:Funds_RequestID', name: 'Funds_Request_Edit', component: {}, meta: { ProgramID: 295, requiresAuth: true }, },
  { path: '/Funds_Request_List', name: 'Funds_Request_List', component: {}, meta: { ProgramID: 295, requiresAuth: true }, },
  { path: '/Customer_List', name: 'Customer_List', component: {}, meta: { ProgramID: 91, requiresAuth: true }, },
  { path: '/Customer/:Mode/:CustomerID/:GroupID', name: 'Customer', component: {}, meta: { ProgramID: 33, requiresAuth: true } },
  { path: '/Manufacturer_List', name: 'Manufacturer_List', component: {}, meta: { ProgramID: 298, requiresAuth: true },
    children: [
      { path: ':FactoryID', name: 'Manufacturer', component: {}, meta: { ProgramID: 392, requiresAuth: true } }
    ]
  },
  {
  path: '/Factory/:FactorySubID',
  name: 'Factory',
  component: {},
  meta: { ProgramID: 123, requiresAuth: true }
},{
  path:'/Produce_Line/:Produce_LineID',
  name:'Produce_Line',
  component:{},
  meta:{ ProgramID:123,requiresAuth:true}
},
  { path: '/Organization_List', name: 'Organization_List', component: {}, meta: { ProgramID: 365, requiresAuth: true },
  children: [
    { path: ':OrganizationID', name: 'Organization', component: {}, meta: { ProgramID: 379, requiresAuth: true } }
  ]
  },
  { path: '/City_List', name: 'City_List', component: {},meta: { ProgramID: 393, requiresAuth: true }},
  { path: '/Region_List', name: 'Region_List', component: {},meta: { ProgramID: 394, requiresAuth: true }},
  { path: '/Brand_List', name: 'Brand_List', component: {},meta: { ProgramID: 395, requiresAuth: true }},
  { path: '/Season_List', name: 'Season', component: {},meta: { ProgramID: 398, requiresAuth: true }},
  { path: '/Warehouse_List', name: 'Warehouse_List', component: {},meta: { ProgramID: 399, requiresAuth: true },
  children: [
    { path: ':mode/:warehouseID', name: 'Warehouse', component: {}, meta: { ProgramID: 400, requiresAuth: true } }
  ]
  },
  { path: '/Product_Size', name: 'Product_Size', component: {},meta: { ProgramID: 401, requiresAuth: true }},  //Derek
  { path: '/Form_login/:object?', name: 'Form_login', component: {}, meta: { ProgramID: 1, requiresAuth: false } },
  { path: '/Program_Disabled', name: 'Program_Disabled', component: {}, meta: { ProgramID: 1, requiresAuth: false } },
  { path: '/Knowledge/:KnowledgeID/:Knowledge_DetailID?/:isPage?', name: 'Knowledge', meta: { ProgramID: 105, title: 'Knowledge', requiresAuth: true } },
  {  path: '/Tutor/:KnowledgeID/:Knowledge_DetailID?', name: 'Tutor', meta: { ProgramID: 106, title: 'Tutor', requiresAuth: true } }
]

// 取得所有的 vue 模組
const modules = import.meta.glob<Object>("./components/pages/**/**.vue", { import: 'default', eager: true });
// 定義 Record 類型用於儲存路由名稱與對應模組的映射
type RouteComponentsMap = Record<string, Object>;
// 建立路由名稱對應元件的物件
const routeComponents: RouteComponentsMap = {};
// 對每個 vue 模組進行處理
for (const path in modules) {
  const componentName = path.split("/").at(-1)?.split(".")[0];
  routeComponents[componentName!] = modules[path];
}
// 更新符合條件的靜態路由的 component
function updateStaticRoutesComponent(staticRoutes: any) {
  for (const option of staticRoutes) {
    if (option.name && routeComponents[option.name]) {
      option.component = routeComponents[option.name];
    }

    if (option.children) {
      for (const childOption of option.children) {
        if (childOption.name && routeComponents[childOption.name]) {
          childOption.component = routeComponents[childOption.name];
        }
      }
    }
  }
}
updateStaticRoutesComponent(staticRoutes);

const routes = dynamicRoutes.concat(staticRoutes);
routes.push({ path: '/:pathMatch(.*)', redirect: '/Program_Disabled' })

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let hostname = process.env.NODE_ENV === 'production' ? `https://${location.hostname}` : `https://erp.shinymark.com`

router.beforeEach((to, from, next) => {
  const group = useGroupsStore()
  const account = useAccountStore()

  // 如果 router 轉跳的頁面需要驗證 requiresAuth: true
  if (to.meta.requiresAuth) { // 判斷該路由是否需要登錄權限
    if (account.isLoggedIn) {
      var path = ''
      group.getGroup({ Program_Name: to.name, ProgramID: to.meta.ProgramID }).then((data) => {
        path = hostname + '/Public/Access_Permission.aspx?ProgramID=' + to.meta.ProgramID + '&UserID=' + group.getUserID
        to.meta.title = data.SharePG_Program
        document.title = data.SharePG_Program
        data.IsGroups ? next() : window.open(path, 'SUBFORM')
      }).catch((err) => {
        //next({ path: '/Form_login/vue', query: { redirect: to.fullPath } })
        next();
      })
    } else {
      // 將跳轉的路由path作爲參數，登錄成功後跳轉到該路由
      next({ path: '/Form_login/vue', query: { redirect: to.fullPath } })
    }
  } else {
    // document.title = to.meta.title
    if (to.name === 'Form_login') {
      next()
    } else {
      next()
    }
  }
})

export default router
