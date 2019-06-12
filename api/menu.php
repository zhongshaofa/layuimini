<?php

$listList = [
    'homeInfo'   => [
        'title' => '首页',
        'icon'  => '&#xe634;',
        'href'  => 'page/welcome.html',
    ],
    'moduleInfo' => [
        'ceshi'   => [
            'title' => '测试管理',
            'icon'  => '&#xe634;',
            'list'  => [
                [
                    'title'  => '按钮列表',
                    'href'   => 'page/button.html',
                    'icon'   => '&#xe634;',
                    'target' => '_self',
                ],
                [
                    'title'    => 'UI管理',
                    'href'     => '',
                    'icon'     => '&#xe634;',
                    'target'   => '',
                    'child' => [
                        [
                            'title'  => '按钮',
                            'href'   => 'page/button.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                        [
                            'title'  => '表单',
                            'href'   => 'page/form.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                        [
                            'title'  => '弹出层',
                            'href'   => 'page/layer.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                        [
                            'title'  => '静态表格',
                            'href'   => 'page/table.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                    ],
                ],
                [
                    'title'    => '测试无限层',
                    'href'     => '',
                    'icon'     => '&#xe634;',
                    'target'   => '',
                    'child' => [
                        [
                            'title'    => '按钮1',
                            'href'     => 'page/button.html',
                            'icon'     => '&#xe634;',
                            'target'   => '_self',
                            'child' => [
                                [
                                    'title'    => '按钮2',
                                    'href'     => 'page/button.html',
                                    'icon'     => '&#xe634;',
                                    'target'   => '_self',
                                    'child' => [
                                        [
                                            'title'  => '按钮3',
                                            'href'   => 'page/button.html',
                                            'icon'   => '&#xe634;',
                                            'target' => '_self',
                                        ],
                                        [
                                            'title'  => '表单4',
                                            'href'   => 'page/form.html',
                                            'icon'   => '&#xe634;',
                                            'target' => '_self',
                                        ],
                                    ],
                                ],
                                [
                                    'title'  => '表单5',
                                    'href'   => 'page/form.html',
                                    'icon'   => '&#xe634;',
                                    'target' => '_self',
                                ],
                            ],
                        ],
                        [
                            'title'  => '表单6',
                            'href'   => 'page/form.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                    ],
                ],
            ],
        ],
        'setting' => [
            'title' => '设置管理',
            'icon'  => '&#xe634;',
            'list'  => [
                [
                    'title'  => '按钮列表【setting】',
                    'href'   => 'page/button.html',
                    'icon'   => '&#xe634;',
                    'target' => '_self',
                ],
                [
                    'title'    => 'UI管理【setting】',
                    'href'     => '',
                    'icon'     => '&#xe634;',
                    'target'   => '',
                    'child' => [
                        [
                            'title'  => '按钮',
                            'href'   => 'page/button.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                        [
                            'title'  => '表单',
                            'href'   => 'page/form.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                        [
                            'title'  => '弹出层',
                            'href'   => 'page/layer.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                        [
                            'title'  => '静态表格',
                            'href'   => 'page/table.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                    ],
                ],
                [
                    'title'    => '测试无限层【setting】',
                    'href'     => '',
                    'icon'     => '&#xe634;',
                    'target'   => '',
                    'child' => [
                        [
                            'title'    => '按钮1',
                            'href'     => 'page/button.html',
                            'icon'     => '&#xe634;',
                            'target'   => '_self',
                            'child' => [
                                [
                                    'title'    => '按钮2',
                                    'href'     => 'page/button.html',
                                    'icon'     => '&#xe634;',
                                    'target'   => '_self',
                                    'child' => [
                                        [
                                            'title'  => '按钮3',
                                            'href'   => 'page/button.html',
                                            'icon'   => '&#xe634;',
                                            'target' => '_self',
                                        ],
                                        [
                                            'title'  => '表单4',
                                            'href'   => 'page/form.html',
                                            'icon'   => '&#xe634;',
                                            'target' => '_self',
                                        ],
                                    ],
                                ],
                                [
                                    'title'  => '表单5',
                                    'href'   => 'page/form.html',
                                    'icon'   => '&#xe634;',
                                    'target' => '_self',
                                ],
                            ],
                        ],
                        [
                            'title'  => '表单6',
                            'href'   => 'page/form.html',
                            'icon'   => '&#xe634;',
                            'target' => '_self',
                        ],
                    ],
                ],
            ],
        ],
    ],
];

die(json_encode($listList, JSON_UNESCAPED_UNICODE));