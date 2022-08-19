import Vue from 'vue'
import VueRouter from 'vue-router'
import Button from 'ant-design-vue'
import index from './views/Home/index.vue'
import login from './views/login/login.vue'
import menu from './components/Breadcrumb/menu.vue'
import submenu from './components/Breadcrumb/submenu.vue'
import financeDashboard from './views/dashboard/financeDashboard.vue'
import financeDashboardContent from './views/dashboard/financeDashboardContent.vue'
import financeInfo from './views/dashboard/financeInfo.vue'
import financeEdit from './views/dashboard/financeEdit.vue'
import contentHead from './views/common/contentHead.vue'
import contentFoot from './views/common/contentFoot.vue'
import f404 from './views/fail/404.vue'
Vue.use(Button);
Vue.use(VueRouter);
let router = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: index,
        },
        {
            path: '/login',
            name: 'login',
            component: login,

        },
        {
            path: '/404',
            name: 'f404',
            component: f404,
            meta: {
                auth: true,
                role: "102",
            },
        },
        {
            path: '/financeDashboard',
            //name: 'financeDashboard',
            component: financeDashboard,
            name: '首页',
            meta: {
                auth: true,
                role: "102",
                title: '首页'
            },

            children: [{
                path: 'financeDashboardContent',
                //name: 'financeDashboardContent',
                name: '首页',
                component: financeDashboardContent,
                meta: {
                    auth: true,
                    role: "102",
                    title: '首页'
                },
            }, {
                path: 'financeInfo',
                //name: 'financeInfo',
                name: '被投公司财务管理',
                component: financeInfo,
                meta: {
                    auth: true,
                    role: "102",
                    title: '被投公司财务管理'
                },
            },
            {
                path: 'financeEdit',
                //name: 'financeEdit',
                name: '财务信息编辑',
                component: financeEdit,
                meta: {
                    auth: true,
                    role: "102",
                    title: '财务信息编辑'
                },
            },

            ]

        },
        {
            path: '/contentHead',
            name: 'contentHead',
            component: contentHead,
            meta: {
                auth: true,
                role: "102",
            },

        },
        {
            path: '/contentFoot',
            name: 'contentFoot',
            component: contentFoot,
            meta: {
                auth: true,
                role: "102",
            },

        },
        {
            path: '/menu',
            name: 'menu',
            component: menu,
            meta: {
                auth: true,
                role: "102",
            },

        },
        {
            path: '/submenu',
            name: 'submenu',
            component: submenu,
            meta: {
                auth: true,
                role: "102",
            },

        },

    ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.auth && to.meta.role === '102') {
        let token = sessionStorage.getItem('token');
        console.log(token);
        if (token) {
            next();
        } else {
            next({
                path: '/404'
            })
        }

    }
    next()
})
export default router;
