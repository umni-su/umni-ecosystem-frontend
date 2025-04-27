import {createRouter, createWebHashHistory} from 'vue-router'
import DashboardPage from '../../components/pages/router/DashboardPage.vue'
import DevicesPage from '../../components/pages/router/DevicesPage.vue'
import DevicePage from '../../components/pages/router/DevicePage.vue'

const routes = [
    {
        path: '/',
        component: DashboardPage,
        name: 'dashboard'
    },
    {
        path: '/devices',
        children: [
            {
                path: '',
                component: DevicesPage,
                name: 'devices'
            },
            {
                path: ':id(\\d+)',
                component: DevicePage,
                name: 'device',
                props: (route) => {
                    return {
                        ...route.params, ...{id: Number.parseInt(route.params.id, 10) || undefined}
                    }
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes // short for `routes: routes`
})

export default router
