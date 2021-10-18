import { createRouter, createWebHashHistory } from "vue-router";
import Login from '~/views/Login.vue';
import Signup2 from '~/views/Signup2.vue';
import Signup1 from '~/views/Signup.vue';

import Dashboard from '~/views/Dashboard.vue';

//종합지표
import Comprehensive from '~/views/indicator/Comprehensive.vue';
import UserChart from '~/views/indicator/UseChart.vue';
import ActiveChart from '~/views/indicator/ActiveChart.vue';
import OutputChart from '~/views/indicator/OutputChart.vue';
import CtChart from '~/views/indicator/CtChart.vue';

//금형관리
import Mold from '~/views/mold/Mold.vue';
import Production from '~/views/mold/Production.vue';
import Maintenance from '~/views/mold/Maintenance.vue';
import Disposal from '~/views/mold/disposal.vue';
import Singularity from '~/views/mold/Singularity.vue';

//장비관리
import Approval from '~/views/management/Approval.vue';
import ApprovalRegistration from '~/views/management/ApprovalRegistration.vue';
import Terminal from '~/views/management/Terminal.vue';
import TerminalRegistration from '~/views/management/TerminalRegistration.vue';
import Counter from '~/views/management/Counter.vue';
import Preset from '~/views/management/Preset.vue';

//설정관리
import Company from '~/views/settings/Company.vue';
import Member from '~/views/settings/Member.vue';
import Customcd from '~/views/settings/Customcd.vue';


import Test from '~/views/test.vue';




export default createRouter({
    history: createWebHashHistory(),
    scrollBehavior() {
        return { top: 0 }
    },

    routes: [
        {
            path: '/',
            component: Login,
            meta: {
                menu: false,
                auth: false,
            }
        },
        {
            path:'/signup',
            component: Signup2
        },
        {
            path:'/check',
            component: Signup1
        },
        {
            path:'/dashboard',
            component: Dashboard
        },

        //종합지표
        {
            path:'/indicator',
            component: Comprehensive
        },
        {
            path:'/userchart',
            component: UserChart
        },
        {
            path:'/activechart',
            component: ActiveChart
        },
        {
            path:'/outputchart',
            component: OutputChart
        },
        {
            path:'/ctchart',
            component: CtChart
        },

        //금형관리
        {
            path:'/mold',
            component: Mold
        },
        {
            path:'/production',
            component: Production
        },
        {
            path:'/maintenance',
            component: Maintenance
        },
        {
            path:'/disposal',
            component: Disposal
        },
        {
            path:'/singularity',
            component: Singularity
        },

        //장비관리
        {
            path:'/approval',
            component: Approval
        },
        {
            path:'/approval/register',
            component: ApprovalRegistration
        },
        {
            path:'/terminal',
            component: Terminal
        },
        {
            path:'/terminal/register',
            component: TerminalRegistration
        },
        {
            path:'/counter',
            component: Counter
        },
        {
            path:'/preset',
            component: Preset
        },

        //설정관리
        {
            path:'/company',
            component: Company
        },
        {
            path:'/member',
            component: Member
        },
        {
            path:'/customcd',
            component: Customcd
        },
        
        {
            path:'/test',
            component: Test
        },

       
    ]
})