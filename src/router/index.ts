import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import DefaultLayout from "@/layout/DefaultLayout.vue"

const routes: any = [
  {
    path: "/",
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        name: "首页"
      },
    ],
    component: DefaultLayout
  },
]


export default createRouter({
  routes,
  history: createWebHashHistory()
})