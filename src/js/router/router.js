import {createRouter, createWebHashHistory} from 'vue-router'
import DashboardPage from '../../components/pages/router/DashboardPage.vue'
import DevicesPage from '../../components/pages/router/DevicesPage.vue'
import DevicePage from '../../components/pages/router/DevicePage.vue'
import SettingsPage from '../../components/pages/router/SettingsPage.vue'
import BaseSettings from "../../components/pages/router/settings/BaseSettings.vue";
import NotificationSettings from "../../components/pages/router/settings/NotificationSettings.vue";
import BackupSettings from "../../components/pages/router/settings/BackupSettings.vue";
import ServicesSettings from "../../components/pages/router/settings/ServicesSettings.vue";
import StorageSettings from "../../components/pages/router/settings/StorageSettings.vue";
import CamerasPage from "../../components/pages/router/CamerasPage.vue";
import CameraPage from "../../components/pages/router/CameraPage.vue";

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
    },
    {
        path: '/cameras',
        children: [
            {
                path: '',
                component: CamerasPage,
                name: 'cameras'
            },
            {
                path: ':id(\\d+)',
                component: CameraPage,
                name: 'camera',
                props: (route) => {
                    return {
                        ...route.params, ...{id: Number.parseInt(route.params.id, 10) || undefined}
                    }
                }
            }
            // {
            //     path: ':id(\\d+)',
            //     component: DevicePage,
            //     name: 'device',
            //     props: (route) => {
            //         return {
            //             ...route.params, ...{id: Number.parseInt(route.params.id, 10) || undefined}
            //         }
            //     }
            // }
        ]
    },
    {
        path: '/settings',
        component: SettingsPage,
        children: [
            {
                path: 'base',
                name: 'settings',
                component: BaseSettings
            },
            {
                path: 'services',
                name: 'services',
                component: ServicesSettings
            },
            {
                path: 'storages',
                name: 'storages',
                component: StorageSettings
            },
            {
                path: 'notifications',
                name: 'notifications',
                component: NotificationSettings
            },
            {
                path: 'backup',
                name: 'backup',
                component: BackupSettings
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes // short for `routes: routes`
})

export default router
