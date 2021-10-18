export const SETTINGS = {
    tokenName: 'shotline-token',
    refreshTokenName: 'shotline-refreshTk',
    userToken: 'shotline-user',
    i18nLocale: 'shotline-locale',
    MAX_FILEUPLOAD_COUNT: 10,
    ITEMS_PER_PAGE: [5, 10, 25, 50, -1],
    DATETIME_FORMAT: 'YYYY/MM/DD HH:mm:ss'
};

export const CODES = {
    LOCALES: [{
        text: 'KOREAN',
        value: 'ko'
    }, {
        text: 'ENGLISH',
        value: 'en'
    }],
    ROLES: [{
        text: 'ADMIN',
        value: 'Administrator'
    }, {
        text: 'DIRECTOR',
        value: '업체 담당자'
    }, {
        text: 'MANAGER',
        value: '업체 관리자'
    }, {
        text: 'OPERATOR',
        value: '사이트 관리자'
    }],
    DEFAULT_VALUE: {
        MOLD_TYPES: 'injection',
        MOLD_STATES: 'mass',
        DAILY_BASE_TIMES: 22 // hours

    },
    SHOT_INFO: {
        injection: {
            warranty: 300000,
            inspection: 30000
        },
        press: {
            warranty: 300000,
            inspection: 100000
        },
        'die-casting': {
            warranty: 70000,
            inspection: 25000
        }
    },
    ITEM_TYPES: {
        ko: [{
            text: '텍스트',
            value: 'text'
        }, {
            text: '선택 유형',
            value: 'select'
        }, {
            text: '라디오 유형',
            value: 'radio'
        }, {
            text: '체크 유형',
            value: 'checkbox'
        } // { text: '날짜', value: 'date' },
        ],
        en: [{
            text: 'Text',
            value: 'text'
        }, {
            text: 'Select Type',
            value: 'select'
        }, {
            text: 'Radio Type',
            value: 'radio'
        }, {
            text: 'Check Type',
            value: 'checkbox'
        } // { text: 'date', value: 'date' },
        ]
    },
    MOLD_TYPES: {
        ko: [{
            text: '사출',
            value: 'injection'
        }, {
            text: '프레스',
            value: 'press'
        }, {
            text: '다이케스팅',
            value: 'die-casting'
        }],
        en: [{
            text: 'Injection',
            value: 'injection'
        }, {
            text: 'Press',
            value: 'press'
        }, {
            text: 'Die-Casting',
            value: 'die-casting'
        }]
    },
    MOLD_STATES: {
        ko: [{
            text: '양산',
            value: 'mass'
        }, {
            text: '개발',
            value: 'dev'
        }, {
            text: '유휴',
            value: 'idle'
        }, {
            text: 'A/S',
            value: 'as'
        }, {
            text: '폐기',
            value: 'disposal'
        }],
        en: [{
            text: 'Mass Production',
            value: 'mass'
        }, {
            text: 'Development',
            value: 'dev'
        }, {
            text: 'Idle',
            value: 'idle'
        }, {
            text: 'A/S',
            value: 'as'
        }, {
            text: 'Disposal',
            value: 'disposal'
        }]
    },
    DEVICE_TYPES: {
        ko: [{
            text: '카운터',
            value: 'counter'
        }, {
            text: '터미널',
            value: 'terminal'
        }],
        en: [{
            text: 'COUNTER',
            value: 'counter'
        }, {
            text: 'TERMINAL',
            value: 'terminal'
        }]
    },
    DEVICE_CODES: {
        COUNTER: {
            PROD_CD: ['LCM', 'CCM'],
            MODEL_TIMES: ['I01', 'P01']
        },
        TERMINAL: {
            PROD_CD: ['LTM', 'CTM'],
            SERVER_CD: ['KRL', 'KRC']
        }
    },
    PROGRESS_STATE: {
        ko: [{
            text: '진행 중',
            value: 'I'
        }, {
            text: '완료',
            value: 'F'
        }],
        en: [{
            text: 'In progress',
            value: 'I'
        }, {
            text: 'Finish',
            value: 'F'
        }]
    },
    APPROVAL_PROGRESS_STATE: [{
        text: '저장 중',
        value: 'S'
    }, {
        text: '요청',
        value: 'W'
    }, {
        text: '거부',
        value: 'R'
    }, {
        text: '완료',
        value: 'F'
    }],
    PRESET_PROGRESS_STATE: [{
        text: '진행 중',
        value: 'I'
    }, {
        text: '완료',
        value: 'F'
    }],
    DEVICE_PROGRESS_STATE: [{
        text: '사용 중',
        value: 'I',
        desc: 'Ing'
    }, {
        text: '사용 종료',
        value: 'F',
        desc: 'Finish'
    }],
    DEVICE_RECEIVED_STATE: [{
        text: '정상',
        value: 'G',
        desc: 'Green'
    }, {
        text: '확인요청',
        value: 'Y',
        desc: 'Yellow'
    }, {
        text: '문제발생',
        value: 'R',
        desc: 'Red'
    }],
    CHECK_ITEMS: {
        ko: [{
            text: '정기점검',
            value: 'N'
        }, {
            text: '일상점검',
            value: 'D'
        }, {
            text: 'A/S',
            value: 'A'
        }, {
            text: '기타',
            value: 'E'
        }],
        en: [{
            text: 'Normal',
            value: 'N'
        }, {
            text: 'Daily',
            value: 'D'
        }, {
            text: 'A/S',
            value: 'A'
        }, {
            text: 'Etc',
            value: 'E'
        }]
    },
    CHECK_TYPES: {
        ko: [{
            text: '세척',
            value: 'C'
        }, {
            text: '보수',
            value: 'R'
        }, {
            text: '금형손상',
            value: 'D'
        }, {
            text: '이물질',
            value: 'F'
        }, {
            text: '작동유무',
            value: 'W'
        }, {
            text: '기타',
            value: 'E'
        }],
        en: [{
            text: 'Clean',
            value: 'C'
        }, {
            text: 'Repair',
            value: 'R'
        }, {
            text: 'Damage',
            value: 'D'
        }, {
            text: 'Foreign substance',
            value: 'F'
        }, {
            text: 'Working or Not',
            value: 'W'
        }, {
            text: 'Etc',
            value: 'E'
        }]
    },
    CONDUCT_METHODS: {
        ko: [{
            text: '보수',
            value: 'R'
        }, {
            text: '간이PM',
            value: 'S'
        }, {
            text: '구리스유입',
            value: 'G'
        }, {
            text: '기타',
            value: 'E'
        }],
        en: [{
            text: 'Repair',
            value: 'R'
        }, {
            text: 'Simple PM',
            value: 'S'
        }, {
            text: 'Grease ingress',
            value: 'G'
        }, {
            text: 'Etc',
            value: 'E'
        }]
    },
    DISPOSAL_REASONS: {
        ko: [{
            text: '생산수율저하',
            value: 'falloff'
        }, {
            text: '수리불가',
            value: 'unrepairable'
        }, {
            text: '단종',
            value: 'extinction'
        }, {
            text: '기타',
            value: 'etc'
        }],
        en: [{
            text: 'Production yield rate fall off',
            value: 'falloff'
        }, {
            text: 'Unrepairable',
            value: 'unrepairable'
        }, {
            text: 'Extinction',
            value: 'extinction'
        }, {
            text: 'Etc',
            value: 'etc'
        }]
    }
};

export const CHART = {
    X_COLORS: ['#ff3088', '#1cd3d3', '#69c302', '#fe9713', '#8959ec'],
    LABEL_COLOR: {
        X: '#26c8fd',
        Y: '#26c8fd'
    },
    AXIS_COLOR: {
        X: '#26c8fd',
        Y: '#e54dd1'
    },
    GRID_OPTIONS: {
        show: true,
        borderColor: '#373F78',
        row: {
            colors: ['#0b1f46']
        }
    }
};

const MENUS = [{
    title: 'Dashboard',
    name: 'dashboard',
    active: false,
    display: true,
    icon: 'main_menu_2_dashboard.png',
    children: []
}, {
    title: '종합지표',
    name: 'total',
    active: false,
    display: true,
    icon: 'main_menu_7_indicator.png',
    children: [{
        title: '종합지표',
        name: 'total.indicator',
        active: false,
        display: true,
        icon: 'ico_menu_mold_total.png'
    }, {
        title: '금형 사용지표',
        name: 'total.indicator.use',
        path: '/indicator/use/chart',
        active: false,
        display: true,
        icon: 'ico_menu_mold_use.png'
    }, {
        title: '금형 가동지표',
        name: 'total.indicator.active',
        path: '/indicator/active/chart',
        active: false,
        display: true,
        icon: 'ico_menu_mold_active.png'
    }, {
        title: '금형 생산지표',
        name: 'total.indicator.output',
        path: '/indicator/output/chart',
        active: false,
        display: true,
        icon: 'ico_menu_mold_product.png'
    }, {
        title: 'C/T 준수지표',
        name: 'total.indicator.ct',
        path: '/indicator/ct/chart',
        active: false,
        display: true,
        icon: 'ico_menu_ct.png'
    }]
}, {
    title: '금형관리',
    name: 'mold',
    active: false,
    display: true,
    icon: 'main_menu_3_mold.png',
    children: [{
        title: '금형관리',
        name: 'mold.list',
        active: false,
        display: true,
        icon: 'ico_menu_mold_management.png'
    }, {
        title: '금형관리',
        name: 'mold.info',
        active: false,
        display: false,
        icon: 'ico_menu_mold_management.png'
    }, {
        title: '생산관리',
        name: 'mold.production',
        active: false,
        display: true,
        icon: 'ico_menu_product_management.png'
    }, {
        title: '유지관리',
        name: 'mold.maintenance',
        active: false,
        display: true,
        icon: 'ico_menu_maintenance.png'
    }, {
        title: '폐기관리',
        name: 'mold.disposal',
        active: false,
        display: true,
        icon: 'ico_menu_disposal.png'
    }, {
        title: '특이사항',
        name: 'mold.singularity',
        active: false,
        display: true,
        icon: 'ico_menu_singularity.png'
    }]
}, {
    title: '장비관리',
    name: 'equipment',
    active: false,
    display: true,
    icon: 'main_menu_4_machine.png',
    children: [{
        title: '장비사용현황',
        name: 'equipment.usage',
        active: false,
        display: false,
        icon: 'ico_menu_machine_use.png'
    }, {
        title: '장비승인요청',
        name: 'equipment.approval',
        active: false,
        display: true,
        icon: 'ico_menu_machine_use.png'
    }, {
        title: '터미널 관리',
        name: 'equipment.terminal',
        active: false,
        display: true,
        icon: 'ico_menu_terminal_manage.png'
    }, {
        title: '카운터 관리',
        name: 'equipment.counter',
        active: false,
        display: true,
        icon: 'ico_menu_counter_manage.png'
    }, {
        title: '카운터 PreSet',
        name: 'equipment.preset',
        active: false,
        display: true,
        icon: 'ico_menu_preset.png'
    }, {
        title: '카운터 알람수신',
        active: false,
        display: false,
        icon: 'ico_menu_counter_alarm.png'
    }, {
        title: '미등록 터미널',
        active: false,
        display: false,
        icon: 'ico_menu_not_regist_terminal.png'
    }, {
        title: '미등록 카운터',
        active: false,
        display: false,
        icon: 'ico_menu_not_regist_counter.png'
    }]
}, {
    title: '공유금형',
    name: 'share',
    active: false,
    display: false,
    icon: 'main_menu_5_share.png',
    children: [{
        title: '금형조회',
        active: false,
        display: false,
        icon: 'ico_mold_search.png'
    }, {
        title: '유지관리',
        active: false,
        display: false,
        icon: 'ico_menu_share_maintenance.png'
    }, {
        title: '폐기관리',
        active: false,
        display: false,
        icon: 'ico_disposal_manage.png'
    }]
}, {
    title: '설정관리',
    name: 'settings',
    active: false,
    display: true,
    icon: 'main_menu_6_setting.png',
    children: [{
        title: '사업장관리',
        name: 'settings.company',
        active: false,
        display: true,
        icon: 'ico_menu_factory.png'
    }, {
        title: '사용자관리',
        name: 'settings.member',
        active: false,
        display: true,
        icon: 'ico_menu_usermanage.png'
    }, {
        title: '금형코드관리',
        name: 'settings.customcd',
        active: false,
        display: true,
        icon: 'ico_menu_moldcode.png'
    }]
}];

const UNAUTH_MENUS = [{
    title: '로그인',
    name: 'login',
    active: false,
    display: true,
    icon: '',
    children: []
}, {
    title: '회원가입',
    name: 'signup',
    active: false,
    display: true,
    icon: '',
    children: []
}, {
    title: '비밀번호 찾기',
    name: 'search.pswd',
    active: false,
    display: true,
    icon: '',
    children: []
}];

export default { SETTINGS, UNAUTH_MENUS, MENUS, CODES, CHART }